import { prisma } from "@/lib/prisma";

export const getFirstAssignmentByEmployeeId = async (employeeId: string) => {
  return await prisma.shiftAssignment.findFirst({
    where: {
      employeeId,
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