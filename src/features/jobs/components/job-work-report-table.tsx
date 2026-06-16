import { Badge } from "@/components/ui/badge";
import { AppCard } from "@/components/shared/app-card";
import { appStyles } from "@/components/shared/design-tokens";
import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { workReportStatusLabel } from "@/features/jobs/labels";
import type { JobDetail } from "@/features/jobs/types";
import { formatDate, formatYen } from "@/lib/format";
import { ClipboardCheck } from "lucide-react";

type WorkReportWithEmployee = JobDetail["workReports"][number];

type JobWorkReportTableProps = {
    reports: WorkReportWithEmployee[];
};

export const JobWorkReportTable = ({ reports }: JobWorkReportTableProps) => {
    return (
        <AppCard className="overflow-hidden">
            <CardHeader className="p-5 pb-3">
                <div className="flex items-start gap-3">
                    <div className={appStyles.icon.circle}>
                        <ClipboardCheck className="h-5 w-5" />
                    </div>

                    <div>
                        <CardTitle
                            className={[
                                appStyles.text.title,
                                "text-xl",
                            ].join(" ")}
                        >
                            就労報告一覧
                        </CardTitle>
                        <p className={["mt-1", appStyles.text.muted].join(" ")}>
                            スタッフから提出された勤務実績を確認します。
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-2">
                <div className={appStyles.table.wrapper}>
                    <Table>
                        <TableHeader>
                            <TableRow className={appStyles.table.headerRow}>
                                <TableHead className={appStyles.table.head}>
                                    氏名
                                </TableHead>

                                <TableHead className={appStyles.table.head}>
                                    ステータス
                                </TableHead>

                                <TableHead className={appStyles.table.head}>
                                    実働時間
                                </TableHead>

                                <TableHead className={appStyles.table.head}>
                                    休憩
                                </TableHead>

                                <TableHead className={appStyles.table.head}>
                                    交通費
                                </TableHead>

                                <TableHead className={appStyles.table.head}>
                                    食事
                                </TableHead>

                                <TableHead className={appStyles.table.head}>
                                    提出日時
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {reports.map((report) => (
                                <TableRow
                                    key={report.id}
                                    className={appStyles.table.row}
                                >
                                    <TableCell>
                                        <p
                                            className={[
                                                appStyles.text.title,
                                                "text-base",
                                            ].join(" ")}
                                        >
                                            {report.employee.name}
                                        </p>
                                    </TableCell>

                                    <TableCell>
                                        <Badge className={appStyles.badge.neutral}>
                                            {workReportStatusLabel[report.status]}
                                        </Badge>
                                    </TableCell>

                                    <TableCell
                                        className={[
                                            "whitespace-nowrap",
                                            appStyles.table.cellMuted,
                                        ].join(" ")}
                                    >
                                        {report.actualStartTime}〜
                                        {report.actualEndTime}
                                    </TableCell>

                                    <TableCell
                                        className={[
                                            "whitespace-nowrap",
                                            appStyles.table.cellMuted,
                                        ].join(" ")}
                                    >
                                        {report.actualBreakMinutes}分
                                    </TableCell>

                                    <TableCell
                                        className={[
                                            "whitespace-nowrap text-sm font-medium",
                                            appStyles.textColor.tableHead,
                                        ].join(" ")}
                                    >
                                        {formatYen(report.transportationFee)}
                                    </TableCell>

                                    <TableCell
                                        className={[
                                            "whitespace-nowrap",
                                            appStyles.table.cellMuted,
                                        ].join(" ")}
                                    >
                                        {report.hasMeal ? "あり" : "なし"}
                                    </TableCell>

                                    <TableCell
                                        className={[
                                            "whitespace-nowrap",
                                            appStyles.table.cellMuted,
                                        ].join(" ")}
                                    >
                                        {formatDate(report.createdAt)}
                                    </TableCell>
                                </TableRow>
                            ))}

                            {reports.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className={appStyles.table.empty}
                                    >
                                        就労報告はまだありません。
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </AppCard>
    );
};