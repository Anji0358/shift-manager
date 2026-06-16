import type { ReactNode } from "react";
import { notFound } from "next/navigation";
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
import { SuccessMessage } from "@/components/shared/success-message";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { AppCard } from "@/components/shared/app-card";
import { appStyles } from "@/components/shared/design-tokens";
import { LinkButton } from "@/components/shared/link-button";
import { StaffAssignmentForm } from "@/features/shift-assignments/components/staff-assignment-form";
import { cancelShiftAssignment } from "@/features/shift-assignments/actions";
import { getAssignmentPageData } from "@/features/shift-assignments/queries";
import { isUnavailableForSlot } from "@/features/unavailable-times/services";
import { formatDate, formatMonth, formatYen } from "@/lib/format";
import { ExternalShiftAssignmentForm } from "@/features/external-shift-assignments/components/external-shift-assignment-form";
import { ExternalShiftAssignmentTable } from "@/features/external-shift-assignments/components/external-shift-assignment-table";
import {
    ArrowLeft,
    CalendarPlus,
    ClipboardCheck,
    Clock,
    TriangleAlert,
    UserCheck,
    UsersRound,
} from "lucide-react";

type AdminJobAssignmentsPageProps = {
    params: Promise<{
        jobId: string;
    }>;
    searchParams: Promise<{
        message?: string;
    }>;
};

