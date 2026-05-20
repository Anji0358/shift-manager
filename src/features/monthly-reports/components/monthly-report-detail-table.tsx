import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { MonthlyReportSummary } from "@/features/monthly-reports/types";
import { formatDate, formatYen } from "@/lib/format";

type MonthlyReportDetailTableProps = {
    summaries: MonthlyReportSummary[];
};

const formatHour = (value: number | null) => {
    if (value === null) {
        return "-";
    }

    return `${value.toFixed(1)}h`;
};

const formatMoney = (value: number | null) => {
    if (value === null) {
        return "-";
    }

    return formatYen(value);
};

export const MonthlyReportDetailTable = ({
    summaries,
}: MonthlyReportDetailTableProps) => {
    if (summaries.length === 0) {
        return (
            <p className="text-sm text-slate-500">
                対象月に就労報告がありません。
            </p>
        );
    }

    return (
        <div className="space-y-8">
            {summaries.map((summary) => (
                <section key={summary.employeeId} className="space-y-3">
                    <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">{summary.employeeName}</h3>
                            <p className="text-sm text-slate-500">
                                {summary.yearMonth} の月次明細
                            </p>
                        </div>

                        <div className="text-sm text-slate-600">
                            勤務回数：{summary.totals.reportCount}回 / 就労時間：
                            {summary.totals.workingHours.toFixed(1)}h / 合計：
                            {formatYen(summary.totals.totalPay)}
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>日付</TableHead>
                                    <TableHead>曜日</TableHead>
                                    <TableHead>案件名</TableHead>
                                    <TableHead>開始時間</TableHead>
                                    <TableHead>終了時間</TableHead>
                                    <TableHead className="text-right">休憩時間</TableHead>
                                    <TableHead className="text-right">就労時間</TableHead>
                                    <TableHead className="text-right">諸経費</TableHead>
                                    <TableHead className="text-right">計</TableHead>
                                    <TableHead>備考</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {summary.rows.map((row, index) => (
                                    <TableRow
                                        key={`${summary.employeeId}-${row.date.toISOString()}-${index}`}
                                    >
                                        <TableCell>{formatDate(row.date)}</TableCell>
                                        <TableCell>{row.dayOfWeek}</TableCell>
                                        <TableCell className="font-medium">
                                            {row.jobTitle}
                                        </TableCell>
                                        <TableCell>{row.startTime}</TableCell>
                                        <TableCell>{row.endTime}</TableCell>
                                        <TableCell className="text-right">
                                            {formatHour(row.breakHours)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatHour(row.workingHours)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatMoney(row.expensesTotal)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatMoney(row.totalPay)}
                                        </TableCell>
                                        <TableCell>{row.note || "-"}</TableCell>
                                    </TableRow>
                                ))}

                                <TableRow className="bg-slate-50 font-semibold">
                                    <TableCell colSpan={5}>合計</TableCell>
                                    <TableCell className="text-right">
                                        {summary.totals.breakHours.toFixed(1)}h
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {summary.totals.workingHours.toFixed(1)}h
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatYen(summary.totals.expensesTotal)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatYen(summary.totals.totalPay)}
                                    </TableCell>
                                    <TableCell>-</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </section>
            ))}
        </div>
    );
};