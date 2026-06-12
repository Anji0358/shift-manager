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
                    ? "border border-[#d6b56d]/70 bg-[#b8872d] text-white shadow-md shadow-yellow-900/15 hover:bg-[#a77925] hover:text-white [&_svg]:text-white"
                    : "text-slate-600 hover:bg-[#fff8e8] hover:text-[#8a641f] [&_svg]:text-slate-400 hover:[&_svg]:text-[#b8872d]",
            ].join(" ")}
        >
            {children}
        </Link>
    );
};