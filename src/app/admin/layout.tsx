import Link from "next/link";
import type { ReactNode } from "react";
import {
    BriefcaseBusiness,
    CalendarCheck,
    ClipboardList,
    FileText,
    Home,
    MessageSquareText,
    Users,
    WalletCards,
} from "lucide-react";
import { LogoutButton } from "@/components/shared/logout-button";
import { CurrentUserBadge } from "@/components/shared/current-user-badge";
import { NavLink } from "@/components/shared/nav-link";
import { MobileAdminNav } from "@/components/shared/mobile-admin-nav";
import { requireAdmin } from "@/lib/auth/guards";
import { appStyles } from "@/components/shared/design-tokens";

type AdminLayoutProps = {
    children: ReactNode;
};

const AdminLayout = async ({ children }: AdminLayoutProps) => {
    await requireAdmin();

    return (
        <div className={appStyles.layout.appShell}>
            <header className={appStyles.layout.stickyHeader}>
                <div className={appStyles.layout.headerInner}>
                    <Link
                        href="/admin"
                        className="group flex items-center gap-3"
                    >
                        <div className={appStyles.layout.brandIcon}>
                            <Home className="h-5 w-5" />
                        </div>

                        <div>
                            <p
                                className={[
                                    appStyles.text.title,
                                    "text-lg font-semibold tracking-tight",
                                ].join(" ")}
                            >
                                Shift Manager
                            </p>
                            <p
                                className={[
                                    "text-xs font-medium uppercase tracking-[0.22em]",
                                    appStyles.text.accent,
                                ].join(" ")}
                            >
                                Admin
                            </p>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-5 md:flex">
                        <nav className={appStyles.nav.desktopWrapper}>
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
                                スタッフ
                            </NavLink>

                            <NavLink href="/admin/work-reports">
                                <ClipboardList className="h-4 w-4" />
                                就労報告
                            </NavLink>

                            <NavLink href="/admin/monthly-summary">
                                <WalletCards className="h-4 w-4" />
                                月次集計
                            </NavLink>

                            <NavLink href="/admin/line-message">
                                <MessageSquareText className="h-4 w-4" />
                                LINE作成
                            </NavLink>

                            <NavLink href="/staff">
                                <CalendarCheck className="h-4 w-4" />
                                スタッフ画面
                            </NavLink>
                        </nav>

                        <div className="flex items-center gap-3">
                            <CurrentUserBadge />
                            <LogoutButton />
                        </div>
                    </div>

                    <div className="md:hidden">
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main>{children}</main>

            <MobileAdminNav />
        </div>
    );
};

export default AdminLayout;