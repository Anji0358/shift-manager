import type { ReactNode } from "react";
import { createJobTemplate } from "@/features/job-templates/actions";
import { SubmitButton } from "@/components/shared/submit-button";
import { LinkButton } from "@/components/shared/link-button";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
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
    ArrowLeft,
    Banknote,
    BriefcaseBusiness,
    CheckCircle2,
    Clock,
    ClipboardList,
    Shirt,
} from "lucide-react";

const NewJobTemplatePage = () => {
    return (
        <PageShell>
            <PageHeader
                title="テンプレート作成"
                description="よく使う案件情報と勤務枠をテンプレートとして登録します。"
                action={
                    <LinkButton
                        href="/admin/job-templates"
                        variant="outline"
                        className={bridalStyles.button.secondary}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        一覧へ戻る
                    </LinkButton>
                }
            />

            <BridalCard>
                <CardHeader className="p-5 pb-3">
                    <div className="flex items-start gap-3">
                        <div className={bridalStyles.icon.circle}>
                            <ClipboardList className="h-5 w-5" />
                        </div>

                        <div>
                            <CardTitle
                                className={[
                                    bridalStyles.text.title,
                                    "text-xl",
                                ].join(" ")}
                            >
                                テンプレート情報
                            </CardTitle>
                            <p className="mt-1 text-sm text-slate-500">
                                案件作成時に再利用できる基本情報、勤務枠、勤務条件を登録します。
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-5 pt-2">
                    <form action={createJobTemplate} className="space-y-8">
                        <FormSection
                            title="基本情報"
                            description="テンプレート名、案件名、勤務場所、集合場所を登録します。"
                            icon={<BriefcaseBusiness className="h-5 w-5" />}
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="テンプレート名" htmlFor="name">
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="例：ホテル宴会テンプレート"
                                        required
                                        className={bridalStyles.form.input}
                                    />
                                </FormField>

                                <FormField label="案件名" htmlFor="title">
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="例：ホテル宴会スタッフ"
                                        required
                                        className={bridalStyles.form.input}
                                    />
                                </FormField>

                                <FormField label="勤務場所" htmlFor="location">
                                    <Input
                                        id="location"
                                        name="location"
                                        placeholder="例：横浜ベイホテル"
                                        required
                                        className={bridalStyles.form.input}
                                    />
                                </FormField>

                                <FormField label="集合場所" htmlFor="meetingPlace">
                                    <Input
                                        id="meetingPlace"
                                        name="meetingPlace"
                                        placeholder="例：ホテル1階ロビー"
                                        className={bridalStyles.form.input}
                                    />
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection
                            title="勤務枠"
                            description="テンプレートに含める基本の勤務枠を登録します。"
                            icon={<Clock className="h-5 w-5" />}
                        >
                            <div className="grid gap-4 md:grid-cols-4">
                                <FormField label="勤務枠名" htmlFor="slotName">
                                    <Input
                                        id="slotName"
                                        name="slotName"
                                        placeholder="例：通し勤務"
                                        defaultValue="基本勤務枠"
                                        required
                                        className={bridalStyles.form.input}
                                    />
                                </FormField>

                                <FormField label="開始時刻" htmlFor="startTime">
                                    <Input
                                        id="startTime"
                                        name="startTime"
                                        type="time"
                                        required
                                        className={bridalStyles.form.input}
                                    />
                                </FormField>

                                <FormField label="終了時刻" htmlFor="endTime">
                                    <Input
                                        id="endTime"
                                        name="endTime"
                                        type="time"
                                        required
                                        className={bridalStyles.form.input}
                                    />
                                </FormField>

                                <FormField label="必要人数" htmlFor="requiredPeople">
                                    <Input
                                        id="requiredPeople"
                                        name="requiredPeople"
                                        type="number"
                                        min={1}
                                        step={1}
                                        placeholder="例：5"
                                        required
                                        className={bridalStyles.form.input}
                                    />
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection
                            title="勤務条件"
                            description="休憩時間、交通費、服装、持ち物、備考、食事の有無を登録します。"
                            icon={<Shirt className="h-5 w-5" />}
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="休憩時間（分）" htmlFor="breakMinutes">
                                    <Input
                                        id="breakMinutes"
                                        name="breakMinutes"
                                        type="number"
                                        min={0}
                                        defaultValue={0}
                                        className={bridalStyles.form.input}
                                    />
                                </FormField>

                                <FormField label="交通費" htmlFor="transportationFee">
                                    <Input
                                        id="transportationFee"
                                        name="transportationFee"
                                        type="number"
                                        min={0}
                                        defaultValue={0}
                                        className={bridalStyles.form.input}
                                    />
                                </FormField>

                                <FormField
                                    label="服装"
                                    htmlFor="dressCode"
                                    className="md:col-span-2"
                                >
                                    <Input
                                        id="dressCode"
                                        name="dressCode"
                                        placeholder="例：黒パンツ、白シャツなど"
                                        className={bridalStyles.form.input}
                                    />
                                </FormField>

                                <FormField
                                    label="持ち物"
                                    htmlFor="belongings"
                                    className="md:col-span-2"
                                >
                                    <Input
                                        id="belongings"
                                        name="belongings"
                                        placeholder="例：メモ帳、筆記用具など"
                                        className={bridalStyles.form.input}
                                    />
                                </FormField>

                                <FormField
                                    label="備考"
                                    htmlFor="note"
                                    className="md:col-span-2"
                                >
                                    <textarea
                                        id="note"
                                        name="note"
                                        rows={4}
                                        className={[
                                            bridalStyles.form.input,
                                            "min-h-28 w-full px-3 py-2 text-sm",
                                        ].join(" ")}
                                        placeholder="案件作成時に引き継ぎたい注意事項"
                                    />
                                </FormField>

                                <label className="flex items-center gap-3 rounded-2xl border border-[#f0e5d0] bg-[#fffdf8]/80 p-4 text-sm text-slate-700 md:col-span-2">
                                    <input
                                        name="hasMeal"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-[#d6b56d] accent-[#b8872d]"
                                    />
                                    食事あり
                                </label>
                            </div>
                        </FormSection>

                        <FormSection
                            title="時給設定"
                            description="スタッフごとの時給を使うか、案件固定の時給を使うかを設定します。"
                            icon={<Banknote className="h-5 w-5" />}
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="給与設定" htmlFor="wageType">
                                    <select
                                        id="wageType"
                                        name="wageType"
                                        defaultValue="EMPLOYEE"
                                        className={[
                                            bridalStyles.form.input,
                                            "h-11 w-full px-3 text-sm",
                                        ].join(" ")}
                                    >
                                        <option value="EMPLOYEE">
                                            スタッフごとの時給を使う
                                        </option>
                                        <option value="JOB_FIXED">
                                            案件固定の時給を使う
                                        </option>
                                    </select>
                                </FormField>

                                <FormField
                                    label="案件固定時給"
                                    htmlFor="fixedHourlyWage"
                                >
                                    <Input
                                        id="fixedHourlyWage"
                                        name="fixedHourlyWage"
                                        type="number"
                                        min={0}
                                        placeholder="例：1300"
                                        className={bridalStyles.form.input}
                                    />
                                    <p className="text-xs text-slate-500">
                                        スタッフごとの時給を使う場合は空欄で問題ありません。
                                    </p>
                                </FormField>
                            </div>
                        </FormSection>

                        <div className="flex flex-col-reverse gap-3 border-t border-[#f0e5d0] pt-5 sm:flex-row sm:justify-end">
                            <LinkButton
                                href="/admin/job-templates"
                                variant="outline"
                                className={bridalStyles.button.secondary}
                            >
                                キャンセル
                            </LinkButton>

                            <SubmitButton
                                pendingText="作成中..."
                                className={[
                                    bridalStyles.button.primary,
                                    "px-6",
                                ].join(" ")}
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                テンプレートを作成
                            </SubmitButton>
                        </div>
                    </form>
                </CardContent>
            </BridalCard>
        </PageShell>
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
        <section className="space-y-4 rounded-2xl border border-[#f0e5d0] bg-white/70 p-5">
            <div className="flex items-start gap-3">
                <div className={bridalStyles.icon.smallCircle}>{icon}</div>

                <div>
                    <h2
                        className={[
                            bridalStyles.text.title,
                            "text-lg",
                        ].join(" ")}
                    >
                        {title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
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
    className?: string;
};

const FormField = ({
    label,
    htmlFor,
    children,
    className,
}: FormFieldProps) => {
    return (
        <div className={["space-y-2", className].filter(Boolean).join(" ")}>
            <Label htmlFor={htmlFor} className={bridalStyles.form.label}>
                {label}
            </Label>
            {children}
        </div>
    );
};

export default NewJobTemplatePage;