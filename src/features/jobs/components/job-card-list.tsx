import type { Job, JobShiftSlot } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/shared/link-button";
import { bridalStyles } from "@/components/shared/design-tokens";
import { formatDate } from "@/lib/format";
import {
    CalendarDays,
    Clock,
    MapPin,
    Users,
} from "lucide-react";

type JobWithFulfillment = Job & {
    shiftSlots: JobShiftSlot[];
    requiredPeople: number;
    assignedPeople: number;
    assignedInternalPeople: number;
    assignedExternalPeople: number;
    fulfillmentRate: number;
};

type JobCardListProps = {
    jobs: JobWithFulfillment[];
};

export const JobCardList = ({ jobs }: JobCardListProps) => {
    if (jobs.length === 0) {
        return (
            <div
                className={[
                    bridalStyles.card.base,
                    "p-6 text-center text-sm text-slate-500",
                ].join(" ")}
            >
                案件がありません。
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {jobs.map((job) => {
                const shiftSlotSummary = formatShiftSlotSummary(job.shiftSlots);
                const isFulfilled = job.fulfillmentRate >= 100;

                return (
                    <article
                        key={job.id}
                        className={[
                            bridalStyles.card.base,
                            "overflow-hidden",
                        ].join(" ")}
                    >
                        <div className="space-y-4 p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#b8872d]">
                                        Job
                                    </p>

                                    <h3
                                        className={[
                                            bridalStyles.text.title,
                                            "mt-1 text-xl leading-snug",
                                        ].join(" ")}
                                    >
                                        {job.title}
                                    </h3>
                                </div>

                                <Badge
                                    className={
                                        isFulfilled
                                            ? bridalStyles.badge.fulfilled
                                            : bridalStyles.badge.pending
                                    }
                                >
                                    {isFulfilled ? "充足" : "未充足"}
                                </Badge>
                            </div>

                            <div className="grid gap-3 text-sm text-slate-600">
                                <div className="flex items-start gap-2">
                                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#b8872d]" />
                                    <span>{formatDate(job.workDate)}</span>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#b8872d]" />
                                    <span>{shiftSlotSummary}</span>
                                </div>

                                <div className="flex items-start gap-2">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#b8872d]" />
                                    <span>{job.location}</span>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#b8872d]" />
                                    <div>
                                        <p className="font-medium text-slate-700">
                                            {job.assignedPeople}/{job.requiredPeople}人
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            登録スタッフ {job.assignedInternalPeople}人 / 外部人員{" "}
                                            {job.assignedExternalPeople}人
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2 border-t border-[#f0e5d0] bg-[#fffdf8]/70 p-4">
                            <LinkButton
                                href={`/admin/jobs/${job.id}`}
                                variant="outline"
                                className={[
                                    bridalStyles.button.secondary,
                                    "w-full",
                                ].join(" ")}
                            >
                                詳細を見る
                            </LinkButton>

                            <LinkButton
                                href={`/admin/jobs/${job.id}/assignments`}
                                className={[
                                    bridalStyles.button.primary,
                                    "w-full",
                                ].join(" ")}
                            >
                                スタッフ割り振り
                            </LinkButton>
                        </div>
                    </article>
                );
            })}
        </div>
    );
};

const formatShiftSlotSummary = (shiftSlots: JobShiftSlot[]) => {
    if (shiftSlots.length === 0) {
        return "勤務枠未設定";
    }

    if (shiftSlots.length === 1) {
        const slot = shiftSlots[0];

        return `${slot.startTime} - ${slot.endTime}`;
    }

    const firstSlot = shiftSlots[0];

    return `${firstSlot.startTime} - ${firstSlot.endTime} 他${shiftSlots.length - 1
        }枠`;
};