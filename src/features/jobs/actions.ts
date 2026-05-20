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

  const meetingPlace = getOptionalString(formData, "meetingPlace");
  const breakMinutes = getNonNegativeNumber(formData, "breakMinutes");
  const hasMeal = String(formData.get("hasMeal")) === "true";
  const transportationFee = getNonNegativeNumber(formData, "transportationFee");
  const dressCode = getOptionalString(formData, "dressCode");
  const belongings = getOptionalString(formData, "belongings");
  const note = getOptionalString(formData, "note");

  const slotName = getRequiredString(formData, "slotName");
  const startTime = getRequiredString(formData, "startTime");
  const endTime = getRequiredString(formData, "endTime");
  const requiredPeople = Number(formData.get("requiredPeople") ?? 0);

  const wageType = getRequiredString(formData, "wageType") as WageType;
  const fixedHourlyWageText = getOptionalString(formData, "fixedHourlyWage");

  validateTimeOrder(startTime, endTime);

  if (!Number.isInteger(requiredPeople) || requiredPeople <= 0) {
    throw new Error("必要人数は1以上の整数で入力してください。");
  }

  if (wageType !== "EMPLOYEE" && wageType !== "JOB_FIXED") {
    throw new Error("時給タイプが不正です。");
  }

 let fixedHourlyWage: number | null = null;

if (wageType === "JOB_FIXED") {
  if (!fixedHourlyWageText) {
    throw new Error("案件一律時給を入力してください。");
  }

  const parsedFixedHourlyWage = Number(fixedHourlyWageText);

  if (
    !Number.isInteger(parsedFixedHourlyWage) ||
    parsedFixedHourlyWage <= 0
  ) {
    throw new Error("案件一律時給は1以上の整数で入力してください。");
  }

  fixedHourlyWage = parsedFixedHourlyWage;
}

  await prisma.$transaction(async (tx) => {
    const job = await tx.job.create({
      data: {
        title,
        workDate: new Date(workDate),
        location,
        meetingPlace,
        breakMinutes,
        hasMeal,
        transportationFee,
        dressCode,
        belongings,
        note,
        wageType,
        fixedHourlyWage,
      },
    });

    await tx.jobShiftSlot.create({
      data: {
        jobId: job.id,
        name: slotName,
        startTime,
        endTime,
        requiredPeople,
      },
    });
  });

  revalidatePath("/admin/jobs");
  redirect("/admin/jobs?message=created");
};

export const deleteJob = async (formData: FormData) => {
  await requireAdmin();

  const jobId = String(formData.get("jobId") ?? "");

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