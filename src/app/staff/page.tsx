import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { AppCard } from "@/components/shared/app-card";
import { appStyles } from "@/components/shared/design-tokens";
import { getStaffDashboardStats } from "@/features/dashboard/staff-queries";
import {
    getCurrentEmployee,
    getCurrentEmployeeId,
} from "@/lib/auth/current-user";
import { formatDate } from "@/lib/format";
import {
    CalendarDays,
    ClipboardCheck,
    Clock,
    MapPin,
    User,
    Utensils,
} from "lucide-react";

const StaffPage = async () => {
    const currentEmployeeId = await getCurrentEmployeeId();
    const stats = await getStaffDashboardStats(currentEmployeeId);
    const currentEmployee = await getCurrentEmployee();

    return (
        <PageShell>
            <PageHeader
                title="スタッフダッシュボード"
                description="自分のシフト、勤務不可情報、就労報告を確認します。"
            />

            <div className="space-y-6">
                {currentEmployee ? (
                    <AppCard className="p-5">
                        <div className="flex items-center gap-3">
                            <div className={appStyles.icon.smallCircle}>
                                <User className="h-5 w-5" />
                            </div>

                            <div>
                                <p className={appStyles.text.muted}>
                                    現在のスタッフ
                                </p>
                                <p
                                    className={[
                                        appStyles.text.title,
                                        "text-lg",
                                    ].join(" ")}
                                >
                                    {currentEmployee.name}
                                </p>
                            </div>
                        </div>
                    </AppCard>
                ) : null}

                <section className="grid gap-4 md:grid-cols-3">
                    <SummaryCard
                        title="今後の確定シフト"
                        value={`${stats.upcomingShiftCount}`}
                        description="本日以降"
                        icon={<CalendarDays className="h-5 w-5" />}
                    />

                    <SummaryCard
                        title="提出済み就労報告"
                        value={`${stats.submittedReportCount}`}
                        description="累計件数"
                        icon={<ClipboardCheck className="h-5 w-5" />}
                    />

                    <AppCard>
                        <CardHeader className="p-4 pb-2">
                            <div className="flex items-center gap-3">
                                <div className={appStyles.icon.smallCircle}>
                                    <Clock className="h-5 w-5" />
                                </div>

                                <CardTitle
                                    className={[
                                        "text-sm font-medium",
                                        appStyles.textColor.muted,
                                    ].join(" ")}
                                >
                                    次回シフト
                                </CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent className="p-4 pt-2">
                            {stats.nextAssignment ? (
                                <Badge className={appStyles.badge.fulfilled}>
                                    {formatDate(
                                        stats.nextAssignment.slot.job.workDate,
                                    )}
                                </Badge>
                            ) : (
                                <p className={appStyles.text.muted}>
                                    予定なし
                                </p>
                            )}
                        </CardContent>
                    </AppCard>
                </section>

                <AppCard>
                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-start gap-3">
                            <div className={appStyles.icon.circle}>
                                <CalendarDays className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle
                                    className={[
                                        appStyles.text.title,
                                        "text-xl",
                                    ].join(" ")}
                                >
                                    次回シフト
                                </CardTitle>
                                <p className={["mt-1", appStyles.text.muted].join(" ")}>
                                    次に予定されている勤務内容を確認します。
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-2">
                        {stats.nextAssignment ? (
                            <div className="space-y-5">
                                <div className={appStyles.section.base}>
                                    <p
                                        className={[
                                            appStyles.text.title,
                                            "text-lg",
                                        ].join(" ")}
                                    >
                                        {stats.nextAssignment.slot.job.title}
                                    </p>

                                    <div
                                        className={[
                                            "mt-4 grid gap-3 text-sm md:grid-cols-2",
                                            appStyles.textColor.body,
                                        ].join(" ")}
                                    >
                                        <InfoRow
                                            label="勤務日"
                                            value={formatDate(
                                                stats.nextAssignment.slot.job.workDate,
                                            )}
                                            icon={
                                                <CalendarDays className="h-4 w-4" />
                                            }
                                        />

                                        <InfoRow
                                            label="勤務枠"
                                            value={stats.nextAssignment.slot.name}
                                            icon={<Clock className="h-4 w-4" />}
                                        />

                                        <InfoRow
                                            label="勤務時間"
                                            value={`${stats.nextAssignment.slot.startTime}〜${stats.nextAssignment.slot.endTime}`}
                                            icon={<Clock className="h-4 w-4" />}
                                        />

                                        <InfoRow
                                            label="場所"
                                            value={
                                                stats.nextAssignment.slot.job.location
                                            }
                                            icon={<MapPin className="h-4 w-4" />}
                                        />

                                        <InfoRow
                                            label="集合場所"
                                            value={
                                                stats.nextAssignment.slot.job
                                                    .meetingPlace || "未設定"
                                            }
                                            icon={<MapPin className="h-4 w-4" />}
                                        />

                                        <InfoRow
                                            label="食事"
                                            value={
                                                stats.nextAssignment.slot.job.hasMeal
                                                    ? "あり"
                                                    : "なし"
                                            }
                                            icon={<Utensils className="h-4 w-4" />}
                                        />
                                    </div>
                                </div>

                                <LinkButton
                                    href="/staff/shifts"
                                    variant="outline"
                                    className={appStyles.button.secondary}
                                >
                                    確定シフト一覧へ
                                </LinkButton>
                            </div>
                        ) : (
                            <div className={["space-y-4", appStyles.section.base].join(" ")}>
                                <p className={appStyles.text.muted}>
                                    現在、今後の確定シフトはありません。
                                </p>

                                <LinkButton
                                    href="/staff/calendar"
                                    variant="outline"
                                    className={appStyles.button.secondary}
                                >
                                    カレンダーを見る
                                </LinkButton>
                            </div>
                        )}
                    </CardContent>
                </AppCard>
            </div>
        </PageShell>
    );
};

type SummaryCardProps = {
    title: string;
    value: string;
    description: string;
    icon: ReactNode;
};

const SummaryCard = ({
    title,
    value,
    description,
    icon,
}: SummaryCardProps) => {
    return (
        <AppCard>
            <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-3">
                    <div className={appStyles.icon.smallCircle}>{icon}</div>

                    <CardTitle
                        className={[
                            "text-sm font-medium",
                            appStyles.textColor.muted,
                        ].join(" ")}
                    >
                        {title}
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-2">
                <p
                    className={[
                        "text-3xl font-semibold tracking-tight",
                        appStyles.textColor.default,
                    ].join(" ")}
                >
                    {value}
                </p>
                <p className={["mt-1", appStyles.text.muted].join(" ")}>
                    {description}
                </p>
            </CardContent>
        </AppCard>
    );
};

type InfoRowProps = {
    label: string;
    value: string;
    icon: ReactNode;
};

const InfoRow = ({ label, value, icon }: InfoRowProps) => {
    return (
        <div className="flex items-start gap-2">
            <span
                className={[
                    "mt-0.5",
                    appStyles.icon.accent,
                ].join(" ")}
            >
                {icon}
            </span>
            <p>
                <span className={appStyles.textColor.muted}>{label}：</span>
                <span
                    className={[
                        "font-medium",
                        appStyles.textColor.default,
                    ].join(" ")}
                >
                    {value}
                </span>
            </p>
        </div>
    );
};

export default StaffPage;