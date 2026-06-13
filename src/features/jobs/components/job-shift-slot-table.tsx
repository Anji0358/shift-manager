import type { JobShiftSlot } from "@prisma/client";
import { LinkButton } from "@/components/shared/link-button";
import { AppCard } from "@/components/shared/bridal-card";
import { appStyles } from "@/components/shared/design-tokens";
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
        <AppCard className="overflow-hidden">
            <CardHeader className="p-5 pb-3">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                        <div className={appStyles.icon.circle}>
                            <Clock className="h-5 w-5" />
                        </div>

                        <div>
                            <CardTitle
                                className={[
                                    appStyles.text.title,
                                    "text-xl",
                                ].join(" ")}
                            >
                                勤務枠一覧
                            </CardTitle>
                            <p className={["mt-1", appStyles.text.muted].join(" ")}>
                                勤務時間帯ごとの必要人数を確認します。
                            </p>
                        </div>
                    </div>

                    <LinkButton
                        href={`/admin/jobs/${jobId}/slots/new`}
                        size="sm"
                        className={appStyles.button.primary}
                    >
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        勤務枠を追加
                    </LinkButton>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-2">
                <div className={appStyles.table.wrapper}>
                    <Table>
                        <TableHeader>
                            <TableRow className={appStyles.table.headerRow}>
                                <TableHead className={appStyles.table.head}>
                                    勤務枠
                                </TableHead>
                                <TableHead className={appStyles.table.head}>
                                    開始時間
                                </TableHead>
                                <TableHead className={appStyles.table.head}>
                                    終了時間
                                </TableHead>
                                <TableHead
                                    className={[
                                        appStyles.table.head,
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
                                    className={appStyles.table.row}
                                >
                                    <TableCell>
                                        <p
                                            className={[
                                                appStyles.text.title,
                                                "text-base",
                                            ].join(" ")}
                                        >
                                            {slot.name}
                                        </p>
                                    </TableCell>

                                    <TableCell className={appStyles.table.cellMuted}>
                                        {slot.startTime}
                                    </TableCell>

                                    <TableCell className={appStyles.table.cellMuted}>
                                        {slot.endTime}
                                    </TableCell>

                                    <TableCell
                                        className={[
                                            "text-right text-sm font-medium",
                                            appStyles.textColor.default,
                                        ].join(" ")}
                                    >
                                        {slot.requiredPeople}人
                                    </TableCell>
                                </TableRow>
                            ))}

                            {shiftSlots.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className={appStyles.table.empty}
                                    >
                                        勤務枠が登録されていません。
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </AppCard>
    );
};