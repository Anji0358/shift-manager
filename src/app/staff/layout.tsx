import Link from "next/link";
import type { ReactNode } from "react";
import {
    CalendarDays,
    CalendarX,
    ClipboardList,
    Home,
    ListChecks,
    WalletCards,
} from "lucide-react";
import { LogoutButton } from "@/components/shared/logout-button";
import { CurrentUserBadge } from "@/components/shared/current-user-badge";
import { NavLink } from "@/components/shared/nav-link";
import { requireLogin } from "@/lib/auth/guards";
import { MobileWorkerNav } from "@/components/shared/mobile-worker-nav";
import { appStyles } from "@/components/shared/design-tokens";

type StaffLayoutProps = {
    children: ReactNode;
};

const StaffLayout = async ({ children }: StaffLayoutProps) => {
    await requireLogin();

    return (
        <div className={appStyles.layout.appShell}>
            <header className={appStyles.layout.stickyHeader}>
                <div className={appStyles.layout.headerInner}>
                    <Link
                        href="/staff"
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
                                Staff
                            </p>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-5 md:flex">
                        <nav className={appStyles.nav.desktopWrapper}>
                            <NavLink href="/staff" exact>
                                <Home className="h-4 w-4" />
                                ホーム
                            </NavLink>

                            <NavLink href="/staff/shifts">
                                <ListChecks className="h-4 w-4" />
                                確定シフト
                            </NavLink>

                            <NavLink href="/staff/calendar">
                                <CalendarDays className="h-4 w-4" />
                                カレンダー
                            </NavLink>

                            <NavLink href="/staff/unavailable-times">
                                <CalendarX className="h-4 w-4" />
                                勤務不可
                            </NavLink>

                            <NavLink href="/staff/work-history">
                                <ClipboardList className="h-4 w-4" />
                                就労履歴
                            </NavLink>

                            <NavLink href="/staff/monthly-summary">
                                <WalletCards className="h-4 w-4" />
                                月次集計
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

            <MobileWorkerNav />
        </div>
    );
};

export default StaffLayout;