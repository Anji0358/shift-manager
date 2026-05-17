import { prisma } from "@/lib/prisma";

export const getJobTemplates = async () => {
  return await prisma.jobTemplate.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};