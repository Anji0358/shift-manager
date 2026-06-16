import type {
    ExternalStaffAssignment,
    JobShiftSlot,
} from "@prisma/client";
import { deleteExternalShiftAssignment } from "@/features/external-shift-assignments/actions";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { AppCard } from "@/components/shared/app-card";
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
        <AppCard className="overflow-hidden">
            <CardHeader className="p-5 pb-3">
                <div className="flex items-start gap-3">
                    <div className={appStyles.icon.circle}>
                        <UserRoundPlus className="h-5 w-5" />
                    </div>

                    <div>
                        <CardTitle
                            className={[
                                appStyles.text.title,
                                "text-xl",
                            ].join(" ")}
                        >
                            外部人員一覧
                        </CardTitle>
                        <p className={["mt-1", appStyles.text.muted].join(" ")}>
                            登録スタッフ以外で確保している外部人員を確認します。
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-2">
                <div className={appStyles.table.wrapper}>
                    <Table>
                        <TableHeader>
                            <TableRow className={appStyles.table.headerRow}>
                                <TableHead className={appStyles.table.head}>
                                    名前・枠名
                                </TableHead>

                                <TableHead
                                    className={[
                                        appStyles.table.head,
                                        "text-right",
                                    ].join(" ")}
                                >
                                    人数
                                </TableHead>

                                <TableHead className={appStyles.table.head}>
                                    勤務枠
                                </TableHead>

                                <TableHead className={appStyles.table.head}>
                                    勤務時間
                                </TableHead>

                                <TableHead className={appStyles.table.head}>
                                    メモ
                                </TableHead>

                                <TableHead
                                    className={[
                                        appStyles.table.head,
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
                                    className={appStyles.table.row}
                                >
                                    <TableCell>
                                        <p
                                            className={[
                                                appStyles.text.title,
                                                "text-base",
                                            ].join(" ")}
                                        >
                                            {assignment.name}
                                        </p>
                                    </TableCell>

                                    <TableCell
                                        className={[
                                            "text-right text-sm font-medium",
                                            appStyles.textColor.default,
                                        ].join(" ")}
                                    >
                                        {assignment.headCount}人
                                    </TableCell>

                                    <TableCell className={appStyles.table.cellMuted}>
                                        {assignment.slot.name}
                                    </TableCell>

                                    <TableCell
                                        className={[
                                            "whitespace-nowrap",
                                            appStyles.table.cellMuted,
                                        ].join(" ")}
                                    >
                                        {assignment.slot.startTime}〜
                                        {assignment.slot.endTime}
                                    </TableCell>

                                    <TableCell
                                        className={[
                                            "max-w-[240px]",
                                            appStyles.table.cellMuted,
                                        ].join(" ")}
                                    >
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
                                                className={appStyles.button.danger}
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
                                        className={appStyles.table.empty}
                                    >
                                        まだ外部人員は追加されていません。
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