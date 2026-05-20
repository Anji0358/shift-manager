"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  getPositiveNumber,
  getRequiredString,
  validateTimeOrder,
} from "@/lib/validation";
import { requireAdmin } from "@/lib/auth/guards";

export const createJobShiftSlot = async (formData: FormData) => {
  await requireAdmin();

  const jobId = getRequiredString(formData, "jobId");
  const name = getRequiredString(formData, "name");
  const startTime = getRequiredString(formData, "startTime");
  const endTime = getRequiredString(formData, "endTime");
  const requiredPeople = getPositiveNumber(formData, "requiredPeople");

  validateTimeOrder(startTime, endTime);

  await prisma.jobShiftSlot.create({
    data: {
      jobId,
      name,
      startTime,
      endTime,
      requiredPeople,
    },
  });

  revalidatePath(`/admin/jobs/${jobId}`);
  redirect(`/admin/jobs/${jobId}/assignments?message=勤務枠を追加しました`);
};