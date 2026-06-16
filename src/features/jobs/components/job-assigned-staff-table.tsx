import { Badge } from "@/components/ui/badge";
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
        <AppCard className="overflow-hidden">
            <CardHeader className="p-5 pb-3">
                <div className="flex items-start gap-3">
                    <div className={appStyles.icon.circle}>
                        <UserCheck className="h-5 w-5" />
                    </div>

                    <div>
                        <CardTitle
                            className={[
                                appStyles.text.title,
                                "text-xl",
                            ].join(" ")}
                        >
                            参加スタッフ一覧
                        </CardTitle>
                        <p className={["mt-1", appStyles.text.muted].join(" ")}>
                            この案件に確定している登録スタッフを確認します。
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
                                    氏名
                                </TableHead>

                                <TableHead className={appStyles.table.head}>
                                    勤務枠
                                </TableHead>

                                <TableHead className={appStyles.table.head}>
                                    メールアドレス
                                </TableHead>

                                <TableHead className={appStyles.table.head}>
                                    ステータス
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {assignments.map((assignment) => (
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
                                            {assignment.employee.name}
                                        </p>
                                    </TableCell>

                                    <TableCell className={appStyles.table.cellMuted}>
                                        {assignment.slot.name}
                                    </TableCell>

                                    <TableCell className={appStyles.table.cellMuted}>
                                        {assignment.employee.email}
                                    </TableCell>

                                    <TableCell>
                                        <Badge className={appStyles.badge.fulfilled}>
                                            確定
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {assignments.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className={appStyles.table.empty}
                                    >
                                        参加スタッフがまだ確定していません。
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