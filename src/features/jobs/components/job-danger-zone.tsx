import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { AppCard } from "@/components/shared/bridal-card";
import { appStyles } from "@/components/shared/design-tokens";
import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { deleteJob } from "@/features/jobs/actions";
import { TriangleAlert, Trash2 } from "lucide-react";

type JobDangerZoneProps = {
    jobId: string;
};

export const JobDangerZone = ({ jobId }: JobDangerZoneProps) => {
    return (
        <AppCard
            className={[
                appStyles.border.danger,
                appStyles.tokens.color.background.danger,
            ].join(" ")}
        >
            <CardHeader className="p-5 pb-3">
                <div className="flex items-start gap-3">
                    <div
                        className={[
                            "flex h-11 w-11 shrink-0 items-center justify-center border",
                            appStyles.radius.full,
                            appStyles.border.danger,
                            appStyles.background.white,
                            appStyles.textColor.danger,
                        ].join(" ")}
                    >
                        <TriangleAlert className="h-5 w-5" />
                    </div>

                    <div>
                        <CardTitle
                            className={[
                                appStyles.text.title,
                                "text-xl",
                                appStyles.textColor.danger,
                            ].join(" ")}
                        >
                            危険な操作
                        </CardTitle>
                        <p className={["mt-1", appStyles.text.body].join(" ")}>
                            削除すると、この案件に関連するデータも削除されます。
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 p-5 pt-2 md:flex-row md:items-center md:justify-between">
                <p className={["max-w-2xl", appStyles.text.body].join(" ")}>
                    この案件と、関連する勤務枠・シフト割当・就労報告を削除します。
                    この操作は取り消せないため、実行前に内容を確認してください。
                </p>

                <form action={deleteJob}>
                    <input type="hidden" name="jobId" value={jobId} />

                    <ConfirmSubmitButton
                        variant="destructive"
                        className={appStyles.button.danger}
                        message="この案件と関連データを削除します。よろしいですか？"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        案件を削除
                    </ConfirmSubmitButton>
                </form>
            </CardContent>
        </AppCard>
    );
};