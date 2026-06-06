import type {
    ExternalStaffAssignment,
    JobShiftSlot,
} from "@prisma/client";
import { deleteExternalShiftAssignment } from "@/features/external-shift-assignments/actions";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
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
import { Trash2, UserRoundPlus } from "lucide-react";

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
        <BridalCard className="overflow-hidden">
            <CardHeader className="p-5 pb-3">
                <div className="flex items-start gap-3">
                    <div className={bridalStyles.icon.circle}>
                        <UserRoundPlus className="h-5 w-5" />
                    </div>

                    <div>
                        <CardTitle
                            className={[
                                bridalStyles.text.title,
                                "text-xl",
                            ].join(" ")}
                        >
                            外部人員一覧
                        </CardTitle>
                        <p className="mt-1 text-sm text-slate-500">
                            登録スタッフ以外で確保している外部人員を確認します。
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-2">
                <div className={bridalStyles.table.wrapper}>
                    <Table>
                        <TableHeader>
                            <TableRow className={bridalStyles.table.headerRow}>
                                <TableHead className={bridalStyles.table.head}>
                                    名前・枠名
                                </TableHead>

                                <TableHead
                                    className={[
                                        bridalStyles.table.head,
                                        "text-right",
                                    ].join(" ")}
                                >
                                    人数
                                </TableHead>

                                <TableHead className={bridalStyles.table.head}>
                                    勤務枠
                                </TableHead>

                                <TableHead className={bridalStyles.table.head}>
                                    勤務時間
                                </TableHead>

                                <TableHead className={bridalStyles.table.head}>
                                    メモ
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
                            {externalAssignments.map((assignment) => (
                                <TableRow
                                    key={assignment.id}
                                    className={bridalStyles.table.row}
                                >
                                    <TableCell>
                                        <p
                                            className={[
                                                bridalStyles.text.title,
                                                "text-base",
                                            ].join(" ")}
                                        >
                                            {assignment.name}
                                        </p>
                                    </TableCell>

                                    <TableCell className="text-right text-sm font-medium text-slate-900">
                                        {assignment.headCount}人
                                    </TableCell>

                                    <TableCell className="text-sm text-slate-600">
                                        {assignment.slot.name}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                        {assignment.slot.startTime}〜
                                        {assignment.slot.endTime}
                                    </TableCell>

                                    <TableCell className="max-w-[240px] text-sm text-slate-600">
                                        <span className="line-clamp-2">
                                            {assignment.note || "-"}
                                        </span>
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
                                                className={bridalStyles.button.danger}
                                                message="この外部人員を削除します。よろしいですか？"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
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
                                        className="py-10 text-center text-sm text-slate-500"
                                    >
                                        まだ外部人員は追加されていません。
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