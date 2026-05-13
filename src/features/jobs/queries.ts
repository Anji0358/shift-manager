import { prisma } from "@/lib/prisma";

export const getJobs = async () => {
  return await prisma.job.findMany({
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
      shiftAssignments: true,
    },
  });
};