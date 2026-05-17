import Link from "next/link";
import type { Job } from "@prisma/client";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";

type JobWithFulfillment = Job & {
    requiredPeople: number;
    assignedPeople: number;
    fulfillmentRate: number;
};

type JobCardProps = {
    job: JobWithFulfillment;
};

export const JobCard = ({ job }: JobCardProps) => {
    const isFulfilled = job.fulfillmentRate >= 100;

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
                    <span>
                        {job.startTime} - {job.endTime}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.meetingPlace || "集合場所未設定"}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>
                        {job.assignedPeople}/{job.requiredPeople}人・
                        {job.fulfillmentRate}%
                    </span>
                </div>
            </div>

            <Button asChild className="mt-4 w-full active:scale-95" variant="outline">
                <Link href={`/admin/jobs/${job.id}`}>詳細を見る</Link>
            </Button>
        </article>
    );
};