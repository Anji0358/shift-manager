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
import {
    mockCandidates,
    mockJobs,
    mockJobShiftSlots,
} from "@/features/shared/mock-data";
import {
    candidateStatusBadgeVariant,
    candidateStatusLabel,
    getCandidatesForJob,
} from "@/features/candidates/services";

type AdminJobAssignmentsPageProps = {
    params: Promise<{
        jobId: string;
    }>;
};

const AdminJobAssignmentsPage = async ({
    params,
}: AdminJobAssignmentsPageProps) => {
    const { jobId } = await params;

    const job = mockJobs.find((job) => job.id === jobId);

    if (!job) {
        notFound();
    }

    const slots = mockJobShiftSlots.filter((slot) => slot.jobId === job.id);
    const candidates = getCandidatesForJob(mockCandidates, job.id);

    return (
        <div className="space-y-8">
            <section className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">シフト確定</h1>
                    <p className="mt-2 text-slate-600">
                        「{job.title}」の勤務枠ごとに勤務者を確定します。
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
                    <p>日付：{job.workDate}</p>
                    <p>場所：{job.location}</p>
                    <p>集合場所：{job.meetingPlace}</p>
                    <p>
                        基本勤務時間：{job.startTime}〜{job.endTime}
                    </p>
                </CardContent>
            </Card>

            <div className="space-y-6">
                {slots.map((slot) => (
                    <Card key={slot.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between gap-4">
                                <CardTitle>{slot.name}</CardTitle>
                                <Badge variant="secondary">
                                    {slot.startTime}〜{slot.endTime} / 必要人数{" "}
                                    {slot.requiredPeople}人
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>名前</TableHead>
                                        <TableHead>勤務可否</TableHead>
                                        <TableHead>勤務歴</TableHead>
                                        <TableHead className="text-right">時給</TableHead>
                                        <TableHead className="text-right">操作</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {candidates.map((candidate) => (
                                        <TableRow key={`${slot.id}-${candidate.employee.id}`}>
                                            <TableCell className="font-medium">
                                                {candidate.employee.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        candidateStatusBadgeVariant[candidate.status]
                                                    }
                                                >
                                                    {candidateStatusLabel[candidate.status]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{candidate.workExperienceText}</TableCell>
                                            <TableCell className="text-right">
                                                {candidate.employee.hourlyWage.toLocaleString()}円
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    disabled={candidate.status === "UNAVAILABLE"}
                                                >
                                                    この枠に確定
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminJobAssignmentsPage;