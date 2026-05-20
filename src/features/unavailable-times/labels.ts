import type { DayOfWeek, UnavailableType } from "@prisma/client";

export const unavailableTypeLabel: Record<UnavailableType, string> = {
  FULL_DAY: "終日NG",
  TIME_RANGE: "一部時間だけNG",
  WEEKLY_FIXED: "毎週決まった時間にNG",
  TEMPORARY: "一時的にNG",
};

export const dayOfWeekLabel: Record<DayOfWeek, string> = {
  MONDAY: "月曜日",
  TUESDAY: "火曜日",
  WEDNESDAY: "水曜日",
  THURSDAY: "木曜日",
  FRIDAY: "金曜日",
  SATURDAY: "土曜日",
  SUNDAY: "日曜日",
};