const AdminJobAssignmentsPage = async ({
    params,
    searchParams,
}: AdminJobAssignmentsPageProps) => {
    const { jobId } = await params;
    const { message } = await searchParams;

    const pageData = await getAssignmentPageData(jobId);

    if (!pageData) {
        notFound();
    }

    const { job, candidates, assignments, externalAssignments } = pageData;
    const firstSlot = job.shiftSlots[0];

    return (
        <PageShell>
            <PageHeader
                title="スタッフ割り振り"
                description={`「${job.title}」の勤務枠にスタッフと外部人員を割り振ります。`}
                action={
                    <div className="flex flex-wrap gap-3">
                        <LinkButton
                            href={`/admin/jobs/${job.id}`}
                            variant="outline"
                            className={appStyles.button.secondary}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            案件詳細へ戻る
                        </LinkButton>

                        <LinkButton
                            href={`/admin/jobs/${job.id}/slots/new`}
                            variant="outline"
                            className={appStyles.button.secondary}
                        >
                            <CalendarPlus className="mr-2 h-4 w-4" />
                            勤務枠を追加
                        </LinkButton>
                    </div>
                }
            />

            <div className="space-y-6">
                {message ? (
                    <div className={appStyles.section.message}>
                        <SuccessMessage message={message} />
                    </div>
                ) : null}

                {job.shiftSlots.length === 0 && (
                    <AppCard>
                        <CardHeader className="p-5 pb-3">
                            <div className="flex items-start gap-3">
                                <div
                                    className={[
                                        "flex h-11 w-11 shrink-0 items-center justify-center border",
                                        appStyles.radius.full,
                                        appStyles.border.pending,
                                        appStyles.tokens.color.background.pending,
                                        appStyles.textColor.pending,
                                    ].join(" ")}
                                >
                                    <TriangleAlert className="h-5 w-5" />
                                </div>

                                <div>
                                    <CardTitle
                                        className={[
                                            appStyles.text.title,
                                            "text-xl",
                                        ].join(" ")}
                                    >
                                        勤務枠がありません
                                    </CardTitle>
                                    <p className={["mt-1", appStyles.text.muted].join(" ")}>
                                        スタッフや外部人員を割り振るには、先に勤務枠を登録してください。
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-5 pt-2">
                            <LinkButton
                                href={`/admin/jobs/${job.id}/slots/new`}
                                className={appStyles.button.primary}
                            >
                                <CalendarPlus className="mr-2 h-4 w-4" />
                                勤務枠を追加する
                            </LinkButton>
                        </CardContent>
                    </AppCard>
                )}

                {job.shiftSlots.length > 0 && (
                    <>
                        <AssignmentSectionCard
                            title="スタッフ割り振りフォーム"
                            description="勤務枠ごとに登録スタッフを割り振ります。"
                            icon={<UserCheck className="h-5 w-5" />}
                        >
                            <StaffAssignmentForm
                                jobId={job.id}
                                workDate={job.workDate.toISOString()}
                                shiftSlots={job.shiftSlots}
                                candidates={candidates}
                                assignments={assignments}
                            />
                        </AssignmentSectionCard>

                        <ExternalShiftAssignmentForm
                            jobId={job.id}
                            shiftSlots={job.shiftSlots}
                        />

                        <ExternalShiftAssignmentTable
                            jobId={job.id}
                            externalAssignments={externalAssignments}
                        />
                    </>
                )}

                <AssignmentSectionCard
                    title="候補者一覧"
                    description="登録スタッフの勤務可否と基本情報を確認します。"
                    icon={<UsersRound className="h-5 w-5" />}
                >
                    {!firstSlot && (
                        <p className={appStyles.text.muted}>
                            勤務枠が登録されていないため、勤務不可判定は表示できません。
                        </p>
                    )}

                    {firstSlot && (
                        <div className={appStyles.table.wrapper}>
                            <Table>
                                <TableHeader>
                                    <TableRow className={appStyles.table.headerRow}>
                                        <TableHead className={appStyles.table.head}>
                                            名前
                                        </TableHead>
                                        <TableHead className={appStyles.table.head}>
                                            メールアドレス
                                        </TableHead>
                                        <TableHead className={appStyles.table.head}>
                                            勤め始めた年月
                                        </TableHead>
                                        <TableHead
                                            className={[
                                                appStyles.table.head,
                                                "text-right",
                                            ].join(" ")}
                                        >
                                            時給
                                        </TableHead>
                                        <TableHead className={appStyles.table.head}>
                                            勤務可否
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {candidates.map((candidate) => {
                                        const unavailable = isUnavailableForSlot(
                                            candidate.unavailableTimes,
                                            job.workDate,
                                            firstSlot.startTime,
                                            firstSlot.endTime,
                                        );

                                        return (
                                            <TableRow
                                                key={candidate.id}
                                                className={appStyles.table.row}
                                            >
                                                <TableCell>
                                                    <p
                                                        className={[
                                                            appStyles.text.title,
                                                            "text-base",
                                                        ].join(" ")}
                                                    >
                                                        {candidate.name}
                                                    </p>
                                                </TableCell>

                                                <TableCell className={appStyles.table.cellMuted}>
                                                    {candidate.email}
                                                </TableCell>

                                                <TableCell
                                                    className={[
                                                        "whitespace-nowrap",
                                                        appStyles.table.cellMuted,
                                                    ].join(" ")}
                                                >
                                                    {formatMonth(candidate.startedWorkingAt)}
                                                </TableCell>

                                                <TableCell
                                                    className={[
                                                        "whitespace-nowrap text-right text-sm font-medium",
                                                        appStyles.textColor.default,
                                                    ].join(" ")}
                                                >
                                                    {formatYen(candidate.hourlyWage)}
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            unavailable
                                                                ? getUnavailableBadgeClassName()
                                                                : appStyles.badge.fulfilled
                                                        }
                                                    >
                                                        {unavailable
                                                            ? "勤務不可あり"
                                                            : "勤務可能"}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}

                                    {candidates.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className={appStyles.table.empty}
                                            >
                                                候補者がいません。
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </AssignmentSectionCard>

                <AssignmentSectionCard
                    title="勤務枠一覧"
                    description="勤務枠ごとの必要人数と割り振り人数を確認します。"
                    icon={<Clock className="h-5 w-5" />}
                >
                    <div className={appStyles.table.wrapper}>
                        <Table>
                            <TableHeader>
                                <TableRow className={appStyles.table.headerRow}>
                                    <TableHead className={appStyles.table.head}>
                                        勤務枠
                                    </TableHead>
                                    <TableHead className={appStyles.table.head}>
                                        時間
                                    </TableHead>
                                    <TableHead
                                        className={[
                                            appStyles.table.head,
                                            "text-right",
                                        ].join(" ")}
                                    >
                                        必要人数
                                    </TableHead>
                                    <TableHead
                                        className={[
                                            appStyles.table.head,
                                            "text-right",
                                        ].join(" ")}
                                    >
                                        社内スタッフ
                                    </TableHead>
                                    <TableHead
                                        className={[
                                            appStyles.table.head,
                                            "text-right",
                                        ].join(" ")}
                                    >
                                        外部人員
                                    </TableHead>
                                    <TableHead
                                        className={[
                                            appStyles.table.head,
                                            "text-right",
                                        ].join(" ")}
                                    >
                                        合計
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {job.shiftSlots.map((slot) => {
                                    const internalAssignedCount = assignments.filter(
                                        (assignment) => assignment.slotId === slot.id,
                                    ).length;

                                    const externalAssignedCount = externalAssignments
                                        .filter(
                                            (assignment) => assignment.slotId === slot.id,
                                        )
                                        .reduce((sum, assignment) => {
                                            return sum + assignment.headCount;
                                        }, 0);

                                    const totalAssignedCount =
                                        internalAssignedCount + externalAssignedCount;

                                    return (
                                        <TableRow
                                            key={slot.id}
                                            className={appStyles.table.row}
                                        >
                                            <TableCell>
                                                <p
                                                    className={[
                                                        appStyles.text.title,
                                                        "text-base",
                                                    ].join(" ")}
                                                >
                                                    {slot.name}
                                                </p>
                                            </TableCell>

                                            <TableCell
                                                className={[
                                                    "whitespace-nowrap",
                                                    appStyles.table.cellMuted,
                                                ].join(" ")}
                                            >
                                                {slot.startTime}〜{slot.endTime}
                                            </TableCell>

                                            <TableCell
                                                className={[
                                                    "text-right",
                                                    appStyles.table.cellMuted,
                                                ].join(" ")}
                                            >
                                                {slot.requiredPeople}人
                                            </TableCell>

                                            <TableCell
                                                className={[
                                                    "text-right",
                                                    appStyles.table.cellMuted,
                                                ].join(" ")}
                                            >
                                                {internalAssignedCount}人
                                            </TableCell>

                                            <TableCell
                                                className={[
                                                    "text-right",
                                                    appStyles.table.cellMuted,
                                                ].join(" ")}
                                            >
                                                {externalAssignedCount}人
                                            </TableCell>

                                            <TableCell
                                                className={[
                                                    "text-right text-sm font-medium",
                                                    appStyles.textColor.default,
                                                ].join(" ")}
                                            >
                                                {totalAssignedCount}人
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                                {job.shiftSlots.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className={appStyles.table.empty}
                                        >
                                            勤務枠がありません。
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </AssignmentSectionCard>

                <AssignmentSectionCard
                    title="割り振り済みスタッフ"
                    description="この案件に割り振り済みのスタッフを確認します。"
                    icon={<ClipboardCheck className="h-5 w-5" />}
                >
                    <div className={appStyles.table.wrapper}>
                        <Table>
                            <TableHeader>
                                <TableRow className={appStyles.table.headerRow}>
                                    <TableHead className={appStyles.table.head}>
                                        スタッフ
                                    </TableHead>
                                    <TableHead className={appStyles.table.head}>
                                        勤務枠
                                    </TableHead>
                                    <TableHead className={appStyles.table.head}>
                                        勤務時間
                                    </TableHead>
                                    <TableHead className={appStyles.table.head}>
                                        勤務日
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
                                {assignments.map((assignment) => (
                                    <TableRow
                                        key={assignment.id}
                                        className={appStyles.table.row}
                                    >
                                        <TableCell>
                                            <p
                                                className={[
                                                    appStyles.text.title,
                                                    "text-base",
                                                ].join(" ")}
                                            >
                                                {assignment.employee.name}
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

                                        <TableCell
                                            className={[
                                                "whitespace-nowrap",
                                                appStyles.table.cellMuted,
                                            ].join(" ")}
                                        >
                                            {formatDate(job.workDate)}
                                        </TableCell>

                                        <TableCell>
                                            <Badge className={appStyles.badge.fulfilled}>
                                                割り振り済み
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <form action={cancelShiftAssignment}>
                                                <input
                                                    type="hidden"
                                                    name="assignmentId"
                                                    value={assignment.id}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="jobId"
                                                    value={job.id}
                                                />

                                                <ConfirmSubmitButton
                                                    size="sm"
                                                    variant="outline"
                                                    className={appStyles.button.danger}
                                                    message="このスタッフ割り振りをキャンセルします。よろしいですか？"
                                                >
                                                    キャンセル
                                                </ConfirmSubmitButton>
                                            </form>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {assignments.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className={appStyles.table.empty}
                                        >
                                            まだ割り振り済みのスタッフはいません。
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </AssignmentSectionCard>
            </div>
        </PageShell>
    );
};

type AssignmentSectionCardProps = {
    title: string;
    description: string;
    icon: ReactNode;
    children: ReactNode;
};

const AssignmentSectionCard = ({
    title,
    description,
    icon,
    children,
}: AssignmentSectionCardProps) => {
    return (
        <AppCard className="overflow-hidden">
            <CardHeader className="p-5 pb-3">
                <div className="flex items-start gap-3">
                    <div className={appStyles.icon.circle}>{icon}</div>

                    <div>
                        <CardTitle
                            className={[
                                appStyles.text.title,
                                "text-xl",
                            ].join(" ")}
                        >
                            {title}
                        </CardTitle>
                        <p className={["mt-1", appStyles.text.muted].join(" ")}>
                            {description}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-2">{children}</CardContent>
        </AppCard>
    );
};

const getUnavailableBadgeClassName = () => {
    return [
        appStyles.radius.full,
        "border px-3 py-1 text-xs font-medium shadow-none",
        appStyles.border.danger,
        appStyles.tokens.color.background.danger,
        appStyles.textColor.danger,
        appStyles.tokens.color.background.hoverDanger,
    ].join(" ");
};

export default AdminJobAssignmentsPage;