import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { getAssignmentsByEmployeeId } from "@/features/shift-assignments/queries";
import { getWorkReportsByEmployeeId } from "@/features/work-reports/queries";
import { formatDate } from "@/lib/format";
import { getCurrentEmployeeId } from "@/lib/auth/current-user";

const StaffShiftsPage = async () => {
    const currentEmployeeId = getCurrentEmployeeId();

    const assignments = await getAssignmentsByEmployeeId(currentEmployeeId);
    const reports = await getWorkReportsByEmployeeId(currentEmployeeId);

    const reportedJobIds = new Set(reports.map((report) => report.jobId));

    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-bold">確定シフト</h1>
                <p className="mt-2 text-slate-600">
                    自分に確定された勤務予定を確認します。
                </p>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>確定シフト一覧</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>日付</TableHead>
                                <TableHead>案件名</TableHead>
                                <TableHead>勤務枠</TableHead>
                                <TableHead>勤務時間</TableHead>
                                <TableHead>場所</TableHead>
                                <TableHead>集合場所</TableHead>
                                <TableHead>食事</TableHead>
                                <TableHead className="text-right">報告</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {assignments.map((assignment) => {
                                const alreadyReported = reportedJobIds.has(assignment.jobId);

                                return (
                                    <TableRow key={assignment.id}>
                                        <TableCell>{formatDate(assignment.job.workDate)}</TableCell>
                                        <TableCell className="font-medium">
                                            {assignment.job.title}
                                        </TableCell>
                                        <TableCell>{assignment.slot.name}</TableCell>
                                        <TableCell>
                                            {assignment.slot.startTime}〜{assignment.slot.endTime}
                                        </TableCell>
                                        <TableCell>{assignment.job.location}</TableCell>
                                        <TableCell>{assignment.job.meetingPlace}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={assignment.job.hasMeal ? "default" : "outline"}
                                            >
                                                {assignment.job.hasMeal ? "あり" : "なし"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {alreadyReported ? (
                                                <Badge variant="secondary">提出済み</Badge>
                                            ) : (
                                                <Button asChild size="sm" variant="outline">
                                                    <Link
                                                        href={`/staff/work-reports/new?assignmentId=${assignment.id}`}
                                                    >
                                                        報告する
                                                    </Link>
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {assignments.length === 0 && (
                        <p className="mt-4 text-sm text-slate-500">
                            確定しているシフトはありません。
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffShiftsPage;