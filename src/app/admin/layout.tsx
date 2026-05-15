import Link from "next/link";
import { LogoutButton } from "@/components/shared/logout-button";
import { requireAdmin } from "@/lib/auth/guards";
import { CurrentUserBadge } from "@/components/shared/current-user-badge";

type AdminLayoutProps = {
    children: React.ReactNode;
};

const AdminLayout = async ({ children }: AdminLayoutProps) => {
    await requireAdmin();

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/admin" className="text-lg font-bold">
                        Shift Manager Admin
                    </Link>

                    <div className="flex items-center gap-6">
                        <nav className="flex gap-4 text-sm text-slate-600">
                            <Link href="/admin/jobs">案件</Link>
                            <Link href="/admin/employees">従業員</Link>
                            <Link href="/admin/work-reports">就労報告</Link>
                            <Link href="/admin/monthly-summary">月次集計</Link>
                            <Link href="/">トップ</Link>
                        </nav>

                        <CurrentUserBadge />
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
        </div>
    );
};

export default AdminLayout;