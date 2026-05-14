"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DayOfWeek, UnavailableType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentEmployeeId } from "@/lib/auth/current-user";

const isUnavailableType = (value: string): value is UnavailableType => {
  return Object.values(UnavailableType).includes(value as UnavailableType);
};

const isDayOfWeek = (value: string): value is DayOfWeek => {
  return Object.values(DayOfWeek).includes(value as DayOfWeek);
};

export const createUnavailableTime = async (formData: FormData) => {
  const employeeId = await getCurrentEmployeeId();

  const typeValue = String(formData.get("type") ?? "");
  const date = String(formData.get("date") ?? "");
  const dayOfWeekValue = String(formData.get("dayOfWeek") ?? "");
  const startTime = String(formData.get("startTime") ?? "");
  const endTime = String(formData.get("endTime") ?? "");
  const reason = String(formData.get("reason") ?? "");

  if (!typeValue) {
    throw new Error("勤務不可種別を選択してください。");
  }

  if (!isUnavailableType(typeValue)) {
    throw new Error("勤務不可種別の値が不正です。");
  }

  const dayOfWeek =
    dayOfWeekValue && isDayOfWeek(dayOfWeekValue) ? dayOfWeekValue : null;

  await prisma.unavailableTime.create({
    data: {
      employeeId,
      type: typeValue,
      date: date ? new Date(date) : null,
      dayOfWeek,
      startTime: startTime || null,
      endTime: endTime || null,
      reason,
    },
  });

  revalidatePath("/staff/unavailable-times");
  redirect("/staff/unavailable-times?message=created");
};

export const deleteUnavailableTime = async (formData: FormData) => {
  const employeeId = await getCurrentEmployeeId();
  const unavailableTimeId = String(formData.get("unavailableTimeId"));

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