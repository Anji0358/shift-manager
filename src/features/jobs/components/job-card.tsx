import type { Job, JobShiftSlot } from "@prisma/client";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/shared/link-button";
import { formatDate } from "@/lib/format";

type JobWithFulfillment = Job & {
    shiftSlots: JobShiftSlot[];
    requiredPeople: number;
    assignedPeople: number;
    assignedInternalPeople: number;
    assignedExternalPeople: number;
    fulfillmentRate: number;
};

type JobCardProps = {
    job: JobWithFulfillment;
};

export const JobCard = ({ job }: JobCardProps) => {
    const isFulfilled = job.fulfillmentRate >= 100;
    const shiftSlotSummary = formatShiftSlotSummary(job.shiftSlots);

    return (
        <article className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="font-semibold leading-tight">{job.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{job.location}</p>
                </div>

                <Badge variant={isFulfilled ? "default" : "secondary"}>
                    {isFulfilled ? "充足" : "未充足"}
                </Badge>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>{formatDate(job.workDate)}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{shiftSlotSummary}</span>
                </div>

                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.meetingPlace || "集合場所未設定"}</span>
                </div>

                <div className="flex items-start gap-2">
                    <Users className="mt-0.5 h-4 w-4" />

                    <div>
                        <p>
                            {job.assignedPeople}/{job.requiredPeople}人・
                            {job.fulfillmentRate}%
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            登録スタッフ {job.assignedInternalPeople}人 / 外部人員{" "}
                            {job.assignedExternalPeople}人
                        </p>
                    </div>
                </div>
            </div>

            <LinkButton
                href={`/admin/jobs/${job.id}`}
                className="mt-4 w-full"
                variant="outline"
            >
                詳細を見る
            </LinkButton>
        </article>
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