import type { JobShiftSlot } from "@prisma/client";
import { LinkButton } from "@/components/shared/link-button";
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
import {
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
import { CalendarPlus, Clock } from "lucide-react";

type JobShiftSlotTableProps = {
    jobId: string;
    shiftSlots: JobShiftSlot[];
};

export const JobShiftSlotTable = ({
    jobId,
    shiftSlots,
}: JobShiftSlotTableProps) => {
    return (
        <BridalCard className="overflow-hidden">
            <CardHeader className="p-5 pb-3">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                        <div className={bridalStyles.icon.circle}>
                            <Clock className="h-5 w-5" />
                        </div>

                        <div>
                            <CardTitle
                                className={[
                                    bridalStyles.text.title,
                                    "text-xl",
                                ].join(" ")}
                            >
                                勤務枠一覧
                            </CardTitle>
                            <p className="mt-1 text-sm text-slate-500">
                                勤務時間帯ごとの必要人数を確認します。
                            </p>
                        </div>
                    </div>

                    <LinkButton
                        href={`/admin/jobs/${jobId}/slots/new`}
                        size="sm"
                        className={bridalStyles.button.primary}
                    >
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        勤務枠を追加
                    </LinkButton>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-2">
                <div className={bridalStyles.table.wrapper}>
                    <Table>
                        <TableHeader>
                            <TableRow className={bridalStyles.table.headerRow}>
                                <TableHead className={bridalStyles.table.head}>
                                    勤務枠
                                </TableHead>
                                <TableHead className={bridalStyles.table.head}>
                                    開始時間
                                </TableHead>
                                <TableHead className={bridalStyles.table.head}>
                                    終了時間
                                </TableHead>
                                <TableHead
                                    className={[
                                        bridalStyles.table.head,
                                        "text-right",
                                    ].join(" ")}
                                >
                                    必要人数
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {shiftSlots.map((slot) => (
                                <TableRow
                                    key={slot.id}
                                    className={bridalStyles.table.row}
                                >
                                    <TableCell>
                                        <p
                                            className={[
                                                bridalStyles.text.title,
                                                "text-base",
                                            ].join(" ")}
                                        >
                                            {slot.name}
                                        </p>
                                    </TableCell>

                                    <TableCell className="text-sm text-slate-600">
                                        {slot.startTime}
                                    </TableCell>

                                    <TableCell className="text-sm text-slate-600">
                                        {slot.endTime}
                                    </TableCell>

                                    <TableCell className="text-right text-sm font-medium text-slate-900">
                                        {slot.requiredPeople}人
                                    </TableCell>
                                </TableRow>
                            ))}

                            {shiftSlots.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="py-10 text-center text-sm text-slate-500"
                                    >
                                        勤務枠が登録されていません。
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </BridalCard>
    );
};