import { UnavailableType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const getUnavailableTimesByEmployeeId = async (employeeId: string) => {
  return await prisma.unavailableTime.findMany({
    where: {
      employeeId,
    },
    orderBy: [
      {
        date: "asc",
      },
      {
        dayOfWeek: "asc",
      },
      {
        startTime: "asc",
      },
    ],
  });
};

export const getUnavailableTimesByEmployeeIdAndMonth = async (
  employeeId: string,
  startDate: Date,
  endDate: Date,
) => {
  return await prisma.unavailableTime.findMany({
    where: {
      employeeId,
      OR: [
        {
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
        {
          type: UnavailableType.WEEKLY_FIXED,
        },
      ],
    },
    orderBy: [
      {
        date: "asc",
      },
      {
        dayOfWeek: "asc",
      },
      {
        startTime: "asc",
      },
    ],
  });
};