import { prisma } from "@/lib/prisma";

export const getEmployees = async () => {
  return await prisma.employee.findMany({
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