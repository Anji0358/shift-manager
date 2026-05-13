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
import { getWorkReports } from "@/features/work-reports/queries";
import {
    calculateEstimatedSalary,
    calculateWorkHours,
} from "@/features/payroll/services";
import { formatDate, formatYen } from "@/lib/format";
import type { WorkReportStatus } from "@prisma/client";

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

const AdminWorkReportsPage = async () => {
    const reports = await getWorkReports();

    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-bold">就労報告管理</h1>
                <p className="mt-2 text-slate-600">
                    従業員から提出された就労報告を確認します。
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
                                <TableHead>勤務日</TableHead>
                                <TableHead>案件名</TableHead>
                                <TableHead>従業員</TableHead>
                                <TableHead>実勤務時間</TableHead>
                                <TableHead className="text-right">勤務時間</TableHead>
                                <TableHead className="text-right">給与見込み</TableHead>
                                <TableHead>状態</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {reports.map((report) => {
                                const workHours = calculateWorkHours(
                                    report.actualStartTime,
                                    report.actualEndTime,
                                    report.actualBreakMinutes,
                                );

                                const estimatedSalary = calculateEstimatedSalary(
                                    report,
                                    report.job,
                                    report.employee,
                                );

                                return (
                                    <TableRow key={report.id}>
                                        <TableCell>{formatDate(report.job.workDate)}</TableCell>
                                        <TableCell className="font-medium">
                                            {report.job.title}
                                        </TableCell>
                                        <TableCell>{report.employee.name}</TableCell>
                                        <TableCell>
                                            {report.actualStartTime}〜{report.actualEndTime}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {workHours}時間
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatYen(estimatedSalary)}
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

                    {reports.length === 0 && (
                        <p className="mt-4 text-sm text-slate-500">
                            まだ就労報告がありません。
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminWorkReportsPage;