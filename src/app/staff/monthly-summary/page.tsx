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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCurrentEmployeeId } from "@/lib/auth/current-user";
import { getCurrentYearMonth } from "@/lib/month";
import { formatDate, formatYen } from "@/lib/format";
import { getStaffMonthlyPayrollSummary } from "@/features/payroll/queries";
import { PayrollCardList } from "@/features/payroll/components/payroll-card-list";

type StaffMonthlySummaryPageProps = {
    searchParams: Promise<{
        month?: string;
    }>;
};

const formatMinutesAsHour = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}時間${remainingMinutes}分`;
};

const StaffMonthlySummaryPage = async ({
    searchParams,
}: StaffMonthlySummaryPageProps) => {
    const currentEmployeeId = await getCurrentEmployeeId();
    const { month } = await searchParams;
    const targetMonth = month ?? getCurrentYearMonth();

    const summary = await getStaffMonthlyPayrollSummary(
        currentEmployeeId,
        targetMonth,
    );

    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-bold">月次集計</h1>
                <p className="mt-2 text-slate-600">
                    承認済みの就労報告をもとに、勤務時間・給与見込み・交通費・食事手当を確認します。
                </p>
            </section>

            <form className="flex items-end gap-3" action="/staff/monthly-summary">
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

            <section className="grid gap-4 md:grid-cols-5">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            勤務回数
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{summary.rows.length}回</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            勤務時間
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {formatMinutesAsHour(summary.totalWorkingMinutes)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            給与見込み
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {formatYen(summary.totalWageAmount)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            交通費
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {formatYen(summary.totalTransportationFee)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            支給見込み合計
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {formatYen(summary.totalPaymentAmount)}
                        </p>
                    </CardContent>
                </Card>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>{targetMonth} の明細</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>勤務日</TableHead>
                                    <TableHead>案件</TableHead>
                                    <TableHead>勤務時間</TableHead>
                                    <TableHead>休憩</TableHead>
                                    <TableHead>時給</TableHead>
                                    <TableHead>給与</TableHead>
                                    <TableHead>交通費</TableHead>
                                    <TableHead>食事</TableHead>
                                    <TableHead>食事手当</TableHead>
                                    <TableHead className="text-right">合計</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {summary.rows.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{formatDate(row.workDate)}</TableCell>
                                        <TableCell>{row.jobTitle}</TableCell>
                                        <TableCell>
                                            {row.actualStartTime}〜{row.actualEndTime}
                                            <div className="text-xs text-slate-500">
                                                実働 {formatMinutesAsHour(row.workingMinutes)}
                                            </div>
                                        </TableCell>
                                        <TableCell>{row.actualBreakMinutes}分</TableCell>
                                        <TableCell>{formatYen(row.hourlyWage)}</TableCell>
                                        <TableCell>{formatYen(row.wageAmount)}</TableCell>
                                        <TableCell>
                                            {formatYen(row.transportationFee)}
                                        </TableCell>
                                        <TableCell>
                                            {row.hasMeal ? "あり" : "なし"}
                                        </TableCell>
                                        <TableCell>{formatYen(row.mealAllowance)}</TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatYen(row.totalAmount)}
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {summary.rows.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={10}
                                            className="py-8 text-center text-slate-500"
                                        >
                                            この月の承認済み就労報告はありません。
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="md:hidden">
                        <PayrollCardList rows={summary.rows} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffMonthlySummaryPage;