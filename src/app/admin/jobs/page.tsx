import Link from "next/link";
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
import { getJobs } from "@/features/jobs/queries";
import { formatDate, formatYen } from "@/lib/format";
import type { WageType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentYearMonth, getMonthRange } from "@/lib/month";
import { SuccessMessage } from "@/components/shared/success-message";

type AdminJobsPageProps = {
    searchParams: Promise<{
        month?: string;
        message?: string;
    }>;
};

const wageTypeLabel: Record<WageType, string> = {
    EMPLOYEE: "従業員ごとの時給",
    JOB_FIXED: "案件一律時給",
};

const AdminJobsPage = async ({ searchParams }: AdminJobsPageProps) => {
    const { month, message } = await searchParams;
    const targetMonth = month ?? getCurrentYearMonth();
    const { startDate, endDate } = getMonthRange(targetMonth);

    const jobs = await getJobs(startDate, endDate);

    return (
        <div className="space-y-6">
            <section className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">案件管理</h1>
                    <p className="mt-2 text-slate-600">
                        案件情報、勤務時間、集合場所、時給設定を管理します。
                    </p>
                </div>

                <div className="flex flex-wrap items-end gap-3">
                    <SuccessMessage message={message} />

                    <form className="flex items-end gap-3" action="/admin/jobs">
                        <div className="space-y-2">
                            <label htmlFor="month" className="text-sm font-medium">
                                対象月
                            </label>
                            <Input
                                id="month"
                                name="month"
                                type="month"
                                defaultValue={targetMonth}
                            />
                        </div>

                        <Button type="submit">表示</Button>
                    </form>

                    <Button asChild>
                        <Link href="/admin/jobs/new">案件を追加</Link>
                    </Button>
                </div>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>案件一覧</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>案件名</TableHead>
                                <TableHead>日付</TableHead>
                                <TableHead>場所</TableHead>
                                <TableHead>集合場所</TableHead>
                                <TableHead>勤務時間</TableHead>
                                <TableHead>食事</TableHead>
                                <TableHead>時給設定</TableHead>
                                <TableHead>充足状況</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {jobs.map((job) => (
                                <TableRow key={job.id}>
                                    <TableCell className="font-medium">
                                        <div className="space-y-1">
                                            <div>{job.title}</div>
                                            <Badge
                                                variant={
                                                    job.fulfillmentRate >= 100 ? "default" : "secondary"
                                                }
                                            >
                                                {job.fulfillmentRate >= 100 ? "充足" : "未充足"}
                                            </Badge>
                                        </div>
                                    </TableCell>

                                    <TableCell>{formatDate(job.workDate)}</TableCell>

                                    <TableCell>{job.location}</TableCell>

                                    <TableCell>{job.meetingPlace}</TableCell>

                                    <TableCell>
                                        {job.startTime}〜{job.endTime}
                                    </TableCell>

                                    <TableCell>
                                        <Badge variant={job.hasMeal ? "default" : "outline"}>
                                            {job.hasMeal ? "あり" : "なし"}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <div className="space-y-1">
                                            <Badge variant="secondary">
                                                {wageTypeLabel[job.wageType]}
                                            </Badge>

                                            {job.fixedHourlyWage !== null && (
                                                <p className="text-xs text-slate-500">
                                                    {formatYen(job.fixedHourlyWage)}
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="w-36 rounded-md bg-slate-100 p-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">必要</span>
                                                <span className="font-medium">
                                                    {job.requiredPeople}人
                                                </span>
                                            </div>

                                            <div className="mt-1 flex justify-between">
                                                <span className="text-slate-500">確定</span>
                                                <span className="font-medium">
                                                    {job.assignedPeople}人
                                                </span>
                                            </div>

                                            <div className="mt-1 flex justify-between">
                                                <span className="text-slate-500">充足率</span>
                                                <span className="font-medium">
                                                    {job.fulfillmentRate}%
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={`/admin/jobs/${job.id}`}>詳細</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {jobs.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={9}
                                        className="py-8 text-center text-slate-500"
                                    >
                                        この月の案件はありません。
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

export default AdminJobsPage;