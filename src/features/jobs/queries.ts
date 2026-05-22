import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const jobDetailInclude = {
  shiftSlots: {
    orderBy: {
      startTime: "asc",
    },
    include: {
      shiftAssignments: {
        where: {
          status: "ASSIGNED",
        },
        include: {
          employee: true,
        },
        orderBy: {
          employee: {
            name: "asc",
          },
        },
      },
      externalStaffAssignments: {
        where: {
          status: "ASSIGNED",
        },
        orderBy: {
          name: "asc",
        },
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

const calculateFulfillment = <
  T extends {
    shiftSlots: Array<{
      requiredPeople: number;
      shiftAssignments?: unknown[];
      externalStaffAssignments?: Array<{
        headCount: number;
      }>;
    }>;
  },
>(
  job: T,
) => {
  const requiredPeople = job.shiftSlots.reduce((sum, slot) => {
    return sum + slot.requiredPeople;
  }, 0);

  const assignedInternalPeople = job.shiftSlots.reduce((sum, slot) => {
    return sum + (slot.shiftAssignments?.length ?? 0);
  }, 0);

  const assignedExternalPeople = job.shiftSlots.reduce((sum, slot) => {
    return (
      sum +
      (slot.externalStaffAssignments?.reduce((slotSum, assignment) => {
        return slotSum + assignment.headCount;
      }, 0) ?? 0)
    );
  }, 0);

  const assignedPeople = assignedInternalPeople + assignedExternalPeople;

  const fulfillmentRate =
    requiredPeople === 0
      ? 0
      : Math.round((assignedPeople / requiredPeople) * 100);

  return {
    requiredPeople,
    assignedPeople,
    assignedInternalPeople,
    assignedExternalPeople,
    fulfillmentRate,
  };
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
    orderBy: {
      workDate: "asc",
    },
    select: {
      id: true,
      title: true,
      workDate: true,
      location: true,
      meetingPlace: true,
      breakMinutes: true,
      hasMeal: true,
      transportationFee: true,
      dressCode: true,
      belongings: true,
      note: true,
      wageType: true,
      fixedHourlyWage: true,
      createdAt: true,
      updatedAt: true,
      shiftSlots: {
        orderBy: {
          startTime: "asc",
        },
        select: {
          id: true,
          jobId: true,
          name: true,
          startTime: true,
          endTime: true,
          requiredPeople: true,
          createdAt: true,
          updatedAt: true,
          shiftAssignments: {
            where: {
              status: "ASSIGNED",
            },
            select: {
              id: true,
              slotId: true,
              employeeId: true,
              status: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          externalStaffAssignments: {
            where: {
              status: "ASSIGNED",
            },
            select: {
              id: true,
              slotId: true,
              name: true,
              headCount: true,
              status: true,
              note: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });

  return jobs.map((job) => {
    const fulfillment = calculateFulfillment(job);

    return {
      ...job,
      ...fulfillment,
    };
  });
};

export const getJobById = async (jobId: string) => {
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
    include: jobDetailInclude,
  });

  if (!job) {
    return null;
  }

  const fulfillment = calculateFulfillment(job);

  return {
    ...job,
    ...fulfillment,
  };
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

  const fulfillment = calculateFulfillment(job);

  return {
    ...job,
    ...fulfillment,
  };
};