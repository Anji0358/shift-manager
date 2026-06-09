import type { Employee, Job, WorkReport, WorkReportStatus } from "@prisma/client";
import {
    CalendarDays,
    CheckCircle2,
    Clock,
    RotateCcw,
    User,
} from "lucide-react";
import { formatDate, formatYen } from "@/lib/format";
import {
    approveWorkReport,
    rejectWorkReport,
} from "@/features/work-reports/actions";
import { SubmitButton } from "@/components/shared/submit-button";
import { Badge } from "@/components/ui/badge";
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";

type WorkReportWithRelations = WorkReport & {
    employee: Employee;
    job: Job;
};

type WorkReportCardListProps = {
    reports: WorkReportWithRelations[];
};

const getStatusLabel = (status: WorkReportStatus) => {
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

const getStatusBadgeClassName = (status: WorkReportStatus) => {
    if (status === "APPROVED") {
        return bridalStyles.badge.fulfilled;
    }

    if (status === "SUBMITTED") {
        return bridalStyles.badge.pending;
    }

    if (status === "REJECTED") {
        return "rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 shadow-none hover:bg-red-50";
    }

    return bridalStyles.badge.neutral;
};

export const WorkReportCardList = ({ reports }: WorkReportCardListProps) => {
    if (reports.length === 0) {
        return (
            <BridalCard className="p-6 text-center text-sm text-slate-500">
                就労報告がありません。
            </BridalCard>
        );
    }

    return (
        <div className="space-y-4">
            {reports.map((report) => (
                <BridalCard key={report.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h2
                                className={[
                                    bridalStyles.text.title,
                                    "text-lg",
                                ].join(" ")}
                            >
                                {report.job.title}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {report.employee.name}
                            </p>
                        </div>

                        <Badge className={getStatusBadgeClassName(report.status)}>
                            {getStatusLabel(report.status)}
                        </Badge>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                        <InfoRow icon={<CalendarDays className="h-4 w-4" />}>
                            {formatDate(report.job.workDate)}
                        </InfoRow>

                        <InfoRow icon={<Clock className="h-4 w-4" />}>
                            {report.actualStartTime}〜{report.actualEndTime}
                        </InfoRow>

                        <InfoRow icon={<User className="h-4 w-4" />}>
                            {report.employee.email}
                        </InfoRow>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-[#f0e5d0] bg-[#fffdf8]/80 p-4 text-sm">
                        <SummaryItem
                            label="休憩"
                            value={`${report.actualBreakMinutes}分`}
                        />

                        <SummaryItem
                            label="交通費"
                            value={formatYen(report.transportationFee)}
                        />

                        <SummaryItem
                            label="食事"
                            value={report.hasMeal ? "あり" : "なし"}
                        />

                        <SummaryItem
                            label="状態"
                            value={getStatusLabel(report.status)}
                        />
                    </div>

                    {report.status === "SUBMITTED" && (
                        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#f0e5d0] pt-4">
                            <form action={approveWorkReport}>
                                <input
                                    type="hidden"
                                    name="reportId"
                                    value={report.id}
                                />

                                <SubmitButton
                                    className={[
                                        bridalStyles.button.primary,
                                        "w-full",
                                    ].join(" ")}
                                    pendingText="承認中..."
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    承認
                                </SubmitButton>
                            </form>

                            <form action={rejectWorkReport}>
                                <input
                                    type="hidden"
                                    name="reportId"
                                    value={report.id}
                                />

                                <SubmitButton
                                    className={[
                                        bridalStyles.button.danger,
                                        "w-full",
                                    ].join(" ")}
                                    variant="outline"
                                    pendingText="差戻し中..."
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    差し戻し
                                </SubmitButton>
                            </form>
                        </div>
                    )}
                </BridalCard>
            ))}
        </div>
    );
};

type InfoRowProps = {
    icon: React.ReactNode;
    children: React.ReactNode;
};

const InfoRow = ({ icon, children }: InfoRowProps) => {
    return (
        <div className="flex items-center gap-2">
            <span className="text-[#b8872d]">{icon}</span>
            <span>{children}</span>
        </div>
    );
};

type SummaryItemProps = {
    label: string;
    value: string;
};

const SummaryItem = ({ label, value }: SummaryItemProps) => {
    return (
        <div>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 font-medium text-slate-900">{value}</p>
        </div>
    );
};