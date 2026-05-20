import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { getAdminDashboardStats } from "@/features/dashboard/admin-queries";
import { getCurrentAdmin } from "@/lib/auth/current-user";

const AdminPage = async () => {
    const stats = await getAdminDashboardStats();
    const currentAdmin = await getCurrentAdmin();

    return (
        <div className="space-y-8">
            <section className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">管理者ダッシュボード</h1>
                    <p className="mt-2 text-slate-600">
                        案件、シフト、就労報告、スタッフの状況を確認します。
                    </p>
                    {currentAdmin && (
                        <p className="mt-1 text-sm text-slate-500">
                            現在の管理者：{currentAdmin.name}
                        </p>
                    )}
                </div>

                <LinkButton href="/admin/jobs/new" pendingText="作成画面へ移動中...">
                    案件を作成
                </LinkButton>
            </section>

            <section className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            今月の案件数
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.monthlyJobCount}</p>
                        <p className="mt-1 text-sm text-slate-500">
                            {stats.currentYearMonth}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            今月の確定シフト数
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {stats.monthlyAssignmentCount}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            ASSIGNED の件数
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            未承認の就労報告
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.pendingReportCount}</p>
                        <p className="mt-1 text-sm text-slate-500">
                            SUBMITTED の件数
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            在籍中スタッフ
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.activeEmployeeCount}</p>
                        <p className="mt-1 text-sm text-slate-500">
                            ACTIVE のスタッフ
                        </p>
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>案件管理</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-slate-600">
                            案件作成、勤務枠作成、スタッフ割り振りを行います。
                        </p>
                        <LinkButton
                            href="/admin/jobs"
                            variant="outline"
                            pendingText="案件一覧へ移動中..."
                        >
                            案件一覧へ
                        </LinkButton>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>就労報告管理</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-slate-600">
                            提出された就労報告を承認・差し戻しします。
                        </p>
                        <LinkButton
                            href="/admin/work-reports"
                            variant="outline"
                            pendingText="就労報告へ移動中..."
                        >
                            就労報告へ
                        </LinkButton>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
};

export default AdminPage;