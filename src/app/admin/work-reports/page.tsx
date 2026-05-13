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
import {
    mockEmployees,
    mockJobs,
    mockWorkReports,
} from "@/features/shared/mock-data";
import type { WorkReportStatus } from "@/features/shared/types";
import {
    calculateEstimatedSalary,
    calculateWorkHours,
} from "@/features/payroll/services";

const workReportStatusLabel: Record<WorkReportStatus, string> = {
    NOT_SUBMITTED: "未提出",
    SUBMITTED: "提出済み",
    APPROVED: "承認済み",
    REJECTED: "差し戻し",
};

const workReportStatusBadgeVariant: Record<
    WorkReportStatus,
    "default" | "secondary" | "outline" | "destructive"
> = {
    NOT_SUBMITTED: "outline",
    SUBMITTED: "secondary",
    APPROVED: "default",
    REJECTED: "destructive",
};

const AdminWorkReportsPage = () => {
    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-bold">就労報告管理</h1>
                <p className="mt-2 text-slate-600">
                    従業員から提出された就労報告を確認し、承認または差し戻しを行います。
                </p>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>就労報告一覧</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>従業員名</TableHead>
                                <TableHead>案件名</TableHead>
                                <TableHead>勤務日</TableHead>
                                <TableHead>報告状態</TableHead>
                                <TableHead className="text-right">実勤務時間</TableHead>
                                <TableHead className="text-right">給与見込み</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {mockWorkReports.map((report) => {
                                const employee = mockEmployees.find(
                                    (employee) => employee.id === report.employeeId,
                                );
                                const job = mockJobs.find((job) => job.id === report.jobId);

                                const actualWorkHours = calculateWorkHours(
                                    report.actualStartTime,
                                    report.actualEndTime,
                                    report.actualBreakMinutes,
                                );

                                const estimatedSalary =
                                    employee && job
                                        ? calculateEstimatedSalary(report, job, employee)
                                        : 0;

                                return (
                                    <TableRow key={report.id}>
                                        <TableCell className="font-medium">
                                            {employee?.name ?? "不明な従業員"}
                                        </TableCell>
                                        <TableCell>{job?.title ?? "不明な案件"}</TableCell>
                                        <TableCell>{job?.workDate ?? "-"}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={workReportStatusBadgeVariant[report.status]}
                                            >
                                                {workReportStatusLabel[report.status]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {actualWorkHours}時間
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {estimatedSalary.toLocaleString()}円
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm">承認</Button>
                                                <Button size="sm" variant="outline">
                                                    差し戻し
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminWorkReportsPage;