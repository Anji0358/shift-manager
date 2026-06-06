import type { Job, JobShiftSlot } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/shared/link-button";
import { bridalStyles } from "@/components/shared/design-tokens";
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
    assignedInternalPeople: number;
    assignedExternalPeople: number;
    fulfillmentRate: number;
};

type JobTableProps = {
    jobs: JobWithFulfillment[];
};

export const JobTable = ({ jobs }: JobTableProps) => {
    return (
        <div className={bridalStyles.table.wrapper}>
            <Table>
                <TableHeader>
                    <TableRow className={bridalStyles.table.headerRow}>
                        <TableHead className={bridalStyles.table.head}>
                            勤務日
                        </TableHead>
                        <TableHead className={bridalStyles.table.head}>
                            案件名
                        </TableHead>
                        <TableHead className={bridalStyles.table.head}>
                            勤務枠
                        </TableHead>
                        <TableHead className={bridalStyles.table.head}>
                            勤務場所
                        </TableHead>
                        <TableHead className={bridalStyles.table.head}>
                            充足状況
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
                    {jobs.map((job) => {
                        const shiftSlotSummary = formatShiftSlotSummary(job.shiftSlots);
                        const isFulfilled = job.fulfillmentRate >= 100;

                        return (
                            <TableRow
                                key={job.id}
                                className={bridalStyles.table.row}
                            >
                                <TableCell className="whitespace-nowrap text-sm text-slate-700">
                                    {formatDate(job.workDate)}
                                </TableCell>

                                <TableCell className="min-w-[180px]">
                                    <p
                                        className={[
                                            bridalStyles.text.title,
                                            "text-base",
                                        ].join(" ")}
                                    >
                                        {job.title}
                                    </p>
                                </TableCell>

                                <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                    {shiftSlotSummary}
                                </TableCell>

                                <TableCell className="max-w-[220px] text-sm text-slate-600">
                                    <span className="line-clamp-2">
                                        {job.location}
                                    </span>
                                </TableCell>

                                <TableCell>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                className={
                                                    isFulfilled
                                                        ? bridalStyles.badge.fulfilled
                                                        : bridalStyles.badge.pending
                                                }
                                            >
                                                {isFulfilled ? "充足" : "未充足"}
                                            </Badge>

                                            <span className="text-sm font-medium text-slate-700">
                                                {job.assignedPeople}/{job.requiredPeople}人
                                            </span>
                                        </div>

                                        <p className="text-xs text-slate-500">
                                            登録スタッフ {job.assignedInternalPeople}人 / 外部人員{" "}
                                            {job.assignedExternalPeople}人
                                        </p>
                                    </div>
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <LinkButton
                                            href={`/admin/jobs/${job.id}`}
                                            size="sm"
                                            variant="outline"
                                            className={bridalStyles.button.secondary}
                                        >
                                            詳細
                                        </LinkButton>

                                        <LinkButton
                                            href={`/admin/jobs/${job.id}/assignments`}
                                            size="sm"
                                            className={bridalStyles.button.primary}
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
                                className="py-10 text-center text-sm text-slate-500"
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