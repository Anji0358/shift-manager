import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { AppCard } from "@/components/shared/bridal-card";
import { appStyles } from "@/components/shared/design-tokens";
import { getWorkReportsByMonth } from "@/features/work-reports/queries";
import { buildMonthlyReportSummaries } from "@/features/monthly-reports/services";
import { MonthlyReportDetailTable } from "@/features/monthly-reports/components/monthly-report-detail-table";
import { formatYen } from "@/lib/format";
import { getCurrentYearMonth, getMonthRange } from "@/lib/month";
import {
    ArrowLeft,
    Clock,
    Download,
    ReceiptText,
    WalletCards,
    CalendarCheck,
} from "lucide-react";

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
        <PageShell>
            <PageHeader
                title="給与明細"
                description={`${summary.employeeName}さんの${targetMonth}の勤務実績・諸経費・支給見込みを確認します。`}
                action={
                    <div className="flex flex-wrap gap-3">
                        <LinkButton
                            href={`/admin/monthly-summary?month=${targetMonth}`}
                            variant="outline"
                            pendingText="月次集計へ移動中..."
                            className={appStyles.button.secondary}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            月次集計へ戻る
                        </LinkButton>

                        <LinkButton
                            href={`/admin/monthly-summary/${employeeId}/export?month=${targetMonth}`}
                            pendingText="Excel出力中..."
                            className={appStyles.button.primary}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            給与明細をExcel出力
                        </LinkButton>
                    </div>
                }
            />

            <div className="space-y-6">
                <section className="grid gap-4 md:grid-cols-4">
                    <SummaryCard
                        title="勤務回数"
                        value={`${summary.totals.reportCount}回`}
                        icon={<ReceiptText className="h-5 w-5" />}
                    />

                    <SummaryCard
                        title="就労時間"
                        value={`${summary.totals.workingHours.toFixed(1)}h`}
                        icon={<Clock className="h-5 w-5" />}
                    />

                    <SummaryCard
                        title="諸経費"
                        value={formatYen(summary.totals.expensesTotal)}
                        icon={<WalletCards className="h-5 w-5" />}
                    />

                    <SummaryCard
                        title="支給見込み"
                        value={formatYen(summary.totals.totalPay)}
                        icon={<CalendarCheck className="h-5 w-5" />}
                    />
                </section>

                <AppCard className="overflow-hidden">
                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-start gap-3">
                            <div className={appStyles.icon.circle}>
                                <ReceiptText className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle
                                    className={[
                                        appStyles.text.title,
                                        "text-xl",
                                    ].join(" ")}
                                >
                                    日別給与明細
                                </CardTitle>
                                <p className={["mt-1", appStyles.text.muted].join(" ")}>
                                    日ごとの勤務時間、経費、給与見込みを確認します。
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-2">
                        <MonthlyReportDetailTable summaries={[summary]} />
                    </CardContent>
                </AppCard>
            </div>
        </PageShell>
    );
};

type SummaryCardProps = {
    title: string;
    value: string;
    icon: ReactNode;
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

export default AdminEmployeeMonthlySummaryPage;