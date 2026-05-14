import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getUnavailableTimesByEmployeeId } from "@/features/unavailable-times/queries";
import { formatDate } from "@/lib/format";
import { deleteUnavailableTime } from "@/features/unavailable-times/actions";
import type { DayOfWeek, UnavailableType } from "@prisma/client";
import { SuccessMessage } from "@/components/shared/success-message";

const unavailableTypeLabel: Record<UnavailableType, string> = {
    FULL_DAY: "一日NG",
    TIME_RANGE: "時間指定NG",
    WEEKLY_FIXED: "毎週固定NG",
    TEMPORARY: "一時的な予定NG",
};

const dayOfWeekLabel: Record<DayOfWeek, string> = {
    MONDAY: "月曜日",
    TUESDAY: "火曜日",
    WEDNESDAY: "水曜日",
    THURSDAY: "木曜日",
    FRIDAY: "金曜日",
    SATURDAY: "土曜日",
    SUNDAY: "日曜日",
};

type StaffUnavailableTimesPageProps = {
    searchParams: Promise<{
        message?: string;
    }>;
};

const StaffUnavailableTimesPage = async ({
    searchParams,
}: StaffUnavailableTimesPageProps) => {
    const { message } = await searchParams;
    const currentEmployeeId = "emp_2";

    const myUnavailableTimes =
        await getUnavailableTimesByEmployeeId(currentEmployeeId);

    return (
        <div className="space-y-6">
            <section className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">勤務不可情報</h1>
                    <p className="mt-2 text-slate-600">
                        一日NG、時間指定NG、毎週固定NG、一時的な予定NGを確認します。
                    </p>
                </div>

                <SuccessMessage message={message} />

                <div className="flex gap-3">
                    <Button asChild variant="outline">
                        <Link href="/staff/unavailable-times/weekly">
                            毎週固定NGを登録
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/staff/unavailable-times/new">勤務不可を追加</Link>
                    </Button>
                </div>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>登録済みの勤務不可情報</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>種別</TableHead>
                                <TableHead>日付</TableHead>
                                <TableHead>曜日</TableHead>
                                <TableHead>時間</TableHead>
                                <TableHead>理由</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {myUnavailableTimes.map((unavailableTime) => (
                                <TableRow key={unavailableTime.id}>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {unavailableTypeLabel[unavailableTime.type]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {unavailableTime.date
                                            ? formatDate(unavailableTime.date)
                                            : "-"}
                                    </TableCell>
                                    <TableCell>
                                        {unavailableTime.dayOfWeek
                                            ? dayOfWeekLabel[unavailableTime.dayOfWeek]
                                            : "-"}
                                    </TableCell>
                                    <TableCell>
                                        {unavailableTime.startTime && unavailableTime.endTime
                                            ? `${unavailableTime.startTime}〜${unavailableTime.endTime}`
                                            : "終日"}
                                    </TableCell>
                                    <TableCell>{unavailableTime.reason}</TableCell>
                                    <TableCell className="text-right">
                                        <form action={deleteUnavailableTime}>
                                            <input
                                                type="hidden"
                                                name="unavailableTimeId"
                                                value={unavailableTime.id}
                                            />
                                            <Button size="sm" type="submit" variant="outline">
                                                削除
                                            </Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffUnavailableTimesPage;