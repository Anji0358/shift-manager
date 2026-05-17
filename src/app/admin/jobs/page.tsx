import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SuccessMessage } from "@/components/shared/success-message";
import { JobTable } from "@/features/jobs/components/job-table";
import { JobCardList } from "@/features/jobs/components/job-card-list";
import { getJobs } from "@/features/jobs/queries";
import { getCurrentYearMonth, getMonthRange } from "@/lib/month";

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
        <div className="space-y-6">
            <section className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">案件管理</h1>
                    <p className="mt-2 text-slate-600">
                        案件情報、勤務時間、集合場所、時給設定を管理します。
                    </p>
                </div>

                <div className="flex flex-wrap items-end gap-3">
                    <SuccessMessage message={message} />

                    <form className="flex items-end gap-3" action="/admin/jobs">
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

                    <Button asChild>
                        <Link href="/admin/jobs/new">案件を追加</Link>
                    </Button>
                </div>
            </section>

            <section className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">案件一覧</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        PCではテーブル、スマホではカード形式で表示します。
                    </p>
                </div>

                <div className="hidden md:block">
                    <JobTable jobs={jobs} />
                </div>

                <div className="md:hidden">
                    <JobCardList jobs={jobs} />
                </div>
            </section>
        </div>
    );
};

export default AdminJobsPage;