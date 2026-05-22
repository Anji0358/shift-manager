import { MessageSquareText } from "lucide-react";
import { GroupJobMessageForm } from "@/features/line-message/components/GroupJobMessageForm";
import { getJobsForGroupMessages } from "@/features/line-message/queries";

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

    const jobs = await getJobsForGroupMessages(selectedMonth);

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-100 p-3">
                        <MessageSquareText className="h-6 w-6 text-slate-700" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            LINEメッセージ作成
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            案件情報やスタッフ情報をもとに、LINEへコピペできる文章を作成します。
                        </p>
                    </div>
                </div>
            </div>

            <GroupJobMessageForm jobs={jobs} selectedMonth={selectedMonth} />
        </div>
    );
};

export default AdminLineMessagePage;