"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { WageType } from "@prisma/client";

export const createJob = async (formData: FormData) => {
  const title = String(formData.get("title"));
  const workDate = String(formData.get("workDate"));
  const location = String(formData.get("location"));
  const meetingPlace = String(formData.get("meetingPlace"));
  const startTime = String(formData.get("startTime"));
  const endTime = String(formData.get("endTime"));
  const breakMinutes = Number(formData.get("breakMinutes"));
  const hasMeal = String(formData.get("hasMeal")) === "true";
  const transportationFee = Number(formData.get("transportationFee"));
  const dressCode = String(formData.get("dressCode"));
  const belongings = String(formData.get("belongings"));
  const note = String(formData.get("note"));
  const wageType = String(formData.get("wageType")) as WageType;
  const fixedHourlyWageText = String(formData.get("fixedHourlyWage") ?? "");

  if (
    !title ||
    !workDate ||
    !location ||
    !meetingPlace ||
    !startTime ||
    !endTime ||
    !breakMinutes ||
    !dressCode ||
    !belongings ||
    !wageType
  ) {
    throw new Error("案件の入力内容が不足しています。");
  }

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
  redirect("/admin/jobs");
};