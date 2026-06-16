import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { AppCard } from "@/components/shared/app-card";
import { appStyles } from "@/components/shared/design-tokens";
import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/shared/submit-button";
import { LinkButton } from "@/components/shared/link-button";
import { getJobById } from "@/features/jobs/queries";
import { createJobShiftSlot } from "@/features/job-shift-slots/actions";
import {
    ArrowLeft,
    CalendarPlus,
    CheckCircle2,
    Clock,
    Users,
} from "lucide-react";

type AdminNewJobSlotPageProps = {
    params: Promise<{
        jobId: string;
    }>;
};

const AdminNewJobSlotPage = async ({ params }: AdminNewJobSlotPageProps) => {
    const { jobId } = await params;

    const job = await getJobById(jobId);

    if (!job) {
        notFound();
    }

    return (
        <PageShell>
            <PageHeader
                title="勤務枠追加"
                description={`「${job.title}」に勤務枠を追加します。`}
                action={
                    <div className="flex flex-wrap gap-3">
                        <LinkButton
                            href={`/admin/jobs/${job.id}/assignments`}
                            variant="outline"
                            className={appStyles.button.secondary}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            スタッフ割り振りへ戻る
                        </LinkButton>

                        <LinkButton
                            href={`/admin/jobs/${job.id}`}
                            variant="outline"
                            className={appStyles.button.secondary}
                        >
                            案件詳細へ戻る
                        </LinkButton>
                    </div>
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
                                勤務枠情報
                            </CardTitle>
                            <p className={["mt-1", appStyles.text.muted].join(" ")}>
                                勤務枠名、必要人数、開始時間、終了時間を登録します。
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-5 pt-2">
                    <form action={createJobShiftSlot} className="space-y-6">
                        <input type="hidden" name="jobId" value={job.id} />

                        <section className={["space-y-5", appStyles.section.base].join(" ")}>
                            <div className="flex items-start gap-3">
                                <div className={appStyles.icon.smallCircle}>
                                    <Clock className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2
                                        className={[
                                            appStyles.text.title,
                                            "text-lg",
                                        ].join(" ")}
                                    >
                                        勤務時間・必要人数
                                    </h2>
                                    <p className={["mt-1", appStyles.text.muted].join(" ")}>
                                        1つの案件に複数の勤務枠を追加できます。
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="勤務枠名" htmlFor="name">
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="例：本番"
                                        required
                                        className={appStyles.form.input}
                                    />
                                </FormField>

                                <FormField
                                    label="必要人数"
                                    htmlFor="requiredPeople"
                                    icon={<Users className="h-4 w-4" />}
                                >
                                    <Input
                                        id="requiredPeople"
                                        name="requiredPeople"
                                        type="number"
                                        min={1}
                                        step={1}
                                        placeholder="例：8"
                                        required
                                        className={appStyles.form.input}
                                    />
                                </FormField>

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
                            </div>
                        </section>

                        <div
                            className={[
                                "flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end",
                                appStyles.border.soft,
                            ].join(" ")}
                        >
                            <LinkButton
                                href={`/admin/jobs/${job.id}/assignments`}
                                variant="outline"
                                className={appStyles.button.secondary}
                            >
                                キャンセル
                            </LinkButton>

                            <SubmitButton
                                pendingText="追加中..."
                                className={[
                                    appStyles.button.primary,
                                    "px-6",
                                ].join(" ")}
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                追加する
                            </SubmitButton>
                        </div>
                    </form>
                </CardContent>
            </AppCard>
        </PageShell>
    );
};

type FormFieldProps = {
    label: string;
    htmlFor: string;
    children: ReactNode;
    icon?: ReactNode;
};

const FormField = ({
    label,
    htmlFor,
    children,
    icon,
}: FormFieldProps) => {
    return (
        <div className="space-y-2">
            <Label
                htmlFor={htmlFor}
                className={[
                    appStyles.form.label,
                    "flex items-center gap-2",
                ].join(" ")}
            >
                {icon}
                {label}
            </Label>
            {children}
        </div>
    );
};

export default AdminNewJobSlotPage;