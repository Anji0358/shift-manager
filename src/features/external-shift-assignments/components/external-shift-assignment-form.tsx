import type { JobShiftSlot } from "@prisma/client";
import { createExternalShiftAssignment } from "@/features/external-shift-assignments/actions";
import { SubmitButton } from "@/components/shared/submit-button";
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    CircleAlert,
    UserRoundPlus,
} from "lucide-react";

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
            <BridalCard>
                <CardHeader className="p-5 pb-3">
                    <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-700">
                            <CircleAlert className="h-5 w-5" />
                        </div>

                        <div>
                            <CardTitle
                                className={[
                                    bridalStyles.text.title,
                                    "text-xl",
                                ].join(" ")}
                            >
                                外部人員を追加
                            </CardTitle>
                            <p className="mt-1 text-sm text-slate-500">
                                外部人員を追加するには、先に勤務枠を作成してください。
                            </p>
                        </div>
                    </div>
                </CardHeader>
            </BridalCard>
        );
    }

    return (
        <BridalCard>
            <CardHeader className="p-5 pb-3">
                <div className="flex items-start gap-3">
                    <div className={bridalStyles.icon.circle}>
                        <UserRoundPlus className="h-5 w-5" />
                    </div>

                    <div>
                        <CardTitle
                            className={[
                                bridalStyles.text.title,
                                "text-xl",
                            ].join(" ")}
                        >
                            外部人員を追加
                        </CardTitle>
                        <p className="mt-1 text-sm text-slate-500">
                            登録スタッフ以外の人員や外部サービス枠を追加します。
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-2">
                <form action={createExternalShiftAssignment} className="space-y-5">
                    <input type="hidden" name="jobId" value={jobId} />

                    <div className="grid gap-4 md:grid-cols-4">
                        <FormField label="勤務枠" htmlFor="slotId">
                            <select
                                id="slotId"
                                name="slotId"
                                required
                                className={[
                                    bridalStyles.form.input,
                                    "h-11 w-full px-3 text-sm",
                                ].join(" ")}
                            >
                                {shiftSlots.map((slot) => (
                                    <option key={slot.id} value={slot.id}>
                                        {slot.name}（{slot.startTime}〜{slot.endTime}）
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        <FormField label="名前・枠名" htmlFor="name">
                            <Input
                                id="name"
                                name="name"
                                placeholder="例：山田 太郎 / タイミー枠"
                                required
                                className={bridalStyles.form.input}
                            />
                        </FormField>

                        <FormField label="人数" htmlFor="headCount">
                            <Input
                                id="headCount"
                                name="headCount"
                                type="number"
                                min={1}
                                step={1}
                                defaultValue={1}
                                required
                                className={bridalStyles.form.input}
                            />
                        </FormField>

                        <FormField label="メモ" htmlFor="note">
                            <Input
                                id="note"
                                name="note"
                                placeholder="例：タイミー、紹介、単発など"
                                className={bridalStyles.form.input}
                            />
                        </FormField>
                    </div>

                    <div className="flex justify-end border-t border-[#f0e5d0] pt-5">
                        <SubmitButton
                            pendingText="追加中..."
                            className={[
                                bridalStyles.button.primary,
                                "px-6",
                            ].join(" ")}
                        >
                            <UserRoundPlus className="mr-2 h-4 w-4" />
                            外部人員を追加
                        </SubmitButton>
                    </div>
                </form>
            </CardContent>
        </BridalCard>
    );
};

type FormFieldProps = {
    label: string;
    htmlFor: string;
    children: React.ReactNode;
};

const FormField = ({ label, htmlFor, children }: FormFieldProps) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={htmlFor} className={bridalStyles.form.label}>
                {label}
            </Label>
            {children}
        </div>
    );
};