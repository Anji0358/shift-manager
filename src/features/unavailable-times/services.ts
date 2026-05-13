import type { DayOfWeek, UnavailableTime } from "@prisma/client";

const dayOfWeekMap: Record<number, DayOfWeek> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

const isSameDate = (dateA: Date, dateB: Date) => {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

const isTimeOverlapped = (
  startA: string,
  endA: string,
  startB: string,
  endB: string,
) => {
  return startA < endB && startB < endA;
};

export const isUnavailableForSlot = (
  unavailableTimes: UnavailableTime[],
  workDate: Date,
  slotStartTime: string,
  slotEndTime: string,
) => {
  const workDayOfWeek = dayOfWeekMap[workDate.getDay()];

  return unavailableTimes.some((unavailableTime) => {
    if (unavailableTime.type === "FULL_DAY") {
      return unavailableTime.date
        ? isSameDate(unavailableTime.date, workDate)
        : false;
    }

    if (unavailableTime.type === "TEMPORARY") {
      if (!unavailableTime.date) {
        return false;
      }

      if (!isSameDate(unavailableTime.date, workDate)) {
        return false;
      }

      if (!unavailableTime.startTime || !unavailableTime.endTime) {
        return true;
      }

      return isTimeOverlapped(
        unavailableTime.startTime,
        unavailableTime.endTime,
        slotStartTime,
        slotEndTime,
      );
    }

    if (unavailableTime.type === "TIME_RANGE") {
      if (!unavailableTime.date) {
        return false;
      }

      if (!isSameDate(unavailableTime.date, workDate)) {
        return false;
      }

      if (!unavailableTime.startTime || !unavailableTime.endTime) {
        return false;
      }

      return isTimeOverlapped(
        unavailableTime.startTime,
        unavailableTime.endTime,
        slotStartTime,
        slotEndTime,
      );
    }

    if (unavailableTime.type === "WEEKLY_FIXED") {
      if (unavailableTime.dayOfWeek !== workDayOfWeek) {
        return false;
      }

      if (!unavailableTime.startTime || !unavailableTime.endTime) {
        return true;
      }

      return isTimeOverlapped(
        unavailableTime.startTime,
        unavailableTime.endTime,
        slotStartTime,
        slotEndTime,
      );
    }

    return false;
  });
};