import { Badge } from "@/components/ui/badge";
import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
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
                {currentEmployee && (
                    <BridalCard className="p-5">
                        <div className="flex items-center gap-3">
                            <div className={bridalStyles.icon.smallCircle}>
                                <User className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    現在のスタッフ
                                </p>
                                <p
                                    className={[
                                        bridalStyles.text.title,
                                        "text-lg",
                                    ].join(" ")}
                                >
                                    {currentEmployee.name}
                                </p>
                            </div>
                        </div>
                    </BridalCard>
                )}

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

                    <BridalCard>
                        <CardHeader className="p-4 pb-2">
                            <div className="flex items-center gap-3">
                                <div className={bridalStyles.icon.smallCircle}>
                                    <Clock className="h-5 w-5" />
                                </div>

                                <CardTitle className="text-sm font-medium text-slate-500">
                                    次回シフト
                                </CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent className="p-4 pt-2">
                            {stats.nextAssignment ? (
                                <Badge className={bridalStyles.badge.fulfilled}>
                                    {formatDate(
                                        stats.nextAssignment.slot.job.workDate,
                                    )}
                                </Badge>
                            ) : (
                                <p className="text-sm text-slate-500">
                                    予定なし
                                </p>
                            )}
                        </CardContent>
                    </BridalCard>
                </section>

                <BridalCard>
                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-start gap-3">
                            <div className={bridalStyles.icon.circle}>
                                <CalendarDays className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle
                                    className={[
                                        bridalStyles.text.title,
                                        "text-xl",
                                    ].join(" ")}
                                >
                                    次回シフト
                                </CardTitle>
                                <p className="mt-1 text-sm text-slate-500">
                                    次に予定されている勤務内容を確認します。
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-2">
                        {stats.nextAssignment ? (
                            <div className="space-y-5">
                                <div className="rounded-2xl border border-[#f0e5d0] bg-[#fffdf8]/80 p-5">
                                    <p
                                        className={[
                                            bridalStyles.text.title,
                                            "text-lg",
                                        ].join(" ")}
                                    >
                                        {stats.nextAssignment.slot.job.title}
                                    </p>

                                    <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
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
                                    className={bridalStyles.button.secondary}
                                >
                                    確定シフト一覧へ
                                </LinkButton>
                            </div>
                        ) : (
                            <div className="space-y-4 rounded-2xl border border-[#f0e5d0] bg-[#fffdf8]/80 p-5">
                                <p className="text-sm text-slate-500">
                                    現在、今後の確定シフトはありません。
                                </p>

                                <LinkButton
                                    href="/staff/calendar"
                                    variant="outline"
                                    className={bridalStyles.button.secondary}
                                >
                                    カレンダーを見る
                                </LinkButton>
                            </div>
                        )}
                    </CardContent>
                </BridalCard>
            </div>
        </PageShell>
    );
};

type SummaryCardProps = {
    title: string;
    value: string;
    description: string;
    icon: React.ReactNode;
};

const SummaryCard = ({
    title,
    value,
    description,
    icon,
}: SummaryCardProps) => {
    return (
        <BridalCard>
            <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-3">
                    <div className={bridalStyles.icon.smallCircle}>{icon}</div>

                    <CardTitle className="text-sm font-medium text-slate-500">
                        {title}
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-2">
                <p className="text-3xl font-semibold tracking-tight text-slate-900">
                    {value}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                    {description}
                </p>
            </CardContent>
        </BridalCard>
    );
};

type InfoRowProps = {
    label: string;
    value: string;
    icon: React.ReactNode;
};

const InfoRow = ({ label, value, icon }: InfoRowProps) => {
    return (
        <div className="flex items-start gap-2">
            <span className="mt-0.5 text-[#b8872d]">{icon}</span>
            <p>
                <span className="text-slate-500">{label}：</span>
                <span className="font-medium text-slate-800">{value}</span>
            </p>
        </div>
    );
};

export default StaffPage;