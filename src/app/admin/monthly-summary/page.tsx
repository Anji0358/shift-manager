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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkButton } from "@/components/shared/link-button";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { AppCard } from "@/components/shared/app-card";
import { appStyles } from "@/components/shared/design-tokens";
import { getWorkReportsByMonth } from "@/features/work-reports/queries";
import { buildMonthlyReportSummaries } from "@/features/monthly-reports/services";
import { formatYen } from "@/lib/format";
import { getCurrentYearMonth, getMonthRange } from "@/lib/month";
import {
    CalendarDays,
    Clock,
    ReceiptText,
    UsersRound,
    WalletCards,
} from "lucide-react";

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
        <PageShell>
            <PageHeader
                title="月次集計"
                description="就労報告をもとに、スタッフ別の勤務回数・就労時間・諸経費・支給見込みを確認します。"
            />

            <div className="space-y-6">
                <AppCard className="p-5">
                    <form
                        className="flex flex-col gap-4 md:flex-row md:items-end"
                        action="/admin/monthly-summary"
                    >
                        <div className="space-y-2">
                            <label
                                htmlFor="month"
                                className={appStyles.form.label}
                            >
                                対象月
                            </label>

                            <Input
                                id="month"
                                name="month"
                                type="month"
                                defaultValue={targetMonth}
                                className={appStyles.form.input}
                            />
                        </div>

                        <Button
                            type="submit"
                            className={[
                                appStyles.button.primary,
                                "h-11 px-6",
                            ].join(" ")}
                        >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            表示
                        </Button>
                    </form>
                </AppCard>

                <section className="grid gap-4 md:grid-cols-4">
                    <SummaryCard
                        title="総勤務件数"
                        value={`${totalReportCount}件`}
                        icon={<ReceiptText className="h-5 w-5" />}
                    />

                    <SummaryCard
                        title="総就労時間"
                        value={`${totalWorkHours.toFixed(1)}h`}
                        icon={<Clock className="h-5 w-5" />}
                    />

                    <SummaryCard
                        title="総諸経費"
                        value={formatYen(totalExpenses)}
                        icon={<WalletCards className="h-5 w-5" />}
                    />

                    <SummaryCard
                        title="総支給見込み"
                        value={formatYen(totalLaborCost)}
                        icon={<UsersRound className="h-5 w-5" />}
                    />
                </section>

                <AppCard className="overflow-hidden">
                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-start gap-3">
                            <div className={appStyles.icon.circle}>
                                <UsersRound className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle
                                    className={[
                                        appStyles.text.title,
                                        "text-xl",
                                    ].join(" ")}
                                >
                                    スタッフ別集計
                                </CardTitle>
                                <p className={["mt-1", appStyles.text.muted].join(" ")}>
                                    対象月の勤務回数、休憩時間、就労時間、諸経費、支給見込みを確認します。
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-2">
                        <div className={appStyles.table.wrapper}>
                            <Table>
                                <TableHeader>
                                    <TableRow className={appStyles.table.headerRow}>
                                        <TableHead className={appStyles.table.head}>
                                            スタッフ
                                        </TableHead>

                                        <TableHead
                                            className={[
                                                appStyles.table.head,
                                                "text-right",
                                            ].join(" ")}
                                        >
                                            勤務回数
                                        </TableHead>

                                        <TableHead
                                            className={[
                                                appStyles.table.head,
                                                "text-right",
                                            ].join(" ")}
                                        >
                                            休憩時間
                                        </TableHead>

                                        <TableHead
                                            className={[
                                                appStyles.table.head,
                                                "text-right",
                                            ].join(" ")}
                                        >
                                            就労時間
                                        </TableHead>

                                        <TableHead
                                            className={[
                                                appStyles.table.head,
                                                "text-right",
                                            ].join(" ")}
                                        >
                                            諸経費
                                        </TableHead>

                                        <TableHead
                                            className={[
                                                appStyles.table.head,
                                                "text-right",
                                            ].join(" ")}
                                        >
                                            支給見込み
                                        </TableHead>

                                        <TableHead
                                            className={[
                                                appStyles.table.head,
                                                "text-right",
                                            ].join(" ")}
                                        >
                                            操作
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {monthlySummaries.map((summary) => (
                                        <TableRow
                                            key={summary.employeeId}
                                            className={appStyles.table.row}
                                        >
                                            <TableCell>
                                                <p
                                                    className={[
                                                        appStyles.text.title,
                                                        "text-base",
                                                    ].join(" ")}
                                                >
                                                    {summary.employeeName}
                                                </p>
                                            </TableCell>

                                            <TableCell
                                                className={[
                                                    "text-right",
                                                    appStyles.table.cellMuted,
                                                ].join(" ")}
                                            >
                                                {summary.totals.reportCount}回
                                            </TableCell>

                                            <TableCell
                                                className={[
                                                    "text-right",
                                                    appStyles.table.cellMuted,
                                                ].join(" ")}
                                            >
                                                {summary.totals.breakHours.toFixed(1)}h
                                            </TableCell>

                                            <TableCell
                                                className={[
                                                    "text-right",
                                                    appStyles.table.cellMuted,
                                                ].join(" ")}
                                            >
                                                {summary.totals.workingHours.toFixed(1)}h
                                            </TableCell>

                                            <TableCell
                                                className={[
                                                    "text-right",
                                                    appStyles.table.cellMuted,
                                                ].join(" ")}
                                            >
                                                {formatYen(summary.totals.expensesTotal)}
                                            </TableCell>

                                            <TableCell
                                                className={[
                                                    "text-right text-sm font-medium",
                                                    appStyles.textColor.default,
                                                ].join(" ")}
                                            >
                                                {formatYen(summary.totals.totalPay)}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <LinkButton
                                                    href={`/admin/monthly-summary/${summary.employeeId}?month=${targetMonth}`}
                                                    size="sm"
                                                    variant="outline"
                                                    className={appStyles.button.secondary}
                                                >
                                                    給与明細の表示
                                                </LinkButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {monthlySummaries.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className={appStyles.table.empty}
                                            >
                                                まだ集計対象の就労報告がありません。
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </AppCard>
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
        <AppCard className="p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className={appStyles.text.muted}>{title}</p>
                    <p
                        className={[
                            "mt-2 text-3xl font-semibold tracking-tight",
                            appStyles.textColor.default,
                        ].join(" ")}
                    >
                        {value}
                    </p>
                </div>

                <div className={appStyles.icon.smallCircle}>{icon}</div>
            </div>
        </AppCard>
    );
};

export default AdminMonthlySummaryPage;