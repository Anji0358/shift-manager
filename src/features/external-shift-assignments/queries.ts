import { prisma } from "@/lib/prisma";

export const getExternalShiftAssignmentsByJobId = async (jobId: string) => {
  return await prisma.externalStaffAssignment.findMany({
    where: {
      jobId,
    },
    include: {
      slot: true,
      job: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};