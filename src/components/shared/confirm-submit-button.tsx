"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConfirmSubmitButtonProps = {
    children: React.ReactNode;
    message: string;
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

export const ConfirmSubmitButton = ({
    children,
    message,
    pendingText = "処理中...",
    className,
    variant = "default",
    size = "default",
}: ConfirmSubmitButtonProps) => {
    const { pending } = useFormStatus();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (pending) {
            event.preventDefault();
            return;
        }

        const ok = window.confirm(message);

        if (!ok) {
            event.preventDefault();
        }
    };

    return (
        <Button
            type="submit"
            variant={variant}
            size={size}
            disabled={pending}
            aria-disabled={pending}
            onClick={handleClick}
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