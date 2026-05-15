import { prisma } from "@/lib/prisma";
import { getMonthRange } from "@/lib/month";
import {
  calculateEstimatedSalary,
  calculateMealAllowance,
  calculateWorkMinutes,
  getAppliedHourlyWage,
} from "@/features/payroll/services";

export const getStaffMonthlyPayrollSummary = async (
  employeeId: string,
  yearMonth: string,
) => {
  const { startDate, endDate } = getMonthRange(yearMonth);

  const reports = await prisma.workReport.findMany({
    where: {
      employeeId,
      status: "APPROVED",
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
      job: {
        workDate: "asc",
      },
    },
  });

  const rows = reports.map((report) => {
    const workingMinutes = calculateWorkMinutes(
      report.actualStartTime,
      report.actualEndTime,
      report.actualBreakMinutes,
    );

    const hourlyWage = getAppliedHourlyWage(report.job, report.employee);
    const mealAllowance = calculateMealAllowance(report);
    const totalAmount = calculateEstimatedSalary(
      report,
      report.job,
      report.employee,
    );

    const wageAmount = Math.round((workingMinutes / 60) * hourlyWage);

    return {
      id: report.id,
      workDate: report.job.workDate,
      jobTitle: report.job.title,
      actualStartTime: report.actualStartTime,
      actualEndTime: report.actualEndTime,
      actualBreakMinutes: report.actualBreakMinutes,
      workingMinutes,
      hourlyWage,
      wageAmount,
      transportationFee: report.transportationFee,
      hasMeal: report.hasMeal,
      mealAllowance,
      totalAmount,
    };
  });

  const totalWorkingMinutes = rows.reduce(
    (sum, row) => sum + row.workingMinutes,
    0,
  );

  const totalWageAmount = rows.reduce(
    (sum, row) => sum + row.wageAmount,
    0,
  );

  const totalTransportationFee = rows.reduce(
    (sum, row) => sum + row.transportationFee,
    0,
  );

  const totalMealAllowance = rows.reduce(
    (sum, row) => sum + row.mealAllowance,
    0,
  );

  const totalPaymentAmount = rows.reduce(
    (sum, row) => sum + row.totalAmount,
    0,
  );

  return {
    rows,
    totalWorkingMinutes,
    totalWageAmount,
    totalTransportationFee,
    totalMealAllowance,
    totalPaymentAmount,
  };
};