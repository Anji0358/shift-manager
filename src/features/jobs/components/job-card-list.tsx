import type { Job } from "@prisma/client";
import { JobCard } from "@/features/jobs/components/job-card";

type JobWithFulfillment = Job & {
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
                <JobCard key={job.id} job={job} />
            ))}
        </div>
    );
};