import { LinkButton } from "@/components/shared/link-button";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const days = ["月", "火", "水", "木", "金", "土", "日"];

const periods = [
    {
        label: "1限",
        time: "09:00〜10:30",
    },
    {
        label: "2限",
        time: "10:40〜12:10",
    },
    {
        label: "3限",
        time: "13:00〜14:30",
    },
    {
        label: "4限",
        time: "14:40〜16:10",
    },
    {
        label: "5限",
        time: "16:20〜17:50",
    },
    {
        label: "6限",
        time: "18:00〜19:30",
    },
];

const StaffWeeklyUnavailableTimePage = () => {
    return (
        <div className="space-y-6">
            <section className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">毎週固定NG登録</h1>
                    <p className="mt-2 text-slate-600">
                        大学の時間割のように、毎週決まってNGの時間帯を登録します。
                    </p>
                </div>

                <LinkButton href="/staff/unavailable-times" variant="outline">
                    一覧へ戻る
                </LinkButton>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>時間割形式のNG登録</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="overflow-x-auto">
                        <div className="min-w-[760px] rounded-lg border">
                            <div className="grid grid-cols-8 border-b bg-slate-100 text-sm font-medium">
                                <div className="p-3">時限</div>

                                {days.map((day) => (
                                    <div key={day} className="border-l p-3 text-center">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {periods.map((period) => (
                                <div
                                    key={period.label}
                                    className="grid grid-cols-8 border-b last:border-b-0"
                                >
                                    <div className="bg-slate-50 p-3 text-sm">
                                        <p className="font-medium">{period.label}</p>
                                        <p className="text-xs text-slate-500">
                                            {period.time}
                                        </p>
                                    </div>

                                    {days.map((day) => (
                                        <div
                                            key={`${day}-${period.label}`}
                                            className="border-l p-2"
                                        >
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-16 w-full transition active:scale-95"
                                            >
                                                NGにする
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="mt-4 text-sm text-slate-500">
                        このStepではUIのみ作成します。クリック状態の保持と保存処理は、後のServer
                        Actions実装時に追加します。
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffWeeklyUnavailableTimePage;