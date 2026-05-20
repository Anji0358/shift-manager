import type { Job, JobShiftSlot } from "@prisma/client";
import { LinkButton } from "@/components/shared/link-button";
import { JobCard } from "@/features/jobs/components/job-card";

type JobWithFulfillment = Job & {
    shiftSlots: JobShiftSlot[];
    requiredPeople: number;
    assignedPeople: number;
    fulfillmentRate: number;
};

type JobCardListProps = {
    jobs: JobWithFulfillment[];
};

export const JobCardList = ({ jobs }: JobCardListProps) => {
    if (jobs.length === 0) {
        return (
            <div className="rounded-xl border bg-white p-6 text-center text-sm text-slate-500">
                案件がありません。
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {jobs.map((job) => (
                <div key={job.id} className="space-y-3">
                    <JobCard job={job} />

                    <div className="grid gap-2 rounded-xl border bg-white p-4">
                        <LinkButton
                            href={`/admin/jobs/${job.id}`}
                            variant="outline"
                            className="w-full"
                        >
                            詳細を見る
                        </LinkButton>

                        <LinkButton
                            href={`/admin/jobs/${job.id}/assignments`}
                            className="w-full"
                        >
                            スタッフ割り振り
                        </LinkButton>
                    </div>
                </div>
            ))}
        </div>
    );
};