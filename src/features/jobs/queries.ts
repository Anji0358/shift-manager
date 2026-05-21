import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const jobDetailInclude = {
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
  externalStaffAssignments: {
    include: {
      slot: true,
    },
    orderBy: {
      name: "asc",
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
} satisfies Prisma.JobInclude;

export type JobDetail = Prisma.JobGetPayload<{
  include: typeof jobDetailInclude;
}> & {
  requiredPeople: number;
  assignedPeople: number;
  assignedInternalPeople: number;
  assignedExternalPeople: number;
  fulfillmentRate: number;
};

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
      externalStaffAssignments: true,
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

    const assignedInternalPeople = job.shiftAssignments.length;
    const assignedExternalPeople = job.externalStaffAssignments.length;

    const assignedPeople = assignedInternalPeople + assignedExternalPeople;

    const fulfillmentRate =
      requiredPeople === 0
        ? 0
        : Math.round((assignedPeople / requiredPeople) * 100);

    return {
      ...job,
      requiredPeople,
      assignedPeople,
      assignedInternalPeople,
      assignedExternalPeople,
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
        orderBy: {
          employee: {
            name: "asc",
          },
        },
      },
      externalStaffAssignments: {
        include: {
          slot: true,
        },
        orderBy: {
          name: "asc",
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
};

export const getActiveStaffCandidates = async () => {
  return await prisma.employee.findMany({
    where: {
      employmentStatus: "ACTIVE",
    },
    include: {
      unavailableTimes: true,
    },
    orderBy: [
      {
        role: "asc",
      },
      {
        startedWorkingAt: "asc",
      },
    ],
  });
};

export const getJobDetail = async (
  jobId: string,
): Promise<JobDetail | null> => {
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
    include: jobDetailInclude,
  });

  if (!job) {
    return null;
  }

  const requiredPeople = job.shiftSlots.reduce(
    (sum, slot) => sum + slot.requiredPeople,
    0,
  );

  const assignedInternalPeople = job.shiftAssignments.length;
  const assignedExternalPeople = job.externalStaffAssignments.length;

  const assignedPeople = assignedInternalPeople + assignedExternalPeople;

  const fulfillmentRate =
    requiredPeople === 0
      ? 0
      : Math.round((assignedPeople / requiredPeople) * 100);

  return {
    ...job,
    requiredPeople,
    assignedPeople,
    assignedInternalPeople,
    assignedExternalPeople,
    fulfillmentRate,
  };
};