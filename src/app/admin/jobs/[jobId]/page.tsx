import { notFound } from "next/navigation";
import { getActiveStaffCandidates, getJobDetail } from "@/features/jobs/queries";
import { JobAssignedStaffTable } from "@/features/jobs/components/job-assigned-staff-table";
import { JobBasicInfoCards } from "@/features/jobs/components/job-basic-info-cards";
import { JobCandidateTable } from "@/features/jobs/components/job-candidate-table";
import { JobDangerZone } from "@/features/jobs/components/job-danger-zone";
import { JobDetailHeader } from "@/features/jobs/components/job-detail-header";
import { JobShiftSlotTable } from "@/features/jobs/components/job-shift-slot-table";
import { JobSummaryCards } from "@/features/jobs/components/job-summary-cards";
import { JobWorkReportTable } from "@/features/jobs/components/job-work-report-table";
import { ExternalShiftAssignmentTable } from "@/features/external-shift-assignments/components/external-shift-assignment-table";

type AdminJobDetailPageProps = {
    params: Promise<{
        jobId: string;
    }>;
};

const AdminJobDetailPage = async ({ params }: AdminJobDetailPageProps) => {
    const { jobId } = await params;

    const job = await getJobDetail(jobId);

    if (!job) {
        notFound();
    }

    const candidates = await getActiveStaffCandidates();

    const totalRequiredPeople = job.requiredPeople;
    const assignedPeople = job.assignedPeople;
    const shortagePeople = Math.max(totalRequiredPeople - assignedPeople, 0);
    const fulfillmentRate = job.fulfillmentRate;
    const isFulfilled = fulfillmentRate >= 100;

    const assignedAssignments = job.shiftAssignments.filter((assignment) => {
        return assignment.status === "ASSIGNED";
    });

    return (
        <div className="space-y-8">
            <JobDetailHeader
                jobId={job.id}
                title={job.title}
                isFulfilled={isFulfilled}
            />

            <JobSummaryCards
                totalRequiredPeople={totalRequiredPeople}
                assignedPeople={assignedPeople}
                shortagePeople={shortagePeople}
                fulfillmentRate={fulfillmentRate}
            />

            <JobBasicInfoCards job={job} />

            <JobShiftSlotTable jobId={job.id} shiftSlots={job.shiftSlots} />

            <ExternalShiftAssignmentTable
                jobId={job.id}
                externalAssignments={job.externalStaffAssignments}
            />

            <JobAssignedStaffTable assignments={assignedAssignments} />

            <JobWorkReportTable reports={job.workReports} />

            <JobCandidateTable candidates={candidates} />

            <JobDangerZone jobId={job.id} />
        </div>
    );
};

export default AdminJobDetailPage;