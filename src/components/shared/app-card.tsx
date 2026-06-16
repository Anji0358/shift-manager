import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { appStyles } from "@/components/shared/design-tokens";

type AppCardProps = {
    children: ReactNode;
    className?: string;
};

export const AppCard = ({ children, className }: AppCardProps) => {
    return (
        <Card
            className={[appStyles.card.base, className]
                .filter(Boolean)
                .join(" ")}
        >
            {children}
        </Card>
    );
};