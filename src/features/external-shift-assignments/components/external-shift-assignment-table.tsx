import type {
    ExternalStaffAssignment,
    JobShiftSlot,
} from "@prisma/client";
import { deleteExternalShiftAssignment } from "@/features/external-shift-assignments/actions";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
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

type ExternalShiftAssignmentWithRelations = ExternalStaffAssignment & {
    slot: JobShiftSlot;
};

type ExternalShiftAssignmentTableProps = {
    jobId: string;
    externalAssignments: ExternalShiftAssignmentWithRelations[];
};

export const ExternalShiftAssignmentTable = ({
    jobId,
    externalAssignments,
}: ExternalShiftAssignmentTableProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>外部人員一覧</CardTitle>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>名前・枠名</TableHead>
                            <TableHead className="text-right">人数</TableHead>
                            <TableHead>勤務枠</TableHead>
                            <TableHead>勤務時間</TableHead>
                            <TableHead>メモ</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {externalAssignments.map((assignment) => (
                            <TableRow key={assignment.id}>
                                <TableCell className="font-medium">
                                    {assignment.name}
                                </TableCell>

                                <TableCell className="text-right">
                                    {assignment.headCount}人
                                </TableCell>

                                <TableCell>
                                    {assignment.slot.name}
                                </TableCell>

                                <TableCell>
                                    {assignment.slot.startTime}〜{assignment.slot.endTime}
                                </TableCell>

                                <TableCell>
                                    {assignment.note || "-"}
                                </TableCell>

                                <TableCell className="text-right">
                                    <form action={deleteExternalShiftAssignment}>
                                        <input
                                            type="hidden"
                                            name="externalAssignmentId"
                                            value={assignment.id}
                                        />

                                        <input
                                            type="hidden"
                                            name="jobId"
                                            value={jobId}
                                        />

                                        <ConfirmSubmitButton
                                            size="sm"
                                            variant="outline"
                                            message="この外部人員を削除します。よろしいですか？"
                                        >
                                            削除
                                        </ConfirmSubmitButton>
                                    </form>
                                </TableCell>
                            </TableRow>
                        ))}

                        {externalAssignments.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="py-8 text-center text-sm text-slate-500"
                                >
                                    まだ外部人員は追加されていません。
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};