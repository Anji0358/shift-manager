import type { Prisma } from "@prisma/client";

export type MonthlyReportWorkReport = Prisma.WorkReportGetPayload<{
  include: {
    job: true;
    employee: true;
  };
}>;

export type MonthlyReportDailyRow = {
  date: Date;
  dayOfWeek: string;
  jobTitle: string;
  startTime: string;
  endTime: string;
  breakHours: number | null;
  workingHours: number | null;
  expensesTotal: number | null;
  totalPay: number | null;
  note: string;
};

export type MonthlyReportSummary = {
  employeeId: string;
  employeeName: string;
  yearMonth: string;
  rows: MonthlyReportDailyRow[];
  totals: {
    reportCount: number;
    breakHours: number;
    workingHours: number;
    expensesTotal: number;
    totalPay: number;
  };
};