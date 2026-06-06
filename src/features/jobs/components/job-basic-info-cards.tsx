import { Badge } from "@/components/ui/badge";
import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { GoogleMapsLink } from "@/components/shared/google-maps-link";
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
import { formatDate, formatYen } from "@/lib/format";
import { wageTypeLabel } from "@/features/jobs/labels";
import type { JobDetail } from "@/features/jobs/types";
import {
    BriefcaseBusiness,
    ClipboardList,
    MapPin,
} from "lucide-react";

type JobBasicInfoCardsProps = {
    job: JobDetail;
};

export const JobBasicInfoCards = ({ job }: JobBasicInfoCardsProps) => {
    const shiftSlotSummary = formatShiftSlotSummary(job.shiftSlots);

    return (
        <section className="grid gap-4 md:grid-cols-2">
            <BridalCard>
                <CardHeader className="p-5 pb-3">
                    <div className="flex items-start gap-3">
                        <div className={bridalStyles.icon.circle}>
                            <MapPin className="h-5 w-5" />
                        </div>

                        <div>
                            <CardTitle
                                className={[
                                    bridalStyles.text.title,
                                    "text-xl",
                                ].join(" ")}
                            >
                                案件基本情報
                            </CardTitle>
                            <p className="mt-1 text-sm text-slate-500">
                                日付、場所、集合場所、勤務枠を確認します。
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4 p-5 pt-2 text-sm">
                    <InfoRow label="日付" value={formatDate(job.workDate)} />

                    <div className="space-y-2 rounded-2xl border border-[#f0e5d0] bg-[#fffdf8]/70 p-4">
                        <InfoRow label="場所" value={job.location} />

                        <div className="flex justify-end">
                            <GoogleMapsLink query={job.location} />
                        </div>
                    </div>

                    <div className="space-y-2 rounded-2xl border border-[#f0e5d0] bg-[#fffdf8]/70 p-4">
                        <InfoRow
                            label="集合場所"
                            value={job.meetingPlace || "未設定"}
                        />

                        {job.meetingPlace ? (
                            <div className="flex justify-end">
                                <GoogleMapsLink
                                    query={`${job.location} ${job.meetingPlace}`}
                                />
                            </div>
                        ) : null}
                    </div>

                    <InfoRow label="勤務枠" value={shiftSlotSummary} />
                    <InfoRow label="休憩時間" value={`${job.breakMinutes}分`} />
                    <InfoRow label="食事" value={job.hasMeal ? "あり" : "なし"} />
                    <InfoRow
                        label="交通費"
                        value={formatYen(job.transportationFee)}
                    />
                </CardContent>
            </BridalCard>

            <BridalCard>
                <CardHeader className="p-5 pb-3">
                    <div className="flex items-start gap-3">
                        <div className={bridalStyles.icon.circle}>
                            <BriefcaseBusiness className="h-5 w-5" />
                        </div>

                        <div>
                            <CardTitle
                                className={[
                                    bridalStyles.text.title,
                                    "text-xl",
                                ].join(" ")}
                            >
                                勤務条件・時給設定
                            </CardTitle>
                            <p className="mt-1 text-sm text-slate-500">
                                時給、服装、持ち物、備考を確認します。
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4 p-5 pt-2 text-sm">
                    <div className="flex items-center justify-between gap-4 border-b border-[#f0e5d0] pb-3">
                        <span className="text-slate-500">時給タイプ</span>
                        <Badge className={bridalStyles.badge.neutral}>
                            {wageTypeLabel[job.wageType]}
                        </Badge>
                    </div>

                    <InfoRow
                        label="案件一律時給"
                        value={
                            job.fixedHourlyWage !== null
                                ? formatYen(job.fixedHourlyWage)
                                : "未設定"
                        }
                    />

                    <InfoRow label="服装" value={job.dressCode || "未設定"} />
                    <InfoRow label="持ち物" value={job.belongings || "未設定"} />

                    <div className="space-y-2 rounded-2xl border border-[#f0e5d0] bg-[#fffdf8]/70 p-4">
                        <div className="flex items-center gap-2">
                            <ClipboardList className="h-4 w-4 text-[#b8872d]" />
                            <span className="text-slate-500">備考</span>
                        </div>

                        <p className="whitespace-pre-wrap leading-6 font-medium text-slate-900">
                            {job.note || "未設定"}
                        </p>
                    </div>
                </CardContent>
            </BridalCard>
        </section>
    );
};

type ShiftSlotForSummary = {
    name: string;
    startTime: string;
    endTime: string;
    requiredPeople: number;
};

const formatShiftSlotSummary = (shiftSlots: ShiftSlotForSummary[]) => {
    if (shiftSlots.length === 0) {
        return "勤務枠未設定";
    }

    if (shiftSlots.length === 1) {
        const slot = shiftSlots[0];

        return `${slot.name}：${slot.startTime}〜${slot.endTime} / ${slot.requiredPeople}人`;
    }

    const firstSlot = shiftSlots[0];

    const totalRequiredPeople = shiftSlots.reduce(
        (sum, slot) => sum + slot.requiredPeople,
        0,
    );

    return `${firstSlot.startTime}〜${firstSlot.endTime} 他${shiftSlots.length - 1
        }枠 / 合計${totalRequiredPeople}人`;
};

type InfoRowProps = {
    label: string;
    value: string;
};

const InfoRow = ({ label, value }: InfoRowProps) => {
    return (
        <div className="flex justify-between gap-4 border-b border-[#f0e5d0] pb-3 last:border-b-0 last:pb-0">
            <span className="shrink-0 text-slate-500">{label}</span>
            <span className="text-right font-medium text-slate-900">
                {value}
            </span>
        </div>
    );
};