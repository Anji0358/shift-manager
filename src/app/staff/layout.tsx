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
import { bridalStyles } from "@/components/shared/design-tokens";

type StaffLayoutProps = {
    children: ReactNode;
};

const StaffLayout = async ({ children }: StaffLayoutProps) => {
    await requireLogin();

    return (
        <div
            className={[
                bridalStyles.page.shell,
                "min-h-screen pb-20 md:pb-0",
            ].join(" ")}
        >
            <header className="sticky top-0 z-40 border-b border-[#eadcc1] bg-white/90 shadow-sm shadow-yellow-900/5 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
                    <Link
                        href="/staff"
                        className="group flex items-center gap-3"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#ead9b5] bg-[#fffaf0] text-[#b8872d] shadow-sm shadow-yellow-900/5 transition group-hover:bg-[#fff8e8]">
                            <Home className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="font-serif text-lg font-semibold tracking-tight text-slate-900">
                                Shift Manager
                            </p>
                            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#b8872d]">
                                Staff
                            </p>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-5 md:flex">
                        <nav className="flex items-center gap-1 rounded-2xl border border-[#eadcc1] bg-white/80 p-1 shadow-sm shadow-yellow-900/5">
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