import type { Employee, Job, WorkReport } from "@prisma/client";
import { CalendarDays, Clock, User } from "lucide-react";
import { formatDate } from "@/lib/format";
import {
    approveWorkReport,
    rejectWorkReport,
} from "@/features/work-reports/actions";
import { SubmitButton } from "@/components/shared/submit-button";
import { Badge } from "@/components/ui/badge";

type WorkReportWithRelations = WorkReport & {
    employee: Employee;
    job: Job;
};

type WorkReportCardListProps = {
    reports: WorkReportWithRelations[];
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case "NOT_SUBMITTED":
            return "未提出";
        case "SUBMITTED":
            return "提出済み";
        case "APPROVED":
            return "承認済み";
        case "REJECTED":
            return "差し戻し";
        default:
            return status;
    }
};

export const WorkReportCardList = ({ reports }: WorkReportCardListProps) => {
    if (reports.length === 0) {
        return (
            <div className="rounded-xl border bg-white p-6 text-center text-sm text-slate-500">
                就労報告がありません。
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reports.map((report) => (
                <article
                    key={report.id}
                    className="rounded-xl border bg-white p-4 shadow-sm"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h2 className="font-semibold">{report.job.title}</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {report.employee.name}
                            </p>
                        </div>

                        <Badge
                            variant={report.status === "APPROVED" ? "default" : "secondary"}
                        >
                            {getStatusLabel(report.status)}
                        </Badge>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            <span>{formatDate(report.job.workDate)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                                {report.actualStartTime} - {report.actualEndTime}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{report.employee.email}</span>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
                        <div>
                            <p className="text-xs text-slate-500">休憩</p>
                            <p className="font-medium">{report.actualBreakMinutes}分</p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-500">交通費</p>
                            <p className="font-medium">
                                ¥{report.transportationFee.toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-500">食事</p>
                            <p className="font-medium">{report.hasMeal ? "あり" : "なし"}</p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-500">状態</p>
                            <p className="font-medium">{getStatusLabel(report.status)}</p>
                        </div>
                    </div>

                    {report.status === "SUBMITTED" && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            <form action={approveWorkReport}>
                                <input type="hidden" name="workReportId" value={report.id} />
                                <SubmitButton className="w-full" pendingText="承認中...">
                                    承認
                                </SubmitButton>
                            </form>

                            <form action={rejectWorkReport}>
                                <input type="hidden" name="workReportId" value={report.id} />
                                <SubmitButton
                                    className="w-full"
                                    variant="outline"
                                    pendingText="差戻し中..."
                                >
                                    差し戻し
                                </SubmitButton>
                            </form>
                        </div>
                    )}
                </article>
            ))}
        </div>
    );
};