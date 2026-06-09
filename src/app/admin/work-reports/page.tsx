import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
import {
    approveWorkReport,
    rejectWorkReport,
} from "@/features/work-reports/actions";
import { getWorkReports } from "@/features/work-reports/queries";
import {
    calculateEstimatedSalary,
    calculateWorkHours,
} from "@/features/payroll/services";
import { formatDate, formatYen } from "@/lib/format";
import type { WorkReportStatus } from "@prisma/client";
import { WorkReportCardList } from "@/features/work-reports/components/work-report-card-list";
import {
    CheckCircle2,
    ClipboardCheck,
    RotateCcw,
} from "lucide-react";

const workReportStatusLabel: Record<WorkReportStatus, string> = {
    NOT_SUBMITTED: "未提出",
    SUBMITTED: "提出済み",
    APPROVED: "承認済み",
    REJECTED: "差し戻し",
};

const getWorkReportStatusBadgeClassName = (status: WorkReportStatus) => {
    if (status === "APPROVED") {
        return bridalStyles.badge.fulfilled;
    }

    if (status === "SUBMITTED") {
        return bridalStyles.badge.pending;
    }

    if (status === "REJECTED") {
        return "rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 shadow-none hover:bg-red-50";
    }

    return bridalStyles.badge.neutral;
};

const AdminWorkReportsPage = async () => {
    const reports = await getWorkReports();

    return (
        <PageShell>
            <PageHeader
                title="就労報告管理"
                description="スタッフから提出された就労報告を確認し、承認または差し戻しを行います。"
            />

            <div className="hidden md:block">
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
                                    提出された勤務実績、給与見込み、承認状態を確認します。
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
                                            勤務日
                                        </TableHead>

                                        <TableHead className={bridalStyles.table.head}>
                                            案件名
                                        </TableHead>

                                        <TableHead className={bridalStyles.table.head}>
                                            スタッフ
                                        </TableHead>

                                        <TableHead className={bridalStyles.table.head}>
                                            実勤務時間
                                        </TableHead>

                                        <TableHead
                                            className={[
                                                bridalStyles.table.head,
                                                "text-right",
                                            ].join(" ")}
                                        >
                                            勤務時間
                                        </TableHead>

                                        <TableHead
                                            className={[
                                                bridalStyles.table.head,
                                                "text-right",
                                            ].join(" ")}
                                        >
                                            給与見込み
                                        </TableHead>

                                        <TableHead className={bridalStyles.table.head}>
                                            状態
                                        </TableHead>

                                        <TableHead
                                            className={[
                                                bridalStyles.table.head,
                                                "text-right",
                                            ].join(" ")}
                                        >
                                            操作
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {reports.map((report) => {
                                        const workHours = calculateWorkHours(
                                            report.actualStartTime,
                                            report.actualEndTime,
                                            report.actualBreakMinutes,
                                        );

                                        const estimatedSalary = calculateEstimatedSalary(
                                            report,
                                            report.job,
                                            report.employee,
                                        );

                                        const canReview = report.status === "SUBMITTED";

                                        return (
                                            <TableRow
                                                key={report.id}
                                                className={bridalStyles.table.row}
                                            >
                                                <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                    {formatDate(report.job.workDate)}
                                                </TableCell>

                                                <TableCell>
                                                    <p
                                                        className={[
                                                            bridalStyles.text.title,
                                                            "text-base",
                                                        ].join(" ")}
                                                    >
                                                        {report.job.title}
                                                    </p>
                                                </TableCell>

                                                <TableCell className="text-sm text-slate-600">
                                                    {report.employee.name}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                    {report.actualStartTime}〜
                                                    {report.actualEndTime}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap text-right text-sm text-slate-600">
                                                    {workHours}時間
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap text-right text-sm font-medium text-slate-900">
                                                    {formatYen(estimatedSalary)}
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        className={getWorkReportStatusBadgeClassName(
                                                            report.status,
                                                        )}
                                                    >
                                                        {workReportStatusLabel[report.status]}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    {canReview ? (
                                                        <div className="flex justify-end gap-2">
                                                            <form action={approveWorkReport}>
                                                                <input
                                                                    type="hidden"
                                                                    name="reportId"
                                                                    value={report.id}
                                                                />

                                                                <Button
                                                                    size="sm"
                                                                    type="submit"
                                                                    className={bridalStyles.button.primary}
                                                                >
                                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                    承認
                                                                </Button>
                                                            </form>

                                                            <form action={rejectWorkReport}>
                                                                <input
                                                                    type="hidden"
                                                                    name="reportId"
                                                                    value={report.id}
                                                                />

                                                                <Button
                                                                    size="sm"
                                                                    type="submit"
                                                                    variant="outline"
                                                                    className={bridalStyles.button.danger}
                                                                >
                                                                    <RotateCcw className="mr-2 h-4 w-4" />
                                                                    差し戻し
                                                                </Button>
                                                            </form>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-slate-400">
                                                            -
                                                        </span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}

                                    {reports.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="py-10 text-center text-sm text-slate-500"
                                            >
                                                まだ就労報告がありません。
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </BridalCard>
            </div>

            <div className="md:hidden">
                <WorkReportCardList reports={reports} />
            </div>
        </PageShell>
    );
};

export default AdminWorkReportsPage;