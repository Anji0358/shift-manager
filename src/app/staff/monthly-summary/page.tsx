import {
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
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
import { getCurrentEmployeeId } from "@/lib/auth/current-user";
import { getCurrentYearMonth } from "@/lib/month";
import { formatDate, formatYen } from "@/lib/format";
import { getStaffMonthlyPayrollSummary } from "@/features/payroll/queries";
import { PayrollCardList } from "@/features/payroll/components/payroll-card-list";
import {
    Banknote,
    CalendarDays,
    Clock,
    Coins,
    ReceiptText,
    Search,
    Train,
} from "lucide-react";

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
        <PageShell>
            <PageHeader
                title="月次集計"
                description="承認済みの就労報告をもとに、勤務時間・給与見込み・交通費・食事手当を確認します。"
            />

            <div className="space-y-6">
                <BridalCard>
                    <CardContent className="p-5">
                        <form
                            className="flex flex-col gap-3 sm:flex-row sm:items-end"
                            action="/staff/monthly-summary"
                        >
                            <div className="space-y-2">
                                <label
                                    htmlFor="month"
                                    className={bridalStyles.form.label}
                                >
                                    対象月
                                </label>
                                <Input
                                    id="month"
                                    name="month"
                                    type="month"
                                    defaultValue={targetMonth}
                                    className={bridalStyles.form.input}
                                />
                            </div>

                            <Button
                                type="submit"
                                className={[
                                    bridalStyles.button.primary,
                                    "h-11 px-6",
                                ].join(" ")}
                            >
                                <Search className="mr-2 h-4 w-4" />
                                表示
                            </Button>
                        </form>
                    </CardContent>
                </BridalCard>

                <section className="grid gap-4 md:grid-cols-5">
                    <SummaryCard
                        title="勤務回数"
                        value={`${summary.rows.length}回`}
                        icon={<CalendarDays className="h-5 w-5" />}
                    />

                    <SummaryCard
                        title="勤務時間"
                        value={formatMinutesAsHour(summary.totalWorkingMinutes)}
                        icon={<Clock className="h-5 w-5" />}
                    />

                    <SummaryCard
                        title="給与見込み"
                        value={formatYen(summary.totalWageAmount)}
                        icon={<Banknote className="h-5 w-5" />}
                    />

                    <SummaryCard
                        title="交通費"
                        value={formatYen(summary.totalTransportationFee)}
                        icon={<Train className="h-5 w-5" />}
                    />

                    <SummaryCard
                        title="支給見込み合計"
                        value={formatYen(summary.totalPaymentAmount)}
                        icon={<Coins className="h-5 w-5" />}
                    />
                </section>

                <BridalCard className="overflow-hidden">
                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-start gap-3">
                            <div className={bridalStyles.icon.circle}>
                                <ReceiptText className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle
                                    className={[
                                        bridalStyles.text.title,
                                        "text-xl",
                                    ].join(" ")}
                                >
                                    {targetMonth} の明細
                                </CardTitle>
                                <p className="mt-1 text-sm text-slate-500">
                                    承認済みの就労報告ごとの給与・交通費・食事手当を確認します。
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-2">
                        <div className="hidden md:block">
                            <div className={bridalStyles.table.wrapper}>
                                <Table>
                                    <TableHeader>
                                        <TableRow className={bridalStyles.table.headerRow}>
                                            <TableHead className={bridalStyles.table.head}>
                                                勤務日
                                            </TableHead>

                                            <TableHead className={bridalStyles.table.head}>
                                                案件
                                            </TableHead>

                                            <TableHead className={bridalStyles.table.head}>
                                                勤務時間
                                            </TableHead>

                                            <TableHead className={bridalStyles.table.head}>
                                                休憩
                                            </TableHead>

                                            <TableHead className={bridalStyles.table.head}>
                                                時給
                                            </TableHead>

                                            <TableHead className={bridalStyles.table.head}>
                                                給与
                                            </TableHead>

                                            <TableHead className={bridalStyles.table.head}>
                                                交通費
                                            </TableHead>

                                            <TableHead className={bridalStyles.table.head}>
                                                食事
                                            </TableHead>

                                            <TableHead className={bridalStyles.table.head}>
                                                食事手当
                                            </TableHead>

                                            <TableHead
                                                className={[
                                                    bridalStyles.table.head,
                                                    "text-right",
                                                ].join(" ")}
                                            >
                                                合計
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {summary.rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                className={bridalStyles.table.row}
                                            >
                                                <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                    {formatDate(row.workDate)}
                                                </TableCell>

                                                <TableCell>
                                                    <p
                                                        className={[
                                                            bridalStyles.text.title,
                                                            "text-base",
                                                        ].join(" ")}
                                                    >
                                                        {row.jobTitle}
                                                    </p>
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                    {row.actualStartTime}〜{row.actualEndTime}
                                                    <div className="text-xs text-slate-500">
                                                        実働{" "}
                                                        {formatMinutesAsHour(row.workingMinutes)}
                                                    </div>
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                    {row.actualBreakMinutes}分
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                    {formatYen(row.hourlyWage)}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                    {formatYen(row.wageAmount)}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                    {formatYen(row.transportationFee)}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                    {row.hasMeal ? "あり" : "なし"}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                    {formatYen(row.mealAllowance)}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap text-right text-sm font-medium text-slate-900">
                                                    {formatYen(row.totalAmount)}
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {summary.rows.length === 0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={10}
                                                    className="py-10 text-center text-sm text-slate-500"
                                                >
                                                    この月の承認済み就労報告はありません。
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        <div className="md:hidden">
                            <PayrollCardList rows={summary.rows} />
                        </div>
                    </CardContent>
                </BridalCard>
            </div>
        </PageShell>
    );
};

type SummaryCardProps = {
    title: string;
    value: string;
    icon: React.ReactNode;
};

const SummaryCard = ({ title, value, icon }: SummaryCardProps) => {
    return (
        <BridalCard>
            <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-3">
                    <div className={bridalStyles.icon.smallCircle}>{icon}</div>

                    <CardTitle className="text-sm font-medium text-slate-500">
                        {title}
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-2">
                <p className="text-2xl font-semibold tracking-tight text-slate-900">
                    {value}
                </p>
            </CardContent>
        </BridalCard>
    );
};

export default StaffMonthlySummaryPage;