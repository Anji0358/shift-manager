import {
  calculateBreakHours,
  calculateEstimatedSalary,
  calculateExpensesTotal,
  calculateWorkHours,
} from "@/features/payroll/services";
import type {
  MonthlyReportDailyRow,
  MonthlyReportSummary,
  MonthlyReportWorkReport,
} from "@/features/monthly-reports/types";

const dayOfWeekLabels = ["日", "月", "火", "水", "木", "金", "土"];

const getDaysInMonth = (yearMonth: string): Date[] => {
  const [yearText, monthText] = yearMonth.split("-");
  const year = Number(yearText);
  const monthIndex = Number(monthText) - 1;

  const lastDate = new Date(year, monthIndex + 1, 0).getDate();

  return Array.from({ length: lastDate }, (_, index) => {
    return new Date(year, monthIndex, index + 1);
  });
};

const isSameDate = (dateA: Date, dateB: Date): boolean => {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

const getDayOfWeekLabel = (date: Date): string => {
  return dayOfWeekLabels[date.getDay()];
};

const createEmptyDailyRow = (date: Date): MonthlyReportDailyRow => {
  return {
    date,
    dayOfWeek: getDayOfWeekLabel(date),
    jobTitle: "-",
    startTime: "-",
    endTime: "-",
    breakHours: null,
    workingHours: null,
    expensesTotal: null,
    totalPay: null,
    note: "",
  };
};

const createDailyRowFromReport = (
  report: MonthlyReportWorkReport,
): MonthlyReportDailyRow => {
  const breakHours = calculateBreakHours(report.actualBreakMinutes);

  const workingHours = calculateWorkHours(
    report.actualStartTime,
    report.actualEndTime,
    report.actualBreakMinutes,
  );

  const expensesTotal = calculateExpensesTotal(report);

  const totalPay = calculateEstimatedSalary(
    report,
    report.job,
    report.employee,
  );

  return {
    date: report.job.workDate,
    dayOfWeek: getDayOfWeekLabel(report.job.workDate),
    jobTitle: report.job.title,
    startTime: report.actualStartTime,
    endTime: report.actualEndTime,
    breakHours,
    workingHours,
    expensesTotal,
    totalPay,
    note: report.hasMeal ? "食事あり" : "",
  };
};

const calculateTotals = (rows: MonthlyReportDailyRow[]) => {
  return rows.reduce(
    (totals, row) => {
      totals.reportCount += row.jobTitle !== "-" ? 1 : 0;
      totals.breakHours += row.breakHours ?? 0;
      totals.workingHours += row.workingHours ?? 0;
      totals.expensesTotal += row.expensesTotal ?? 0;
      totals.totalPay += row.totalPay ?? 0;

      return totals;
    },
    {
      reportCount: 0,
      breakHours: 0,
      workingHours: 0,
      expensesTotal: 0,
      totalPay: 0,
    },
  );
};

export const buildMonthlyReportSummaries = (
  reports: MonthlyReportWorkReport[],
  yearMonth: string,
): MonthlyReportSummary[] => {
  const dates = getDaysInMonth(yearMonth);

  const reportsByEmployee = reports.reduce<
    Record<string, MonthlyReportWorkReport[]>
  >((groupedReports, report) => {
    const employeeId = report.employeeId;

    if (!groupedReports[employeeId]) {
      groupedReports[employeeId] = [];
    }

    groupedReports[employeeId].push(report);

    return groupedReports;
  }, {});

  return Object.entries(reportsByEmployee).map(([employeeId, employeeReports]) => {
    const employeeName = employeeReports[0]?.employee.name ?? "不明なスタッフ";

    const rows = dates.flatMap((date) => {
      const reportsOfDay = employeeReports.filter((report) => {
        return isSameDate(report.job.workDate, date);
      });

      if (reportsOfDay.length === 0) {
        return [createEmptyDailyRow(date)];
      }

      return reportsOfDay
        .sort((a, b) => {
          return a.actualStartTime.localeCompare(b.actualStartTime);
        })
        .map((report) => createDailyRowFromReport(report));
    });

    return {
      employeeId,
      employeeName,
      yearMonth,
      rows,
      totals: calculateTotals(rows),
    };
  });
};