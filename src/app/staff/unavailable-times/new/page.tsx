import { CalendarX2 } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { UnavailableTimeForm } from "@/features/unavailable-times/components/unavailable-time-form";

const StaffNewUnavailableTimePage = () => {
    return (
        <PageShell>
            <PageHeader
                title="NGの日時を登録"
                description="NGの日や時間を登録すると、管理者がスタッフを割り振るときの候補から外れます。授業・予定・試験など、NGの日時を登録してください。"
            />

            <BridalCard>
                <CardHeader className="p-5 pb-3">
                    <div className="flex items-start gap-3">
                        <div className={bridalStyles.icon.circle}>
                            <CalendarX2 className="h-5 w-5" />
                        </div>

                        <div>
                            <CardTitle
                                className={[
                                    bridalStyles.text.title,
                                    "text-xl",
                                ].join(" ")}
                            >
                                NGの日時
                            </CardTitle>
                            <p className="mt-1 text-sm text-slate-500">
                                終日NG・時間指定NG・毎週固定NGを登録できます。
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-5 pt-2">
                    <UnavailableTimeForm />
                </CardContent>
            </BridalCard>
        </PageShell>
    );
};

export default StaffNewUnavailableTimePage;