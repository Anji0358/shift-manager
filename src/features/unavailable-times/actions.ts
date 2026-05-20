"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { DayOfWeek, UnavailableType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentEmployeeId } from "@/lib/auth/current-user";

const selectableUnavailableTypes = [
  "FULL_DAY",
  "TIME_RANGE",
  "WEEKLY_FIXED",
] as const satisfies readonly UnavailableType[];

type SelectableUnavailableType = (typeof selectableUnavailableTypes)[number];

const dayOfWeeks = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const satisfies readonly DayOfWeek[];

const isSelectableUnavailableType = (
  value: string,
): value is SelectableUnavailableType => {
  return selectableUnavailableTypes.includes(
    value as SelectableUnavailableType,
  );
};

const isDayOfWeek = (value: string): value is DayOfWeek => {
  return dayOfWeeks.includes(value as DayOfWeek);
};

const getRequiredString = (formData: FormData, key: string, label: string) => {
  const value = String(formData.get(key) ?? "").trim();

  if (!value) {
    throw new Error(`${label}を入力してください。`);
  }

  return value;
};

const getOptionalString = (formData: FormData, key: string) => {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
};

const toValidDate = (dateValue: string) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    throw new Error("日付の形式が正しくありません。");
  }

  return date;
};

const validateTimeOrder = (startTime: string, endTime: string) => {
  if (startTime >= endTime) {
    throw new Error("終了時間は開始時間より後にしてください。");
  }
};

export const createUnavailableTime = async (formData: FormData) => {
  const employeeId = await getCurrentEmployeeId();

  const typeValue = getRequiredString(
    formData,
    "type",
    "NGの日時の種類",
  );

  if (!isSelectableUnavailableType(typeValue)) {
    throw new Error("NGの日時の種類が不正です。");
  }

  const reason = getOptionalString(formData, "reason");

  if (typeValue === "FULL_DAY") {
    const dateValue = getRequiredString(formData, "date", "日付");

    await prisma.unavailableTime.create({
      data: {
        employeeId,
        type: typeValue,
        date: toValidDate(dateValue),
        dayOfWeek: null,
        startTime: null,
        endTime: null,
        reason,
      },
    });

    revalidatePath("/staff/unavailable-times");
    revalidatePath("/admin/jobs");
    redirect("/staff/unavailable-times?message=created");
  }

  if (typeValue === "TIME_RANGE") {
    const dateValue = getRequiredString(formData, "date", "日付");
    const startTime = getRequiredString(formData, "startTime", "開始時間");
    const endTime = getRequiredString(formData, "endTime", "終了時間");

    validateTimeOrder(startTime, endTime);

    await prisma.unavailableTime.create({
      data: {
        employeeId,
        type: typeValue,
        date: toValidDate(dateValue),
        dayOfWeek: null,
        startTime,
        endTime,
        reason,
      },
    });

    revalidatePath("/staff/unavailable-times");
    revalidatePath("/admin/jobs");
    redirect("/staff/unavailable-times?message=created");
  }

  if (typeValue === "WEEKLY_FIXED") {
    const dayOfWeekValue = getRequiredString(formData, "dayOfWeek", "曜日");
    const startTime = getRequiredString(formData, "startTime", "開始時間");
    const endTime = getRequiredString(formData, "endTime", "終了時間");

    if (!isDayOfWeek(dayOfWeekValue)) {
      throw new Error("曜日の値が不正です。");
    }

    validateTimeOrder(startTime, endTime);

    await prisma.unavailableTime.create({
      data: {
        employeeId,
        type: typeValue,
        date: null,
        dayOfWeek: dayOfWeekValue,
        startTime,
        endTime,
        reason,
      },
    });

    revalidatePath("/staff/unavailable-times");
    revalidatePath("/admin/jobs");
    redirect("/staff/unavailable-times?message=created");
  }

  throw new Error("NGの日時の登録に失敗しました。");
};

export const deleteUnavailableTime = async (formData: FormData) => {
  const employeeId = await getCurrentEmployeeId();
  const unavailableTimeId = String(
    formData.get("unavailableTimeId") ?? "",
  ).trim();

  if (!unavailableTimeId) {
    throw new Error("削除対象のNGの日時が取得できません。");
  }

  const unavailableTime = await prisma.unavailableTime.findUnique({
    where: {
      id: unavailableTimeId,
    },
  });

  if (!unavailableTime) {
    throw new Error("NGの日時が見つかりません。");
  }

  if (unavailableTime.employeeId !== employeeId) {
    throw new Error("他のユーザーのNGの日時は削除できません。");
  }

  await prisma.unavailableTime.delete({
    where: {
      id: unavailableTimeId,
    },
  });

  revalidatePath("/staff/unavailable-times");
  revalidatePath("/admin/jobs");

  redirect("/staff/unavailable-times?message=deleted");
};