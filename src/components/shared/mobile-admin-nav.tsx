"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BriefcaseBusiness,
    ClipboardList,
    FileText,
    Home,
    Users,
    WalletCards,
} from "lucide-react";

const navItems = [
    {
        href: "/admin",
        label: "ホーム",
        icon: Home,
        exact: true,
    },
    {
        href: "/admin/jobs",
        label: "案件",
        icon: BriefcaseBusiness,
        exact: false,
    },
    {
        href: "/admin/job-templates",
        label: "テンプレ",
        icon: FileText,
        exact: false,
    },
    {
        href: "/admin/employees",
        label: "従業員",
        icon: Users,
        exact: false,
    },
    {
        href: "/admin/monthly-summary",
        label: "集計",
        icon: WalletCards,
        exact: false,
    },
    {
        href: "/admin/work-reports",
        label: "報告",
        icon: ClipboardList,
        exact: false,
    },
];

export const MobileAdminNav = () => {
    const pathname = usePathname();

    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-white md:hidden">
            <div className="grid grid-cols-6">
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
                                "flex flex-col items-center gap-1 px-1 py-2 text-[11px] transition active:scale-95",
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