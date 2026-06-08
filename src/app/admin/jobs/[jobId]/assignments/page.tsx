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
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
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
                            className={bridalStyles.button.secondary}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            案件詳細へ戻る
                        </LinkButton>

                        <LinkButton
                            href={`/admin/jobs/${job.id}/slots/new`}
                            variant="outline"
                            className={bridalStyles.button.secondary}
                        >
                            <CalendarPlus className="mr-2 h-4 w-4" />
                            勤務枠を追加
                        </LinkButton>
                    </div>
                }
            />

            <div className="space-y-6">
                {message ? (
                    <div className={[bridalStyles.card.base, "px-5 py-4"].join(" ")}>
                        <SuccessMessage message={message} />
                    </div>
                ) : null}

                {job.shiftSlots.length === 0 && (
                    <BridalCard>
                        <CardHeader className="p-5 pb-3">
                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-700">
                                    <TriangleAlert className="h-5 w-5" />
                                </div>

                                <div>
                                    <CardTitle className="font-serif text-xl font-medium text-slate-900">
                                        勤務枠がありません
                                    </CardTitle>
                                    <p className="mt-1 text-sm text-slate-500">
                                        スタッフや外部人員を割り振るには、先に勤務枠を登録してください。
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-5 pt-2">
                            <LinkButton
                                href={`/admin/jobs/${job.id}/slots/new`}
                                className={bridalStyles.button.primary}
                            >
                                <CalendarPlus className="mr-2 h-4 w-4" />
                                勤務枠を追加する
                            </LinkButton>
                        </CardContent>
                    </BridalCard>
                )}

                {job.shiftSlots.length > 0 && (
                    <>
                        <BridalCard>
                            <CardHeader className="p-5 pb-3">
                                <div className="flex items-start gap-3">
                                    <div className={bridalStyles.icon.circle}>
                                        <UserCheck className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <CardTitle
                                            className={[
                                                bridalStyles.text.title,
                                                "text-xl",
                                            ].join(" ")}
                                        >
                                            スタッフ割り振りフォーム
                                        </CardTitle>
                                        <p className="mt-1 text-sm text-slate-500">
                                            勤務枠ごとに登録スタッフを割り振ります。
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-5 pt-2">
                                <StaffAssignmentForm
                                    jobId={job.id}
                                    workDate={job.workDate.toISOString()}
                                    shiftSlots={job.shiftSlots}
                                    candidates={candidates}
                                    assignments={assignments}
                                />
                            </CardContent>
                        </BridalCard>

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

                <BridalCard className="overflow-hidden">
                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-start gap-3">
                            <div className={bridalStyles.icon.circle}>
                                <UsersRound className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle
                                    className={[
                                        bridalStyles.text.title,
                                        "text-xl",
                                    ].join(" ")}
                                >
                                    候補者一覧
                                </CardTitle>
                                <p className="mt-1 text-sm text-slate-500">
                                    登録スタッフの勤務可否と基本情報を確認します。
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-2">
                        {!firstSlot && (
                            <p className="text-sm text-slate-500">
                                勤務枠が登録されていないため、勤務不可判定は表示できません。
                            </p>
                        )}

                        {firstSlot && (
                            <div className={bridalStyles.table.wrapper}>
                                <Table>
                                    <TableHeader>
                                        <TableRow className={bridalStyles.table.headerRow}>
                                            <TableHead className={bridalStyles.table.head}>
                                                名前
                                            </TableHead>
                                            <TableHead className={bridalStyles.table.head}>
                                                メールアドレス
                                            </TableHead>
                                            <TableHead className={bridalStyles.table.head}>
                                                勤め始めた年月
                                            </TableHead>
                                            <TableHead
                                                className={[
                                                    bridalStyles.table.head,
                                                    "text-right",
                                                ].join(" ")}
                                            >
                                                時給
                                            </TableHead>
                                            <TableHead className={bridalStyles.table.head}>
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
                                                    className={bridalStyles.table.row}
                                                >
                                                    <TableCell>
                                                        <p
                                                            className={[
                                                                bridalStyles.text.title,
                                                                "text-base",
                                                            ].join(" ")}
                                                        >
                                                            {candidate.name}
                                                        </p>
                                                    </TableCell>

                                                    <TableCell className="text-sm text-slate-600">
                                                        {candidate.email}
                                                    </TableCell>

                                                    <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                        {formatMonth(candidate.startedWorkingAt)}
                                                    </TableCell>

                                                    <TableCell className="whitespace-nowrap text-right text-sm font-medium text-slate-900">
                                                        {formatYen(candidate.hourlyWage)}
                                                    </TableCell>

                                                    <TableCell>
                                                        <Badge
                                                            className={
                                                                unavailable
                                                                    ? "rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 shadow-none hover:bg-red-50"
                                                                    : bridalStyles.badge.fulfilled
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
                                                    className="py-10 text-center text-sm text-slate-500"
                                                >
                                                    候補者がいません。
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </BridalCard>

                <BridalCard className="overflow-hidden">
                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-start gap-3">
                            <div className={bridalStyles.icon.circle}>
                                <Clock className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle
                                    className={[
                                        bridalStyles.text.title,
                                        "text-xl",
                                    ].join(" ")}
                                >
                                    勤務枠一覧
                                </CardTitle>
                                <p className="mt-1 text-sm text-slate-500">
                                    勤務枠ごとの必要人数と割り振り人数を確認します。
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
                                            勤務枠
                                        </TableHead>
                                        <TableHead className={bridalStyles.table.head}>
                                            時間
                                        </TableHead>
                                        <TableHead
                                            className={[
                                                bridalStyles.table.head,
                                                "text-right",
                                            ].join(" ")}
                                        >
                                            必要人数
                                        </TableHead>
                                        <TableHead
                                            className={[
                                                bridalStyles.table.head,
                                                "text-right",
                                            ].join(" ")}
                                        >
                                            社内スタッフ
                                        </TableHead>
                                        <TableHead
                                            className={[
                                                bridalStyles.table.head,
                                                "text-right",
                                            ].join(" ")}
                                        >
                                            外部人員
                                        </TableHead>
                                        <TableHead
                                            className={[
                                                bridalStyles.table.head,
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
                                                className={bridalStyles.table.row}
                                            >
                                                <TableCell>
                                                    <p
                                                        className={[
                                                            bridalStyles.text.title,
                                                            "text-base",
                                                        ].join(" ")}
                                                    >
                                                        {slot.name}
                                                    </p>
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                    {slot.startTime}〜{slot.endTime}
                                                </TableCell>

                                                <TableCell className="text-right text-sm text-slate-600">
                                                    {slot.requiredPeople}人
                                                </TableCell>

                                                <TableCell className="text-right text-sm text-slate-600">
                                                    {internalAssignedCount}人
                                                </TableCell>

                                                <TableCell className="text-right text-sm text-slate-600">
                                                    {externalAssignedCount}人
                                                </TableCell>

                                                <TableCell className="text-right text-sm font-medium text-slate-900">
                                                    {totalAssignedCount}人
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}

                                    {job.shiftSlots.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="py-10 text-center text-sm text-slate-500"
                                            >
                                                勤務枠がありません。
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </BridalCard>

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
                                    割り振り済みスタッフ
                                </CardTitle>
                                <p className="mt-1 text-sm text-slate-500">
                                    この案件に割り振り済みのスタッフを確認します。
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
                                            スタッフ
                                        </TableHead>
                                        <TableHead className={bridalStyles.table.head}>
                                            勤務枠
                                        </TableHead>
                                        <TableHead className={bridalStyles.table.head}>
                                            勤務時間
                                        </TableHead>
                                        <TableHead className={bridalStyles.table.head}>
                                            勤務日
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
                                    {assignments.map((assignment) => (
                                        <TableRow
                                            key={assignment.id}
                                            className={bridalStyles.table.row}
                                        >
                                            <TableCell>
                                                <p
                                                    className={[
                                                        bridalStyles.text.title,
                                                        "text-base",
                                                    ].join(" ")}
                                                >
                                                    {assignment.employee.name}
                                                </p>
                                            </TableCell>

                                            <TableCell className="text-sm text-slate-600">
                                                {assignment.slot.name}
                                            </TableCell>

                                            <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                {assignment.slot.startTime}〜
                                                {assignment.slot.endTime}
                                            </TableCell>

                                            <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                {formatDate(job.workDate)}
                                            </TableCell>

                                            <TableCell>
                                                <Badge className={bridalStyles.badge.fulfilled}>
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
                                                        className={bridalStyles.button.danger}
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
                                                className="py-10 text-center text-sm text-slate-500"
                                            >
                                                まだ割り振り済みのスタッフはいません。
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </BridalCard>
            </div>
        </PageShell>
    );
};

export default AdminJobAssignmentsPage;