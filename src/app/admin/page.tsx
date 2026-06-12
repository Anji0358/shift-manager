import type { ReactNode } from "react";
import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { AppCard } from "@/components/shared/bridal-card";
import { appStyles } from "@/components/shared/design-tokens";
import { getAdminDashboardStats } from "@/features/dashboard/admin-queries";
import { getCurrentAdmin } from "@/lib/auth/current-user";
import {
    BriefcaseBusiness,
    CalendarCheck,
    ClipboardCheck,
    FileText,
    Plus,
    Users,
} from "lucide-react";

const AdminPage = async () => {
    const currentAdmin = await getCurrentAdmin();
    const stats = await getAdminDashboardStats();

    return (
        <PageShell>
            <PageHeader
                title="管理者ダッシュボード"
                description="案件、シフト、就労報告、スタッフの状況を確認します。"
                action={
                    <LinkButton
                        href="/admin/jobs/new"
                        pendingText="作成画面へ移動中..."
                        className={[appStyles.button.primary, "px-5"].join(" ")}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        案件を作成
                    </LinkButton>
                }
            />

            <div
                className={[
                    appStyles.section.message,
                    "mb-6",
                    appStyles.text.body,
                ].join(" ")}
            >
                現在の管理者：
                <span
                    className={[
                        "ml-1 font-medium",
                        appStyles.textColor.default,
                    ].join(" ")}
                >
                    {currentAdmin.name}
                </span>
            </div>

            <section className="grid gap-4 md:grid-cols-4">
                <SummaryCard
                    title="今月の案件数"
                    value={stats.monthlyJobCount}
                    description={stats.currentYearMonth}
                    icon={<BriefcaseBusiness className="h-5 w-5" />}
                />

                <SummaryCard
                    title="今月の確定シフト数"
                    value={stats.monthlyAssignmentCount}
                    description="ASSIGNED の件数"
                    icon={<CalendarCheck className="h-5 w-5" />}
                />

                <SummaryCard
                    title="未承認の就労報告"
                    value={stats.pendingReportCount}
                    description="SUBMITTED の件数"
                    icon={<ClipboardCheck className="h-5 w-5" />}
                />

                <SummaryCard
                    title="在籍中スタッフ"
                    value={stats.activeEmployeeCount}
                    description="ACTIVE のスタッフ"
                    icon={<Users className="h-5 w-5" />}
                />
            </section>

            <section className="mt-6 grid gap-4 md:grid-cols-2">
                <ActionCard
                    title="案件管理"
                    description="案件作成、勤務枠作成、スタッフ割り振り"
                    body="現場ごとの案件情報、勤務枠、必要人数、割り振り状況をまとめて管理します。"
                    href="/admin/jobs"
                    buttonLabel="案件一覧へ"
                    pendingText="案件一覧へ移動中..."
                    icon={<BriefcaseBusiness className="h-5 w-5" />}
                />

                <ActionCard
                    title="就労報告管理"
                    description="提出内容の確認、承認、差し戻し"
                    body="スタッフから提出された就労報告を確認し、承認または差し戻しを行います。"
                    href="/admin/work-reports"
                    buttonLabel="就労報告へ"
                    pendingText="就労報告へ移動中..."
                    icon={<FileText className="h-5 w-5" />}
                />
            </section>
        </PageShell>
    );
};

type SummaryCardProps = {
    title: string;
    value: number;
    description: string;
    icon: ReactNode;
};

const SummaryCard = ({
    title,
    value,
    description,
    icon,
}: SummaryCardProps) => {
    return (
        <AppCard>
            <CardHeader className="space-y-0 p-5 pb-3">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle
                        className={[
                            "text-sm font-medium",
                            appStyles.textColor.muted,
                        ].join(" ")}
                    >
                        {title}
                    </CardTitle>

                    <div className={appStyles.icon.smallCircle}>
                        {icon}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-0">
                <p
                    className={[
                        "text-3xl font-semibold tracking-tight",
                        appStyles.textColor.default,
                    ].join(" ")}
                >
                    {value}
                </p>
                <p className={["mt-1", appStyles.text.muted].join(" ")}>
                    {description}
                </p>
            </CardContent>
        </AppCard>
    );
};

type ActionCardProps = {
    title: string;
    description: string;
    body: string;
    href: string;
    buttonLabel: string;
    pendingText: string;
    icon: ReactNode;
};

const ActionCard = ({
    title,
    description,
    body,
    href,
    buttonLabel,
    pendingText,
    icon,
}: ActionCardProps) => {
    return (
        <AppCard className={appStyles.card.hover}>
            <CardHeader className="p-5 pb-3">
                <div className="flex items-start gap-3">
                    <div className={appStyles.icon.circle}>
                        {icon}
                    </div>

                    <div>
                        <CardTitle
                            className={[
                                appStyles.text.title,
                                "text-xl",
                            ].join(" ")}
                        >
                            {title}
                        </CardTitle>
                        <p className={["mt-1", appStyles.text.muted].join(" ")}>
                            {description}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 p-5 pt-0">
                <p className={appStyles.text.body}>{body}</p>

                <LinkButton
                    href={href}
                    variant="outline"
                    pendingText={pendingText}
                    className={appStyles.button.secondary}
                >
                    {buttonLabel}
                </LinkButton>
            </CardContent>
        </AppCard>
    );
};

export default AdminPage;