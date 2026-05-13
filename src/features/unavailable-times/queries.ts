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