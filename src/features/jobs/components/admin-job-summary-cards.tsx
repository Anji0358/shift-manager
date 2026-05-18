import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type AdminJobSummaryCardsProps = {
    totalRequiredPeople: number;
    assignedPeople: number;
    shortagePeople: number;
    fulfillmentRate: number;
};

export const AdminJobSummaryCards = ({
    totalRequiredPeople,
    assignedPeople,
    shortagePeople,
    fulfillmentRate,
}: AdminJobSummaryCardsProps) => {
    return (
        <section className="grid gap-4 md:grid-cols-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm text-slate-500">必要人数</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{totalRequiredPeople}人</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm text-slate-500">確定人数</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{assignedPeople}人</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm text-slate-500">不足人数</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{shortagePeople}人</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm text-slate-500">充足率</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{fulfillmentRate}%</p>
                </CardContent>
            </Card>
        </section>
    );
};