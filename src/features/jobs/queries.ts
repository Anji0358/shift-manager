import { prisma } from "@/lib/prisma";

export const getJobs = async (startDate?: Date, endDate?: Date) => {
  return await prisma.job.findMany({
    where:
      startDate && endDate
        ? {
            workDate: {
              gte: startDate,
              lt: endDate,
            },
          }
        : undefined,
    orderBy: {
      workDate: "asc",
    },
  });
};

export const getJobById = async (jobId: string) => {
  return await prisma.job.findUnique({
    where: {
      id: jobId,
    },
    include: {
      shiftSlots: {
        orderBy: {
          startTime: "asc",
        },
      },
      shiftAssignments: {
        include: {
          employee: true,
          slot: true,
        },
      },
    },
  });
};

export const getActiveStaffCandidates = async () => {
  return await prisma.employee.findMany({
    where: {
      role: "STAFF",
      employmentStatus: "ACTIVE",
    },
    include: {
      unavailableTimes: true,
    },
    orderBy: {
      startedWorkingAt: "asc",
    },
  });
};