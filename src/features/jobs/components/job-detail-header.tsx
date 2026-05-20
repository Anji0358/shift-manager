import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/shared/link-button";

type JobDetailHeaderProps = {
    jobId: string;
    title: string;
    isFulfilled: boolean;
};

export const JobDetailHeader = ({
    jobId,
    title,
    isFulfilled,
}: JobDetailHeaderProps) => {
    return (
        <section className="flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        {title}
                    </h1>

                    <Badge variant={isFulfilled ? "default" : "secondary"}>
                        {isFulfilled ? "充足済み" : "未充足"}
                    </Badge>
                </div>

                <p className="max-w-2xl text-sm leading-6 text-slate-600">
                    案件情報、勤務枠、候補者、参加スタッフ、就労報告、充足状況を確認できます。
                    スタッフの割り振りは「シフトを確定する」から行います。
                </p>
            </div>

            <div className="flex flex-wrap gap-3 md:justify-end">
                <LinkButton href="/admin/jobs" variant="outline">
                    案件一覧へ戻る
                </LinkButton>

                <LinkButton href={`/admin/jobs/${jobId}/slots/new`} variant="outline">
                    勤務枠を追加
                </LinkButton>

                <LinkButton href={`/admin/jobs/${jobId}/assignments`}>
                    シフトを確定する
                </LinkButton>
            </div>
        </section>
    );
};