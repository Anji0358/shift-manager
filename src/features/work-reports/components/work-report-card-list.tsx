import type { ReactNode } from "react";
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
import { AppCard } from "@/components/shared/bridal-card";
import { appStyles } from "@/components/shared/design-tokens";

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
        return appStyles.badge.fulfilled;
    }

    if (status === "SUBMITTED") {
        return appStyles.badge.pending;
    }

    if (status === "REJECTED") {
        return [
            appStyles.radius.full,
            "border px-3 py-1 text-xs font-medium shadow-none",
            appStyles.border.danger,
            appStyles.tokens.color.background.danger,
            appStyles.textColor.danger,
            appStyles.tokens.color.background.hoverDanger,
        ].join(" ");
    }

    return appStyles.badge.neutral;
};

export const WorkReportCardList = ({ reports }: WorkReportCardListProps) => {
    if (reports.length === 0) {
        return (
            <AppCard className="p-6 text-center">
                <p className={appStyles.text.muted}>
                    就労報告がありません。
                </p>
            </AppCard>
        );
    }

    return (
        <div className="space-y-4">
            {reports.map((report) => (
                <AppCard key={report.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h2
                                className={[
                                    appStyles.text.title,
                                    "text-lg",
                                ].join(" ")}
                            >
                                {report.job.title}
                            </h2>
                            <p className={["mt-1", appStyles.text.muted].join(" ")}>
                                {report.employee.name}
                            </p>
                        </div>

                        <Badge className={getStatusBadgeClassName(report.status)}>
                            {getStatusLabel(report.status)}
                        </Badge>
                    </div>

                    <div
                        className={[
                            "mt-4 space-y-2 text-sm",
                            appStyles.textColor.body,
                        ].join(" ")}
                    >
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

                    <div
                        className={[
                            "mt-4 grid grid-cols-2 gap-3 p-4 text-sm",
                            appStyles.section.soft,
                        ].join(" ")}
                    >
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
                        <div
                            className={[
                                "mt-4 grid grid-cols-2 gap-2 border-t pt-4",
                                appStyles.border.soft,
                            ].join(" ")}
                        >
                            <form action={approveWorkReport}>
                                <input
                                    type="hidden"
                                    name="reportId"
                                    value={report.id}
                                />

                                <SubmitButton
                                    className={[
                                        appStyles.button.primary,
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
                                        appStyles.button.danger,
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
                </AppCard>
            ))}
        </div>
    );
};

type InfoRowProps = {
    icon: ReactNode;
    children: ReactNode;
};

const InfoRow = ({ icon, children }: InfoRowProps) => {
    return (
        <div className="flex items-center gap-2">
            <span className={appStyles.icon.accent}>{icon}</span>
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
            <p className={["text-xs", appStyles.textColor.muted].join(" ")}>
                {label}
            </p>
            <p
                className={[
                    "mt-1 font-medium",
                    appStyles.textColor.default,
                ].join(" ")}
            >
                {value}
            </p>
        </div>
    );
};