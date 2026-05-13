"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const createJobShiftSlot = async (formData: FormData) => {
  const jobId = String(formData.get("jobId"));
  const name = String(formData.get("name"));
  const startTime = String(formData.get("startTime"));
  const endTime = String(formData.get("endTime"));
  const requiredPeople = Number(formData.get("requiredPeople"));

  if (!jobId || !name || !startTime || !endTime || !requiredPeople) {
    throw new Error("勤務枠の入力内容が不足しています。");
  }

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
  redirect(`/admin/jobs/${jobId}`);
};