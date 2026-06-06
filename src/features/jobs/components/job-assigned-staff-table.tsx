import { Badge } from "@/components/ui/badge";
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
import type { JobDetail } from "@/features/jobs/types";
import { UserCheck } from "lucide-react";

type ShiftSlotWithAssignments = JobDetail["shiftSlots"][number];

type AssignedAssignment =
    ShiftSlotWithAssignments["shiftAssignments"][number] & {
        slot: ShiftSlotWithAssignments;
    };

type JobAssignedStaffTableProps = {
    assignments: AssignedAssignment[];
};

export const JobAssignedStaffTable = ({
    assignments,
}: JobAssignedStaffTableProps) => {
    return (
        <BridalCard className="overflow-hidden">
            <CardHeader className="p-5 pb-3">
                <div className="flex items-start gap-3">
                    <div className={bridalStyles.icon.circle}>
                        <UserCheck className="h-5 w-5" />
                    </div>

                    <div>
                        <CardTitle
                            className={[
                                bridalStyles.text.title,
                                "text-xl",
                            ].join(" ")}
                        >
                            参加スタッフ一覧
                        </CardTitle>
                        <p className="mt-1 text-sm text-slate-500">
                            この案件に確定している登録スタッフを確認します。
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
                                    氏名
                                </TableHead>

                                <TableHead className={bridalStyles.table.head}>
                                    勤務枠
                                </TableHead>

                                <TableHead className={bridalStyles.table.head}>
                                    メールアドレス
                                </TableHead>

                                <TableHead className={bridalStyles.table.head}>
                                    ステータス
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {assignments.map((assignment) => (
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
                                            {assignment.employee.name}
                                        </p>
                                    </TableCell>

                                    <TableCell className="text-sm text-slate-600">
                                        {assignment.slot.name}
                                    </TableCell>

                                    <TableCell className="text-sm text-slate-600">
                                        {assignment.employee.email}
                                    </TableCell>

                                    <TableCell>
                                        <Badge className={bridalStyles.badge.fulfilled}>
                                            確定
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {assignments.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="py-10 text-center text-sm text-slate-500"
                                    >
                                        参加スタッフがまだ確定していません。
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