import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { formatDate, formatMonth, formatYen } from "@/lib/format";
import type { WageType } from "@prisma/client";
import { deleteJob } from "@/features/jobs/actions";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";

type AdminJobDetailPageProps = {
    params: Promise<{
        jobId: string;
    }>;
};

const wageTypeLabel: Record<WageType, string> = {
    EMPLOYEE: "従業員ごとの時給",
    JOB_FIXED: "案件一律時給",
};

const AdminJobDetailPage = async ({ params }: AdminJobDetailPageProps) => {
    const { jobId } = await params;

    const job = await getJobById(jobId);

    if (!job) {
        notFound();
    }

    const candidates = await getActiveStaffCandidates();

    const totalRequiredPeople = job.shiftSlots.reduce((total, slot) => {
        return total + slot.requiredPeople;
    }, 0);

    const assignedPeople = job.shiftAssignments.length;

    const shortagePeople = Math.max(totalRequiredPeople - assignedPeople, 0);

    const fulfillmentRate =
        totalRequiredPeople === 0
            ? 0
            : Math.round((assignedPeople / totalRequiredPeople) * 100);

    return (
        <div className="space-y-8">
            <section className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{job.title}</h1>
                    <p className="mt-2 text-slate-600">
                        案件情報、勤務枠、候補者、充足状況を確認します。
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button asChild variant="outline">
                        <Link href="/admin/jobs">案件一覧へ戻る</Link>
                    </Button>
                    <Button asChild>
                        <Link href={`/admin/jobs/${job.id}/assignments`}>
                            シフトを確定する
                        </Link>
                    </Button>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">必要人数</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{totalRequiredPeople}人</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">確定人数</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{assignedPeople}人</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">不足人数</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{shortagePeople}人</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">充足率</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{fulfillmentRate}%</p>
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>案件基本情報</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">日付</span>
                            <span className="font-medium">{formatDate(job.workDate)}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">場所</span>
                            <span className="font-medium">{job.location}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">集合場所</span>
                            <span className="font-medium">{job.meetingPlace}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">勤務時間</span>
                            <span className="font-medium">
                                {job.startTime}〜{job.endTime}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">休憩時間</span>
                            <span className="font-medium">{job.breakMinutes}分</span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">食事</span>
                            <span className="font-medium">
                                {job.hasMeal ? "あり" : "なし"}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">交通費</span>
                            <span className="font-medium">
                                {formatYen(job.transportationFee)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>勤務条件・時給設定</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">時給タイプ</span>
                            <Badge variant="secondary">{wageTypeLabel[job.wageType]}</Badge>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">案件一律時給</span>
                            <span className="font-medium">
                                {job.fixedHourlyWage !== null
                                    ? formatYen(job.fixedHourlyWage)
                                    : "未設定"}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">服装</span>
                            <span className="font-medium">{job.dressCode}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">持ち物</span>
                            <span className="font-medium">{job.belongings}</span>
                        </div>

                        <div className="space-y-1">
                            <span className="text-slate-500">備考</span>
                            <p className="font-medium">{job.note}</p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                        <CardTitle>勤務枠一覧</CardTitle>
                        <Button asChild size="sm">
                            <Link href={`/admin/jobs/${job.id}/slots/new`}>
                                勤務枠を追加
                            </Link>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>勤務枠</TableHead>
                                <TableHead>開始時間</TableHead>
                                <TableHead>終了時間</TableHead>
                                <TableHead className="text-right">必要人数</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {job.shiftSlots.map((slot) => (
                                <TableRow key={slot.id}>
                                    <TableCell className="font-medium">{slot.name}</TableCell>
                                    <TableCell>{slot.startTime}</TableCell>
                                    <TableCell>{slot.endTime}</TableCell>
                                    <TableCell className="text-right">
                                        {slot.requiredPeople}人
                                    </TableCell>
                                </TableRow>
                            ))}
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
                    <CardTitle>危険な操作</CardTitle>
                </CardHeader>

                <CardContent className="flex items-center justify-between gap-4">
                    <p className="text-sm text-slate-600">
                        この案件と、関連する勤務枠・シフト割当・就労報告を削除します。
                    </p>

                    <form action={deleteJob}>
                        <input type="hidden" name="jobId" value={job.id} />
                        <ConfirmSubmitButton
                            variant="destructive"
                            message="この案件と関連データを削除します。よろしいですか？"
                        >
                            案件を削除
                        </ConfirmSubmitButton>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminJobDetailPage;