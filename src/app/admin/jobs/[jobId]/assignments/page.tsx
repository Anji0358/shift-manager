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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    createShiftAssignment,
    cancelShiftAssignment,
} from "@/features/shift-assignments/actions";
import { getActiveStaffCandidates, getJobById } from "@/features/jobs/queries";
import { getAssignmentsByJobId } from "@/features/shift-assignments/queries";
import { isUnavailableForSlot } from "@/features/unavailable-times/services";
import { formatDate, formatMonth, formatYen } from "@/lib/format";
import { SuccessMessage } from "@/components/shared/success-message";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";

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

    const candidates = await getActiveStaffCandidates();
    const assignments = await getAssignmentsByJobId(job.id);
    const firstSlot = job.shiftSlots[0];

    return (
        <div className="space-y-8">
            <section className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">シフト確定</h1>
                    <p className="mt-2 text-slate-600">
                        「{job.title}」の勤務枠にスタッフを割り当てます。
                    </p>
                </div>

                <Button asChild variant="outline">
                    <Link href={`/admin/jobs/${job.id}`}>案件詳細へ戻る</Link>
                </Button>
            </section>

            <SuccessMessage message={message} />

            <Card>
                <CardHeader>
                    <CardTitle>シフト確定フォーム</CardTitle>
                </CardHeader>

                <CardContent>
                    <form
                        action={createShiftAssignment}
                        className="grid gap-4 md:grid-cols-[1fr_1fr_auto]"
                    >
                        <input type="hidden" name="jobId" value={job.id} />

                        <Select name="slotId" required>
                            <SelectTrigger>
                                <SelectValue placeholder="勤務枠を選択" />
                            </SelectTrigger>
                            <SelectContent>
                                {job.shiftSlots.map((slot) => (
                                    <SelectItem key={slot.id} value={slot.id}>
                                        {slot.name}：{slot.startTime}〜{slot.endTime}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select name="employeeId" required>
                            <SelectTrigger>
                                <SelectValue placeholder="スタッフを選択" />
                            </SelectTrigger>
                            <SelectContent>
                                {candidates.map((candidate) => (
                                    <SelectItem key={candidate.id} value={candidate.id}>
                                        {candidate.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button type="submit">確定する</Button>
                    </form>
                </CardContent>
            </Card>

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
                                                <Badge variant={unavailable ? "destructive" : "secondary"}>
                                                    {unavailable ? "勤務不可あり" : "勤務可能"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
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
                                <TableHead className="text-right">確定人数</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {job.shiftSlots.map((slot) => {
                                const assignedCount = assignments.filter(
                                    (assignment) => assignment.slotId === slot.id,
                                ).length;

                                return (
                                    <TableRow key={slot.id}>
                                        <TableCell className="font-medium">{slot.name}</TableCell>
                                        <TableCell>
                                            {slot.startTime}〜{slot.endTime}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {slot.requiredPeople}人
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {assignedCount}人
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>確定済みシフト</CardTitle>
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
                                        {assignment.slot.startTime}〜{assignment.slot.endTime}
                                    </TableCell>
                                    <TableCell>{formatDate(assignment.job.workDate)}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">確定</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <form action={cancelShiftAssignment}>
                                            <input type="hidden" name="assignmentId" value={assignment.id} />
                                            <input type="hidden" name="jobId" value={job.id} />
                                            <ConfirmSubmitButton
                                                size="sm"
                                                variant="outline"
                                                message="このシフト確定をキャンセルします。よろしいですか？"
                                            >
                                                キャンセル
                                            </ConfirmSubmitButton>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {assignments.length === 0 && (
                        <p className="mt-4 text-sm text-slate-500">
                            まだ確定済みのシフトはありません。
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminJobAssignmentsPage;