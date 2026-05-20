"use server";

import bcrypt from "bcryptjs";
import { EmployeeRole, EmploymentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";

export type EmployeeActionState = {
  error?: string;
};

const buildRedirectUrl = (path: string, message: string) => {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}message=${encodeURIComponent(message)}`;
};

const redirectWithMessage = (path: string, message: string): never => {
  redirect(buildRedirectUrl(path, message));
};

const parseStartedWorkingAt = (value: string) => {
  if (!value) {
    return null;
  }

  // type="month" の場合: 2026-05
  if (/^\d{4}-\d{2}$/.test(value)) {
    return new Date(`${value}-01`);
  }

  // type="date" の場合: 2026-05-01
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(value);
  }

  return null;
};

export const createEmployee = async (
  _prevState: EmployeeActionState,
  formData: FormData,
): Promise<EmployeeActionState> => {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? EmployeeRole.STAFF);
  const hourlyWageText = String(formData.get("hourlyWage") ?? "");
  const startedWorkingAtText = String(formData.get("startedWorkingAt") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !startedWorkingAtText || !password) {
    return {
      error: "スタッフ登録に必要な情報をすべて入力してください。",
    };
  }

  if (role !== EmployeeRole.ADMIN && role !== EmployeeRole.STAFF) {
    return {
      error: "権限の値が不正です。",
    };
  }

  const hourlyWage = Number(hourlyWageText);

  if (!Number.isInteger(hourlyWage) || hourlyWage < 0) {
    return {
      error: "時給は0以上の整数で入力してください。",
    };
  }

  const startedWorkingAt = parseStartedWorkingAt(startedWorkingAtText);

  if (!startedWorkingAt || Number.isNaN(startedWorkingAt.getTime())) {
    return {
      error: "勤め始めた年月の形式が不正です。",
    };
  }

  if (password.length < 8) {
    return {
      error: "パスワードは8文字以上で入力してください。",
    };
  }

  const existingEmployee = await prisma.employee.findUnique({
    where: {
      email,
    },
  });

  if (existingEmployee) {
    return {
      error: "このメールアドレスはすでに登録されています。",
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.employee.create({
    data: {
      name,
      email,
      role: role as EmployeeRole,
      hourlyWage,
      startedWorkingAt,
      employmentStatus: EmploymentStatus.ACTIVE,
      passwordHash,
    },
  });

  revalidatePath("/admin/employees");

  return redirectWithMessage("/admin/employees", "スタッフを追加しました。");
};

export const updateEmployee = async (formData: FormData) => {
  await requireAdmin();

  const employeeId = String(formData.get("employeeId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "");
  const employmentStatus = String(formData.get("employmentStatus") ?? "");
  const hourlyWageText = String(formData.get("hourlyWage") ?? "");
  const startedWorkingAtText = String(formData.get("startedWorkingAt") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  if (!employeeId) {
    throw new Error("スタッフIDが取得できません。");
  }

  const editPath = `/admin/employees/${employeeId}/edit`;

  if (!name) {
    return redirectWithMessage(editPath, "名前を入力してください。");
  }

  if (!email) {
    return redirectWithMessage(editPath, "メールアドレスを入力してください。");
  }

  if (role !== EmployeeRole.ADMIN && role !== EmployeeRole.STAFF) {
    return redirectWithMessage(editPath, "権限の値が不正です。");
  }

  if (
    employmentStatus !== EmploymentStatus.ACTIVE &&
    employmentStatus !== EmploymentStatus.INACTIVE
  ) {
    return redirectWithMessage(editPath, "在籍状況の値が不正です。");
  }

  const hourlyWage = Number(hourlyWageText);

  if (!Number.isInteger(hourlyWage) || hourlyWage < 0) {
    return redirectWithMessage(editPath, "時給は0以上の整数で入力してください。");
  }

  const startedWorkingAt = parseStartedWorkingAt(startedWorkingAtText);

  if (!startedWorkingAt || Number.isNaN(startedWorkingAt.getTime())) {
    return redirectWithMessage(editPath, "勤め始めた年月の形式が不正です。");
  }

  if (newPassword && newPassword.length < 8) {
    return redirectWithMessage(
      editPath,
      "新しいパスワードは8文字以上で入力してください。",
    );
  }

  const existingEmployee = await prisma.employee.findUnique({
    where: {
      id: employeeId,
    },
  });

  if (!existingEmployee) {
    return redirectWithMessage(
      "/admin/employees",
      "対象のスタッフが見つかりません。",
    );
  }

  const duplicatedEmailEmployee = await prisma.employee.findFirst({
    where: {
      email,
      NOT: {
        id: employeeId,
      },
    },
  });

  if (duplicatedEmailEmployee) {
    return redirectWithMessage(
      editPath,
      "このメールアドレスはすでに使用されています。",
    );
  }

  const updateData: {
    name: string;
    email: string;
    role: EmployeeRole;
    employmentStatus: EmploymentStatus;
    hourlyWage: number;
    startedWorkingAt: Date;
    passwordHash?: string;
  } = {
    name,
    email,
    role: role as EmployeeRole,
    employmentStatus: employmentStatus as EmploymentStatus,
    hourlyWage,
    startedWorkingAt,
  };

  if (newPassword) {
    updateData.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  await prisma.employee.update({
    where: {
      id: employeeId,
    },
    data: updateData,
  });

  revalidatePath("/admin/employees");
  revalidatePath(`/admin/employees/${employeeId}/edit`);
  revalidatePath("/admin/jobs");
  revalidatePath("/staff/shifts");
  revalidatePath("/staff/calendar");

  return redirectWithMessage("/admin/employees", "スタッフ情報を更新しました。");
};

export const deactivateEmployee = async (formData: FormData) => {
  await requireAdmin();

  const employeeId = String(formData.get("employeeId") ?? "");

  if (!employeeId) {
    throw new Error("スタッフIDが取得できません。");
  }

  const employee = await prisma.employee.findUnique({
    where: {
      id: employeeId,
    },
  });

  if (!employee) {
    return redirectWithMessage(
      "/admin/employees",
      "対象のスタッフが見つかりません。",
    );
  }

  if (employee.employmentStatus === EmploymentStatus.INACTIVE) {
    return redirectWithMessage(
      "/admin/employees",
      "このスタッフはすでに退職済みです。",
    );
  }

  await prisma.employee.update({
    where: {
      id: employeeId,
    },
    data: {
      employmentStatus: EmploymentStatus.INACTIVE,
    },
  });

  await prisma.shiftAssignment.updateMany({
    where: {
      employeeId,
      status: "ASSIGNED",
    },
    data: {
      status: "CANCELED",
    },
  });

  revalidatePath("/admin/employees");
  revalidatePath("/admin/jobs");
  revalidatePath("/staff/shifts");
  revalidatePath("/staff/calendar");

  return redirectWithMessage(
    "/admin/employees",
    "スタッフを退職済みにしました。",
  );
};