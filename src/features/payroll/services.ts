import type { Employee, Job, WorkReport } from "@/features/shared/types";

export const calculateWorkHours = (
  startTime: string,
  endTime: string,
  breakMinutes: number,
): number => {
  const startHour = Number(startTime.split(":")[0]);
  const startMinute = Number(startTime.split(":")[1]);
  const endHour = Number(endTime.split(":")[0]);
  const endMinute = Number(endTime.split(":")[1]);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  const workMinutes = endTotalMinutes - startTotalMinutes - breakMinutes;

  return workMinutes / 60;
};

export const getAppliedHourlyWage = (
  job: Job,
  employee: Employee,
): number => {
  if (job.wageType === "JOB_FIXED" && job.fixedHourlyWage !== null) {
    return job.fixedHourlyWage;
  }

  return employee.hourlyWage;
};

export const calculateEstimatedSalary = (
  report: WorkReport,
  job: Job,
  employee: Employee,
): number => {
  const workHours = calculateWorkHours(
    report.actualStartTime,
    report.actualEndTime,
    report.actualBreakMinutes,
  );

  const appliedHourlyWage = getAppliedHourlyWage(job, employee);

  return Math.round(
    workHours * appliedHourlyWage + report.transportationFee,
  );
};