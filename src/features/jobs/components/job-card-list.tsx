import type { Job, JobShiftSlot } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/shared/link-button";
import { AppCard } from "@/components/shared/bridal-card";
import { appStyles } from "@/components/shared/design-tokens";
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
            <AppCard className="p-6 text-center">
                <p className={appStyles.text.muted}>
                    案件がありません。
                </p>
            </AppCard>
        );
    }

    return (
        <div className="space-y-4">
            {jobs.map((job) => {
                const shiftSlotSummary = formatShiftSlotSummary(job.shiftSlots);
                const isFulfilled = job.fulfillmentRate >= 100;

                return (
                    <AppCard
                        key={job.id}
                        className="overflow-hidden"
                    >
                        <div className="space-y-4 p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p
                                        className={[
                                            "text-xs font-medium uppercase tracking-[0.18em]",
                                            appStyles.textColor.accent,
                                        ].join(" ")}
                                    >
                                        Job
                                    </p>

                                    <h3
                                        className={[
                                            appStyles.text.title,
                                            "mt-1 text-xl leading-snug",
                                        ].join(" ")}
                                    >
                                        {job.title}
                                    </h3>
                                </div>

                                <Badge
                                    className={
                                        isFulfilled
                                            ? appStyles.badge.fulfilled
                                            : appStyles.badge.pending
                                    }
                                >
                                    {isFulfilled ? "充足" : "未充足"}
                                </Badge>
                            </div>

                            <div
                                className={[
                                    "grid gap-3 text-sm",
                                    appStyles.textColor.body,
                                ].join(" ")}
                            >
                                <InfoRow
                                    icon={<CalendarDays className="h-4 w-4" />}
                                    value={formatDate(job.workDate)}
                                />

                                <InfoRow
                                    icon={<Clock className="h-4 w-4" />}
                                    value={shiftSlotSummary}
                                />

                                <InfoRow
                                    icon={<MapPin className="h-4 w-4" />}
                                    value={job.location}
                                />

                                <div className="flex items-start gap-2">
                                    <Users
                                        className={[
                                            "mt-0.5 h-4 w-4 shrink-0",
                                            appStyles.icon.accent,
                                        ].join(" ")}
                                    />

                                    <div>
                                        <p
                                            className={[
                                                "font-medium",
                                                appStyles.textColor.tableHead,
                                            ].join(" ")}
                                        >
                                            {job.assignedPeople}/{job.requiredPeople}人
                                        </p>
                                        <p
                                            className={[
                                                "mt-0.5 text-xs",
                                                appStyles.textColor.muted,
                                            ].join(" ")}
                                        >
                                            登録スタッフ {job.assignedInternalPeople}人 / 外部人員{" "}
                                            {job.assignedExternalPeople}人
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className={[
                                "grid gap-2 border-t p-4",
                                appStyles.border.soft,
                                appStyles.background.warmSoft,
                            ].join(" ")}
                        >
                            <LinkButton
                                href={`/admin/jobs/${job.id}`}
                                variant="outline"
                                className={[
                                    appStyles.button.secondary,
                                    "w-full",
                                ].join(" ")}
                            >
                                詳細を見る
                            </LinkButton>

                            <LinkButton
                                href={`/admin/jobs/${job.id}/assignments`}
                                className={[
                                    appStyles.button.primary,
                                    "w-full",
                                ].join(" ")}
                            >
                                スタッフ割り振り
                            </LinkButton>
                        </div>
                    </AppCard>
                );
            })}
        </div>
    );
};

type InfoRowProps = {
    icon: React.ReactNode;
    value: string;
};

const InfoRow = ({ icon, value }: InfoRowProps) => {
    return (
        <div className="flex items-start gap-2">
            <span
                className={[
                    "mt-0.5 shrink-0",
                    appStyles.icon.accent,
                ].join(" ")}
            >
                {icon}
            </span>
            <span>{value}</span>
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