import { Input } from "@/components/ui/input";
import { SuccessMessage } from "@/components/shared/success-message";
import { LinkButton } from "@/components/shared/link-button";
import { SubmitButton } from "@/components/shared/submit-button";
import { JobTable } from "@/features/jobs/components/job-table";
import { JobCardList } from "@/features/jobs/components/job-card-list";
import { getJobs } from "@/features/jobs/queries";
import { getCurrentYearMonth, getMonthRange } from "@/lib/month";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { AppCard } from "@/components/shared/bridal-card";
import { appStyles } from "@/components/shared/design-tokens";
import { CalendarDays, ClipboardList, Plus } from "lucide-react";

type AdminJobsPageProps = {
    searchParams: Promise<{
        month?: string;
        message?: string;
    }>;
};

const AdminJobsPage = async ({ searchParams }: AdminJobsPageProps) => {
    const { month, message } = await searchParams;
    const targetMonth = month ?? getCurrentYearMonth();
    const { startDate, endDate } = getMonthRange(targetMonth);

    const jobs = await getJobs(startDate, endDate);

    return (
        <PageShell>
            <PageHeader
                title="案件管理"
                description="案件情報、勤務枠、集合場所、時給設定を管理します。"
                action={
                    <LinkButton
                        href="/admin/jobs/new"
                        className={[appStyles.button.primary, "px-5"].join(" ")}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        案件を追加
                    </LinkButton>
                }
            />

            <div className="space-y-6">
                {message ? (
                    <div className={appStyles.section.message}>
                        <SuccessMessage message={message} />
                    </div>
                ) : null}

                <AppCard>
                    <div className="flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between">
                        <div className="flex items-start gap-3">
                            <div className={appStyles.icon.circle}>
                                <CalendarDays className="h-5 w-5" />
                            </div>

                            <div>
                                <h2
                                    className={[
                                        appStyles.text.title,
                                        "text-xl",
                                    ].join(" ")}
                                >
                                    表示月の選択
                                </h2>
                                <p className={["mt-1", appStyles.text.muted].join(" ")}>
                                    対象月を選ぶと、その月に登録されている案件を表示します。
                                </p>
                            </div>
                        </div>

                        <form
                            className="flex flex-col gap-3 sm:flex-row sm:items-end"
                            action="/admin/jobs"
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
                                    className={[
                                        appStyles.form.input,
                                        "h-11",
                                    ].join(" ")}
                                />
                            </div>

                            <SubmitButton
                                pendingText="表示中..."
                                className={[
                                    appStyles.button.dark,
                                    "h-11 px-5",
                                ].join(" ")}
                            >
                                表示
                            </SubmitButton>
                        </form>
                    </div>
                </AppCard>

                <section className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className={appStyles.icon.smallCircle}>
                            <ClipboardList className="h-5 w-5" />
                        </div>

                        <div>
                            <h2
                                className={[
                                    appStyles.text.title,
                                    "text-2xl tracking-tight",
                                ].join(" ")}
                            >
                                案件一覧
                            </h2>
                            <p className={["mt-1", appStyles.text.muted].join(" ")}>
                                PCではテーブル、スマホではカード形式で表示します。
                            </p>
                        </div>
                    </div>

                    <AppCard className="overflow-hidden">
                        <div className="hidden md:block">
                            <JobTable jobs={jobs} />
                        </div>

                        <div className="md:hidden">
                            <JobCardList jobs={jobs} />
                        </div>
                    </AppCard>
                </section>
            </div>
        </PageShell>
    );
};

export default AdminJobsPage;