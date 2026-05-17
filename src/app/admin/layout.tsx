import Link from "next/link";
import {
    BriefcaseBusiness,
    CalendarCheck,
    ClipboardList,
    FileText,
    Home,
    Users,
    WalletCards,
} from "lucide-react";
import { LogoutButton } from "@/components/shared/logout-button";
import { CurrentUserBadge } from "@/components/shared/current-user-badge";
import { NavLink } from "@/components/shared/nav-link";
import { MobileAdminNav } from "@/components/shared/mobile-admin-nav";
import { requireAdmin } from "@/lib/auth/guards";

type AdminLayoutProps = {
    children: React.ReactNode;
};

const AdminLayout = async ({ children }: AdminLayoutProps) => {
    await requireAdmin();

    return (
        <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
            <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
                    <Link href="/admin" className="text-lg font-bold">
                        Shift Manager Admin
                    </Link>

                    <div className="hidden items-center gap-6 md:flex">
                        <nav className="flex items-center gap-2">
                            <NavLink href="/admin" exact>
                                <Home className="h-4 w-4" />
                                ホーム
                            </NavLink>

                            <NavLink href="/admin/jobs">
                                <BriefcaseBusiness className="h-4 w-4" />
                                案件
                            </NavLink>

                            <NavLink href="/admin/job-templates">
                                <FileText className="h-4 w-4" />
                                テンプレート
                            </NavLink>

                            <NavLink href="/admin/employees">
                                <Users className="h-4 w-4" />
                                従業員
                            </NavLink>

                            <NavLink href="/admin/work-reports">
                                <ClipboardList className="h-4 w-4" />
                                就労報告
                            </NavLink>

                            <NavLink href="/admin/monthly-summary">
                                <WalletCards className="h-4 w-4" />
                                月次集計
                            </NavLink>

                            <NavLink href="/staff">
                                <CalendarCheck className="h-4 w-4" />
                                勤務者画面
                            </NavLink>
                        </nav>

                        <CurrentUserBadge />
                        <LogoutButton />
                    </div>

                    <div className="md:hidden">
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
                {children}
            </main>

            <MobileAdminNav />
        </div>
    );
};

export default AdminLayout;