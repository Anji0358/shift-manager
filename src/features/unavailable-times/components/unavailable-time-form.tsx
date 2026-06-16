"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { LinkButton } from "@/components/shared/link-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/shared/submit-button";
import { appStyles } from "@/components/shared/design-tokens";
import { createUnavailableTime } from "@/features/unavailable-times/actions";
import {
    CalendarDays,
    CalendarX2,
    CheckCircle2,
    Clock,
    Repeat,
} from "lucide-react";

type UnavailableFormType = "FULL_DAY" | "TIME_RANGE" | "WEEKLY_FIXED";

export const UnavailableTimeForm = () => {
    const [type, setType] = useState<UnavailableFormType>("FULL_DAY");

    const showDate = type === "FULL_DAY" || type === "TIME_RANGE";
    const showDayOfWeek = type === "WEEKLY_FIXED";
    const showTimeRange = type === "TIME_RANGE" || type === "WEEKLY_FIXED";

    return (
        <form action={createUnavailableTime} className="space-y-6">
            <FormSection
                title="NG日時の種類"
                description="選択した内容に合わせて、必要な入力欄だけ表示されます。"
                icon={<CalendarX2 className="h-5 w-5" />}
            >
                <FormField label="どのような予定ですか？" htmlFor="type">
                    <Select
                        name="type"
                        value={type}
                        onValueChange={(value) =>
                            setType(value as UnavailableFormType)
                        }
                    >
                        <SelectTrigger
                            id="type"
                            className={appStyles.form.input}
                        >
                            <SelectValue placeholder="NG日時の種類を選択" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="FULL_DAY">
                                この日は終日NG
                            </SelectItem>

                            <SelectItem value="TIME_RANGE">
                                この日の一部時間だけNG
                            </SelectItem>

                            <SelectItem value="WEEKLY_FIXED">
                                毎週決まった時間にNG
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </FormField>

                <div
                    className={[
                        appStyles.section.soft,
                        "text-sm leading-6",
                        appStyles.textColor.body,
                    ].join(" ")}
                >
                    {type === "FULL_DAY" && (
                        <p>
                            例：試験、帰省、私用などで、その日まるごとNGの場合に使います。
                        </p>
                    )}

                    {type === "TIME_RANGE" && (
                        <p>
                            例：13:00〜17:00は授業があるなど、その日の一部時間だけNGの場合に使います。
                        </p>
                    )}

                    {type === "WEEKLY_FIXED" && (
                        <p>
                            例：毎週月曜の9:00〜12:00は授業があるなど、毎週決まった予定がある場合に使います。
                        </p>
                    )}
                </div>
            </FormSection>

            <FormSection
                title="日時"
                description="NGになる日付・曜日・時間帯を入力します。"
                icon={
                    type === "WEEKLY_FIXED" ? (
                        <Repeat className="h-5 w-5" />
                    ) : (
                        <CalendarDays className="h-5 w-5" />
                    )
                }
            >
                <div className="grid gap-4 md:grid-cols-2">
                    {showDate && (
                        <FormField label="日付" htmlFor="date">
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                required
                                className={appStyles.form.input}
                            />
                        </FormField>
                    )}

                    {showDayOfWeek && (
                        <FormField label="曜日" htmlFor="dayOfWeek">
                            <Select name="dayOfWeek" defaultValue="MONDAY">
                                <SelectTrigger
                                    id="dayOfWeek"
                                    className={appStyles.form.input}
                                >
                                    <SelectValue placeholder="曜日を選択" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="MONDAY">月曜日</SelectItem>
                                    <SelectItem value="TUESDAY">火曜日</SelectItem>
                                    <SelectItem value="WEDNESDAY">水曜日</SelectItem>
                                    <SelectItem value="THURSDAY">木曜日</SelectItem>
                                    <SelectItem value="FRIDAY">金曜日</SelectItem>
                                    <SelectItem value="SATURDAY">土曜日</SelectItem>
                                    <SelectItem value="SUNDAY">日曜日</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                    )}

                    {showTimeRange && (
                        <>
                            <FormField label="開始時間" htmlFor="startTime">
                                <Input
                                    id="startTime"
                                    name="startTime"
                                    type="time"
                                    required
                                    className={appStyles.form.input}
                                />
                            </FormField>

                            <FormField label="終了時間" htmlFor="endTime">
                                <Input
                                    id="endTime"
                                    name="endTime"
                                    type="time"
                                    required
                                    className={appStyles.form.input}
                                />
                            </FormField>
                        </>
                    )}
                </div>
            </FormSection>

            <FormSection
                title="理由・メモ"
                description="管理者が割り振り時に確認しやすいように、必要に応じて理由を書きます。"
                icon={<Clock className="h-5 w-5" />}
            >
                <FormField label="理由・メモ" htmlFor="reason">
                    <Textarea
                        id="reason"
                        name="reason"
                        placeholder="例：大学の授業、試験、帰省、別予定など"
                        className={appStyles.form.textarea}
                    />
                </FormField>
            </FormSection>

            <div
                className={[
                    "flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end",
                    appStyles.border.soft,
                ].join(" ")}
            >
                <LinkButton
                    href="/staff/unavailable-times"
                    variant="outline"
                    className={appStyles.button.secondary}
                >
                    キャンセル
                </LinkButton>

                <SubmitButton
                    pendingText="登録中..."
                    className={[appStyles.button.primary, "px-6"].join(" ")}
                >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    NG日時を登録
                </SubmitButton>
            </div>
        </form>
    );
};

type FormSectionProps = {
    title: string;
    description: string;
    icon: ReactNode;
    children: ReactNode;
};

const FormSection = ({
    title,
    description,
    icon,
    children,
}: FormSectionProps) => {
    return (
        <section className={["space-y-4", appStyles.section.base].join(" ")}>
            <div className="flex items-start gap-3">
                <div className={appStyles.icon.smallCircle}>{icon}</div>

                <div>
                    <h2
                        className={[
                            appStyles.text.title,
                            "text-lg",
                        ].join(" ")}
                    >
                        {title}
                    </h2>
                    <p className={["mt-1", appStyles.text.muted].join(" ")}>
                        {description}
                    </p>
                </div>
            </div>

            <div className="space-y-4">{children}</div>
        </section>
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