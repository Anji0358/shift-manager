import type { DayOfWeek, UnavailableType } from "@prisma/client";

export const unavailableTypeLabel: Record<UnavailableType, string> = {
    FULL_DAY: "終日勤務不可",
    TIME_RANGE: "時間帯勤務不可",
    WEEKLY_FIXED: "毎週固定の勤務不可",
    TEMPORARY: "単発の予定",
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