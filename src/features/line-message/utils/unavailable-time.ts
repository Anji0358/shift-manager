import type {
    AvailablePersonalSlot,
    LineMessageUnavailableTime,
} from "../types";
import { isSameDate } from "./date";

const dayOfWeekMap = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
] as const;

const isTimeOverlapping = (
    slotStartMinutes: number,
    slotEndMinutes: number,
    unavailableStartTime: string | null,
    unavailableEndTime: string | null
) => {
    if (!unavailableStartTime || !unavailableEndTime) {
        return true;
    }

    const [unavailableStartHour, unavailableStartMinute] =
        unavailableStartTime.split(":").map(Number);
    const [unavailableEndHour, unavailableEndMinute] =
        unavailableEndTime.split(":").map(Number);

    const unavailableStartMinutes =
        unavailableStartHour * 60 + unavailableStartMinute;
    const unavailableEndMinutes =
        unavailableEndHour * 60 + unavailableEndMinute;

    return (
        slotStartMinutes < unavailableEndMinutes &&
        unavailableStartMinutes < slotEndMinutes
    );
};

export const isSlotUnavailable = (
    slot: AvailablePersonalSlot,
    unavailableTimes: LineMessageUnavailableTime[]
) => {
    return unavailableTimes.some((unavailableTime) => {
        if (unavailableTime.type === "FULL_DAY") {
            return unavailableTime.date
                ? isSameDate(slot.workDate, unavailableTime.date)
                : false;
        }

        if (
            unavailableTime.type === "TIME_RANGE" ||
            unavailableTime.type === "TEMPORARY"
        ) {
            if (!unavailableTime.date) {
                return false;
            }

            return (
                isSameDate(slot.workDate, unavailableTime.date) &&
                isTimeOverlapping(
                    slot.startTimeMinutes,
                    slot.endTimeMinutes,
                    unavailableTime.startTime,
                    unavailableTime.endTime
                )
            );
        }

        if (unavailableTime.type === "WEEKLY_FIXED") {
            const slotDayOfWeek = dayOfWeekMap[slot.workDate.getDay()];

            return (
                unavailableTime.dayOfWeek === slotDayOfWeek &&
                isTimeOverlapping(
                    slot.startTimeMinutes,
                    slot.endTimeMinutes,
                    unavailableTime.startTime,
                    unavailableTime.endTime
                )
            );
        }

        return false;
    });
};