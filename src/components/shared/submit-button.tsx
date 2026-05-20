"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { type VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/ui/button";

type SubmitButtonProps = {
    children: ReactNode;
    pendingText?: string;
    className?: string;
} & VariantProps<typeof buttonVariants>;

export const SubmitButton = ({
    children,
    pendingText = "処理中...",
    className,
    variant = "default",
    size = "default",
}: SubmitButtonProps) => {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            disabled={pending}
            variant={variant}
            size={size}
            aria-disabled={pending}
            className={[
                "transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {pending ? (
                <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{pendingText}</span>
                </span>
            ) : (
                children
            )}
        </Button>
    );
};