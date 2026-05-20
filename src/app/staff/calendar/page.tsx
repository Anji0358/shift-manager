import Link from "next/link";
import type { DayOfWeek, UnavailableTime } from "@prisma/client";
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
import { getUnavailableTimesByEmployeeIdAndMonth } from "@/features/unavailable-times/queries";
import {
    getCalendarStatusClassName,
    getCalendarStatusLabel,
    type CalendarStatus,
} from "@/features/calendar/calendar-status";
import {
    dayOfWeekLabel,
    unavailableTypeLabel,
} from "@/features/unavailable-times/labels";
import { formatDate } from "@/lib/format";
import { getCurrentYearMonth, getMonthRange } from "@/lib/month";
import { getCurrentEmployeeId } from "@/lib/auth/current-user";

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

const dayOfWeekMap: Record<number, DayOfWeek> = {
    0: "SUNDAY",
    1: "MONDAY",
    2: "TUESDAY",
    3: "WEDNESDAY",
    4: "THURSDAY",
    5: "FRIDAY",
    6: "SATURDAY",
};

const getDaysInMonth = (yearMonth: string) => {
    const [yearText, monthText] = yearMonth.split("-");
    const year = Number(yearText);
    const month = Number(monthText);

    return new Date(year, month, 0).getDate();
};

const getDateByYearMonthAndDay = (yearMonth: string, day: number) => {
    const [yearText, monthText] = yearMonth.split("-");
    const year = Number(yearText);
    const monthIndex = Number(monthText) - 1;

    return new Date(year, monthIndex, day);
};

const getFirstDayOfWeek = (yearMonth: string) => {
    const [yearText, monthText] = yearMonth.split("-");
    const year = Number(yearText);
    const monthIndex = Number(monthText) - 1;

    return new Date(year, monthIndex, 1).getDay();
};

const isSameDate = (dateA: Date, dateB: Date) => {
    return (
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate()
    );
};

const getDayOfWeek = (date: Date) => {
    return dayOfWeekMap[date.getDay()];
};

const isUnavailableOnDate = (
    unavailableTime: UnavailableTime,
    targetDate: Date,
) => {
    if (unavailableTime.type === "WEEKLY_FIXED") {
        return unavailableTime.dayOfWeek === getDayOfWeek(targetDate);
    }

    if (!unavailableTime.date) {
        return false;
    }

    return isSameDate(unavailableTime.date, targetDate);
};

const getUnavailableTimeText = (unavailableTime: UnavailableTime) => {
    if (unavailableTime.type === "FULL_DAY") {
        return "終日";
    }

    if (unavailableTime.startTime && unavailableTime.endTime) {
        return `${unavailableTime.startTime}〜${unavailableTime.endTime}`;
    }

    return "-";
};

const getUnavailableTitle = (unavailableTime: UnavailableTime) => {
    if (unavailableTime.reason) {
        return unavailableTime.reason;
    }

    return unavailableTypeLabel[unavailableTime.type];
};

const getUnavailableSubText = (unavailableTime: UnavailableTime) => {
    if (unavailableTime.type === "WEEKLY_FIXED" && unavailableTime.dayOfWeek) {
        return `${dayOfWeekLabel[unavailableTime.dayOfWeek]}・毎週固定`;
    }

    return unavailableTypeLabel[unavailableTime.type];
};

const StaffCalendarPage = async ({ searchParams }: StaffCalendarPageProps) => {
    const currentEmployeeId = await getCurrentEmployeeId();

    const { month } = await searchParams;
    const targetMonth = month ?? getCurrentYearMonth();
    const { startDate, endDate } = getMonthRange(targetMonth);

    const [assignments, unavailableTimes] = await Promise.all([
        getAssignmentsByEmployeeIdAndMonth(currentEmployeeId, startDate, endDate),
        getUnavailableTimesByEmployeeIdAndMonth(
            currentEmployeeId,
            startDate,
            endDate,
        ),
    ]);

    const days = Array.from(
        { length: getDaysInMonth(targetMonth) },
        (_, index) => index + 1,
    );

    const firstDayOfWeek = getFirstDayOfWeek(targetMonth);

    const blankDays = Array.from(
        { length: firstDayOfWeek },
        (_, index) => index,
    );

    const unavailableListItems: CalendarListItem[] = days.flatMap((day) => {
        const targetDate = getDateByYearMonthAndDay(targetMonth, day);

        return unavailableTimes
            .filter((unavailableTime) => isUnavailableOnDate(unavailableTime, targetDate))
            .map((unavailableTime) => ({
                id: `${unavailableTime.id}-${day}`,
                date: targetDate,
                title: getUnavailableTitle(unavailableTime),
                status: "unavailable" as CalendarStatus,
                timeText: getUnavailableTimeText(unavailableTime),
                locationText: getUnavailableSubText(unavailableTime),
                meetingPlaceText: "-",
            }));
    });

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
        ...unavailableListItems,
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    return (
        <div className="space-y-8">
            <section>
                <h1 className="text-3xl font-bold">月間シフトカレンダー</h1>
                <p className="mt-2 text-slate-600">
                    月ごとの勤務予定と勤務できない日時を色分けして確認します。
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

                        {blankDays.map((blankDay) => (
                            <div
                                key={`blank-${blankDay}`}
                                className="min-h-32 border-r border-b bg-slate-50 p-2"
                            />
                        ))}

                        {days.map((day) => {
                            const targetDate = getDateByYearMonthAndDay(targetMonth, day);

                            const assignmentsOfDay = assignments.filter((assignment) => {
                                return isSameDate(assignment.job.workDate, targetDate);
                            });

                            const unavailableTimesOfDay = unavailableTimes.filter(
                                (unavailableTime) => {
                                    return isUnavailableOnDate(unavailableTime, targetDate);
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
                                                    {assignment.slot.startTime}〜{assignment.slot.endTime}
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
                                                key={`${unavailableTime.id}-${day}`}
                                                className={[
                                                    "rounded-md border p-2 text-xs shadow-sm",
                                                    getCalendarStatusClassName("unavailable"),
                                                ].join(" ")}
                                            >
                                                <p className="font-medium">
                                                    {getUnavailableTitle(unavailableTime)}
                                                </p>

                                                <p>{getUnavailableTimeText(unavailableTime)}</p>

                                                <p className="text-[11px]">
                                                    {getUnavailableSubText(unavailableTime)}
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
                                <TableHead>場所・種別</TableHead>
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

                                    <TableCell className="font-medium">{item.title}</TableCell>

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