import { prisma } from "@/lib/prisma";

export const getExternalStaffAssignmentsByJobId = async (jobId: string) => {
  return await prisma.externalStaffAssignment.findMany({
    where: {
      status: "ASSIGNED",
      slot: {
        jobId,
      },
    },
    include: {
      slot: {
        include: {
          job: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getExternalStaffAssignmentsBySlotId = async (slotId: string) => {
  return await prisma.externalStaffAssignment.findMany({
    where: {
      slotId,
      status: "ASSIGNED",
    },
    include: {
      slot: {
        include: {
          job: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};