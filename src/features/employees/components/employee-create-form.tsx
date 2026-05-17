"use client";

import { useActionState } from "react";
import { createEmployee } from "@/features/employees/actions";
import { SubmitButton } from "@/components/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const EmployeeCreateForm = () => {
    const [state, formAction] = useActionState(createEmployee, {
        error: undefined,
    });

    return (
        <form action={formAction} className="space-y-4">
            {state.error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {state.error}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">氏名</Label>
                    <Input id="name" name="name" placeholder="山田 太郎" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="staff@example.com"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="role">権限</Label>
                    <select
                        id="role"
                        name="role"
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                        defaultValue="STAFF"
                    >
                        <option value="STAFF">スタッフ</option>
                        <option value="ADMIN">管理者</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="hourlyWage">時給</Label>
                    <Input
                        id="hourlyWage"
                        name="hourlyWage"
                        type="number"
                        min={0}
                        defaultValue={1200}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="startedWorkingAt">勤務開始日</Label>
                    <Input
                        id="startedWorkingAt"
                        name="startedWorkingAt"
                        type="date"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">初期パスワード</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="8文字以上"
                        minLength={8}
                        required
                    />
                </div>
            </div>

            <SubmitButton pendingText="登録中...">スタッフを登録</SubmitButton>
        </form>
    );
};