import Link from "next/link";
import { notFound } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getWorkReportsByMonth } from "@/features/work-reports/queries";
import { buildMonthlyReportSummaries } from "@/features/monthly-reports/services";
import { MonthlyReportDetailTable } from "@/features/monthly-reports/components/monthly-report-detail-table";
import { formatYen } from "@/lib/format";
import { getCurrentYearMonth, getMonthRange } from "@/lib/month";

type AdminEmployeeMonthlySummaryPageProps = {
    params: Promise<{
        employeeId: string;
    }>;
    searchParams: Promise<{
        month?: string;
    }>;
};

const AdminEmployeeMonthlySummaryPage = async ({
    params,
    searchParams,
}: AdminEmployeeMonthlySummaryPageProps) => {
    const { employeeId } = await params;
    const { month } = await searchParams;

    const targetMonth = month ?? getCurrentYearMonth();
    const { startDate, endDate } = getMonthRange(targetMonth);

    const reports = await getWorkReportsByMonth(startDate, endDate);
    const monthlySummaries = buildMonthlyReportSummaries(reports, targetMonth);

    const summary = monthlySummaries.find((summary) => {
        return summary.employeeId === employeeId;
    });

    if (!summary) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">給与明細</h1>
                    <p className="mt-2 text-slate-600">
                        {summary.employeeName}さんの{targetMonth}の勤務実績・諸経費・支給見込みを確認します。
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline">
                        <Link href={`/admin/monthly-summary?month=${targetMonth}`}>
                            月次集計へ戻る
                        </Link>
                    </Button>

                    <Button asChild>
                        <Link
                            href={`/admin/monthly-summary/${employeeId}/export?month=${targetMonth}`}
                        >
                            給与明細をExcel出力
                        </Link>
                    </Button>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            勤務回数
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {summary.totals.reportCount}回
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            就労時間
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {summary.totals.workingHours.toFixed(1)}h
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            諸経費
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {formatYen(summary.totals.expensesTotal)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            支給見込み
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {formatYen(summary.totals.totalPay)}
                        </p>
                    </CardContent>
                </Card>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>日別給与明細</CardTitle>
                </CardHeader>

                <CardContent>
                    <MonthlyReportDetailTable summaries={[summary]} />
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminEmployeeMonthlySummaryPage;