import { prisma } from "@/lib/prisma";

export const getJobs = async (startDate?: Date, endDate?: Date) => {
  const jobs = await prisma.job.findMany({
    where:
      startDate && endDate
        ? {
            workDate: {
              gte: startDate,
              lt: endDate,
            },
          }
        : undefined,
    include: {
      shiftSlots: true,
      shiftAssignments: {
        where: {
          status: "ASSIGNED",
        },
      },
    },
    orderBy: {
      workDate: "asc",
    },
  });

  return jobs.map((job) => {
    const requiredPeople = job.shiftSlots.reduce(
      (sum, slot) => sum + slot.requiredPeople,
      0,
    );

    const assignedPeople = job.shiftAssignments.length;

    const fulfillmentRate =
      requiredPeople === 0
        ? 0
        : Math.round((assignedPeople / requiredPeople) * 100);

    return {
      ...job,
      requiredPeople,
      assignedPeople,
      fulfillmentRate,
    };
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

export const getJobDetail = async (jobId: string) => {
  const job = await prisma.job.findUnique({
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
        where: {
          status: "ASSIGNED",
        },
        include: {
          employee: true,
          slot: true,
        },
        orderBy: {
          employee: {
            name: "asc",
          },
        },
      },
      workReports: {
        include: {
          employee: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!job) {
    return null;
  }

  const requiredPeople = job.shiftSlots.reduce(
    (sum, slot) => sum + slot.requiredPeople,
    0,
  );

  const assignedPeople = job.shiftAssignments.length;

  const fulfillmentRate =
    requiredPeople === 0
      ? 0
      : Math.round((assignedPeople / requiredPeople) * 100);

  return {
    ...job,
    requiredPeople,
    assignedPeople,
    fulfillmentRate,
  };
};