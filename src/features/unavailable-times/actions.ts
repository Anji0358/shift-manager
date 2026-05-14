"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { DayOfWeek, UnavailableType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentEmployeeId } from "@/lib/auth/current-user";

const unavailableTypes = [
  "FULL_DAY",
  "TIME_RANGE",
  "WEEKLY_FIXED",
  "TEMPORARY",
] as const satisfies readonly UnavailableType[];

const dayOfWeeks = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const satisfies readonly DayOfWeek[];

const isUnavailableType = (value: string): value is UnavailableType => {
  return unavailableTypes.includes(value as UnavailableType);
};

const isDayOfWeek = (value: string): value is DayOfWeek => {
  return dayOfWeeks.includes(value as DayOfWeek);
};

export const createUnavailableTime = async (formData: FormData) => {
  const employeeId = await getCurrentEmployeeId();

  const typeValue = String(formData.get("type") ?? "");
  const dateValue = String(formData.get("date") ?? "");
  const dayOfWeekValue = String(formData.get("dayOfWeek") ?? "");
  const startTime = String(formData.get("startTime") ?? "");
  const endTime = String(formData.get("endTime") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();

  if (!typeValue) {
    throw new Error("勤務不可種別を選択してください。");
  }

  if (!isUnavailableType(typeValue)) {
    throw new Error("勤務不可種別の値が不正です。");
  }

  const dayOfWeek = dayOfWeekValue
    ? isDayOfWeek(dayOfWeekValue)
      ? dayOfWeekValue
      : null
    : null;

  await prisma.unavailableTime.create({
    data: {
      employeeId,
      type: typeValue,
      date: dateValue ? new Date(dateValue) : null,
      dayOfWeek,
      startTime: startTime || null,
      endTime: endTime || null,
      reason: reason || null,
    },
  });

  revalidatePath("/staff/unavailable-times");
  redirect("/staff/unavailable-times?message=created");
};

export const deleteUnavailableTime = async (formData: FormData) => {
  const employeeId = await getCurrentEmployeeId();
  const unavailableTimeId = String(formData.get("unavailableTimeId") ?? "");

  if (!unavailableTimeId) {
    throw new Error("削除対象の勤務不可情報が取得できません。");
  }

  const unavailableTime = await prisma.unavailableTime.findUnique({
    where: {
      id: unavailableTimeId,
    },
  });

  if (!unavailableTime) {
    throw new Error("勤務不可情報が見つかりません。");
  }

  if (unavailableTime.employeeId !== employeeId) {
    throw new Error("他のユーザーの勤務不可情報は削除できません。");
  }

  await prisma.unavailableTime.delete({
    where: {
      id: unavailableTimeId,
    },
  });

  revalidatePath("/staff/unavailable-times");
  redirect("/staff/unavailable-times?message=deleted");
};