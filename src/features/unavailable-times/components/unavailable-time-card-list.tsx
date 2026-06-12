import type { ReactNode } from "react";
import type { UnavailableTime } from "@prisma/client";
import { CalendarDays, Clock, Repeat, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
import { deleteUnavailableTime } from "@/features/unavailable-times/actions";
import { formatDate } from "@/lib/format";
import {
    dayOfWeekLabel,
    unavailableTypeLabel,
} from "@/features/unavailable-times/labels";

type UnavailableTimeCardListProps = {
    unavailableTimes: UnavailableTime[];
};

const getUnavailableDescription = (unavailableTime: UnavailableTime) => {
    if (unavailableTime.type === "FULL_DAY") {
        return "この日は終日勤務できません。";
    }

    if (unavailableTime.type === "TIME_RANGE") {
        return "この日の一部時間だけ勤務できません。";
    }

    if (unavailableTime.type === "WEEKLY_FIXED") {
        return "毎週決まった時間に勤務できません。";
    }

    return "NGの予定です。";
};

const getUnavailableDateLabel = (unavailableTime: UnavailableTime) => {
    if (unavailableTime.date) {
        return formatDate(unavailableTime.date);
    }

    if (unavailableTime.dayOfWeek) {
        return dayOfWeekLabel[unavailableTime.dayOfWeek];
    }

    return "-";
};

const getUnavailableTimeLabel = (unavailableTime: UnavailableTime) => {
    if (unavailableTime.type === "FULL_DAY") {
        return "終日";
    }

    if (unavailableTime.startTime && unavailableTime.endTime) {
        return `${unavailableTime.startTime}〜${unavailableTime.endTime}`;
    }

    return "-";
};

export const UnavailableTimeCardList = ({
    unavailableTimes,
}: UnavailableTimeCardListProps) => {
    if (unavailableTimes.length === 0) {
        return (
            <BridalCard className="p-6 text-center text-sm text-slate-500">
                NGの日時はまだ登録されていません。
            </BridalCard>
        );
    }

    return (
        <div className="space-y-4">
            {unavailableTimes.map((unavailableTime) => (
                <BridalCard key={unavailableTime.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <Badge className={bridalStyles.badge.neutral}>
                                {unavailableTypeLabel[unavailableTime.type]}
                            </Badge>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                {getUnavailableDescription(unavailableTime)}
                            </p>
                        </div>

                        <form action={deleteUnavailableTime}>
                            <input
                                type="hidden"
                                name="unavailableTimeId"
                                value={unavailableTime.id}
                            />

                            <ConfirmSubmitButton
                                size="sm"
                                variant="outline"
                                className={bridalStyles.button.danger}
                                message="このNGの日時を削除します。よろしいですか？"
                            >
                                <Trash2 className="mr-1 h-4 w-4" />
                                削除
                            </ConfirmSubmitButton>
                        </form>
                    </div>

                    <div className="mt-4 space-y-3 text-sm text-slate-700">
                        <InfoRow
                            icon={
                                unavailableTime.type === "WEEKLY_FIXED" ? (
                                    <Repeat className="h-4 w-4" />
                                ) : (
                                    <CalendarDays className="h-4 w-4" />
                                )
                            }
                            value={getUnavailableDateLabel(unavailableTime)}
                        />

                        <InfoRow
                            icon={<Clock className="h-4 w-4" />}
                            value={getUnavailableTimeLabel(unavailableTime)}
                        />

                        {unavailableTime.reason ? (
                            <div className="rounded-2xl border border-[#f0e5d0] bg-[#fffdf8]/80 p-4 text-sm leading-6 text-slate-600">
                                {unavailableTime.reason}
                            </div>
                        ) : null}
                    </div>
                </BridalCard>
            ))}
        </div>
    );
};

type InfoRowProps = {
    icon: ReactNode;
    value: string;
};

const InfoRow = ({ icon, value }: InfoRowProps) => {
    return (
        <div className="flex items-center gap-2">
            <span className="text-[#b8872d]">{icon}</span>
            <span className="font-medium text-slate-800">{value}</span>
        </div>
    );
};