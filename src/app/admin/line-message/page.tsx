import { MessageSquareText } from "lucide-react";

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

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">作成するメッセージ</h2>
                    <p className="text-sm text-slate-500">
                        次のステップで「個人依頼文」と「案件グループ用メッセージ」のタブを追加します。
                    </p>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border bg-slate-50 p-4">
                        <h3 className="font-semibold">個人依頼文</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            スタッフを選択し、NG日時と重複しない案件から依頼文を作成します。
                        </p>
                    </div>

                    <div className="rounded-xl border bg-slate-50 p-4">
                        <h3 className="font-semibold">案件グループ用</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            案件ごとにスケジュール確認文・詳細連絡文を作成します。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLineMessagePage;