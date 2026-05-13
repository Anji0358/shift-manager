"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isUnavailableForSlot } from "@/features/unavailable-times/services";

export const createShiftAssignment = async (formData: FormData) => {
  const jobId = String(formData.get("jobId"));
  const slotId = String(formData.get("slotId"));
  const employeeId = String(formData.get("employeeId"));

  if (!jobId || !slotId || !employeeId) {
    throw new Error("シフト確定に必要な情報が不足しています。");
  }

  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new Error("案件が見つかりません。");
  }

  const slot = await prisma.jobShiftSlot.findUnique({
    where: {
      id: slotId,
    },
  });

  if (!slot) {
    throw new Error("勤務枠が見つかりません。");
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
    throw new Error("従業員が見つかりません。");
  }

  const duplicatedAssignment = await prisma.shiftAssignment.findFirst({
    where: {
      jobId,
      slotId,
      employeeId,
      status: "ASSIGNED",
    },
  });

  if (duplicatedAssignment) {
    throw new Error("この従業員はすでに同じ勤務枠に割り当てられています。");
  }

  const assignedCount = await prisma.shiftAssignment.count({
    where: {
      slotId,
      status: "ASSIGNED",
    },
  });

  if (assignedCount >= slot.requiredPeople) {
    throw new Error("この勤務枠はすでに必要人数に達しています。");
  }

  const unavailable = isUnavailableForSlot(
    employee.unavailableTimes,
    job.workDate,
    slot.startTime,
    slot.endTime,
  );

  if (unavailable) {
    throw new Error("この従業員は指定した勤務枠の時間帯に勤務不可です。");
  }

  await prisma.shiftAssignment.create({
    data: {
      jobId,
      slotId,
      employeeId,
      status: "ASSIGNED",
    },
  });

  revalidatePath(`/admin/jobs/${jobId}`);
  revalidatePath(`/admin/jobs/${jobId}/assignments`);
  revalidatePath("/staff/shifts");
  revalidatePath("/staff/calendar");

  redirect(`/admin/jobs/${jobId}/assignments`);
};