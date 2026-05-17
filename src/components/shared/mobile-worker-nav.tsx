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
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-white md:hidden">
            <div className="grid grid-cols-5">
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
                                "flex flex-col items-center gap-1 px-2 py-2 text-xs transition active:scale-95",
                                isActive ? "text-slate-950" : "text-slate-500",
                            ].join(" ")}
                        >
                            <Icon
                                className={[
                                    "h-5 w-5",
                                    isActive ? "stroke-[2.5]" : "stroke-2",
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