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
import {
    calculateEstimatedSalary,
    calculateWorkHours,
} from "@/features/payroll/services";

const AdminMonthlySummariesPage = () => {
    const employeeSummaries = mockEmployees.map((employee) => {
        const reports = mockWorkReports.filter(
            (report) => report.employeeId === employee.id,
        );

        const totalWorkHours = reports.reduce((total, report) => {
            return (
                total +
                calculateWorkHours(
                    report.actualStartTime,
                    report.actualEndTime,
                    report.actualBreakMinutes,
                )
            );
        }, 0);

        const totalSalary = reports.reduce((total, report) => {
            const job = mockJobs.find((job) => job.id === report.jobId);

            if (!job) {
                return total;
            }

            return total + calculateEstimatedSalary(report, job, employee);
        }, 0);

        return {
            employee,
            workCount: reports.length,
            totalWorkHours,
            totalSalary,
        };
    });

    const jobCostSummaries = mockJobs.map((job) => {
        const reports = mockWorkReports.filter(
            (report) => report.jobId === job.id,
        );

        const totalLaborCost = reports.reduce((total, report) => {
            const employee = mockEmployees.find(
                (employee) => employee.id === report.employeeId,
            );

            if (!employee) {
                return total;
            }

            return total + calculateEstimatedSalary(report, job, employee);
        }, 0);

        return {
            job,
            assignedCount: reports.length,
            totalLaborCost,
        };
    });

    return (
        <div className="space-y-8">
            <section>
                <h1 className="text-3xl font-bold">月次集計</h1>
                <p className="mt-2 text-slate-600">
                    従業員ごとの勤務回数・総勤務時間・給与見込みと、案件ごとの人件費を確認します。
                </p>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>従業員ごとの月次集計</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>従業員名</TableHead>
                                <TableHead className="text-right">勤務回数</TableHead>
                                <TableHead className="text-right">総勤務時間</TableHead>
                                <TableHead className="text-right">給与見込み</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {employeeSummaries.map((summary) => (
                                <TableRow key={summary.employee.id}>
                                    <TableCell className="font-medium">
                                        {summary.employee.name}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {summary.workCount}回
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {summary.totalWorkHours}時間
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {summary.totalSalary.toLocaleString()}円
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>案件ごとの人件費</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>案件名</TableHead>
                                <TableHead>日付</TableHead>
                                <TableHead className="text-right">確定人数</TableHead>
                                <TableHead className="text-right">人件費</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {jobCostSummaries.map((summary) => (
                                <TableRow key={summary.job.id}>
                                    <TableCell className="font-medium">
                                        {summary.job.title}
                                    </TableCell>
                                    <TableCell>{summary.job.workDate}</TableCell>
                                    <TableCell className="text-right">
                                        {summary.assignedCount}人
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {summary.totalLaborCost.toLocaleString()}円
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminMonthlySummariesPage;