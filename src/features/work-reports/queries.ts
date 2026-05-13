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