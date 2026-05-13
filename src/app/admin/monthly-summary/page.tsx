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
import { formatYen } from "@/lib/format";

const AdminMonthlySummaryPage = async () => {
    const reports = await getWorkReports();

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

    const totalLaborCost = reports.reduce((total, report) => {
        return (
            total +
            calculateEstimatedSalary(report, report.job, report.employee)
        );
    }, 0);

    const employeeSummaries = reports.reduce<
        Record<
            string,
            {
                employeeName: string;
                reportCount: number;
                workHours: number;
                salary: number;
            }
        >
    >((summaries, report) => {
        const employeeId = report.employeeId;

        const workHours = calculateWorkHours(
            report.actualStartTime,
            report.actualEndTime,
            report.actualBreakMinutes,
        );

        const salary = calculateEstimatedSalary(
            report,
            report.job,
            report.employee,
        );

        if (!summaries[employeeId]) {
            summaries[employeeId] = {
                employeeName: report.employee.name,
                reportCount: 0,
                workHours: 0,
                salary: 0,
            };
        }

        summaries[employeeId].reportCount += 1;
        summaries[employeeId].workHours += workHours;
        summaries[employeeId].salary += salary;

        return summaries;
    }, {});

    const employeeSummaryRows = Object.values(employeeSummaries);

    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-bold">月次集計</h1>
                <p className="mt-2 text-slate-600">
                    全従業員の勤務時間、人件費、従業員別実績を確認します。
                </p>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            総勤務件数
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{reports.length}件</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            総勤務時間
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{totalWorkHours}時間</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            総人件費見込み
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {formatYen(totalLaborCost)}
                        </p>
                    </CardContent>
                </Card>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>従業員別集計</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>従業員</TableHead>
                                <TableHead className="text-right">勤務回数</TableHead>
                                <TableHead className="text-right">勤務時間</TableHead>
                                <TableHead className="text-right">給与見込み</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {employeeSummaryRows.map((summary) => (
                                <TableRow key={summary.employeeName}>
                                    <TableCell className="font-medium">
                                        {summary.employeeName}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {summary.reportCount}回
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {summary.workHours}時間
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatYen(summary.salary)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {employeeSummaryRows.length === 0 && (
                        <p className="mt-4 text-sm text-slate-500">
                            まだ集計対象の就労報告がありません。
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminMonthlySummaryPage;