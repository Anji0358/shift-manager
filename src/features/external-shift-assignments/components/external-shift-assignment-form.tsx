import type { ReactNode } from "react";
import type { JobShiftSlot } from "@prisma/client";
import { createExternalShiftAssignment } from "@/features/external-shift-assignments/actions";
import { SubmitButton } from "@/components/shared/submit-button";
import { AppCard } from "@/components/shared/app-card";
import { appStyles } from "@/components/shared/design-tokens";
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
            <AppCard>
                <CardHeader className="p-5 pb-3">
                    <div className="flex items-start gap-3">
                        <div
                            className={[
                                "flex h-11 w-11 shrink-0 items-center justify-center border",
                                appStyles.radius.full,
                                appStyles.border.pending,
                                appStyles.tokens.color.background.pending,
                                appStyles.textColor.pending,
                            ].join(" ")}
                        >
                            <CircleAlert className="h-5 w-5" />
                        </div>

                        <div>
                            <CardTitle
                                className={[
                                    appStyles.text.title,
                                    "text-xl",
                                ].join(" ")}
                            >
                                外部人員を追加
                            </CardTitle>
                            <p className={["mt-1", appStyles.text.muted].join(" ")}>
                                外部人員を追加するには、先に勤務枠を作成してください。
                            </p>
                        </div>
                    </div>
                </CardHeader>
            </AppCard>
        );
    }

    return (
        <AppCard>
            <CardHeader className="p-5 pb-3">
                <div className="flex items-start gap-3">
                    <div className={appStyles.icon.circle}>
                        <UserRoundPlus className="h-5 w-5" />
                    </div>

                    <div>
                        <CardTitle
                            className={[
                                appStyles.text.title,
                                "text-xl",
                            ].join(" ")}
                        >
                            外部人員を追加
                        </CardTitle>
                        <p className={["mt-1", appStyles.text.muted].join(" ")}>
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
                                    appStyles.form.input,
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
                                className={appStyles.form.input}
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
                                className={appStyles.form.input}
                            />
                        </FormField>

                        <FormField label="メモ" htmlFor="note">
                            <Input
                                id="note"
                                name="note"
                                placeholder="例：タイミー、紹介、単発など"
                                className={appStyles.form.input}
                            />
                        </FormField>
                    </div>

                    <div
                        className={[
                            "flex justify-end border-t pt-5",
                            appStyles.border.soft,
                        ].join(" ")}
                    >
                        <SubmitButton
                            pendingText="追加中..."
                            className={[
                                appStyles.button.primary,
                                "px-6",
                            ].join(" ")}
                        >
                            <UserRoundPlus className="mr-2 h-4 w-4" />
                            外部人員を追加
                        </SubmitButton>
                    </div>
                </form>
            </CardContent>
        </AppCard>
    );
};

type FormFieldProps = {
    label: string;
    htmlFor: string;
    children: ReactNode;
};

const FormField = ({ label, htmlFor, children }: FormFieldProps) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={htmlFor} className={appStyles.form.label}>
                {label}
            </Label>
            {children}
        </div>
    );
};