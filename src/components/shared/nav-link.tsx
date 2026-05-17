"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

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
                "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
                "hover:bg-slate-100 hover:text-slate-950",
                "active:scale-95",
                isActive
                    ? "bg-slate-900 text-white hover:bg-slate-900 hover:text-white"
                    : "text-slate-600",
            ].join(" ")}
        >
            {children}
        </Link>
    );
};