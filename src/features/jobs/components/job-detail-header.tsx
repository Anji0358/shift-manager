import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
        <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-bold">{title}</h1>

                    <Badge variant={isFulfilled ? "default" : "secondary"}>
                        {isFulfilled ? "充足" : "未充足"}
                    </Badge>
                </div>

                <p className="mt-2 text-slate-600">
                    案件情報、勤務枠、候補者、参加スタッフ、就労報告、充足状況を確認します。
                </p>
            </div>

            <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                    <Link href="/admin/jobs">案件一覧へ戻る</Link>
                </Button>

                <Button asChild>
                    <Link href={`/admin/jobs/${jobId}/assignments`}>
                        シフトを確定する
                    </Link>
                </Button>
            </div>
        </section>
    );
};