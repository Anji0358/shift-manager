import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
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
        <BridalCard className="border-red-200 bg-red-50/60 shadow-red-900/5">
            <CardHeader className="p-5 pb-3">
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-200 bg-white text-red-700">
                        <TriangleAlert className="h-5 w-5" />
                    </div>

                    <div>
                        <CardTitle className="font-serif text-xl font-medium text-red-700">
                            危険な操作
                        </CardTitle>
                        <p className="mt-1 text-sm text-slate-600">
                            削除すると、この案件に関連するデータも削除されます。
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 p-5 pt-2 md:flex-row md:items-center md:justify-between">
                <p className="max-w-2xl text-sm leading-6 text-slate-600">
                    この案件と、関連する勤務枠・シフト割当・就労報告を削除します。
                    この操作は取り消せないため、実行前に内容を確認してください。
                </p>

                <form action={deleteJob}>
                    <input type="hidden" name="jobId" value={jobId} />

                    <ConfirmSubmitButton
                        variant="destructive"
                        className={bridalStyles.button.danger}
                        message="この案件と関連データを削除します。よろしいですか？"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        案件を削除
                    </ConfirmSubmitButton>
                </form>
            </CardContent>
        </BridalCard>
    );
};