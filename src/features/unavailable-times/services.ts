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

const getDayOfWeek = (date: Date) => {
  return dayOfWeekMap[date.getDay()];
};

const isTimeOverlapped = (
  slotStartTime: string,
  slotEndTime: string,
  unavailableStartTime: string,
  unavailableEndTime: string,
) => {
  return slotStartTime < unavailableEndTime && unavailableStartTime < slotEndTime;
};

export const isUnavailableForSlot = (
  unavailableTimes: UnavailableTime[],
  workDate: Date,
  slotStartTime: string,
  slotEndTime: string,
) => {
  const workDayOfWeek = getDayOfWeek(workDate);

  return unavailableTimes.some((unavailableTime) => {
    if (unavailableTime.type === "FULL_DAY") {
      if (!unavailableTime.date) {
        return false;
      }

      return isSameDate(unavailableTime.date, workDate);
    }

    if (unavailableTime.type === "TIME_RANGE") {
      if (
        !unavailableTime.date ||
        !unavailableTime.startTime ||
        !unavailableTime.endTime
      ) {
        return false;
      }

      return (
        isSameDate(unavailableTime.date, workDate) &&
        isTimeOverlapped(
          slotStartTime,
          slotEndTime,
          unavailableTime.startTime,
          unavailableTime.endTime,
        )
      );
    }

    if (unavailableTime.type === "WEEKLY_FIXED") {
      if (
        !unavailableTime.dayOfWeek ||
        !unavailableTime.startTime ||
        !unavailableTime.endTime
      ) {
        return false;
      }

      return (
        unavailableTime.dayOfWeek === workDayOfWeek &&
        isTimeOverlapped(
          slotStartTime,
          slotEndTime,
          unavailableTime.startTime,
          unavailableTime.endTime,
        )
      );
    }

    if (unavailableTime.type === "TEMPORARY") {
      if (
        !unavailableTime.date ||
        !unavailableTime.startTime ||
        !unavailableTime.endTime
      ) {
        return false;
      }

      return (
        isSameDate(unavailableTime.date, workDate) &&
        isTimeOverlapped(
          slotStartTime,
          slotEndTime,
          unavailableTime.startTime,
          unavailableTime.endTime,
        )
      );
    }

    return false;
  });
};