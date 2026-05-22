"use server";

import type { WageType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { timeTextToMinutes } from "@/lib/time";

const validateTimeOrder = (startTime: string, endTime: string) => {
  if (startTime >= endTime) {
    throw new Error("終了時刻は開始時刻より後にしてください。");
  }
};

const parseNonNegativeNumber = (value: FormDataEntryValue | null) => {
  const numberValue = Number(value ?? 0);

  if (!Number.isInteger(numberValue) || numberValue < 0) {
    return null;
  }

  return numberValue;
};

const parsePositiveNumber = (value: FormDataEntryValue | null) => {
  const numberValue = Number(value ?? 0);

  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return null;
  }

  return numberValue;
};

const parseFixedHourlyWage = (
  wageType: WageType,
  fixedHourlyWageValue: string,
) => {
  if (wageType === "EMPLOYEE") {
    return null;
  }

  if (!fixedHourlyWageValue) {
    throw new Error("案件固定時給を入力してください。");
  }

  const fixedHourlyWage = Number(fixedHourlyWageValue);

  if (!Number.isInteger(fixedHourlyWage) || fixedHourlyWage <= 0) {
    throw new Error("案件固定時給は1以上の整数で入力してください。");
  }

  return fixedHourlyWage;
};

export const createJobTemplate = async (formData: FormData) => {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const meetingPlace = String(formData.get("meetingPlace") ?? "").trim();

  const slotName = String(formData.get("slotName") ?? "").trim();
  const startTime = String(formData.get("startTime") ?? "").trim();
  const endTime = String(formData.get("endTime") ?? "").trim();
  const requiredPeople = parsePositiveNumber(formData.get("requiredPeople"));

  const breakMinutes = parseNonNegativeNumber(formData.get("breakMinutes"));
  const transportationFee = parseNonNegativeNumber(
    formData.get("transportationFee"),
  );

  const hasMeal = formData.get("hasMeal") !== null;

  const dressCode = String(formData.get("dressCode") ?? "").trim();
  const belongings = String(formData.get("belongings") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  const wageTypeValue = String(formData.get("wageType") ?? "EMPLOYEE");
  const fixedHourlyWageValue = String(
    formData.get("fixedHourlyWage") ?? "",
  ).trim();

  if (!name || !title || !location) {
    throw new Error("テンプレート名、案件名、勤務場所は必須です。");
  }

  if (!slotName || !startTime || !endTime) {
    throw new Error("勤務枠名、開始時刻、終了時刻は必須です。");
  }

  validateTimeOrder(startTime, endTime);

  const startTimeMinutes = timeTextToMinutes(startTime);
  const endTimeMinutes = timeTextToMinutes(endTime);

  if (requiredPeople === null) {
    throw new Error("必要人数は1以上の整数で入力してください。");
  }

  if (breakMinutes === null) {
    throw new Error("休憩時間は0以上の整数で入力してください。");
  }

  if (transportationFee === null) {
    throw new Error("交通費は0以上の整数で入力してください。");
  }

  if (wageTypeValue !== "EMPLOYEE" && wageTypeValue !== "JOB_FIXED") {
    throw new Error("給与設定の値が不正です。");
  }

  const wageType = wageTypeValue as WageType;
  const fixedHourlyWage = parseFixedHourlyWage(
    wageType,
    fixedHourlyWageValue,
  );

  await prisma.$transaction(async (tx) => {
    const template = await tx.jobTemplate.create({
      data: {
        name,
        title,
        location,
        meetingPlace: meetingPlace || null,
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

    await tx.jobTemplateShiftSlot.create({
      data: {
        jobTemplateId: template.id,
        name: slotName,
        startTime,
        endTime,
        startTimeMinutes,
        endTimeMinutes,
        requiredPeople,
      },
    });
  });

  revalidatePath("/admin/job-templates");
  revalidatePath("/admin/jobs/new");

  redirect("/admin/job-templates");
};

export const deleteJobTemplate = async (formData: FormData) => {
  await requireAdmin();

  const templateId = String(formData.get("templateId") ?? "");

  if (!templateId) {
    throw new Error("削除対象のテンプレートが取得できません。");
  }

  await prisma.jobTemplate.delete({
    where: {
      id: templateId,
    },
  });

  revalidatePath("/admin/job-templates");
  revalidatePath("/admin/jobs/new");

  redirect("/admin/job-templates");
};

export const updateJobTemplate = async (formData: FormData) => {
  await requireAdmin();

  const templateId = String(formData.get("templateId") ?? "").trim();

  const name = String(formData.get("name") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const meetingPlace = String(formData.get("meetingPlace") ?? "").trim();

  const slotName = String(formData.get("slotName") ?? "").trim();
  const startTime = String(formData.get("startTime") ?? "").trim();
  const endTime = String(formData.get("endTime") ?? "").trim();
  const requiredPeople = parsePositiveNumber(formData.get("requiredPeople"));

  const breakMinutes = parseNonNegativeNumber(formData.get("breakMinutes"));
  const transportationFee = parseNonNegativeNumber(
    formData.get("transportationFee"),
  );

  const hasMeal = formData.get("hasMeal") !== null;

  const dressCode = String(formData.get("dressCode") ?? "").trim();
  const belongings = String(formData.get("belongings") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  const wageTypeValue = String(formData.get("wageType") ?? "EMPLOYEE");
  const fixedHourlyWageValue = String(
    formData.get("fixedHourlyWage") ?? "",
  ).trim();

  if (!templateId) {
    throw new Error("更新対象のテンプレートが取得できません。");
  }

  if (!name || !title || !location) {
    throw new Error("テンプレート名、案件名、勤務場所は必須です。");
  }

  if (!slotName || !startTime || !endTime) {
    throw new Error("勤務枠名、開始時刻、終了時刻は必須です。");
  }

  validateTimeOrder(startTime, endTime);

  const startTimeMinutes = timeTextToMinutes(startTime);
  const endTimeMinutes = timeTextToMinutes(endTime);

  if (requiredPeople === null) {
    throw new Error("必要人数は1以上の整数で入力してください。");
  }

  if (breakMinutes === null) {
    throw new Error("休憩時間は0以上の整数で入力してください。");
  }

  if (transportationFee === null) {
    throw new Error("交通費は0以上の整数で入力してください。");
  }

  if (wageTypeValue !== "EMPLOYEE" && wageTypeValue !== "JOB_FIXED") {
    throw new Error("給与設定の値が不正です。");
  }

  const wageType = wageTypeValue as WageType;
  const fixedHourlyWage = parseFixedHourlyWage(
    wageType,
    fixedHourlyWageValue,
  );

  await prisma.$transaction(async (tx) => {
    await tx.jobTemplate.update({
      where: {
        id: templateId,
      },
      data: {
        name,
        title,
        location,
        meetingPlace: meetingPlace || null,
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

    await tx.jobTemplateShiftSlot.deleteMany({
      where: {
        jobTemplateId: templateId,
      },
    });

    await tx.jobTemplateShiftSlot.create({
      data: {
        jobTemplateId: templateId,
        name: slotName,
        startTime,
        endTime,
        startTimeMinutes,
        endTimeMinutes,
        requiredPeople,
      },
    });
  });

  revalidatePath("/admin/job-templates");
  revalidatePath(`/admin/job-templates/${templateId}/edit`);
  revalidatePath("/admin/jobs/new");

  redirect("/admin/job-templates");
};