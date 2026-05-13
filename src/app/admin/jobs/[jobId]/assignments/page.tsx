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
import { getActiveStaffCandidates, getJobById } from "@/features/jobs/queries";
import { getAssignmentsByJobId } from "@/features/shift-assignments/queries";
import { formatDate, formatMonth, formatYen } from "@/lib/format";

type AdminJobAssignmentsPageProps = {
    params: Promise<{
        jobId: string;
    }>;
};

const AdminJobAssignmentsPage = async ({
    params,
}: AdminJobAssignmentsPageProps) => {
    const { jobId } = await params;

    const job = await getJobById(jobId);

    if (!job) {
        notFound();
    }

    const candidates = await getActiveStaffCandidates();
    const assignments = await getAssignmentsByJobId(job.id);

    return (
        <div className="space-y-8">
            <section className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">シフト確定</h1>
                    <p className="mt-2 text-slate-600">
                        「{job.title}」の勤務枠に従業員を割り当てます。
                    </p>
                </div>

                <Button asChild variant="outline">
                    <Link href={`/admin/jobs/${job.id}`}>案件詳細へ戻る</Link>
                </Button>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>案件情報</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm md:grid-cols-2">
                    <p>勤務日：{formatDate(job.workDate)}</p>
                    <p>場所：{job.location}</p>
                    <p>集合場所：{job.meetingPlace}</p>
                    <p>
                        勤務時間：{job.startTime}〜{job.endTime}
                    </p>
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
                    <CardTitle>候補者一覧</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>名前</TableHead>
                                <TableHead>メールアドレス</TableHead>
                                <TableHead>勤め始めた年月</TableHead>
                                <TableHead className="text-right">時給</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {candidates.map((candidate) => (
                                <TableRow key={candidate.id}>
                                    <TableCell className="font-medium">
                                        {candidate.name}
                                    </TableCell>
                                    <TableCell>{candidate.email}</TableCell>
                                    <TableCell>{formatMonth(candidate.startedWorkingAt)}</TableCell>
                                    <TableCell className="text-right">
                                        {formatYen(candidate.hourlyWage)}
                                    </TableCell>
                                </TableRow>
                            ))}
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
                                <TableHead>従業員</TableHead>
                                <TableHead>勤務枠</TableHead>
                                <TableHead>勤務時間</TableHead>
                                <TableHead>状態</TableHead>
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
                                    <TableCell>
                                        <Badge variant="secondary">確定</Badge>
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