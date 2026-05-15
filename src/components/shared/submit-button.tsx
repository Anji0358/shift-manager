"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
    children: React.ReactNode;
    pendingText?: string;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
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
            className={className}
            variant={variant}
            size={size}
        >
            {pending ? pendingText : children}
        </Button>
    );
};