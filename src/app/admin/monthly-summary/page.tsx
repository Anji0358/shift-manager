import Link from "next/link";
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
import { getWorkReportsByMonth } from "@/features/work-reports/queries";
import { buildMonthlyReportSummaries } from "@/features/monthly-reports/services";
import { formatYen } from "@/lib/format";
import { getCurrentYearMonth, getMonthRange } from "@/lib/month";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AdminMonthlySummaryPageProps = {
    searchParams: Promise<{
        month?: string;
    }>;
};

const AdminMonthlySummaryPage = async ({
    searchParams,
}: AdminMonthlySummaryPageProps) => {
    const { month } = await searchParams;
    const targetMonth = month ?? getCurrentYearMonth();
    const { startDate, endDate } = getMonthRange(targetMonth);

    const reports = await getWorkReportsByMonth(startDate, endDate);
    const monthlySummaries = buildMonthlyReportSummaries(reports, targetMonth);

    const totalReportCount = monthlySummaries.reduce((total, summary) => {
        return total + summary.totals.reportCount;
    }, 0);

    const totalWorkHours = monthlySummaries.reduce((total, summary) => {
        return total + summary.totals.workingHours;
    }, 0);

    const totalExpenses = monthlySummaries.reduce((total, summary) => {
        return total + summary.totals.expensesTotal;
    }, 0);

    const totalLaborCost = monthlySummaries.reduce((total, summary) => {
        return total + summary.totals.totalPay;
    }, 0);

    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-bold">月次集計</h1>
                <p className="mt-2 text-slate-600">
                    就労報告をもとに、スタッフ別の勤務回数・就労時間・諸経費・支給見込みを確認します。
                </p>
            </section>

            <form className="flex items-end gap-3" action="/admin/monthly-summary">
                <div className="space-y-2">
                    <label htmlFor="month" className="text-sm font-medium">
                        対象月
                    </label>
                    <Input
                        id="month"
                        name="month"
                        type="month"
                        defaultValue={targetMonth}
                    />
                </div>

                <Button type="submit">表示</Button>
            </form>

            <section className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            総勤務件数
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{totalReportCount}件</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            総就労時間
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {totalWorkHours.toFixed(1)}h
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            総諸経費
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {formatYen(totalExpenses)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            総支給見込み
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
                    <CardTitle>スタッフ別集計</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>スタッフ</TableHead>
                                    <TableHead className="text-right">勤務回数</TableHead>
                                    <TableHead className="text-right">休憩時間</TableHead>
                                    <TableHead className="text-right">就労時間</TableHead>
                                    <TableHead className="text-right">諸経費</TableHead>
                                    <TableHead className="text-right">支給見込み</TableHead>
                                    <TableHead className="text-right">操作</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {monthlySummaries.map((summary) => (
                                    <TableRow key={summary.employeeId}>
                                        <TableCell className="font-medium">
                                            {summary.employeeName}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            {summary.totals.reportCount}回
                                        </TableCell>

                                        <TableCell className="text-right">
                                            {summary.totals.breakHours.toFixed(1)}h
                                        </TableCell>

                                        <TableCell className="text-right">
                                            {summary.totals.workingHours.toFixed(1)}h
                                        </TableCell>

                                        <TableCell className="text-right">
                                            {formatYen(summary.totals.expensesTotal)}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            {formatYen(summary.totals.totalPay)}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <Button asChild size="sm" variant="outline">
                                                <Link
                                                    href={`/admin/monthly-summary/${summary.employeeId}?month=${targetMonth}`}
                                                >
                                                    給与明細の表示
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {monthlySummaries.length === 0 && (
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