import { Badge } from "@/components/ui/badge";
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
import type { JobDetail } from "@/features/jobs/types";

type AssignedAssignment = JobDetail["shiftAssignments"][number];

type JobAssignedStaffTableProps = {
    assignments: AssignedAssignment[];
};

export const JobAssignedStaffTable = ({
    assignments,
}: JobAssignedStaffTableProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>参加スタッフ一覧</CardTitle>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>氏名</TableHead>
                            <TableHead>勤務枠</TableHead>
                            <TableHead>メールアドレス</TableHead>
                            <TableHead>ステータス</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {assignments.map((assignment) => (
                            <TableRow key={assignment.id}>
                                <TableCell className="font-medium">
                                    {assignment.employee.name}
                                </TableCell>
                                <TableCell>{assignment.slot.name}</TableCell>
                                <TableCell>{assignment.employee.email}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">確定</Badge>
                                </TableCell>
                            </TableRow>
                        ))}

                        {assignments.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="py-8 text-center text-slate-500"
                                >
                                    参加スタッフがまだ確定していません。
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};