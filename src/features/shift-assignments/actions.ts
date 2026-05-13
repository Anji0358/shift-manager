"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const createShiftAssignment = async (formData: FormData) => {
  const jobId = String(formData.get("jobId"));
  const slotId = String(formData.get("slotId"));
  const employeeId = String(formData.get("employeeId"));

  if (!jobId || !slotId || !employeeId) {
    throw new Error("シフト確定に必要な情報が不足しています。");
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