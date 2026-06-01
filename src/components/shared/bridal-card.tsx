import { Card } from "@/components/ui/card";
import { bridalStyles } from "@/components/shared/design-tokens";

type BridalCardProps = {
    children: React.ReactNode;
    className?: string;
};

export const BridalCard = ({ children, className }: BridalCardProps) => {
    return (
        <Card
            className={[bridalStyles.card.base, className]
                .filter(Boolean)
                .join(" ")}
        >
            {children}
        </Card>
    );
};