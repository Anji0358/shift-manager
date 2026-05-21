import { notFound } from "next/navigation";
import {
    CalendarDays,
    Clock,
    MapPin,
    Shirt,
    Utensils,
    Wallet,
} from "lucide-react";
import { getCurrentEmployeeId } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { formatDate, formatYen } from "@/lib/format";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { GoogleMapsLink } from "@/components/shared/google-maps-link";
import { LinkButton } from "@/components/shared/link-button";

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
        <div className="space-y-6">
            <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{job.title}</h1>
                    <p className="mt-2 text-slate-600">
                        自分が入る案件の詳細情報を確認します。
                    </p>
                </div>

                <LinkButton href="/staff/shifts" variant="outline">
                    確定シフトへ戻る
                </LinkButton>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm text-slate-500">
                            <CalendarDays className="h-4 w-4" />
                            勤務日
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-bold">
                            {formatDate(job.workDate)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="h-4 w-4" />
                            勤務枠
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <p className="text-xl font-bold">
                            {assignedSlot.startTime} - {assignedSlot.endTime}
                        </p>
                        <p className="text-sm text-slate-500">
                            {assignedSlot.name}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm text-slate-500">
                            <Wallet className="h-4 w-4" />
                            交通費
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-bold">
                            {formatYen(job.transportationFee)}
                        </p>
                    </CardContent>
                </Card>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>集合・勤務情報</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 text-sm">
                    <div className="flex gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 text-slate-500" />
                        <div>
                            <p className="text-slate-500">勤務場所</p>
                            <p className="font-medium">{job.location}</p>
                            <div className="mt-2">
                                <GoogleMapsLink query={job.location} />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 text-slate-500" />
                        <div>
                            <p className="text-slate-500">集合場所</p>
                            <p className="font-medium">
                                {job.meetingPlace || "未設定"}
                            </p>

                            {job.meetingPlace && (
                                <div className="mt-2">
                                    <GoogleMapsLink
                                        query={`${job.location} ${job.meetingPlace}`}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Clock className="mt-0.5 h-4 w-4 text-slate-500" />
                        <div>
                            <p className="text-slate-500">自分の勤務枠</p>
                            <p className="font-medium">
                                {assignedSlot.name}：{assignedSlot.startTime} -{" "}
                                {assignedSlot.endTime}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Shirt className="mt-0.5 h-4 w-4 text-slate-500" />
                        <div>
                            <p className="text-slate-500">服装</p>
                            <p className="font-medium">
                                {job.dressCode || "未設定"}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Utensils className="mt-0.5 h-4 w-4 text-slate-500" />
                        <div>
                            <p className="text-slate-500">食事</p>
                            <p className="font-medium">
                                {job.hasMeal ? "あり" : "なし"}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-slate-500">持ち物</p>
                        <p className="font-medium">
                            {job.belongings || "未設定"}
                        </p>
                    </div>

                    <div>
                        <p className="text-slate-500">備考</p>
                        <p className="whitespace-pre-wrap font-medium">
                            {job.note || "未設定"}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffJobDetailPage;