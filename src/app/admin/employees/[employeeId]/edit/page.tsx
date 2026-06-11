import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LinkButton } from "@/components/shared/link-button";
import { SubmitButton } from "@/components/shared/submit-button";
import { SuccessMessage } from "@/components/shared/success-message";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
import { updateEmployee } from "@/features/employees/actions";
import { getEmployeeById } from "@/features/employees/queries";
import {
    ArrowLeft,
    CircleAlert,
    Save,
    UserPen,
} from "lucide-react";

type AdminEmployeeEditPageProps = {
    params: Promise<{
        employeeId: string;
    }>;
    searchParams: Promise<{
        message?: string;
    }>;
};

const formatMonthInputValue = (date: Date) => {
    return date.toISOString().slice(0, 7);
};

const AdminEmployeeEditPage = async ({
    params,
    searchParams,
}: AdminEmployeeEditPageProps) => {
    const { employeeId } = await params;
    const { message } = await searchParams;

    const employee = await getEmployeeById(employeeId);

    if (!employee) {
        notFound();
    }

    return (
        <PageShell>
            <PageHeader
                title="スタッフ情報編集"
                description={`「${employee.name}」の基本情報とログイン情報を編集します。`}
                action={
                    <LinkButton
                        href="/admin/employees"
                        variant="outline"
                        pendingText="スタッフ一覧へ移動中..."
                        className={bridalStyles.button.secondary}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        スタッフ一覧へ戻る
                    </LinkButton>
                }
            />

            <div className="space-y-6">
                {message ? (
                    <div className={[bridalStyles.card.base, "px-5 py-4"].join(" ")}>
                        <SuccessMessage message={message} />
                    </div>
                ) : null}

                <BridalCard>
                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-start gap-3">
                            <div className={bridalStyles.icon.circle}>
                                <UserPen className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle
                                    className={[
                                        bridalStyles.text.title,
                                        "text-xl",
                                    ].join(" ")}
                                >
                                    基本情報
                                </CardTitle>
                                <p className="mt-1 text-sm text-slate-500">
                                    スタッフの表示情報、権限、在籍状況、ログイン用パスワードを管理します。
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-2">
                        <form action={updateEmployee} className="space-y-6">
                            <input
                                type="hidden"
                                name="employeeId"
                                value={employee.id}
                            />

                            <section className="rounded-2xl border border-[#f0e5d0] bg-white/70 p-5">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField label="名前" htmlFor="name">
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={employee.name}
                                            required
                                            className={bridalStyles.form.input}
                                        />
                                    </FormField>

                                    <FormField label="メールアドレス" htmlFor="email">
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            defaultValue={employee.email}
                                            required
                                            className={bridalStyles.form.input}
                                        />
                                    </FormField>

                                    <FormField label="権限" htmlFor="role">
                                        <Select
                                            name="role"
                                            defaultValue={employee.role}
                                        >
                                            <SelectTrigger
                                                id="role"
                                                className={bridalStyles.form.input}
                                            >
                                                <SelectValue placeholder="権限を選択" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ADMIN">
                                                    管理者
                                                </SelectItem>
                                                <SelectItem value="STAFF">
                                                    スタッフ
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>

                                    <FormField
                                        label="在籍状況"
                                        htmlFor="employmentStatus"
                                    >
                                        <Select
                                            name="employmentStatus"
                                            defaultValue={employee.employmentStatus}
                                        >
                                            <SelectTrigger
                                                id="employmentStatus"
                                                className={bridalStyles.form.input}
                                            >
                                                <SelectValue placeholder="在籍状況を選択" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE">
                                                    在籍中
                                                </SelectItem>
                                                <SelectItem value="INACTIVE">
                                                    退職済み
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>

                                    <FormField label="時給" htmlFor="hourlyWage">
                                        <Input
                                            id="hourlyWage"
                                            name="hourlyWage"
                                            type="number"
                                            min={0}
                                            step={1}
                                            defaultValue={employee.hourlyWage}
                                            required
                                            className={bridalStyles.form.input}
                                        />
                                    </FormField>

                                    <FormField
                                        label="勤め始めた年月"
                                        htmlFor="startedWorkingAt"
                                    >
                                        <Input
                                            id="startedWorkingAt"
                                            name="startedWorkingAt"
                                            type="month"
                                            defaultValue={formatMonthInputValue(
                                                employee.startedWorkingAt,
                                            )}
                                            required
                                            className={bridalStyles.form.input}
                                        />
                                    </FormField>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label
                                            htmlFor="newPassword"
                                            className={bridalStyles.form.label}
                                        >
                                            新しいパスワード
                                        </Label>
                                        <Input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            placeholder="変更する場合のみ入力"
                                            className={bridalStyles.form.input}
                                        />

                                        <div className="flex items-start gap-2 rounded-2xl border border-[#f0e5d0] bg-[#fffdf8]/80 p-4 text-sm text-slate-600">
                                            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#b8872d]" />
                                            <p>
                                                空欄の場合、現在のパスワードは変更されません。
                                                入力した場合は、このパスワードでスタッフがログインできるようになります。
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="flex flex-col-reverse gap-3 border-t border-[#f0e5d0] pt-5 sm:flex-row sm:justify-end">
                                <LinkButton
                                    href="/admin/employees"
                                    variant="outline"
                                    pendingText="スタッフ一覧へ移動中..."
                                    className={bridalStyles.button.secondary}
                                >
                                    キャンセル
                                </LinkButton>

                                <SubmitButton
                                    pendingText="保存中..."
                                    className={[
                                        bridalStyles.button.primary,
                                        "px-6",
                                    ].join(" ")}
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    保存する
                                </SubmitButton>
                            </div>
                        </form>
                    </CardContent>
                </BridalCard>
            </div>
        </PageShell>
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

export default AdminEmployeeEditPage;