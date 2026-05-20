import type { Job, JobShiftSlot } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/shared/link-button";
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
    shiftSlots: JobShiftSlot[];
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
                        <TableHead>勤務枠</TableHead>
                        <TableHead>勤務場所</TableHead>
                        <TableHead>充足状況</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {jobs.map((job) => {
                        const shiftSlotSummary = formatShiftSlotSummary(job.shiftSlots);
                        const isFulfilled = job.fulfillmentRate >= 100;

                        return (
                            <TableRow key={job.id}>
                                <TableCell>{formatDate(job.workDate)}</TableCell>

                                <TableCell className="font-medium">{job.title}</TableCell>

                                <TableCell>{shiftSlotSummary}</TableCell>

                                <TableCell>{job.location}</TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={isFulfilled ? "default" : "secondary"}>
                                            {isFulfilled ? "充足" : "未充足"}
                                        </Badge>

                                        <span className="text-sm text-slate-600">
                                            {job.assignedPeople}/{job.requiredPeople}人
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <LinkButton
                                            href={`/admin/jobs/${job.id}`}
                                            size="sm"
                                            variant="outline"
                                        >
                                            詳細
                                        </LinkButton>

                                        <LinkButton
                                            href={`/admin/jobs/${job.id}/assignments`}
                                            size="sm"
                                        >
                                            スタッフ割り振り
                                        </LinkButton>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}

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

const formatShiftSlotSummary = (shiftSlots: JobShiftSlot[]) => {
    if (shiftSlots.length === 0) {
        return "勤務枠未設定";
    }

    if (shiftSlots.length === 1) {
        const slot = shiftSlots[0];

        return `${slot.startTime} - ${slot.endTime}`;
    }

    const firstSlot = shiftSlots[0];

    return `${firstSlot.startTime} - ${firstSlot.endTime} 他${shiftSlots.length - 1
        }枠`;
};