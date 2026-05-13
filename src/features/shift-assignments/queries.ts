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

export const getAssignmentsByEmployeeId = async (employeeId: string) => {
  return await prisma.shiftAssignment.findMany({
    where: {
      employeeId,
      status: "ASSIGNED",
    },
    include: {
      job: true,
      slot: true,
      employee: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getAssignmentsByJobId = async (jobId: string) => {
  return await prisma.shiftAssignment.findMany({
    where: {
      jobId,
      status: "ASSIGNED",
    },
    include: {
      job: true,
      slot: true,
      employee: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};