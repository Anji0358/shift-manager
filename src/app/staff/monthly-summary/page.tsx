import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getWorkReportsByEmployeeIdAndMonth } from "@/features/work-reports/queries";
import {
    calculateEstimatedSalary,
    calculateWorkHours,
} from "@/features/payroll/services";
import { formatYen } from "@/lib/format";
import { getCurrentYearMonth, getMonthRange } from "@/lib/month";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCurrentEmployeeId } from "@/lib/auth/current-user";

type StaffMonthlySummaryPageProps = {
    searchParams: Promise<{
        month?: string;
    }>;
};

const StaffMonthlySummaryPage = async ({
    searchParams,
}: StaffMonthlySummaryPageProps) => {
    const currentEmployeeId = await getCurrentEmployeeId();
    const { month } = await searchParams;
    const targetMonth = month ?? getCurrentYearMonth();
    const { startDate, endDate } = getMonthRange(targetMonth);

    const reports = await getWorkReportsByEmployeeIdAndMonth(
        currentEmployeeId,
        startDate,
        endDate,
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
        return (
            total +
            calculateEstimatedSalary(report, report.job, report.employee)
        );
    }, 0);

    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-bold">月次集計</h1>
                <p className="mt-2 text-slate-600">
                    今月の勤務回数、勤務時間、給与見込みを確認します。
                </p>
            </section>

            <form className="flex items-end gap-3" action="/staff/monthly-summary">
                <div className="space-y-2">
                    <label htmlFor="month" className="text-sm font-medium">
                        対象月
                    </label>
                    <Input id="month" name="month" type="month" defaultValue={targetMonth} />
                </div>
                <Button type="submit">表示</Button>
            </form>

            <section className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            今月の勤務回数
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{reports.length}回</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            今月の勤務時間
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{totalWorkHours}時間</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            今月の給与見込み
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{formatYen(totalSalary)}</p>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
};

export default StaffMonthlySummaryPage;