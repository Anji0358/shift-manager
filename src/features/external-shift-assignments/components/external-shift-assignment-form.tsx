import type { JobShiftSlot } from "@prisma/client";
import { createExternalShiftAssignment } from "@/features/external-shift-assignments/actions";
import { SubmitButton } from "@/components/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type ExternalShiftAssignmentFormProps = {
    jobId: string;
    shiftSlots: JobShiftSlot[];
};

export const ExternalShiftAssignmentForm = ({
    jobId,
    shiftSlots,
}: ExternalShiftAssignmentFormProps) => {
    if (shiftSlots.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>外部人員を追加</CardTitle>
                </CardHeader>

                <CardContent>
                    <p className="text-sm text-slate-500">
                        外部人員を追加するには、先に勤務枠を作成してください。
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>外部人員を追加</CardTitle>
            </CardHeader>

            <CardContent>
                <form action={createExternalShiftAssignment} className="space-y-4">
                    <input type="hidden" name="jobId" value={jobId} />

                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                            <Label htmlFor="slotId">勤務枠</Label>
                            <select
                                id="slotId"
                                name="slotId"
                                required
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                            >
                                {shiftSlots.map((slot) => (
                                    <option key={slot.id} value={slot.id}>
                                        {slot.name}（{slot.startTime}〜{slot.endTime}）
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">名前・枠名</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="例：山田 太郎 / タイミー枠"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="headCount">人数</Label>
                            <Input
                                id="headCount"
                                name="headCount"
                                type="number"
                                min={1}
                                step={1}
                                defaultValue={1}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="note">メモ</Label>
                            <Input
                                id="note"
                                name="note"
                                placeholder="例：タイミー、紹介、単発など"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <SubmitButton pendingText="追加中...">
                            外部人員を追加
                        </SubmitButton>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};