"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  getNonNegativeNumber,
  getOptionalString,
  getRequiredString,
  validateTimeOrder,
} from "@/lib/validation";
import type { WageType } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/guards";

export const createJob = async (formData: FormData) => {
   await requireAdmin();

  const title = getRequiredString(formData, "title");
  const workDate = getRequiredString(formData, "workDate");
  const location = getRequiredString(formData, "location");
  const meetingPlace = getRequiredString(formData, "meetingPlace");
  const startTime = getRequiredString(formData, "startTime");
  const endTime = getRequiredString(formData, "endTime");
  const breakMinutes = getNonNegativeNumber(formData, "breakMinutes");
  const hasMeal = String(formData.get("hasMeal")) === "true";
  const transportationFee = getNonNegativeNumber(formData, "transportationFee");
  const dressCode = getRequiredString(formData, "dressCode");
  const belongings = getRequiredString(formData, "belongings");
  const note = getOptionalString(formData, "note");
  const wageType = getRequiredString(formData, "wageType") as WageType;
  const fixedHourlyWageText = getOptionalString(formData, "fixedHourlyWage");

  validateTimeOrder(startTime, endTime);

  await prisma.job.create({
    data: {
      title,
      workDate: new Date(workDate),
      location,
      meetingPlace,
      startTime,
      endTime,
      breakMinutes,
      hasMeal,
      transportationFee,
      dressCode,
      belongings,
      note,
      wageType,
      fixedHourlyWage:
        wageType === "JOB_FIXED" && fixedHourlyWageText
          ? Number(fixedHourlyWageText)
          : null,
    },
  });

  revalidatePath("/admin/jobs");
  redirect("/admin/jobs?message=created");
};

export const deleteJob = async (formData: FormData) => {
  await requireAdmin();

  const jobId = String(formData.get("jobId"));

  if (!jobId) {
    throw new Error("削除対象の案件IDが取得できません。");
  }

  await prisma.$transaction([
    prisma.workReport.deleteMany({
      where: {
        jobId,
      },
    }),
    prisma.shiftAssignment.deleteMany({
      where: {
        jobId,
      },
    }),
    prisma.jobShiftSlot.deleteMany({
      where: {
        jobId,
      },
    }),
    prisma.job.delete({
      where: {
        id: jobId,
      },
    }),
  ]);

  revalidatePath("/admin/jobs");
  redirect("/admin/jobs?message=deleted");
};