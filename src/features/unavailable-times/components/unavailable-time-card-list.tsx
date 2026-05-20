import type { UnavailableTime } from "@prisma/client";
import { CalendarDays, Clock, Repeat, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
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

    return "勤務できない予定です。";
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
            <div className="rounded-xl border bg-white p-6 text-center text-sm text-slate-500">
                勤務できない日時はまだ登録されていません。
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {unavailableTimes.map((unavailableTime) => (
                <article
                    key={unavailableTime.id}
                    className="rounded-xl border bg-white p-4 shadow-sm"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <Badge variant="secondary">
                                {unavailableTypeLabel[unavailableTime.type]}
                            </Badge>

                            <p className="mt-2 text-sm text-slate-500">
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
                                message="この勤務できない日時を削除します。よろしいですか？"
                            >
                                <Trash2 className="mr-1 h-4 w-4" />
                                削除
                            </ConfirmSubmitButton>
                        </form>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-700">
                        <div className="flex items-center gap-2">
                            {unavailableTime.type === "WEEKLY_FIXED" ? (
                                <Repeat className="h-4 w-4 text-slate-400" />
                            ) : (
                                <CalendarDays className="h-4 w-4 text-slate-400" />
                            )}

                            <span>{getUnavailableDateLabel(unavailableTime)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span>{getUnavailableTimeLabel(unavailableTime)}</span>
                        </div>

                        {unavailableTime.reason && (
                            <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                                {unavailableTime.reason}
                            </div>
                        )}
                    </div>
                </article>
            ))}
        </div>
    );
};