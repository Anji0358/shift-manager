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
                "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
                "active:scale-95",
                "[&_svg]:h-4 [&_svg]:w-4",
                isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25 hover:from-blue-400 hover:to-indigo-400 hover:text-white [&_svg]:text-white"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700 [&_svg]:text-slate-400 hover:[&_svg]:text-blue-600",
            ].join(" ")}
        >
            {children}
        </Link>
    );
};