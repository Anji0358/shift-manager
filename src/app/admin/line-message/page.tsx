import { MessageSquareText } from "lucide-react";
import { GroupJobMessageForm } from "@/features/line-message/components/GroupJobMessageForm";

const AdminLineMessagePage = () => {
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

            <GroupJobMessageForm />
        </div>
    );
};

export default AdminLineMessagePage;