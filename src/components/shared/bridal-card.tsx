import { Card } from "@/components/ui/card";

type BridalCardProps = {
    children: React.ReactNode;
    className?: string;
};

export const BridalCard = ({ children, className }: BridalCardProps) => {
    return (
        <Card
            className={[
                "rounded-2xl border-[#eadcc1] bg-white/88 text-slate-900 shadow-lg shadow-yellow-900/5 backdrop-blur",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {children}
        </Card>
    );
};