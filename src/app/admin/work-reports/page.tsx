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
import { AppCard } from "@/components/shared/bridal-card";
import { appStyles } from "@/components/shared/design-tokens";
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
        return appStyles.badge.fulfilled;
    }

    if (status === "SUBMITTED") {
        return appStyles.badge.pending;
    }

    if (status === "REJECTED") {
        return [
            appStyles.radius.full,
            "border px-3 py-1 text-xs font-medium shadow-none",
            appStyles.border.danger,
            appStyles.tokens.color.background.danger,
            appStyles.textColor.danger,
            appStyles.tokens.color.background.hoverDanger,
        ].join(" ");
    }

    return appStyles.badge.neutral;
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
                                    提出された勤務実績、給与見込み、承認状態を確認します。
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
                                            勤務日
                                        </TableHead>

                                        <TableHead className={appStyles.table.head}>
                                            案件名
                                        </TableHead>

                                        <TableHead className={appStyles.table.head}>
                                            スタッフ
                                        </TableHead>

                                        <TableHead className={appStyles.table.head}>
                                            実勤務時間
                                        </TableHead>

                                        <TableHead
                                            className={[
                                                appStyles.table.head,
                                                "text-right",
                                            ].join(" ")}
                                        >
                                            勤務時間
                                        </TableHead>

                                        <TableHead
                                            className={[
                                                appStyles.table.head,
                                                "text-right",
                                            ].join(" ")}
                                        >
                                            給与見込み
                                        </TableHead>

                                        <TableHead className={appStyles.table.head}>
                                            状態
                                        </TableHead>

                                        <TableHead
                                            className={[
                                                appStyles.table.head,
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
                                                className={appStyles.table.row}
                                            >
                                                <TableCell
                                                    className={[
                                                        "whitespace-nowrap",
                                                        appStyles.table.cellMuted,
                                                    ].join(" ")}
                                                >
                                                    {formatDate(report.job.workDate)}
                                                </TableCell>

                                                <TableCell>
                                                    <p
                                                        className={[
                                                            appStyles.text.title,
                                                            "text-base",
                                                        ].join(" ")}
                                                    >
                                                        {report.job.title}
                                                    </p>
                                                </TableCell>

                                                <TableCell className={appStyles.table.cellMuted}>
                                                    {report.employee.name}
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
                                                        "whitespace-nowrap text-right",
                                                        appStyles.table.cellMuted,
                                                    ].join(" ")}
                                                >
                                                    {workHours}時間
                                                </TableCell>

                                                <TableCell
                                                    className={[
                                                        "whitespace-nowrap text-right text-sm font-medium",
                                                        appStyles.textColor.default,
                                                    ].join(" ")}
                                                >
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
                                                                    className={appStyles.button.primary}
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
                                                                    className={appStyles.button.danger}
                                                                >
                                                                    <RotateCcw className="mr-2 h-4 w-4" />
                                                                    差し戻し
                                                                </Button>
                                                            </form>
                                                        </div>
                                                    ) : (
                                                        <span
                                                            className={[
                                                                "text-sm",
                                                                appStyles.textColor.muted,
                                                            ].join(" ")}
                                                        >
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
                                                className={appStyles.table.empty}
                                            >
                                                まだ就労報告がありません。
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </AppCard>
            </div>

            <div className="md:hidden">
                <WorkReportCardList reports={reports} />
            </div>
        </PageShell>
    );
};

export default AdminWorkReportsPage;