"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    CalendarDays,
    CalendarX,
    Home,
    ListChecks,
    WalletCards,
} from "lucide-react";

const navItems = [
    {
        href: "/staff",
        label: "ホーム",
        icon: Home,
        exact: true,
    },
    {
        href: "/staff/shifts",
        label: "シフト",
        icon: ListChecks,
        exact: false,
    },
    {
        href: "/staff/calendar",
        label: "予定",
        icon: CalendarDays,
        exact: false,
    },
    {
        href: "/staff/unavailable-times",
        label: "不可",
        icon: CalendarX,
        exact: false,
    },
    {
        href: "/staff/monthly-summary",
        label: "集計",
        icon: WalletCards,
        exact: false,
    },
];

export const MobileWorkerNav = () => {
    const pathname = usePathname();

    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#eadcc1] bg-white/95 shadow-[0_-8px_24px_rgba(120,79,20,0.08)] backdrop-blur md:hidden">
            <div className="grid grid-cols-5 px-1 py-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={[
                                "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium transition active:scale-95",
                                isActive
                                    ? "bg-[#fff8e8] text-[#8a641f] shadow-sm shadow-yellow-900/5"
                                    : "text-slate-500 hover:bg-[#fffdf8] hover:text-[#8a641f]",
                            ].join(" ")}
                        >
                            <Icon
                                className={[
                                    "h-5 w-5",
                                    isActive
                                        ? "stroke-[2.5] text-[#b8872d]"
                                        : "stroke-2 text-slate-400",
                                ].join(" ")}
                            />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};