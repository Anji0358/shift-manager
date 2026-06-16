import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
    ArrowLeft,
    BriefcaseBusiness,
    CheckCircle2,
    Clock,
    MapPin,
    ReceiptText,
    User,
} from "lucide-react";
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
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { AppCard } from "@/components/shared/app-card";
import { appStyles } from "@/components/shared/design-tokens";
import { getAssignmentById } from "@/features/shift-assignments/queries";
import { createWorkReport } from "@/features/work-reports/actions";
import { getWorkReportByEmployeeIdAndJobId } from "@/features/work-reports/queries";
import { formatDate } from "@/lib/format";
import { getCurrentEmployeeId } from "@/lib/auth/current-user";

type StaffNewWorkReportPageProps = {
    searchParams: Promise<{
        assignmentId?: string;
    }>;
};

const StaffNewWorkReportPage = async ({
    searchParams,
}: StaffNewWorkReportPageProps) => {
    const { assignmentId } = await searchParams;

    if (!assignmentId) {
        notFound();
    }

    const currentEmployeeId = await getCurrentEmployeeId();

    const assignment = await getAssignmentById(assignmentId);

    if (!assignment) {
        notFound();
    }

    if (assignment.employeeId !== currentEmployeeId) {
        notFound();
    }

    const job = assignment.slot.job;
    const slot = assignment.slot;
    const employee = assignment.employee;

    const existingReport = await getWorkReportByEmployeeIdAndJobId(
        currentEmployeeId,
        job.id,
    );

    if (existingReport) {
        redirect("/staff/shifts");
    }

    return (
        <PageShell>
            <PageHeader
                title="就労報告提出"
                description="実際の勤務時間、休憩時間、交通費などを報告します。"
                action={
                    <LinkButton
                        href="/staff/shifts"
                        variant="outline"
                        className={appStyles.button.secondary}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        確定シフトへ戻る
                    </LinkButton>
                }
            />

            <div className="space-y-6">
                <AppCard>
                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-start gap-3">
                            <div className={appStyles.icon.circle}>
                                <BriefcaseBusiness className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle
                                    className={[
                                        appStyles.text.title,
                                        "text-xl",
                                    ].join(" ")}
                                >
                                    報告対象の案件
                                </CardTitle>
                                <p className={["mt-1", appStyles.text.muted].join(" ")}>
                                    提出する就労報告の対象案件を確認してください。
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-2">
                        <div
                            className={[
                                "grid gap-4 text-sm md:grid-cols-2",
                                appStyles.section.base,
                            ].join(" ")}
                        >
                            <InfoRow
                                label="スタッフ"
                                value={employee.name}
                                icon={<User className="h-4 w-4" />}
                            />

                            <InfoRow
                                label="案件名"
                                value={job.title}
                                icon={<BriefcaseBusiness className="h-4 w-4" />}
                            />

                            <InfoRow
                                label="勤務日"
                                value={formatDate(job.workDate)}
                                icon={<ReceiptText className="h-4 w-4" />}
                            />

                            <InfoRow
                                label="勤務枠"
                                value={slot.name}
                                icon={<Clock className="h-4 w-4" />}
                            />

                            <InfoRow
                                label="勤務時間"
                                value={`${slot.startTime}〜${slot.endTime}`}
                                icon={<Clock className="h-4 w-4" />}
                            />

                            <InfoRow
                                label="場所"
                                value={job.location}
                                icon={<MapPin className="h-4 w-4" />}
                            />

                            <InfoRow
                                label="集合場所"
                                value={job.meetingPlace || "未設定"}
                                icon={<MapPin className="h-4 w-4" />}
                            />
                        </div>
                    </CardContent>
                </AppCard>

                <AppCard>
                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-start gap-3">
                            <div className={appStyles.icon.circle}>
                                <ReceiptText className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle
                                    className={[
                                        appStyles.text.title,
                                        "text-xl",
                                    ].join(" ")}
                                >
                                    就労報告内容
                                </CardTitle>
                                <p className={["mt-1", appStyles.text.muted].join(" ")}>
                                    実際の勤務内容に合わせて、勤務時間・休憩・交通費・食事の有無を入力します。
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-2">
                        <form action={createWorkReport} className="space-y-6">
                            <input type="hidden" name="jobId" value={job.id} />

                            <section className={appStyles.section.base}>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        label="実勤務開始時間"
                                        htmlFor="actualStartTime"
                                    >
                                        <Input
                                            id="actualStartTime"
                                            name="actualStartTime"
                                            type="time"
                                            defaultValue={slot.startTime}
                                            required
                                            className={appStyles.form.input}
                                        />
                                    </FormField>

                                    <FormField
                                        label="実勤務終了時間"
                                        htmlFor="actualEndTime"
                                    >
                                        <Input
                                            id="actualEndTime"
                                            name="actualEndTime"
                                            type="time"
                                            defaultValue={slot.endTime}
                                            required
                                            className={appStyles.form.input}
                                        />
                                    </FormField>

                                    <FormField
                                        label="実休憩時間"
                                        htmlFor="actualBreakMinutes"
                                    >
                                        <Input
                                            id="actualBreakMinutes"
                                            name="actualBreakMinutes"
                                            type="number"
                                            min={0}
                                            defaultValue={job.breakMinutes}
                                            required
                                            className={appStyles.form.input}
                                        />
                                    </FormField>

                                    <FormField
                                        label="交通費"
                                        htmlFor="transportationFee"
                                    >
                                        <Input
                                            id="transportationFee"
                                            name="transportationFee"
                                            type="number"
                                            min={0}
                                            defaultValue={job.transportationFee}
                                            required
                                            className={appStyles.form.input}
                                        />
                                    </FormField>

                                    <FormField label="食事の有無" htmlFor="hasMeal">
                                        <Select
                                            name="hasMeal"
                                            defaultValue={
                                                job.hasMeal ? "true" : "false"
                                            }
                                        >
                                            <SelectTrigger
                                                id="hasMeal"
                                                className={appStyles.form.input}
                                            >
                                                <SelectValue placeholder="食事の有無を選択" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectItem value="true">
                                                    あり
                                                </SelectItem>
                                                <SelectItem value="false">
                                                    なし
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                </div>
                            </section>

                            <div
                                className={[
                                    "flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end",
                                    appStyles.border.soft,
                                ].join(" ")}
                            >
                                <LinkButton
                                    href="/staff/shifts"
                                    variant="outline"
                                    className={appStyles.button.secondary}
                                >
                                    キャンセル
                                </LinkButton>

                                <SubmitButton
                                    pendingText="提出中..."
                                    className={[
                                        appStyles.button.primary,
                                        "px-6",
                                    ].join(" ")}
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    提出する
                                </SubmitButton>
                            </div>
                        </form>
                    </CardContent>
                </AppCard>
            </div>
        </PageShell>
    );
};

type InfoRowProps = {
    label: string;
    value: string;
    icon: ReactNode;
};

const InfoRow = ({ label, value, icon }: InfoRowProps) => {
    return (
        <div className="flex items-start gap-2">
            <span className={["mt-0.5", appStyles.icon.accent].join(" ")}>
                {icon}
            </span>
            <p>
                <span className={appStyles.textColor.muted}>{label}：</span>
                <span
                    className={[
                        "font-medium",
                        appStyles.textColor.default,
                    ].join(" ")}
                >
                    {value}
                </span>
            </p>
        </div>
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

export default StaffNewWorkReportPage;