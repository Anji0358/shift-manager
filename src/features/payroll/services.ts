import type { Employee, Job, WorkReport } from "@prisma/client";

type SalaryWorkReport = Pick<
  WorkReport,
  | "actualStartTime"
  | "actualEndTime"
  | "actualBreakMinutes"
  | "transportationFee"
  | "hasMeal"
>;

type SalaryJob = Pick<Job, "wageType" | "fixedHourlyWage">;

type SalaryEmployee = Pick<Employee, "hourlyWage">;

const NO_MEAL_ALLOWANCE = 500;

export const calculateBreakHours = (breakMinutes: number): number => {
  return breakMinutes / 60;
};

export const calculateWorkHours = (
  startTime: string,
  endTime: string,
  breakMinutes: number,
): number => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  const workMinutes = endTotalMinutes - startTotalMinutes - breakMinutes;

  return Math.max(workMinutes, 0) / 60;
};

export const calculateWorkMinutes = (
  startTime: string,
  endTime: string,
  breakMinutes: number,
): number => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  const workMinutes = endTotalMinutes - startTotalMinutes - breakMinutes;

  return Math.max(workMinutes, 0);
};

export const getAppliedHourlyWage = (
  job: SalaryJob,
  employee: SalaryEmployee,
): number => {
  if (job.wageType === "JOB_FIXED" && job.fixedHourlyWage !== null) {
    return job.fixedHourlyWage;
  }

  return employee.hourlyWage;
};

export const calculateMealAllowance = (report: SalaryWorkReport): number => {
  return report.hasMeal ? 0 : NO_MEAL_ALLOWANCE;
};

export const calculateExpensesTotal = (
  report: SalaryWorkReport,
): number => {
  return report.transportationFee + calculateMealAllowance(report);
};

export const calculateBaseSalary = (
  report: SalaryWorkReport,
  job: SalaryJob,
  employee: SalaryEmployee,
): number => {
  const workHours = calculateWorkHours(
    report.actualStartTime,
    report.actualEndTime,
    report.actualBreakMinutes,
  );

  const appliedHourlyWage = getAppliedHourlyWage(job, employee);

  return Math.round(workHours * appliedHourlyWage);
};

export const calculateEstimatedSalary = (
  report: SalaryWorkReport,
  job: SalaryJob,
  employee: SalaryEmployee,
): number => {
  return (
    calculateBaseSalary(report, job, employee) +
    calculateExpensesTotal(report)
  );
};