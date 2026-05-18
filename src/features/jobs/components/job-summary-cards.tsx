import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

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
            <SummaryCard title="必要人数" value={`${totalRequiredPeople}人`} />
            <SummaryCard title="確定人数" value={`${assignedPeople}人`} />
            <SummaryCard title="不足人数" value={`${shortagePeople}人`} />
            <SummaryCard title="充足率" value={`${fulfillmentRate}%`} />
        </section>
    );
};

type SummaryCardProps = {
    title: string;
    value: string;
};

const SummaryCard = ({ title, value }: SummaryCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm text-slate-500">{title}</CardTitle>
            </CardHeader>

            <CardContent>
                <p className="text-3xl font-bold">{value}</p>
            </CardContent>
        </Card>
    );
};