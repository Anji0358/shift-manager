import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
    CalendarDays,
    Clock,
    MapPin,
    Shirt,
    Utensils,
    Wallet,
    ArrowLeft,
    ClipboardList,
} from "lucide-react";
import { getCurrentEmployeeId } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { formatDate, formatYen } from "@/lib/format";
import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { GoogleMapsLink } from "@/components/shared/google-maps-link";
import { LinkButton } from "@/components/shared/link-button";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";

type StaffJobDetailPageProps = {
    params: Promise<{
        jobId: string;
    }>;
};

const StaffJobDetailPage = async ({ params }: StaffJobDetailPageProps) => {
    const { jobId } = await params;
    const employeeId = await getCurrentEmployeeId();

    const assignment = await prisma.shiftAssignment.findFirst({
        where: {
            employeeId,
            status: "ASSIGNED",
            slot: {
                jobId,
            },
        },
        include: {
            slot: {
                include: {
                    job: true,
                },
            },
            employee: true,
        },
    });

    if (!assignment) {
        notFound();
    }

    const assignedSlot = assignment.slot;
    const job = assignedSlot.job;

    return (
        <PageShell>
            <PageHeader
                title={job.title}
                description="自分が入る案件の詳細情報を確認します。"
                action={
                    <LinkButton
                        href="/staff/shifts"
                        variant="outline"
                        className={bridalStyles.button.secondary}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        確定シフトへ戻る
                    </LinkButton>
                }
            />

            <div className="space-y-6">
                <section className="grid gap-4 md:grid-cols-3">
                    <SummaryCard
                        title="勤務日"
                        value={formatDate(job.workDate)}
                        icon={<CalendarDays className="h-5 w-5" />}
                    />

                    <SummaryCard
                        title="勤務枠"
                        value={`${assignedSlot.startTime}〜${assignedSlot.endTime}`}
                        description={assignedSlot.name}
                        icon={<Clock className="h-5 w-5" />}
                    />

                    <SummaryCard
                        title="交通費"
                        value={formatYen(job.transportationFee)}
                        icon={<Wallet className="h-5 w-5" />}
                    />
                </section>

                <BridalCard>
                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-start gap-3">
                            <div className={bridalStyles.icon.circle}>
                                <ClipboardList className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle
                                    className={[
                                        bridalStyles.text.title,
                                        "text-xl",
                                    ].join(" ")}
                                >
                                    集合・勤務情報
                                </CardTitle>
                                <p className="mt-1 text-sm text-slate-500">
                                    当日の勤務場所、集合場所、服装、持ち物、備考を確認します。
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4 p-5 pt-2 text-sm">
                        <InfoBlock
                            icon={<MapPin className="h-4 w-4" />}
                            label="勤務場所"
                            value={job.location}
                        >
                            <div className="mt-2">
                                <GoogleMapsLink query={job.location} />
                            </div>
                        </InfoBlock>

                        <InfoBlock
                            icon={<MapPin className="h-4 w-4" />}
                            label="集合場所"
                            value={job.meetingPlace || "未設定"}
                        >
                            {job.meetingPlace ? (
                                <div className="mt-2">
                                    <GoogleMapsLink
                                        query={`${job.location} ${job.meetingPlace}`}
                                    />
                                </div>
                            ) : null}
                        </InfoBlock>

                        <InfoBlock
                            icon={<Clock className="h-4 w-4" />}
                            label="自分の勤務枠"
                            value={`${assignedSlot.name}：${assignedSlot.startTime}〜${assignedSlot.endTime}`}
                        />

                        <InfoBlock
                            icon={<Shirt className="h-4 w-4" />}
                            label="服装"
                            value={job.dressCode || "未設定"}
                        />

                        <InfoBlock
                            icon={<Utensils className="h-4 w-4" />}
                            label="食事"
                            value={job.hasMeal ? "あり" : "なし"}
                        />

                        <InfoBlock
                            label="持ち物"
                            value={job.belongings || "未設定"}
                        />

                        <InfoBlock
                            label="備考"
                            value={job.note || "未設定"}
                            preWrap
                        />
                    </CardContent>
                </BridalCard>
            </div>
        </PageShell>
    );
};

type SummaryCardProps = {
    title: string;
    value: string;
    description?: string;
    icon: ReactNode;
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
                <p className="text-xl font-semibold tracking-tight text-slate-900">
                    {value}
                </p>

                {description ? (
                    <p className="mt-1 text-sm text-slate-500">
                        {description}
                    </p>
                ) : null}
            </CardContent>
        </BridalCard>
    );
};

type InfoBlockProps = {
    icon?: ReactNode;
    label: string;
    value: string;
    children?: ReactNode;
    preWrap?: boolean;
};

const InfoBlock = ({
    icon,
    label,
    value,
    children,
    preWrap = false,
}: InfoBlockProps) => {
    return (
        <div className="rounded-2xl border border-[#f0e5d0] bg-[#fffdf8]/80 p-4">
            <div className="flex gap-3">
                {icon ? (
                    <span className="mt-0.5 text-[#b8872d]">{icon}</span>
                ) : null}

                <div className="min-w-0">
                    <p className="text-slate-500">{label}</p>
                    <p
                        className={[
                            "font-medium text-slate-900",
                            preWrap ? "whitespace-pre-wrap" : "",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                    >
                        {value}
                    </p>

                    {children}
                </div>
            </div>
        </div>
    );
};

export default StaffJobDetailPage;