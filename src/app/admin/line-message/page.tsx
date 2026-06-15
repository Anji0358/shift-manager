import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { LineMessageTabs } from "@/features/line-message/components/LineMessageTabs";
import {
    getEmployeesForPersonalMessages,
    getJobsForGroupMessages,
    getJobsForPersonalMessages,
    getUnavailableTimesForPersonalMessages,
} from "@/features/line-message/queries";

type AdminLineMessagePageProps = {
    searchParams: Promise<{
        month?: string;
    }>;
};

const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;
};

const AdminLineMessagePage = async ({
    searchParams,
}: AdminLineMessagePageProps) => {
    const params = await searchParams;
    const selectedMonth = params.month ?? getCurrentMonth();

    const [jobs, employees, personalJobs, unavailableTimes] = await Promise.all([
        getJobsForGroupMessages(selectedMonth),
        getEmployeesForPersonalMessages(),
        getJobsForPersonalMessages(selectedMonth),
        getUnavailableTimesForPersonalMessages(selectedMonth),
    ]);

    return (
        <PageShell>
            <PageHeader
                title="LINEメッセージ作成"
                description="案件情報やスタッフ情報をもとに、LINEへコピペできる文章を作成します。"
            />

            <LineMessageTabs
                jobs={jobs}
                employees={employees}
                personalJobs={personalJobs}
                unavailableTimes={unavailableTimes}
                selectedMonth={selectedMonth}
            />
        </PageShell>
    );
};

export default AdminLineMessagePage;