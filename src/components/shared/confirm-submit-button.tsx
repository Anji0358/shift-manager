"use client";

import { Button } from "@/components/ui/button";

type ConfirmSubmitButtonProps = {
    children: React.ReactNode;
    message: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
};

export const ConfirmSubmitButton = ({
    children,
    message,
    variant = "default",
    size = "default",
}: ConfirmSubmitButtonProps) => {
    return (
        <Button
            type="submit"
            variant={variant}
            size={size}
            onClick={(event) => {
                const ok = window.confirm(message);

                if (!ok) {
                    event.preventDefault();
                }
            }}
        >
            {children}
        </Button>
    );
};