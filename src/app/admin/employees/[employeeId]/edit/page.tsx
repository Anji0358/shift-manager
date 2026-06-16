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
import { AppCard } from "@/components/shared/app-card";
import { appStyles } from "@/components/shared/design-tokens";
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
                        className={appStyles.button.secondary}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        スタッフ一覧へ戻る
                    </LinkButton>
                }
            />

            <div className="space-y-6">
                {message ? (
                    <div className={appStyles.section.message}>
                        <SuccessMessage message={message} />
                    </div>
                ) : null}

                <AppCard>
                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-start gap-3">
                            <div className={appStyles.icon.circle}>
                                <UserPen className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle
                                    className={[
                                        appStyles.text.title,
                                        "text-xl",
                                    ].join(" ")}
                                >
                                    基本情報
                                </CardTitle>
                                <p className={["mt-1", appStyles.text.muted].join(" ")}>
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

                            <section className={appStyles.section.base}>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField label="名前" htmlFor="name">
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={employee.name}
                                            required
                                            className={appStyles.form.input}
                                        />
                                    </FormField>

                                    <FormField label="メールアドレス" htmlFor="email">
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            defaultValue={employee.email}
                                            required
                                            className={appStyles.form.input}
                                        />
                                    </FormField>

                                    <FormField label="権限" htmlFor="role">
                                        <Select
                                            name="role"
                                            defaultValue={employee.role}
                                        >
                                            <SelectTrigger
                                                id="role"
                                                className={appStyles.form.input}
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
                                                className={appStyles.form.input}
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
                                            className={appStyles.form.input}
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
                                            className={appStyles.form.input}
                                        />
                                    </FormField>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label
                                            htmlFor="newPassword"
                                            className={appStyles.form.label}
                                        >
                                            新しいパスワード
                                        </Label>

                                        <Input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            placeholder="変更する場合のみ入力"
                                            className={appStyles.form.input}
                                        />

                                        <div
                                            className={[
                                                "flex items-start gap-2 border p-4 text-sm",
                                                appStyles.radius["2xl"],
                                                appStyles.border.soft,
                                                appStyles.background.warmSoft,
                                                appStyles.textColor.body,
                                            ].join(" ")}
                                        >
                                            <CircleAlert
                                                className={[
                                                    "mt-0.5 h-4 w-4 shrink-0",
                                                    appStyles.icon.accent,
                                                ].join(" ")}
                                            />
                                            <p>
                                                空欄の場合、現在のパスワードは変更されません。
                                                入力した場合は、このパスワードでスタッフがログインできるようになります。
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div
                                className={[
                                    "flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end",
                                    appStyles.border.soft,
                                ].join(" ")}
                            >
                                <LinkButton
                                    href="/admin/employees"
                                    variant="outline"
                                    pendingText="スタッフ一覧へ移動中..."
                                    className={appStyles.button.secondary}
                                >
                                    キャンセル
                                </LinkButton>

                                <SubmitButton
                                    pendingText="保存中..."
                                    className={[
                                        appStyles.button.primary,
                                        "px-6",
                                    ].join(" ")}
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    保存する
                                </SubmitButton>
                            </div>
                        </form>
                    </CardContent>
                </AppCard>
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
            <Label htmlFor={htmlFor} className={appStyles.form.label}>
                {label}
            </Label>
            {children}
        </div>
    );
};

export default AdminEmployeeEditPage;