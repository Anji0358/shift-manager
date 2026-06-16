import { Badge } from "@/components/ui/badge";
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
import { LinkButton } from "@/components/shared/link-button";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { AppCard } from "@/components/shared/app-card";
import { appStyles } from "@/components/shared/design-tokens";
import { getAssignmentsByEmployeeId } from "@/features/shift-assignments/queries";
import { getWorkReportsByEmployeeId } from "@/features/work-reports/queries";
import { formatDate } from "@/lib/format";
import { getCurrentEmployeeId } from "@/lib/auth/current-user";
import {
    CalendarDays,
    ClipboardCheck,
    FileText,
    MapPin,
    Utensils,
} from "lucide-react";

const StaffShiftsPage = async () => {
    const currentEmployeeId = await getCurrentEmployeeId();

    const assignments = await getAssignmentsByEmployeeId(currentEmployeeId);
    const reports = await getWorkReportsByEmployeeId(currentEmployeeId);

    const reportedJobIds = new Set(reports.map((report) => report.jobId));

    return (
        <PageShell>
            <PageHeader
                title="確定シフト"
                description="自分に確定された勤務予定を確認します。"
            />

            <AppCard className="overflow-hidden">
                <CardHeader className="p-5 pb-3">
                    <div className="flex items-start gap-3">
                        <div className={appStyles.icon.circle}>
                            <CalendarDays className="h-5 w-5" />
                        </div>

                        <div>
                            <CardTitle
                                className={[
                                    appStyles.text.title,
                                    "text-xl",
                                ].join(" ")}
                            >
                                確定シフト一覧
                            </CardTitle>
                            <p className={["mt-1", appStyles.text.muted].join(" ")}>
                                勤務日、勤務時間、集合場所、就労報告の提出状況を確認します。
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
                                        日付
                                    </TableHead>

                                    <TableHead className={appStyles.table.head}>
                                        案件名
                                    </TableHead>

                                    <TableHead className={appStyles.table.head}>
                                        勤務枠
                                    </TableHead>

                                    <TableHead className={appStyles.table.head}>
                                        勤務時間
                                    </TableHead>

                                    <TableHead className={appStyles.table.head}>
                                        場所
                                    </TableHead>

                                    <TableHead className={appStyles.table.head}>
                                        集合場所
                                    </TableHead>

                                    <TableHead className={appStyles.table.head}>
                                        食事
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
                                {assignments.map((assignment) => {
                                    const job = assignment.slot.job;
                                    const alreadyReported = reportedJobIds.has(job.id);

                                    return (
                                        <TableRow
                                            key={assignment.id}
                                            className={appStyles.table.row}
                                        >
                                            <TableCell
                                                className={[
                                                    "whitespace-nowrap",
                                                    appStyles.table.cellMuted,
                                                ].join(" ")}
                                            >
                                                {formatDate(job.workDate)}
                                            </TableCell>

                                            <TableCell>
                                                <p
                                                    className={[
                                                        appStyles.text.title,
                                                        "text-base",
                                                    ].join(" ")}
                                                >
                                                    {job.title}
                                                </p>
                                            </TableCell>

                                            <TableCell className={appStyles.table.cellMuted}>
                                                {assignment.slot.name}
                                            </TableCell>

                                            <TableCell
                                                className={[
                                                    "whitespace-nowrap",
                                                    appStyles.table.cellMuted,
                                                ].join(" ")}
                                            >
                                                {assignment.slot.startTime}〜
                                                {assignment.slot.endTime}
                                            </TableCell>

                                            <TableCell className={appStyles.table.cellMuted}>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPin
                                                        className={[
                                                            "h-4 w-4",
                                                            appStyles.icon.accent,
                                                        ].join(" ")}
                                                    />
                                                    {job.location}
                                                </span>
                                            </TableCell>

                                            <TableCell className={appStyles.table.cellMuted}>
                                                {job.meetingPlace || "未設定"}
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    className={
                                                        job.hasMeal
                                                            ? appStyles.badge.fulfilled
                                                            : appStyles.badge.neutral
                                                    }
                                                >
                                                    <Utensils className="mr-1 h-3 w-3" />
                                                    {job.hasMeal ? "あり" : "なし"}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <LinkButton
                                                        href={`/staff/jobs/${job.id}`}
                                                        size="sm"
                                                        variant="outline"
                                                        className={appStyles.button.secondary}
                                                    >
                                                        <FileText className="mr-2 h-4 w-4" />
                                                        詳細
                                                    </LinkButton>

                                                    {alreadyReported ? (
                                                        <Badge className={appStyles.badge.fulfilled}>
                                                            <ClipboardCheck className="mr-1 h-3 w-3" />
                                                            提出済み
                                                        </Badge>
                                                    ) : (
                                                        <LinkButton
                                                            href={`/staff/work-reports/new?assignmentId=${assignment.id}`}
                                                            size="sm"
                                                            className={appStyles.button.primary}
                                                        >
                                                            報告する
                                                        </LinkButton>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                                {assignments.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className={appStyles.table.empty}
                                        >
                                            確定しているシフトはありません。
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </AppCard>
        </PageShell>
    );
};

export default StaffShiftsPage;