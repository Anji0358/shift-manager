import { Badge } from "@/components/ui/badge";
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
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
        <BridalCard className="overflow-hidden">
            <CardHeader className="p-5 pb-3">
                <div className="flex items-start gap-3">
                    <div className={bridalStyles.icon.circle}>
                        <ClipboardCheck className="h-5 w-5" />
                    </div>

                    <div>
                        <CardTitle
                            className={[
                                bridalStyles.text.title,
                                "text-xl",
                            ].join(" ")}
                        >
                            就労報告一覧
                        </CardTitle>
                        <p className="mt-1 text-sm text-slate-500">
                            スタッフから提出された勤務実績を確認します。
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-2">
                <div className={bridalStyles.table.wrapper}>
                    <Table>
                        <TableHeader>
                            <TableRow className={bridalStyles.table.headerRow}>
                                <TableHead className={bridalStyles.table.head}>
                                    氏名
                                </TableHead>

                                <TableHead className={bridalStyles.table.head}>
                                    ステータス
                                </TableHead>

                                <TableHead className={bridalStyles.table.head}>
                                    実働時間
                                </TableHead>

                                <TableHead className={bridalStyles.table.head}>
                                    休憩
                                </TableHead>

                                <TableHead className={bridalStyles.table.head}>
                                    交通費
                                </TableHead>

                                <TableHead className={bridalStyles.table.head}>
                                    食事
                                </TableHead>

                                <TableHead className={bridalStyles.table.head}>
                                    提出日時
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {reports.map((report) => (
                                <TableRow
                                    key={report.id}
                                    className={bridalStyles.table.row}
                                >
                                    <TableCell>
                                        <p
                                            className={[
                                                bridalStyles.text.title,
                                                "text-base",
                                            ].join(" ")}
                                        >
                                            {report.employee.name}
                                        </p>
                                    </TableCell>

                                    <TableCell>
                                        <Badge className={bridalStyles.badge.neutral}>
                                            {workReportStatusLabel[report.status]}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                        {report.actualStartTime}〜
                                        {report.actualEndTime}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                        {report.actualBreakMinutes}分
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap text-sm font-medium text-slate-700">
                                        {formatYen(report.transportationFee)}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                        {report.hasMeal ? "あり" : "なし"}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                        {formatDate(report.createdAt)}
                                    </TableCell>
                                </TableRow>
                            ))}

                            {reports.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="py-10 text-center text-sm text-slate-500"
                                    >
                                        就労報告はまだありません。
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </BridalCard>
    );
};