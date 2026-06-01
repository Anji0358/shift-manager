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
import { BridalCard } from "@/components/shared/bridal-card";
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
                        className="rounded-xl bg-[#b8872d] px-5 text-white shadow-md shadow-yellow-900/10 hover:bg-[#a77925] hover:text-white"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        案件を追加
                    </LinkButton>
                }
            />

            <div className="space-y-6">
                {message ? (
                    <div className="rounded-2xl border border-[#eadcc1] bg-white/82 px-5 py-4 shadow-md shadow-yellow-900/5 backdrop-blur">
                        <SuccessMessage message={message} />
                    </div>
                ) : null}

                <BridalCard>
                    <div className="flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ead9b5] bg-[#fffaf0] text-[#b8872d]">
                                <CalendarDays className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="font-serif text-xl font-medium text-slate-900">
                                    表示月の選択
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
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
                                    className="text-sm font-medium text-slate-700"
                                >
                                    対象月
                                </label>
                                <Input
                                    id="month"
                                    name="month"
                                    type="month"
                                    defaultValue={targetMonth}
                                    className="h-11 rounded-xl border-[#eadcc1] bg-white/90 shadow-sm focus-visible:ring-[#b8872d]"
                                />
                            </div>

                            <SubmitButton
                                pendingText="表示中..."
                                className="h-11 rounded-xl bg-slate-900 px-5 text-white shadow-md shadow-slate-900/10 hover:bg-slate-700 hover:text-white"
                            >
                                表示
                            </SubmitButton>
                        </form>
                    </div>
                </BridalCard>

                <section className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ead9b5] bg-[#fffaf0] text-[#b8872d]">
                            <ClipboardList className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="font-serif text-2xl font-medium tracking-tight text-slate-900">
                                案件一覧
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                PCではテーブル、スマホではカード形式で表示します。
                            </p>
                        </div>
                    </div>

                    <BridalCard className="overflow-hidden">
                        <div className="hidden md:block">
                            <JobTable jobs={jobs} />
                        </div>

                        <div className="md:hidden">
                            <JobCardList jobs={jobs} />
                        </div>
                    </BridalCard>
                </section>
            </div>
        </PageShell>
    );
};

export default AdminJobsPage;