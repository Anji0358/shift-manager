"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
    children: React.ReactNode;
    pendingText?: string;
    className?: string;
    variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
    size?: "default" | "sm" | "lg" | "icon";
};

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
            className={[
                "transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            variant={variant}
            size={size}
            aria-disabled={pending}
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