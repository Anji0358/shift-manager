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
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
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

            <BridalCard className="overflow-hidden">
                <CardHeader className="p-5 pb-3">
                    <div className="flex items-start gap-3">
                        <div className={bridalStyles.icon.circle}>
                            <CalendarDays className="h-5 w-5" />
                        </div>

                        <div>
                            <CardTitle
                                className={[
                                    bridalStyles.text.title,
                                    "text-xl",
                                ].join(" ")}
                            >
                                確定シフト一覧
                            </CardTitle>
                            <p className="mt-1 text-sm text-slate-500">
                                勤務日、勤務時間、集合場所、就労報告の提出状況を確認します。
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
                                        日付
                                    </TableHead>

                                    <TableHead className={bridalStyles.table.head}>
                                        案件名
                                    </TableHead>

                                    <TableHead className={bridalStyles.table.head}>
                                        勤務枠
                                    </TableHead>

                                    <TableHead className={bridalStyles.table.head}>
                                        勤務時間
                                    </TableHead>

                                    <TableHead className={bridalStyles.table.head}>
                                        場所
                                    </TableHead>

                                    <TableHead className={bridalStyles.table.head}>
                                        集合場所
                                    </TableHead>

                                    <TableHead className={bridalStyles.table.head}>
                                        食事
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
                                {assignments.map((assignment) => {
                                    const job = assignment.slot.job;
                                    const alreadyReported = reportedJobIds.has(job.id);

                                    return (
                                        <TableRow
                                            key={assignment.id}
                                            className={bridalStyles.table.row}
                                        >
                                            <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                {formatDate(job.workDate)}
                                            </TableCell>

                                            <TableCell>
                                                <p
                                                    className={[
                                                        bridalStyles.text.title,
                                                        "text-base",
                                                    ].join(" ")}
                                                >
                                                    {job.title}
                                                </p>
                                            </TableCell>

                                            <TableCell className="text-sm text-slate-600">
                                                {assignment.slot.name}
                                            </TableCell>

                                            <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                {assignment.slot.startTime}〜
                                                {assignment.slot.endTime}
                                            </TableCell>

                                            <TableCell className="text-sm text-slate-600">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPin className="h-4 w-4 text-[#b8872d]" />
                                                    {job.location}
                                                </span>
                                            </TableCell>

                                            <TableCell className="text-sm text-slate-600">
                                                {job.meetingPlace || "未設定"}
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    className={
                                                        job.hasMeal
                                                            ? bridalStyles.badge.fulfilled
                                                            : bridalStyles.badge.neutral
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
                                                        className={bridalStyles.button.secondary}
                                                    >
                                                        <FileText className="mr-2 h-4 w-4" />
                                                        詳細
                                                    </LinkButton>

                                                    {alreadyReported ? (
                                                        <Badge className={bridalStyles.badge.fulfilled}>
                                                            <ClipboardCheck className="mr-1 h-3 w-3" />
                                                            提出済み
                                                        </Badge>
                                                    ) : (
                                                        <LinkButton
                                                            href={`/staff/work-reports/new?assignmentId=${assignment.id}`}
                                                            size="sm"
                                                            className={bridalStyles.button.primary}
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
                                            className="py-10 text-center text-sm text-slate-500"
                                        >
                                            確定しているシフトはありません。
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </BridalCard>
        </PageShell>
    );
};

export default StaffShiftsPage;