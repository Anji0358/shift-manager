import Link from "next/link";
import { LogoutButton } from "@/components/shared/logout-button";
import { requireLogin } from "@/lib/auth/guards";

type StaffLayoutProps = {
    children: React.ReactNode;
};

const StaffLayout = async ({ children }: StaffLayoutProps) => {
    await requireLogin();

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/staff" className="text-lg font-bold">
                        Shift Manager Staff
                    </Link>

                    <div className="flex items-center gap-6">
                        <nav className="flex gap-4 text-sm text-slate-600">
                            <Link href="/staff/shifts">確定シフト</Link>
                            <Link href="/staff/calendar">カレンダー</Link>
                            <Link href="/staff/unavailable-times">勤務不可</Link>
                            <Link href="/staff/work-history">就労履歴</Link>
                            <Link href="/staff/monthly-summary">月次集計</Link>
                            <Link href="/">トップ</Link>
                        </nav>

                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
        </div>
    );
};

export default StaffLayout;