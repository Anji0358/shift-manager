import { prisma } from "@/lib/prisma";

export const getExternalShiftAssignmentsByJobId = async (jobId: string) => {
  return await prisma.externalStaffAssignment.findMany({
    where: {
      status: "ASSIGNED",
      slot: {
        jobId,
      },
    },
    include: {
      slot: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};