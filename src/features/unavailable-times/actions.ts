"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { DayOfWeek, UnavailableType } from "@prisma/client";

export const createUnavailableTime = async (formData: FormData) => {
  const employeeId = String(formData.get("employeeId"));
  const type = String(formData.get("type")) as UnavailableType;
  const dateText = String(formData.get("date") ?? "");
  const dayOfWeekText = String(formData.get("dayOfWeek") ?? "");
  const startTimeText = String(formData.get("startTime") ?? "");
  const endTimeText = String(formData.get("endTime") ?? "");
  const reason = String(formData.get("reason") ?? "");

  if (!employeeId || !type) {
    throw new Error("勤務不可情報の入力内容が不足しています。");
  }

  await prisma.unavailableTime.create({
    data: {
      employeeId,
      type,
      date: dateText ? new Date(dateText) : null,
      dayOfWeek: dayOfWeekText ? (dayOfWeekText as DayOfWeek) : null,
      startTime: startTimeText || null,
      endTime: endTimeText || null,
      reason,
    },
  });

  revalidatePath("/staff/unavailable-times");
  redirect("/staff/unavailable-times");
};