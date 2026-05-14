import { prisma } from "@/lib/prisma";

export const getWorkReportsByEmployeeId = async (employeeId: string) => {
  return await prisma.workReport.findMany({
    where: {
      employeeId,
    },
    include: {
      job: true,
      employee: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getWorkReports = async () => {
  return await prisma.workReport.findMany({
    include: {
      job: true,
      employee: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getWorkReportByEmployeeIdAndJobId = async (
  employeeId: string,
  jobId: string,
) => {
  return await prisma.workReport.findFirst({
    where: {
      employeeId,
      jobId,
    },
  });
};

export const getWorkReportsByEmployeeIdAndMonth = async (
  employeeId: string,
  startDate: Date,
  endDate: Date,
) => {
  return await prisma.workReport.findMany({
    where: {
      employeeId,
      job: {
        workDate: {
          gte: startDate,
          lt: endDate,
        },
      },
    },
    include: {
      job: true,
      employee: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getWorkReportsByMonth = async (
  startDate: Date,
  endDate: Date,
) => {
  return await prisma.workReport.findMany({
    where: {
      job: {
        workDate: {
          gte: startDate,
          lt: endDate,
        },
      },
    },
    include: {
      job: true,
      employee: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};