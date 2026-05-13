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

const StaffWorkHistoryPage = () => {
    const currentEmployeeId = "emp_2";

    const employee = mockEmployees.find(
        (employee) => employee.id === currentEmployeeId,
    );

    const myReports = mockWorkReports.filter(
        (report) => report.employeeId === currentEmployeeId,
    );

    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-bold">勤務履歴</h1>
                <p className="mt-2 text-slate-600">
                    これまでの勤務実績、給与見込み、承認状況を確認します。
                </p>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>勤務履歴一覧</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>勤務日</TableHead>
                                <TableHead>案件名</TableHead>
                                <TableHead>勤務時間</TableHead>
                                <TableHead className="text-right">実勤務時間</TableHead>
                                <TableHead className="text-right">給与見込み</TableHead>
                                <TableHead>食事</TableHead>
                                <TableHead>承認状況</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {myReports.map((report) => {
                                const job = mockJobs.find((job) => job.id === report.jobId);

                                const workHours = calculateWorkHours(
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
                                        <TableCell>{job?.workDate ?? "-"}</TableCell>
                                        <TableCell className="font-medium">
                                            {job?.title ?? "不明な案件"}
                                        </TableCell>
                                        <TableCell>
                                            {report.actualStartTime}〜{report.actualEndTime}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {workHours}時間
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {estimatedSalary.toLocaleString()}円
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={report.hasMeal ? "default" : "outline"}>
                                                {report.hasMeal ? "あり" : "なし"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={workReportStatusBadgeVariant[report.status]}>
                                                {workReportStatusLabel[report.status]}
                                            </Badge>
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

export default StaffWorkHistoryPage;