"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import { createEmployee } from "@/features/employees/actions";
import { SubmitButton } from "@/components/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bridalStyles } from "@/components/shared/design-tokens";
import {
    CircleAlert,
    UserPlus,
} from "lucide-react";

export const EmployeeCreateForm = () => {
    const [state, formAction] = useActionState(createEmployee, {
        error: undefined,
    });

    return (
        <form action={formAction} className="space-y-5">
            {state.error && (
                <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{state.error}</p>
                </div>
            )}

            <section className="rounded-2xl border border-[#f0e5d0] bg-white/70 p-5">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField label="氏名" htmlFor="name">
                        <Input
                            id="name"
                            name="name"
                            placeholder="山田 太郎"
                            required
                            className={bridalStyles.form.input}
                        />
                    </FormField>

                    <FormField label="メールアドレス" htmlFor="email">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="staff@example.com"
                            required
                            className={bridalStyles.form.input}
                        />
                    </FormField>

                    <FormField label="権限" htmlFor="role">
                        <select
                            id="role"
                            name="role"
                            className={[
                                bridalStyles.form.input,
                                "h-11 w-full px-3 text-sm",
                            ].join(" ")}
                            defaultValue="STAFF"
                        >
                            <option value="STAFF">スタッフ</option>
                            <option value="ADMIN">管理者</option>
                        </select>
                    </FormField>

                    <FormField label="時給" htmlFor="hourlyWage">
                        <Input
                            id="hourlyWage"
                            name="hourlyWage"
                            type="number"
                            min={0}
                            defaultValue={1200}
                            required
                            className={bridalStyles.form.input}
                        />
                    </FormField>

                    <FormField label="勤務開始日" htmlFor="startedWorkingAt">
                        <Input
                            id="startedWorkingAt"
                            name="startedWorkingAt"
                            type="date"
                            required
                            className={bridalStyles.form.input}
                        />
                    </FormField>

                    <FormField label="初期パスワード" htmlFor="password">
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="8文字以上"
                            minLength={8}
                            required
                            className={bridalStyles.form.input}
                        />
                    </FormField>
                </div>
            </section>

            <div className="flex justify-end border-t border-[#f0e5d0] pt-5">
                <SubmitButton
                    pendingText="登録中..."
                    className={[
                        bridalStyles.button.primary,
                        "px-6",
                    ].join(" ")}
                >
                    <UserPlus className="mr-2 h-4 w-4" />
                    スタッフを登録
                </SubmitButton>
            </div>
        </form>
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
            <Label htmlFor={htmlFor} className={bridalStyles.form.label}>
                {label}
            </Label>
            {children}
        </div>
    );
};