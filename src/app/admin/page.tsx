import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
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
                        className={[bridalStyles.button.primary, "px-5"].join(" ")}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        案件を作成
                    </LinkButton>
                }
            />

            <div
                className={[
                    "mb-6 rounded-2xl border border-[#eadcc1] bg-white/72 px-5 py-4 shadow-md shadow-yellow-900/5 backdrop-blur",
                    bridalStyles.text.body,
                ].join(" ")}
            >
                現在の管理者：
                <span className="ml-1 font-medium text-slate-900">
                    {currentAdmin.name}
                </span>
            </div>

            <section className="grid gap-4 md:grid-cols-4">
                <BridalCard>
                    <CardHeader className="space-y-0 p-5 pb-3">
                        <div className="flex items-center justify-between gap-3">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                今月の案件数
                            </CardTitle>
                            <div className={bridalStyles.icon.smallCircle}>
                                <BriefcaseBusiness className="h-5 w-5" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-0">
                        <p className="text-3xl font-semibold tracking-tight text-slate-900">
                            {stats.monthlyJobCount}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            {stats.currentYearMonth}
                        </p>
                    </CardContent>
                </BridalCard>

                <BridalCard>
                    <CardHeader className="space-y-0 p-5 pb-3">
                        <div className="flex items-center justify-between gap-3">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                今月の確定シフト数
                            </CardTitle>
                            <div className={bridalStyles.icon.smallCircle}>
                                <CalendarCheck className="h-5 w-5" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-0">
                        <p className="text-3xl font-semibold tracking-tight text-slate-900">
                            {stats.monthlyAssignmentCount}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            ASSIGNED の件数
                        </p>
                    </CardContent>
                </BridalCard>

                <BridalCard>
                    <CardHeader className="space-y-0 p-5 pb-3">
                        <div className="flex items-center justify-between gap-3">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                未承認の就労報告
                            </CardTitle>
                            <div className={bridalStyles.icon.smallCircle}>
                                <ClipboardCheck className="h-5 w-5" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-0">
                        <p className="text-3xl font-semibold tracking-tight text-slate-900">
                            {stats.pendingReportCount}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            SUBMITTED の件数
                        </p>
                    </CardContent>
                </BridalCard>

                <BridalCard>
                    <CardHeader className="space-y-0 p-5 pb-3">
                        <div className="flex items-center justify-between gap-3">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                在籍中スタッフ
                            </CardTitle>
                            <div className={bridalStyles.icon.smallCircle}>
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-0">
                        <p className="text-3xl font-semibold tracking-tight text-slate-900">
                            {stats.activeEmployeeCount}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            ACTIVE のスタッフ
                        </p>
                    </CardContent>
                </BridalCard>
            </section>

            <section className="mt-6 grid gap-4 md:grid-cols-2">
                <BridalCard className={bridalStyles.card.hover}>
                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-start gap-3">
                            <div className={bridalStyles.icon.circle}>
                                <BriefcaseBusiness className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle
                                    className={[
                                        bridalStyles.text.title,
                                        "text-xl",
                                    ].join(" ")}
                                >
                                    案件管理
                                </CardTitle>
                                <p className="mt-1 text-sm text-slate-500">
                                    案件作成、勤務枠作成、スタッフ割り振り
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4 p-5 pt-0">
                        <p className={bridalStyles.text.body}>
                            現場ごとの案件情報、勤務枠、必要人数、割り振り状況をまとめて管理します。
                        </p>

                        <LinkButton
                            href="/admin/jobs"
                            variant="outline"
                            pendingText="案件一覧へ移動中..."
                            className={bridalStyles.button.secondary}
                        >
                            案件一覧へ
                        </LinkButton>
                    </CardContent>
                </BridalCard>

                <BridalCard className={bridalStyles.card.hover}>
                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-start gap-3">
                            <div className={bridalStyles.icon.circle}>
                                <FileText className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle
                                    className={[
                                        bridalStyles.text.title,
                                        "text-xl",
                                    ].join(" ")}
                                >
                                    就労報告管理
                                </CardTitle>
                                <p className="mt-1 text-sm text-slate-500">
                                    提出内容の確認、承認、差し戻し
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4 p-5 pt-0">
                        <p className={bridalStyles.text.body}>
                            スタッフから提出された就労報告を確認し、承認または差し戻しを行います。
                        </p>

                        <LinkButton
                            href="/admin/work-reports"
                            variant="outline"
                            pendingText="就労報告へ移動中..."
                            className={bridalStyles.button.secondary}
                        >
                            就労報告へ
                        </LinkButton>
                    </CardContent>
                </BridalCard>
            </section>
        </PageShell>
    );
};

export default AdminPage;