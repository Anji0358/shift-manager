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
import { appStyles } from "@/components/shared/design-tokens";

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
        label: "スタッフ",
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
        <nav className={appStyles.nav.mobileWrapper}>
            <div className="grid grid-cols-6 px-1 py-1">
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