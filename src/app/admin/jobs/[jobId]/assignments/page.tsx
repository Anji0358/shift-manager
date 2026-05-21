import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
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
import { StaffAssignmentForm } from "@/features/shift-assignments/components/staff-assignment-form";
import { cancelShiftAssignment } from "@/features/shift-assignments/actions";
import { getActiveStaffCandidates, getJobById } from "@/features/jobs/queries";
import { getAssignmentsByJobId } from "@/features/shift-assignments/queries";
import { isUnavailableForSlot } from "@/features/unavailable-times/services";
import { formatDate, formatMonth, formatYen } from "@/lib/format";
import { getExternalShiftAssignmentsByJobId } from "@/features/external-shift-assignments/queries";
import { ExternalShiftAssignmentForm } from "@/features/external-shift-assignments/components/external-shift-assignment-form";
import { ExternalShiftAssignmentTable } from "@/features/external-shift-assignments/components/external-shift-assignment-table";

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

    const job = await getJobById(jobId);

    if (!job) {
        notFound();
    }

    const [candidates, assignments, externalAssignments] = await Promise.all([
        getActiveStaffCandidates(),
        getAssignmentsByJobId(job.id),
        getExternalShiftAssignmentsByJobId(job.id),
    ]);

    const firstSlot = job.shiftSlots[0];

    return (
        <div className="space-y-8">
            <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">スタッフ割り振り</h1>
                    <p className="mt-2 text-slate-600">
                        「{job.title}」の勤務枠にスタッフと外部人員を割り振ります。
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline">
                        <Link href={`/admin/jobs/${job.id}`}>案件詳細へ戻る</Link>
                    </Button>

                    <Button asChild variant="outline">
                        <Link href={`/admin/jobs/${job.id}/slots/new`}>
                            勤務枠を追加
                        </Link>
                    </Button>
                </div>
            </section>

            <SuccessMessage message={message} />

            {job.shiftSlots.length === 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>勤務枠がありません</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <p className="text-sm text-slate-600">
                            スタッフや外部人員を割り振るには、先に勤務枠を登録してください。
                        </p>

                        <Button asChild>
                            <Link href={`/admin/jobs/${job.id}/slots/new`}>
                                勤務枠を追加する
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {job.shiftSlots.length > 0 && (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>スタッフ割り振りフォーム</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <StaffAssignmentForm
                                jobId={job.id}
                                workDate={job.workDate.toISOString()}
                                shiftSlots={job.shiftSlots}
                                candidates={candidates}
                                assignments={assignments}
                            />
                        </CardContent>
                    </Card>

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

            <Card>
                <CardHeader>
                    <CardTitle>候補者一覧</CardTitle>
                </CardHeader>

                <CardContent>
                    {!firstSlot && (
                        <p className="text-sm text-slate-500">
                            勤務枠が登録されていないため、勤務不可判定は表示できません。
                        </p>
                    )}

                    {firstSlot && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>名前</TableHead>
                                    <TableHead>メールアドレス</TableHead>
                                    <TableHead>勤め始めた年月</TableHead>
                                    <TableHead className="text-right">時給</TableHead>
                                    <TableHead>勤務可否</TableHead>
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
                                        <TableRow key={candidate.id}>
                                            <TableCell className="font-medium">
                                                {candidate.name}
                                            </TableCell>

                                            <TableCell>{candidate.email}</TableCell>

                                            <TableCell>
                                                {formatMonth(candidate.startedWorkingAt)}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                {formatYen(candidate.hourlyWage)}
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        unavailable
                                                            ? "destructive"
                                                            : "secondary"
                                                    }
                                                >
                                                    {unavailable ? "勤務不可あり" : "勤務可能"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                                {candidates.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-6 text-center text-sm text-slate-500"
                                        >
                                            候補者がいません。
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>勤務枠一覧</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>勤務枠</TableHead>
                                <TableHead>時間</TableHead>
                                <TableHead className="text-right">必要人数</TableHead>
                                <TableHead className="text-right">社内スタッフ</TableHead>
                                <TableHead className="text-right">外部人員</TableHead>
                                <TableHead className="text-right">合計</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {job.shiftSlots.map((slot) => {
                                const internalAssignedCount = assignments.filter(
                                    (assignment) => assignment.slotId === slot.id,
                                ).length;

                                const externalAssignedCount = externalAssignments
                                    .filter((assignment) => assignment.slotId === slot.id)
                                    .reduce((sum, assignment) => {
                                        return sum + assignment.headCount;
                                    }, 0);

                                const totalAssignedCount =
                                    internalAssignedCount + externalAssignedCount;

                                return (
                                    <TableRow key={slot.id}>
                                        <TableCell className="font-medium">
                                            {slot.name}
                                        </TableCell>

                                        <TableCell>
                                            {slot.startTime}〜{slot.endTime}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            {slot.requiredPeople}人
                                        </TableCell>

                                        <TableCell className="text-right">
                                            {internalAssignedCount}人
                                        </TableCell>

                                        <TableCell className="text-right">
                                            {externalAssignedCount}人
                                        </TableCell>

                                        <TableCell className="text-right font-medium">
                                            {totalAssignedCount}人
                                        </TableCell>
                                    </TableRow>
                                );
                            })}

                            {job.shiftSlots.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-6 text-center text-sm text-slate-500"
                                    >
                                        勤務枠がありません。
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>割り振り済みスタッフ</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>スタッフ</TableHead>
                                <TableHead>勤務枠</TableHead>
                                <TableHead>勤務時間</TableHead>
                                <TableHead>勤務日</TableHead>
                                <TableHead>状態</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {assignments.map((assignment) => (
                                <TableRow key={assignment.id}>
                                    <TableCell className="font-medium">
                                        {assignment.employee.name}
                                    </TableCell>

                                    <TableCell>{assignment.slot.name}</TableCell>

                                    <TableCell>
                                        {assignment.slot.startTime}〜
                                        {assignment.slot.endTime}
                                    </TableCell>

                                    <TableCell>
                                        {formatDate(assignment.job.workDate)}
                                    </TableCell>

                                    <TableCell>
                                        <Badge variant="secondary">
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
                                        className="py-6 text-center text-sm text-slate-500"
                                    >
                                        まだ割り振り済みのスタッフはいません。
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminJobAssignmentsPage;