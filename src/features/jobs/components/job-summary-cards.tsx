import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
import {
    CircleGauge,
    TriangleAlert,
    UserCheck,
    Users,
} from "lucide-react";

type JobSummaryCardsProps = {
    totalRequiredPeople: number;
    assignedPeople: number;
    shortagePeople: number;
    fulfillmentRate: number;
};

export const JobSummaryCards = ({
    totalRequiredPeople,
    assignedPeople,
    shortagePeople,
    fulfillmentRate,
}: JobSummaryCardsProps) => {
    return (
        <section className="grid gap-4 md:grid-cols-4">
            <SummaryCard
                title="必要人数"
                value={`${totalRequiredPeople}人`}
                icon={<Users className="h-5 w-5" />}
            />

            <SummaryCard
                title="確定人数"
                value={`${assignedPeople}人`}
                icon={<UserCheck className="h-5 w-5" />}
            />

            <SummaryCard
                title="不足人数"
                value={`${shortagePeople}人`}
                icon={<TriangleAlert className="h-5 w-5" />}
                valueClassName={
                    shortagePeople > 0 ? "text-amber-700" : "text-slate-900"
                }
            />

            <SummaryCard
                title="充足率"
                value={`${fulfillmentRate}%`}
                icon={<CircleGauge className="h-5 w-5" />}
                valueClassName={
                    fulfillmentRate >= 100 ? "text-[#8a641f]" : "text-slate-900"
                }
            />
        </section>
    );
};

type SummaryCardProps = {
    title: string;
    value: string;
    icon: React.ReactNode;
    valueClassName?: string;
};

const SummaryCard = ({
    title,
    value,
    icon,
    valueClassName,
}: SummaryCardProps) => {
    return (
        <BridalCard>
            <CardHeader className="space-y-0 p-5 pb-3">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm font-medium text-slate-500">
                        {title}
                    </CardTitle>

                    <div className={bridalStyles.icon.smallCircle}>
                        {icon}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-0">
                <p
                    className={[
                        "text-3xl font-semibold tracking-tight",
                        valueClassName ?? "text-slate-900",
                    ].join(" ")}
                >
                    {value}
                </p>
            </CardContent>
        </BridalCard>
    );
};