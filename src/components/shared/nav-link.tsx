"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { appStyles } from "@/components/shared/design-tokens";

type NavLinkProps = {
    href: string;
    children: ReactNode;
    exact?: boolean;
};

export const NavLink = ({ href, children, exact = false }: NavLinkProps) => {
    const pathname = usePathname();

    const isActive = exact ? pathname === href : pathname.startsWith(href);

    return (
        <Link
            href={href}
            className={[
                appStyles.nav.linkBase,
                isActive
                    ? appStyles.nav.linkActive
                    : appStyles.nav.linkInactive,
            ].join(" ")}
        >
            {children}
        </Link>
    );
};