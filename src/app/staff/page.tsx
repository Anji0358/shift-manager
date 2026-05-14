import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getStaffDashboardStats } from "@/features/dashboard/staff-queries";
import { getCurrentEmployeeId } from "@/lib/auth/current-user";
import { formatDate } from "@/lib/format";

const StaffPage = async () => {
    const currentEmployeeId = getCurrentEmployeeId();
    const stats = await getStaffDashboardStats(currentEmployeeId);

    return (
        <div className="space-y-8">
            <section>
                <h1 className="text-3xl font-bold">従業員ダッシュボード</h1>
                <p className="mt-2 text-slate-600">
                    自分のシフト、勤務不可情報、就労報告を確認します。
                </p>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            今後の確定シフト
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.upcomingShiftCount}</p>
                        <p className="mt-1 text-sm text-slate-500">本日以降</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            提出済み就労報告
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.submittedReportCount}</p>
                        <p className="mt-1 text-sm text-slate-500">累計件数</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            次回シフト
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.nextAssignment ? (
                            <Badge variant="secondary">
                                {formatDate(stats.nextAssignment.job.workDate)}
                            </Badge>
                        ) : (
                            <p className="text-sm text-slate-500">予定なし</p>
                        )}
                    </CardContent>
                </Card>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>次回シフト</CardTitle>
                </CardHeader>

                <CardContent>
                    {stats.nextAssignment ? (
                        <div className="space-y-3">
                            <p className="text-lg font-semibold">
                                {stats.nextAssignment.job.title}
                            </p>

                            <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                                <p>勤務日：{formatDate(stats.nextAssignment.job.workDate)}</p>
                                <p>勤務枠：{stats.nextAssignment.slot.name}</p>
                                <p>
                                    勤務時間：{stats.nextAssignment.slot.startTime}〜
                                    {stats.nextAssignment.slot.endTime}
                                </p>
                                <p>場所：{stats.nextAssignment.job.location}</p>
                                <p>集合場所：{stats.nextAssignment.job.meetingPlace}</p>
                                <p>
                                    食事：{stats.nextAssignment.job.hasMeal ? "あり" : "なし"}
                                </p>
                            </div>

                            <Button asChild variant="outline">
                                <Link href="/staff/shifts">確定シフト一覧へ</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm text-slate-500">
                                現在、今後の確定シフトはありません。
                            </p>
                            <Button asChild variant="outline">
                                <Link href="/staff/calendar">カレンダーを見る</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffPage;