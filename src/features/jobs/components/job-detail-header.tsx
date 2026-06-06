import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/shared/link-button";
import { bridalStyles } from "@/components/shared/design-tokens";
import { ArrowLeft, CalendarPlus, CheckCircle2 } from "lucide-react";

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
        <section className={bridalStyles.header.wrapper}>
            <div>
                <p className={bridalStyles.header.label}>Job Detail</p>

                <div className="flex flex-wrap items-center gap-3">
                    <h1 className={bridalStyles.header.title}>{title}</h1>

                    <Badge
                        className={
                            isFulfilled
                                ? bridalStyles.badge.fulfilled
                                : bridalStyles.badge.pending
                        }
                    >
                        {isFulfilled ? "充足済み" : "未充足"}
                    </Badge>
                </div>

                <p className={bridalStyles.header.description}>
                    案件情報、勤務枠、候補者、参加スタッフ、就労報告、充足状況を確認できます。
                    スタッフの割り振りは「シフトを確定する」から行います。
                </p>
            </div>

            <div className="flex flex-wrap gap-3 md:justify-end">
                <LinkButton
                    href="/admin/jobs"
                    variant="outline"
                    className={bridalStyles.button.secondary}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    案件一覧へ戻る
                </LinkButton>

                <LinkButton
                    href={`/admin/jobs/${jobId}/slots/new`}
                    variant="outline"
                    className={bridalStyles.button.secondary}
                >
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    勤務枠を追加
                </LinkButton>

                <LinkButton
                    href={`/admin/jobs/${jobId}/assignments`}
                    className={bridalStyles.button.primary}
                >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    シフトを確定する
                </LinkButton>
            </div>
        </section>
    );
};