import type { JobShiftSlot } from "@prisma/client";
import { LinkButton } from "@/components/shared/link-button";
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

type JobShiftSlotTableProps = {
    jobId: string;
    shiftSlots: JobShiftSlot[];
};

export const JobShiftSlotTable = ({
    jobId,
    shiftSlots,
}: JobShiftSlotTableProps) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between gap-4">
                    <CardTitle>勤務枠一覧</CardTitle>

                    <LinkButton
                        href={`/admin/jobs/${jobId}/slots/new`}
                        size="sm"
                    >
                        勤務枠を追加
                    </LinkButton>
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
                        {shiftSlots.map((slot) => (
                            <TableRow key={slot.id}>
                                <TableCell className="font-medium">
                                    {slot.name}
                                </TableCell>
                                <TableCell>{slot.startTime}</TableCell>
                                <TableCell>{slot.endTime}</TableCell>
                                <TableCell className="text-right">
                                    {slot.requiredPeople}人
                                </TableCell>
                            </TableRow>
                        ))}

                        {shiftSlots.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="py-8 text-center text-slate-500"
                                >
                                    勤務枠が登録されていません。
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};