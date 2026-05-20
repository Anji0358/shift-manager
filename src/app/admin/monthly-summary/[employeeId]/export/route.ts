import ExcelJS from "exceljs";
import { notFound } from "next/navigation";
import { getWorkReportsByMonth } from "@/features/work-reports/queries";
import {
  calculateEstimatedSalary,
  calculateMealAllowance,
  calculateWorkHours,
} from "@/features/payroll/services";
import { getCurrentYearMonth, getMonthRange } from "@/lib/month";
import { requireAdmin } from "@/lib/auth/guards";

export const runtime = "nodejs";

type ExportPayrollRouteProps = {
  params: Promise<{
    employeeId: string;
  }>;
};

const dayOfWeekLabels = ["日", "月", "火", "水", "木", "金", "土"];

const getDaysInMonth = (yearMonth: string) => {
  const [yearText, monthText] = yearMonth.split("-");
  const year = Number(yearText);
  const month = Number(monthText);

  return new Date(year, month, 0).getDate();
};

const getDateByYearMonthAndDay = (yearMonth: string, day: number) => {
  const [yearText, monthText] = yearMonth.split("-");
  const year = Number(yearText);
  const monthIndex = Number(monthText) - 1;

  return new Date(year, monthIndex, day);
};

const isSameDate = (dateA: Date, dateB: Date) => {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

const formatDateForExcel = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
};

const createSafeFileName = (value: string) => {
  return value.replace(/[\\/:*?"<>|]/g, "_");
};

export const GET = async (
  request: Request,
  { params }: ExportPayrollRouteProps,
) => {
  await requireAdmin();

  const { employeeId } = await params;
  const url = new URL(request.url);
  const targetMonth = url.searchParams.get("month") ?? getCurrentYearMonth();
  const { startDate, endDate } = getMonthRange(targetMonth);

  const reports = await getWorkReportsByMonth(startDate, endDate);

  const employeeReports = reports
    .filter((report) => report.employeeId === employeeId)
    .sort((a, b) => {
      return a.job.workDate.getTime() - b.job.workDate.getTime();
    });

  if (employeeReports.length === 0) {
    notFound();
  }

  const employeeName = employeeReports[0].employee.name;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Shift Manager";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("給与明細");

  worksheet.columns = [
    { header: "日付", key: "date", width: 14 },
    { header: "曜日", key: "dayOfWeek", width: 8 },
    { header: "案件名", key: "jobTitle", width: 28 },
    { header: "開始時間", key: "startTime", width: 12 },
    { header: "終了時間", key: "endTime", width: 12 },
    { header: "休憩時間(h)", key: "breakHours", width: 14 },
    { header: "就労時間(h)", key: "workHours", width: 14 },
    { header: "諸経費", key: "expenses", width: 12 },
    { header: "計", key: "totalPay", width: 12 },
    { header: "備考", key: "note", width: 24 },
  ];

  worksheet.spliceRows(1, 0, [`給与明細：${employeeName}`]);
  worksheet.spliceRows(2, 0, [`対象月：${targetMonth}`]);
  worksheet.spliceRows(3, 0, []);

  worksheet.getCell("A1").font = {
    bold: true,
    size: 16,
  };

  worksheet.getCell("A2").font = {
    bold: true,
  };

  const headerRow = worksheet.getRow(4);
  headerRow.font = {
    bold: true,
  };

  headerRow.eachCell((cell) => {
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  const days = Array.from(
    { length: getDaysInMonth(targetMonth) },
    (_, index) => index + 1,
  );

  let totalWorkHours = 0;
  let totalExpenses = 0;
  let totalPay = 0;

  for (const day of days) {
    const targetDate = getDateByYearMonthAndDay(targetMonth, day);
    const reportsOfDay = employeeReports.filter((report) => {
      return isSameDate(report.job.workDate, targetDate);
    });

    if (reportsOfDay.length === 0) {
      worksheet.addRow({
        date: formatDateForExcel(targetDate),
        dayOfWeek: dayOfWeekLabels[targetDate.getDay()],
        jobTitle: "",
        startTime: "",
        endTime: "",
        breakHours: "",
        workHours: "",
        expenses: "",
        totalPay: "",
        note: "",
      });

      continue;
    }

    for (const report of reportsOfDay) {
      const breakHours = report.actualBreakMinutes / 60;
      const workHours = calculateWorkHours(
        report.actualStartTime,
        report.actualEndTime,
        report.actualBreakMinutes,
      );

      const expenses =
        report.transportationFee + calculateMealAllowance(report);

      const pay = calculateEstimatedSalary(
        report,
        report.job,
        report.employee,
      );

      totalWorkHours += workHours;
      totalExpenses += expenses;
      totalPay += pay;

      worksheet.addRow({
        date: formatDateForExcel(targetDate),
        dayOfWeek: dayOfWeekLabels[targetDate.getDay()],
        jobTitle: report.job.title,
        startTime: report.actualStartTime,
        endTime: report.actualEndTime,
        breakHours: Number(breakHours.toFixed(1)),
        workHours: Number(workHours.toFixed(1)),
        expenses,
        totalPay: pay,
        note: report.hasMeal ? "食事あり" : "",
      });
    }
  }

  worksheet.addRow([]);
  worksheet.addRow({
    date: "合計",
    workHours: Number(totalWorkHours.toFixed(1)),
    expenses: totalExpenses,
    totalPay,
  });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber < 4) {
      return;
    }

    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      cell.alignment = {
        vertical: "middle",
      };
    });
  });

  worksheet.getColumn("expenses").numFmt = '"¥"#,##0';
  worksheet.getColumn("totalPay").numFmt = '"¥"#,##0';

  const fileName = createSafeFileName(
    `給与明細_${employeeName}_${targetMonth}.xlsx`,
  );

  const buffer = await workbook.xlsx.writeBuffer();
  const body = Buffer.from(buffer);

  return new Response(body, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(
        fileName,
      )}`,
    },
  });
};