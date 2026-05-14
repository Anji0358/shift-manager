"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";

export const createEmployee = async (formData: FormData) => {

  await requireAdmin();

  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const role = String(formData.get("role") ?? "STAFF");
  const hourlyWage = Number(formData.get("hourlyWage") ?? 0);
  const startedWorkingAt = String(formData.get("startedWorkingAt") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !startedWorkingAt || !password) {
    throw new Error("従業員登録に必要な情報が不足しています。");
  }

  if (password.length < 8) {
    throw new Error("パスワードは8文字以上で入力してください。");
  }

  if (role !== "ADMIN" && role !== "STAFF") {
    throw new Error("権限の値が不正です。");
  }

  const existingEmployee = await prisma.employee.findUnique({
    where: {
      email,
    },
  });

  if (existingEmployee) {
    throw new Error("このメールアドレスはすでに登録されています。");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.employee.create({
    data: {
      name,
      email,
      role,
      hourlyWage,
      startedWorkingAt: new Date(startedWorkingAt),
      employmentStatus: "ACTIVE",
      passwordHash,
    },
  });

  revalidatePath("/admin/employees");
  redirect("/admin/employees?message=created");
};

export const deactivateEmployee = async (formData: FormData) => {

  await requireAdmin();

  const employeeId = String(formData.get("employeeId"));

  if (!employeeId) {
    throw new Error("従業員IDが取得できません。");
  }

  await prisma.employee.update({
    where: {
      id: employeeId,
    },
    data: {
      employmentStatus: "INACTIVE",
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

  redirect("/admin/employees?message=deactivated");
};

export const resetEmployeePassword = async (formData: FormData) => {

  await requireAdmin();

  const employeeId = String(formData.get("employeeId") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!employeeId || !password) {
    throw new Error("パスワードリセットに必要な情報が不足しています。");
  }

  if (password.length < 8) {
    throw new Error("パスワードは8文字以上で入力してください。");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.employee.update({
    where: {
      id: employeeId,
    },
    data: {
      passwordHash,
    },
  });

  revalidatePath("/admin/employees");
  redirect("/admin/employees?message=updated");
};