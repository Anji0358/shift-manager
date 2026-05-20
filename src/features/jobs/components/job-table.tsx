import Link from "next/link";
import type { Job } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";

type JobWithFulfillment = Job & {
    requiredPeople: number;
    assignedPeople: number;
    fulfillmentRate: number;
};

type JobTableProps = {
    jobs: JobWithFulfillment[];
};

export const JobTable = ({ jobs }: JobTableProps) => {
    return (
        <div className="rounded-xl border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>勤務日</TableHead>
                        <TableHead>案件名</TableHead>
                        <TableHead>勤務時間</TableHead>
                        <TableHead>勤務場所</TableHead>
                        <TableHead>充足状況</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {jobs.map((job) => (
                        <TableRow key={job.id}>
                            <TableCell>{formatDate(job.workDate)}</TableCell>

                            <TableCell className="font-medium">
                                {job.title}
                            </TableCell>

                            <TableCell>
                                {job.startTime} - {job.endTime}
                            </TableCell>

                            <TableCell>{job.location}</TableCell>

                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={
                                            job.fulfillmentRate >= 100
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {job.fulfillmentRate >= 100 ? "充足" : "未充足"}
                                    </Badge>

                                    <span className="text-sm text-slate-600">
                                        {job.assignedPeople}/{job.requiredPeople}人
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button asChild size="sm" variant="outline">
                                        <Link href={`/admin/jobs/${job.id}`}>
                                            詳細
                                        </Link>
                                    </Button>

                                    <Button asChild size="sm">
                                        <Link href={`/admin/jobs/${job.id}/assignments`}>
                                            スタッフ割り振り
                                        </Link>
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}

                    {jobs.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="py-8 text-center text-slate-500"
                            >
                                案件がありません。
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};