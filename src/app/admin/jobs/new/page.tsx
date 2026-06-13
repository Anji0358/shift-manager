import type { ReactNode } from "react";
import { createJob } from "@/features/jobs/actions";
import { getJobTemplates } from "@/features/job-templates/queries";
import { TemplateSelector } from "@/features/job-templates/components/template-selector";
import { SubmitButton } from "@/components/shared/submit-button";
import { LinkButton } from "@/components/shared/link-button";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { AppCard } from "@/components/shared/bridal-card";
import { appStyles } from "@/components/shared/design-tokens";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Banknote,
    BriefcaseBusiness,
    CalendarPlus,
    ClipboardList,
    Clock,
    Shirt,
} from "lucide-react";

type NewJobPageProps = {
    searchParams: Promise<{
        templateId?: string;
    }>;
};

const NewJobPage = async ({ searchParams }: NewJobPageProps) => {
    const { templateId } = await searchParams;

    const templates = await getJobTemplates();

    const selectedTemplate = templateId
        ? templates.find((template) => template.id === templateId)
        : undefined;

    const selectedTemplateSlot = selectedTemplate?.shiftSlots[0];

    return (
        <PageShell>
            <PageHeader
                title="案件追加"
                description="案件の基本情報、勤務枠、勤務条件、時給設定を登録します。"
                action={
                    <LinkButton
                        href="/admin/jobs"
                        variant="outline"
                        className={appStyles.button.secondary}
                    >
                        案件一覧へ戻る
                    </LinkButton>
                }
            />

            <AppCard>
                <CardHeader className="p-5 pb-3">
                    <div className="flex items-start gap-3">
                        <div className={appStyles.icon.circle}>
                            <CalendarPlus className="h-5 w-5" />
                        </div>

                        <div>
                            <CardTitle
                                className={[
                                    appStyles.text.title,
                                    "text-xl",
                                ].join(" ")}
                            >
                                案件情報
                            </CardTitle>
                            <p className={["mt-1", appStyles.text.muted].join(" ")}>
                                テンプレートを使う場合は、先にテンプレートを選択してください。
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-5 pt-2">
                    <form action={createJob} className="space-y-8">
                        <section className={appStyles.section.soft}>
                            <TemplateSelector
                                templates={templates}
                                selectedTemplateId={templateId}
                            />
                        </section>

                        <FormSection
                            title="基本情報"
                            description="案件名、日付、場所、集合場所を登録します。"
                            icon={<BriefcaseBusiness className="h-5 w-5" />}
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="案件名" htmlFor="title">
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="例：横浜ホテル宴会"
                                        defaultValue={selectedTemplate?.title ?? ""}
                                        required
                                        className={appStyles.form.input}
                                    />
                                </FormField>

                                <FormField label="日付" htmlFor="workDate">
                                    <Input
                                        id="workDate"
                                        name="workDate"
                                        type="date"
                                        required
                                        className={appStyles.form.input}
                                    />
                                </FormField>

                                <FormField label="場所" htmlFor="location">
                                    <Input
                                        id="location"
                                        name="location"
                                        placeholder="例：横浜ホテル"
                                        defaultValue={selectedTemplate?.location ?? ""}
                                        required
                                        className={appStyles.form.input}
                                    />
                                </FormField>

                                <FormField label="集合場所" htmlFor="meetingPlace">
                                    <Input
                                        id="meetingPlace"
                                        name="meetingPlace"
                                        placeholder="例：横浜駅中央改札"
                                        defaultValue={selectedTemplate?.meetingPlace ?? ""}
                                        className={appStyles.form.input}
                                    />
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection
                            title="勤務枠"
                            description="最初に作成する勤務時間帯と必要人数を登録します。"
                            icon={<Clock className="h-5 w-5" />}
                        >
                            <div className="grid gap-4 md:grid-cols-4">
                                <FormField label="勤務枠名" htmlFor="slotName">
                                    <Input
                                        id="slotName"
                                        name="slotName"
                                        placeholder="例：通し勤務"
                                        defaultValue={
                                            selectedTemplateSlot?.name ?? "基本勤務枠"
                                        }
                                        required
                                        className={appStyles.form.input}
                                    />
                                </FormField>

                                <FormField label="開始時間" htmlFor="startTime">
                                    <Input
                                        id="startTime"
                                        name="startTime"
                                        type="time"
                                        defaultValue={selectedTemplateSlot?.startTime ?? ""}
                                        required
                                        className={appStyles.form.input}
                                    />
                                </FormField>

                                <FormField label="終了時間" htmlFor="endTime">
                                    <Input
                                        id="endTime"
                                        name="endTime"
                                        type="time"
                                        defaultValue={selectedTemplateSlot?.endTime ?? ""}
                                        required
                                        className={appStyles.form.input}
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
                                        defaultValue={
                                            selectedTemplateSlot?.requiredPeople ?? ""
                                        }
                                        required
                                        className={appStyles.form.input}
                                    />
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection
                            title="勤務条件"
                            description="休憩、食事、交通費、服装、持ち物、備考を登録します。"
                            icon={<Shirt className="h-5 w-5" />}
                        >
                            <div className="grid gap-4 md:grid-cols-3">
                                <FormField label="休憩時間" htmlFor="breakMinutes">
                                    <Input
                                        id="breakMinutes"
                                        name="breakMinutes"
                                        type="number"
                                        min={0}
                                        placeholder="例：30"
                                        defaultValue={selectedTemplate?.breakMinutes ?? 0}
                                        required
                                        className={appStyles.form.input}
                                    />
                                </FormField>

                                <FormField label="食事の有無" htmlFor="hasMeal">
                                    <Select
                                        name="hasMeal"
                                        defaultValue={
                                            selectedTemplate?.hasMeal ? "true" : "false"
                                        }
                                    >
                                        <SelectTrigger
                                            id="hasMeal"
                                            className={appStyles.form.input}
                                        >
                                            <SelectValue placeholder="食事の有無を選択" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">あり</SelectItem>
                                            <SelectItem value="false">なし</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField label="交通費" htmlFor="transportationFee">
                                    <Input
                                        id="transportationFee"
                                        name="transportationFee"
                                        type="number"
                                        min={0}
                                        placeholder="例：800"
                                        defaultValue={
                                            selectedTemplate?.transportationFee ?? 0
                                        }
                                        required
                                        className={appStyles.form.input}
                                    />
                                </FormField>

                                <FormField label="服装" htmlFor="dressCode">
                                    <Input
                                        id="dressCode"
                                        name="dressCode"
                                        placeholder="例：黒スラックス・白シャツ"
                                        defaultValue={selectedTemplate?.dressCode ?? ""}
                                        className={appStyles.form.input}
                                    />
                                </FormField>
                            </div>

                            <FormField label="持ち物" htmlFor="belongings">
                                <Input
                                    id="belongings"
                                    name="belongings"
                                    placeholder="例：メモ帳、黒靴"
                                    defaultValue={selectedTemplate?.belongings ?? ""}
                                    className={appStyles.form.input}
                                />
                            </FormField>

                            <FormField label="備考" htmlFor="note">
                                <Textarea
                                    id="note"
                                    name="note"
                                    placeholder="注意事項や補足情報を入力してください"
                                    defaultValue={selectedTemplate?.note ?? ""}
                                    className={appStyles.form.textarea}
                                />
                            </FormField>
                        </FormSection>

                        <FormSection
                            title="時給設定"
                            description="スタッフごとの時給を使うか、案件一律の時給を使うかを設定します。"
                            icon={<Banknote className="h-5 w-5" />}
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="時給タイプ" htmlFor="wageType">
                                    <Select
                                        name="wageType"
                                        defaultValue={
                                            selectedTemplate?.wageType ?? "EMPLOYEE"
                                        }
                                    >
                                        <SelectTrigger
                                            id="wageType"
                                            className={appStyles.form.input}
                                        >
                                            <SelectValue placeholder="時給タイプを選択" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="EMPLOYEE">
                                                スタッフごとの時給を使う
                                            </SelectItem>
                                            <SelectItem value="JOB_FIXED">
                                                案件一律の時給を使う
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField
                                    label="案件一律時給"
                                    htmlFor="fixedHourlyWage"
                                >
                                    <Input
                                        id="fixedHourlyWage"
                                        name="fixedHourlyWage"
                                        type="number"
                                        min={0}
                                        placeholder="例：1400"
                                        defaultValue={
                                            selectedTemplate?.fixedHourlyWage ?? ""
                                        }
                                        className={appStyles.form.input}
                                    />
                                    <p className={["text-xs", appStyles.textColor.muted].join(" ")}>
                                        スタッフごとの時給を使う場合は空欄で問題ありません。
                                    </p>
                                </FormField>
                            </div>
                        </FormSection>

                        <div
                            className={[
                                "flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end",
                                appStyles.border.soft,
                            ].join(" ")}
                        >
                            <LinkButton
                                href="/admin/jobs"
                                variant="outline"
                                className={appStyles.button.secondary}
                            >
                                キャンセル
                            </LinkButton>

                            <SubmitButton
                                pendingText="作成中..."
                                className={[
                                    appStyles.button.primary,
                                    "px-6",
                                ].join(" ")}
                            >
                                <ClipboardList className="mr-2 h-4 w-4" />
                                案件を作成
                            </SubmitButton>
                        </div>
                    </form>
                </CardContent>
            </AppCard>
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

export default NewJobPage;