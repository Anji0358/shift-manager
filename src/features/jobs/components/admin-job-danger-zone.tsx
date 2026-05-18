import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { deleteJob } from "@/features/jobs/actions";

type AdminJobDangerZoneProps = {
    jobId: string;
};

export const AdminJobDangerZone = ({ jobId }: AdminJobDangerZoneProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>危険な操作</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-slate-600">
                    この案件と、関連する勤務枠・シフト割当・就労報告を削除します。
                </p>

                <form action={deleteJob}>
                    <input type="hidden" name="jobId" value={jobId} />
                    <ConfirmSubmitButton
                        variant="destructive"
                        message="この案件と関連データを削除します。よろしいですか？"
                    >
                        案件を削除
                    </ConfirmSubmitButton>
                </form>
            </CardContent>
        </Card>
    );
};