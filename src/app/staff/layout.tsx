import Link from "next/link";
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

type StaffLayoutProps = {
    children: React.ReactNode;
};

const StaffLayout = async ({ children }: StaffLayoutProps) => {
    await requireLogin();

    return (
        <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
            <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
                    <Link href="/staff" className="text-lg font-bold">
                        Shift Manager Staff
                    </Link>

                    <div className="hidden items-center gap-6 md:flex">
                        <nav className="flex items-center gap-2">
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

            <MobileWorkerNav />
        </div>
    );
};

export default StaffLayout;