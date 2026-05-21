import { prisma } from "@/lib/prisma";
import { getCurrentYearMonth, getMonthRange } from "@/lib/month";

export const getAdminDashboardStats = async () => {
  const currentYearMonth = getCurrentYearMonth();
  const { startDate, endDate } = getMonthRange(currentYearMonth);

  const [
    monthlyJobCount,
    monthlyAssignmentCount,
    pendingReportCount,
    activeEmployeeCount,
  ] = await Promise.all([
    prisma.job.count({
      where: {
        workDate: {
          gte: startDate,
          lt: endDate,
        },
      },
    }),
    prisma.shiftAssignment.count({
      where: {
        status: "ASSIGNED",
        slot: {
          job: {
            workDate: {
              gte: startDate,
              lt: endDate,
            },
          },
        },
      },
    }),
    prisma.workReport.count({
      where: {
        status: "SUBMITTED",
      },
    }),
    prisma.employee.count({
      where: {
        role: "STAFF",
        employmentStatus: "ACTIVE",
      },
    }),
  ]);

  return {
    currentYearMonth,
    monthlyJobCount,
    monthlyAssignmentCount,
    pendingReportCount,
    activeEmployeeCount,
  };
};