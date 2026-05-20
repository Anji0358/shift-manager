"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type LinkButtonProps = {
    href: string;
    children: React.ReactNode;
    pendingText?: string;
    className?: string;
    variant?: React.ComponentProps<typeof Button>["variant"];
    size?: React.ComponentProps<typeof Button>["size"];
};

export const LinkButton = ({
    href,
    children,
    pendingText = "移動中...",
    className,
    variant,
    size,
}: LinkButtonProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        startTransition(() => {
            router.push(href);
        });
    };

    return (
        <Button
            asChild
            disabled={isPending}
            className={className}
            variant={variant}
            size={size}
        >
            <Link href={href} onClick={handleClick} aria-disabled={isPending}>
                {isPending ? (
                    <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {pendingText}
                    </span>
                ) : (
                    children
                )}
            </Link>
        </Button>
    );
};