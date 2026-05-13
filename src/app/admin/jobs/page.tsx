import Link from "next/link";
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
import { getJobs } from "@/features/jobs/queries";
import { formatDate, formatYen } from "@/lib/format";
import type { WageType } from "@prisma/client";

const wageTypeLabel: Record<WageType, string> = {
    EMPLOYEE: "従業員ごとの時給",
    JOB_FIXED: "案件一律時給",
};

const AdminJobsPage = async () => {
    const jobs = await getJobs();

    return (
        <div className="space-y-6">
            <section className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">案件管理</h1>
                    <p className="mt-2 text-slate-600">
                        案件情報、勤務時間、集合場所、時給設定を管理します。
                    </p>
                </div>

                <Button asChild>
                    <Link href="/admin/jobs/new">案件を追加</Link>
                </Button>
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
                                <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {jobs.map((job) => (
                                <TableRow key={job.id}>
                                    <TableCell className="font-medium">{job.title}</TableCell>
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
                                    <TableCell className="text-right">
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={`/admin/jobs/${job.id}`}>詳細</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminJobsPage;