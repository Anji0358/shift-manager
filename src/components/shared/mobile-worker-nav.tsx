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
import { appStyles } from "@/components/shared/design-tokens";

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
        <nav className={appStyles.nav.mobileWrapper}>
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
                                appStyles.nav.mobileLinkBase,
                                isActive
                                    ? appStyles.nav.mobileLinkActive
                                    : appStyles.nav.mobileLinkInactive,
                            ].join(" ")}
                        >
                            <Icon
                                className={[
                                    "h-5 w-5",
                                    isActive
                                        ? appStyles.nav.mobileIconActive
                                        : appStyles.nav.mobileIconInactive,
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