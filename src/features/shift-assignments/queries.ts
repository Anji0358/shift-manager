import { prisma } from "@/lib/prisma";

export const getFirstAssignmentByEmployeeId = async (employeeId: string) => {
  return await prisma.shiftAssignment.findFirst({
    where: {
      employeeId,
      status: "ASSIGNED",
    },
    include: {
      slot: {
        include: {
          job: true,
        },
      },
      employee: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getAssignmentsByEmployeeId = async (employeeId: string) => {
  return await prisma.shiftAssignment.findMany({
    where: {
      employeeId,
      status: "ASSIGNED",
    },
    include: {
      slot: {
        include: {
          job: true,
        },
      },
      employee: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getAssignmentsByJobId = async (jobId: string) => {
  return await prisma.shiftAssignment.findMany({
    where: {
      status: "ASSIGNED",
      slot: {
        jobId,
      },
    },
    include: {
      slot: true,
      employee: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getAssignmentById = async (assignmentId: string) => {
  return await prisma.shiftAssignment.findUnique({
    where: {
      id: assignmentId,
    },
    include: {
      slot: {
        include: {
          job: true,
        },
      },
      employee: true,
    },
  });
};

export const getAssignmentsByEmployeeIdAndMonth = async (
  employeeId: string,
  startDate: Date,
  endDate: Date,
) => {
  return await prisma.shiftAssignment.findMany({
    where: {
      employeeId,
      status: "ASSIGNED",
      slot: {
        job: {
          workDate: {
            gte: startDate,
            lt: endDate,
          },
        },
      },
    },
    include: {
      slot: {
        include: {
          job: true,
        },
      },
      employee: true,
    },
    orderBy: {
      slot: {
        job: {
          workDate: "asc",
        },
      },
    },
  });
};

export const getAssignmentPageData = async (jobId: string) => {
  const job = await prisma.job.findUnique({
  where: {
    id: jobId,
  },
  select: {
    id: true,
    title: true,
    workDate: true,
    location: true,
    meetingPlace: true,
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
            employee: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                hourlyWage: true,
                startedWorkingAt: true,
              },
            },
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

  if (!job) {
    return null;
  }

  const candidates = await prisma.employee.findMany({
  where: {
    employmentStatus: "ACTIVE",
  },
  orderBy: [
    {
      role: "asc",
    },
    {
      startedWorkingAt: "asc",
    },
  ],
  select: {
    id: true,
    name: true,
    email: true,
    passwordHash: true,
    role: true,
    hourlyWage: true,
    startedWorkingAt: true,
    employmentStatus: true,
    createdAt: true,
    updatedAt: true,
    unavailableTimes: {
      select: {
        id: true,
        employeeId: true,
        type: true,
        date: true,
        dayOfWeek: true,
        startTime: true,
        endTime: true,
        reason: true,
        createdAt: true,
        updatedAt: true,
      },
    },
    shiftAssignments: {
      where: {
        status: "ASSIGNED",
        slot: {
          job: {
            workDate: job.workDate,
          },
        },
      },
      select: {
        id: true,
        slotId: true,
        employeeId: true,
        status: true,
        slot: {
          select: {
            id: true,
            jobId: true,
            name: true,
            startTime: true,
            endTime: true,
            job: {
              select: {
                id: true,
                title: true,
                workDate: true,
              },
            },
          },
        },
      },
    },
  },
});

  const assignments = job.shiftSlots.flatMap((slot) => {
    return slot.shiftAssignments.map((assignment) => {
      return {
        ...assignment,
        slot: {
          id: slot.id,
          jobId: slot.jobId,
          name: slot.name,
          startTime: slot.startTime,
          endTime: slot.endTime,
          requiredPeople: slot.requiredPeople,
          createdAt: slot.createdAt,
          updatedAt: slot.updatedAt,
        },
      };
    });
  });

  const externalAssignments = job.shiftSlots.flatMap((slot) => {
    return slot.externalStaffAssignments.map((assignment) => {
      return {
        ...assignment,
        slot: {
          id: slot.id,
          jobId: slot.jobId,
          name: slot.name,
          startTime: slot.startTime,
          endTime: slot.endTime,
          requiredPeople: slot.requiredPeople,
          createdAt: slot.createdAt,
          updatedAt: slot.updatedAt,
        },
      };
    });
  });

  return {
    job,
    candidates,
    assignments,
    externalAssignments,
  };
};