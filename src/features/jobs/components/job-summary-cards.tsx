import type { ReactNode } from "react";
import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AppCard } from "@/components/shared/app-card";
import { appStyles } from "@/components/shared/design-tokens";
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
                valueTone={shortagePeople > 0 ? "warning" : "default"}
            />

            <SummaryCard
                title="充足率"
                value={`${fulfillmentRate}%`}
                icon={<CircleGauge className="h-5 w-5" />}
                valueTone={fulfillmentRate >= 100 ? "accent" : "default"}
            />
        </section>
    );
};

type SummaryCardProps = {
    title: string;
    value: string;
    icon: ReactNode;
    valueTone?: "default" | "accent" | "warning";
};

const SummaryCard = ({
    title,
    value,
    icon,
    valueTone = "default",
}: SummaryCardProps) => {
    return (
        <AppCard>
            <CardHeader className="space-y-0 p-5 pb-3">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle
                        className={[
                            "text-sm font-medium",
                            appStyles.textColor.muted,
                        ].join(" ")}
                    >
                        {title}
                    </CardTitle>

                    <div className={appStyles.icon.smallCircle}>
                        {icon}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-0">
                <p
                    className={[
                        "text-3xl font-semibold tracking-tight",
                        getValueToneClassName(valueTone),
                    ].join(" ")}
                >
                    {value}
                </p>
            </CardContent>
        </AppCard>
    );
};

const getValueToneClassName = (
    valueTone: SummaryCardProps["valueTone"],
) => {
    if (valueTone === "accent") {
        return appStyles.textColor.accentDark;
    }

    if (valueTone === "warning") {
        return appStyles.textColor.pending;
    }

    return appStyles.textColor.default;
};