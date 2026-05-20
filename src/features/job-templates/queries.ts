import { prisma } from "@/lib/prisma";

export const getJobTemplates = async () => {
  return await prisma.jobTemplate.findMany({
    include: {
      shiftSlots: {
        orderBy: {
          startTime: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getJobTemplateById = async (templateId: string) => {
  return await prisma.jobTemplate.findUnique({
    where: {
      id: templateId,
    },
  });
};