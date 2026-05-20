import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

                <Button asChild>
                    <Link href="/admin/jobs/new">案件を作成</Link>
                </Button>
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
                        <p className="text-3xl font-bold">{stats.monthlyAssignmentCount}</p>
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
                        <Button asChild variant="outline">
                            <Link href="/admin/jobs">案件一覧へ</Link>
                        </Button>
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
                        <Button asChild variant="outline">
                            <Link href="/admin/work-reports">就労報告へ</Link>
                        </Button>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
};

export default AdminPage;