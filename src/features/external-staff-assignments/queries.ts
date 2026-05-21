import { prisma } from "@/lib/prisma";

export const getExternalStaffAssignmentsByJobId = async (jobId: string) => {
  return await prisma.externalStaffAssignment.findMany({
    where: {
      jobId,
      status: "ASSIGNED",
    },
    include: {
      job: true,
      slot: true,
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
      job: true,
      slot: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};