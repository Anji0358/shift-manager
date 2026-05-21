"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isUnavailableForSlot } from "@/features/unavailable-times/services";
import { requireAdmin } from "@/lib/auth/guards";

const buildRedirectUrl = (path: string, message: string) => {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}message=${encodeURIComponent(message)}`;
};

const redirectWithMessage = (path: string, message: string): never => {
  redirect(buildRedirectUrl(path, message));
};

const getSafeRedirectPath = (
  value: FormDataEntryValue | null,
  fallback: string,
) => {
  const redirectTo = String(value ?? "");

  if (!redirectTo.startsWith("/")) {
    return fallback;
  }

  return redirectTo;
};

export const createShiftAssignment = async (formData: FormData) => {
  await requireAdmin();

  const jobId = String(formData.get("jobId") ?? "");
  const slotId = String(formData.get("slotId") ?? "");
  const employeeId = String(formData.get("employeeId") ?? "");

  if (!jobId) {
    throw new Error("案件IDが取得できませんでした。");
  }

  const redirectPath = `/admin/jobs/${jobId}/assignments`;

  if (!slotId || !employeeId) {
    return redirectWithMessage(
      redirectPath,
      "勤務枠とスタッフを選択してください。",
    );
  }

  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    return redirectWithMessage(redirectPath, "案件が見つかりません。");
  }

  const slot = await prisma.jobShiftSlot.findUnique({
    where: {
      id: slotId,
    },
  });

  if (!slot) {
    return redirectWithMessage(redirectPath, "勤務枠が見つかりません。");
  }

  if (slot.jobId !== jobId) {
    return redirectWithMessage(
      redirectPath,
      "指定された勤務枠はこの案件に属していません。",
    );
  }

  const employee = await prisma.employee.findUnique({
    where: {
      id: employeeId,
    },
    include: {
      unavailableTimes: true,
    },
  });

  if (!employee) {
    return redirectWithMessage(redirectPath, "スタッフが見つかりません。");
  }

  const duplicatedAssignment = await prisma.shiftAssignment.findFirst({
    where: {
      slotId,
      employeeId,
      status: "ASSIGNED",
    },
  });

  if (duplicatedAssignment) {
    return redirectWithMessage(
      redirectPath,
      "このスタッフはすでに同じ勤務枠に割り振られています。",
    );
  }

  const assignedCount = await prisma.shiftAssignment.count({
    where: {
      slotId,
      status: "ASSIGNED",
    },
  });

  if (assignedCount >= slot.requiredPeople) {
    return redirectWithMessage(
      redirectPath,
      "この勤務枠はすでに必要人数に達しています。",
    );
  }

  const unavailable = isUnavailableForSlot(
    employee.unavailableTimes,
    job.workDate,
    slot.startTime,
    slot.endTime,
  );

  if (unavailable) {
    return redirectWithMessage(
      redirectPath,
      "このスタッフは指定した勤務枠の時間帯に勤務不可です。",
    );
  }

  await prisma.shiftAssignment.create({
    data: {
      slotId,
      employeeId,
      status: "ASSIGNED",
    },
  });

  revalidatePath(`/admin/jobs/${jobId}`);
  revalidatePath(`/admin/jobs/${jobId}/assignments`);
  revalidatePath("/admin/jobs");
  revalidatePath("/staff");
  revalidatePath("/staff/shifts");
  revalidatePath("/staff/calendar");

  redirectWithMessage(redirectPath, "スタッフを割り振りました。");
};

export const cancelShiftAssignment = async (formData: FormData) => {
  await requireAdmin();

  const assignmentId = String(formData.get("assignmentId") ?? "");
  const jobId = String(formData.get("jobId") ?? "");

  if (!jobId) {
    throw new Error("案件IDが取得できませんでした。");
  }

  const fallbackRedirectPath = `/admin/jobs/${jobId}/assignments`;
  const redirectPath = getSafeRedirectPath(
    formData.get("redirectTo"),
    fallbackRedirectPath,
  );

  if (!assignmentId) {
    return redirectWithMessage(
      redirectPath,
      "キャンセル対象の割り振りが見つかりません。",
    );
  }

  const assignment = await prisma.shiftAssignment.findUnique({
    where: {
      id: assignmentId,
    },
    include: {
      slot: true,
    },
  });

  if (!assignment) {
    return redirectWithMessage(
      redirectPath,
      "キャンセル対象の割り振りが見つかりません。",
    );
  }

  if (assignment.slot.jobId !== jobId) {
    return redirectWithMessage(
      redirectPath,
      "この割り振りは指定された案件に属していません。",
    );
  }

  if (assignment.status === "CANCELED") {
    return redirectWithMessage(
      redirectPath,
      "このスタッフ割り振りはすでにキャンセルされています。",
    );
  }

  await prisma.shiftAssignment.update({
    where: {
      id: assignmentId,
    },
    data: {
      status: "CANCELED",
    },
  });

  revalidatePath(`/admin/jobs/${jobId}`);
  revalidatePath(`/admin/jobs/${jobId}/assignments`);
  revalidatePath("/admin/jobs");
  revalidatePath("/staff");
  revalidatePath("/staff/shifts");
  revalidatePath("/staff/calendar");

  redirectWithMessage(redirectPath, "スタッフ割り振りをキャンセルしました。");
};