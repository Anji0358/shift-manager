import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { appStyles } from "@/components/shared/design-tokens";
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
            <p className={appStyles.text.muted}>
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
                            <h3
                                className={[
                                    appStyles.text.title,
                                    "text-lg font-semibold",
                                ].join(" ")}
                            >
                                {summary.employeeName}
                            </h3>
                            <p className={appStyles.text.muted}>
                                {summary.yearMonth} の月次明細
                            </p>
                        </div>

                        <div
                            className={[
                                "text-sm",
                                appStyles.textColor.body,
                            ].join(" ")}
                        >
                            勤務回数：{summary.totals.reportCount}回 / 就労時間：
                            {summary.totals.workingHours.toFixed(1)}h / 合計：
                            {formatYen(summary.totals.totalPay)}
                        </div>
                    </div>

                    <div className={appStyles.table.wrapper}>
                        <Table>
                            <TableHeader>
                                <TableRow className={appStyles.table.headerRow}>
                                    <TableHead className={appStyles.table.head}>
                                        日付
                                    </TableHead>
                                    <TableHead className={appStyles.table.head}>
                                        曜日
                                    </TableHead>
                                    <TableHead className={appStyles.table.head}>
                                        案件名
                                    </TableHead>
                                    <TableHead className={appStyles.table.head}>
                                        開始時間
                                    </TableHead>
                                    <TableHead className={appStyles.table.head}>
                                        終了時間
                                    </TableHead>
                                    <TableHead
                                        className={[
                                            appStyles.table.head,
                                            "text-right",
                                        ].join(" ")}
                                    >
                                        休憩時間
                                    </TableHead>
                                    <TableHead
                                        className={[
                                            appStyles.table.head,
                                            "text-right",
                                        ].join(" ")}
                                    >
                                        就労時間
                                    </TableHead>
                                    <TableHead
                                        className={[
                                            appStyles.table.head,
                                            "text-right",
                                        ].join(" ")}
                                    >
                                        諸経費
                                    </TableHead>
                                    <TableHead
                                        className={[
                                            appStyles.table.head,
                                            "text-right",
                                        ].join(" ")}
                                    >
                                        計
                                    </TableHead>
                                    <TableHead className={appStyles.table.head}>
                                        備考
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {summary.rows.map((row, index) => (
                                    <TableRow
                                        key={`${summary.employeeId}-${row.date.toISOString()}-${index}`}
                                        className={appStyles.table.row}
                                    >
                                        <TableCell className={appStyles.table.cellMuted}>
                                            {formatDate(row.date)}
                                        </TableCell>
                                        <TableCell className={appStyles.table.cellMuted}>
                                            {row.dayOfWeek}
                                        </TableCell>
                                        <TableCell>
                                            <p
                                                className={[
                                                    appStyles.text.title,
                                                    "text-sm font-medium",
                                                ].join(" ")}
                                            >
                                                {row.jobTitle}
                                            </p>
                                        </TableCell>
                                        <TableCell className={appStyles.table.cellMuted}>
                                            {row.startTime}
                                        </TableCell>
                                        <TableCell className={appStyles.table.cellMuted}>
                                            {row.endTime}
                                        </TableCell>
                                        <TableCell
                                            className={[
                                                "text-right",
                                                appStyles.table.cellMuted,
                                            ].join(" ")}
                                        >
                                            {formatHour(row.breakHours)}
                                        </TableCell>
                                        <TableCell
                                            className={[
                                                "text-right",
                                                appStyles.table.cellMuted,
                                            ].join(" ")}
                                        >
                                            {formatHour(row.workingHours)}
                                        </TableCell>
                                        <TableCell
                                            className={[
                                                "text-right",
                                                appStyles.table.cellMuted,
                                            ].join(" ")}
                                        >
                                            {formatMoney(row.expensesTotal)}
                                        </TableCell>
                                        <TableCell
                                            className={[
                                                "text-right text-sm font-medium",
                                                appStyles.textColor.default,
                                            ].join(" ")}
                                        >
                                            {formatMoney(row.totalPay)}
                                        </TableCell>
                                        <TableCell className={appStyles.table.cellMuted}>
                                            {row.note || "-"}
                                        </TableCell>
                                    </TableRow>
                                ))}

                                <TableRow
                                    className={[
                                        appStyles.table.row,
                                        appStyles.background.warmSoft,
                                        "font-semibold",
                                    ].join(" ")}
                                >
                                    <TableCell
                                        colSpan={5}
                                        className={appStyles.textColor.default}
                                    >
                                        合計
                                    </TableCell>
                                    <TableCell
                                        className={[
                                            "text-right",
                                            appStyles.textColor.default,
                                        ].join(" ")}
                                    >
                                        {summary.totals.breakHours.toFixed(1)}h
                                    </TableCell>
                                    <TableCell
                                        className={[
                                            "text-right",
                                            appStyles.textColor.default,
                                        ].join(" ")}
                                    >
                                        {summary.totals.workingHours.toFixed(1)}h
                                    </TableCell>
                                    <TableCell
                                        className={[
                                            "text-right",
                                            appStyles.textColor.default,
                                        ].join(" ")}
                                    >
                                        {formatYen(summary.totals.expensesTotal)}
                                    </TableCell>
                                    <TableCell
                                        className={[
                                            "text-right",
                                            appStyles.textColor.default,
                                        ].join(" ")}
                                    >
                                        {formatYen(summary.totals.totalPay)}
                                    </TableCell>
                                    <TableCell className={appStyles.textColor.default}>
                                        -
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </section>
            ))}
        </div>
    );
};