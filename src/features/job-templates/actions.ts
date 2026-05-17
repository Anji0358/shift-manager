"use server";

import { WageType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";

export const createJobTemplate = async (formData: FormData) => {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const meetingPlace = String(formData.get("meetingPlace") ?? "").trim();
  const startTime = String(formData.get("startTime") ?? "").trim();
  const endTime = String(formData.get("endTime") ?? "").trim();

  const breakMinutes = Number(formData.get("breakMinutes") ?? 0);
  const transportationFee = Number(formData.get("transportationFee") ?? 0);

  const hasMeal = formData.get("hasMeal") !== null;

  const dressCode = String(formData.get("dressCode") ?? "").trim();
  const belongings = String(formData.get("belongings") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  const wageTypeValue = String(formData.get("wageType") ?? "EMPLOYEE");
  const fixedHourlyWageValue = String(
    formData.get("fixedHourlyWage") ?? "",
  ).trim();

  if (!name || !title || !location || !startTime || !endTime) {
    throw new Error(
      "テンプレート名、案件名、勤務場所、開始時刻、終了時刻は必須です。",
    );
  }

  if (Number.isNaN(breakMinutes) || breakMinutes < 0) {
    throw new Error("休憩時間の値が不正です。");
  }

  if (Number.isNaN(transportationFee) || transportationFee < 0) {
    throw new Error("交通費の値が不正です。");
  }

  if (wageTypeValue !== "EMPLOYEE" && wageTypeValue !== "JOB_FIXED") {
    throw new Error("給与設定の値が不正です。");
  }

  const wageType = wageTypeValue as WageType;

  const fixedHourlyWage =
    wageType === "JOB_FIXED" && fixedHourlyWageValue
      ? Number(fixedHourlyWageValue)
      : null;

  if (
    wageType === "JOB_FIXED" &&
    (fixedHourlyWage === null ||
      Number.isNaN(fixedHourlyWage) ||
      fixedHourlyWage < 0)
  ) {
    throw new Error("案件固定時給を正しく入力してください。");
  }

  await prisma.jobTemplate.create({
    data: {
      name,
      title,
      location,
      meetingPlace: meetingPlace || null,
      startTime,
      endTime,
      breakMinutes,
      hasMeal,
      transportationFee,
      dressCode: dressCode || null,
      belongings: belongings || null,
      note: note || null,
      wageType,
      fixedHourlyWage,
    },
  });

  revalidatePath("/admin/job-templates");
  redirect("/admin/job-templates");
};