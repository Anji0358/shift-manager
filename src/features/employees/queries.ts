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

export const getEmployeeById = async (employeeId: string) => {
  return await prisma.employee.findUnique({
    where: {
      id: employeeId,
    },
  });
};