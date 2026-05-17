import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getAssignmentsByEmployeeIdAndMonth } from "@/features/shift-assignments/queries";
import {
    getCalendarStatusClassName,
    getCalendarStatusLabel,
    type CalendarStatus,
} from "@/features/calendar/calendar-status";
import { formatDate } from "@/lib/format";
import { getCurrentYearMonth, getMonthRange } from "@/lib/month";
import { getCurrentEmployeeId } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";

type StaffCalendarPageProps = {
    searchParams: Promise<{
        month?: string;
    }>;
};

type CalendarListItem = {
    id: string;
    date: Date;
    title: string;
    status: CalendarStatus;
    timeText?: string;
    locationText?: string;
    meetingPlaceText?: string;
    href?: string;
};

const getDayNumber = (date: Date) => {
    return date.getDate();
};

const getDaysInMonth = (yearMonth: string) => {
    const [yearText, monthText] = yearMonth.split("-");
    const year = Number(yearText);
    const month = Number(monthText);

    return new Date(year, month, 0).getDate();
};

const StaffCalendarPage = async ({ searchParams }: StaffCalendarPageProps) => {
    const currentEmployeeId = await getCurrentEmployeeId();

    const { month } = await searchParams;
    const targetMonth = month ?? getCurrentYearMonth();
    const { startDate, endDate } = getMonthRange(targetMonth);

    const assignments = await getAssignmentsByEmployeeIdAndMonth(
        currentEmployeeId,
        startDate,
        endDate,
    );

    const unavailableTimes = await prisma.unavailableTime.findMany({
        where: {
            employeeId: currentEmployeeId,
            date: {
                gte: startDate,
                lt: endDate,
            },
        },
        orderBy: {
            date: "asc",
        },
    });

    const days = Array.from(
        { length: getDaysInMonth(targetMonth) },
        (_, index) => index + 1,
    );

    const listItems: CalendarListItem[] = [
        ...assignments.map((assignment) => ({
            id: assignment.id,
            date: assignment.job.workDate,
            title: assignment.job.title,
            status: "confirmed" as CalendarStatus,
            timeText: `${assignment.slot.startTime}〜${assignment.slot.endTime}`,
            locationText: assignment.job.location,
            meetingPlaceText: assignment.job.meetingPlace || "未設定",
            href: `/staff/jobs/${assignment.jobId}`,
        })),
        ...unavailableTimes
            .filter((unavailableTime) => unavailableTime.date !== null)
            .map((unavailableTime) => ({
                id: unavailableTime.id,
                date: unavailableTime.date as Date,
                title: unavailableTime.reason || "勤務不可",
                status: "unavailable" as CalendarStatus,
                timeText:
                    unavailableTime.startTime && unavailableTime.endTime
                        ? `${unavailableTime.startTime}〜${unavailableTime.endTime}`
                        : "終日",
                locationText: "-",
                meetingPlaceText: "-",
            })),
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    return (
        <div className="space-y-8">
            <section>
                <h1 className="text-3xl font-bold">月間シフトカレンダー</h1>
                <p className="mt-2 text-slate-600">
                    月ごとの勤務予定と勤務不可情報を色分けして確認します。
                </p>
            </section>

            <form className="flex items-end gap-3" action="/staff/calendar">
                <div className="space-y-2">
                    <label htmlFor="month" className="text-sm font-medium">
                        対象月
                    </label>
                    <Input id="month" name="month" type="month" defaultValue={targetMonth} />
                </div>

                <Button type="submit">表示</Button>
            </form>

            <section className="flex flex-wrap gap-2">
                {(["confirmed", "unavailable", "open"] as CalendarStatus[]).map(
                    (status) => (
                        <div
                            key={status}
                            className={[
                                "rounded-full border px-3 py-1 text-xs font-medium",
                                getCalendarStatusClassName(status),
                            ].join(" ")}
                        >
                            {getCalendarStatusLabel(status)}
                        </div>
                    ),
                )}
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>{targetMonth}</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-7 overflow-hidden rounded-lg border">
                        {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
                            <div
                                key={day}
                                className="border-b bg-slate-100 p-2 text-center text-sm font-medium"
                            >
                                {day}
                            </div>
                        ))}

                        {days.map((day) => {
                            const assignmentsOfDay = assignments.filter((assignment) => {
                                return getDayNumber(assignment.job.workDate) === day;
                            });

                            const unavailableTimesOfDay = unavailableTimes.filter(
                                (unavailableTime) => {
                                    if (!unavailableTime.date) {
                                        return false;
                                    }

                                    return getDayNumber(unavailableTime.date) === day;
                                },
                            );

                            return (
                                <div key={day} className="min-h-32 border-r border-b p-2">
                                    <p className="mb-2 text-sm font-medium">{day}</p>

                                    <div className="space-y-2">
                                        {assignmentsOfDay.map((assignment) => (
                                            <Link
                                                key={assignment.id}
                                                href={`/staff/jobs/${assignment.jobId}`}
                                                className={[
                                                    "block rounded-md border p-2 text-xs shadow-sm transition active:scale-[0.98]",
                                                    getCalendarStatusClassName("confirmed"),
                                                ].join(" ")}
                                            >
                                                <p className="font-medium">{assignment.job.title}</p>
                                                <p>
                                                    {assignment.slot.startTime}〜
                                                    {assignment.slot.endTime}
                                                </p>
                                                <p>
                                                    集合：
                                                    {assignment.job.meetingPlace || "未設定"}
                                                </p>
                                                <Badge variant="secondary" className="mt-2">
                                                    {getCalendarStatusLabel("confirmed")}
                                                </Badge>
                                            </Link>
                                        ))}

                                        {unavailableTimesOfDay.map((unavailableTime) => (
                                            <div
                                                key={unavailableTime.id}
                                                className={[
                                                    "rounded-md border p-2 text-xs shadow-sm",
                                                    getCalendarStatusClassName("unavailable"),
                                                ].join(" ")}
                                            >
                                                <p className="font-medium">
                                                    {unavailableTime.reason || "勤務不可"}
                                                </p>
                                                <p>
                                                    {unavailableTime.startTime &&
                                                        unavailableTime.endTime
                                                        ? `${unavailableTime.startTime}〜${unavailableTime.endTime}`
                                                        : "終日"}
                                                </p>
                                                <Badge variant="secondary" className="mt-2">
                                                    {getCalendarStatusLabel("unavailable")}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>一覧表示</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>日付</TableHead>
                                <TableHead>状態</TableHead>
                                <TableHead>内容</TableHead>
                                <TableHead>時間</TableHead>
                                <TableHead>場所</TableHead>
                                <TableHead>集合場所</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {listItems.map((item) => (
                                <TableRow key={`${item.status}-${item.id}`}>
                                    <TableCell>{formatDate(item.date)}</TableCell>

                                    <TableCell>
                                        <span
                                            className={[
                                                "inline-flex rounded-full border px-2 py-1 text-xs font-medium",
                                                getCalendarStatusClassName(item.status),
                                            ].join(" ")}
                                        >
                                            {getCalendarStatusLabel(item.status)}
                                        </span>
                                    </TableCell>

                                    <TableCell className="font-medium">
                                        {item.title}
                                    </TableCell>

                                    <TableCell>{item.timeText || "-"}</TableCell>
                                    <TableCell>{item.locationText || "-"}</TableCell>
                                    <TableCell>{item.meetingPlaceText || "-"}</TableCell>

                                    <TableCell className="text-right">
                                        {item.href ? (
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={item.href}>詳細</Link>
                                            </Button>
                                        ) : (
                                            <span className="text-sm text-slate-400">-</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {listItems.length === 0 && (
                        <p className="mt-4 text-sm text-slate-500">
                            対象月に予定はありません。
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffCalendarPage;