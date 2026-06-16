import Link from "next/link";
import type { DayOfWeek, UnavailableTime } from "@prisma/client";
import {
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
import { SubmitButton } from "@/components/shared/submit-button";
import { LinkButton } from "@/components/shared/link-button";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { AppCard } from "@/components/shared/bridal-card";
import { appStyles } from "@/components/shared/design-tokens";
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
import {
    CalendarDays,
    FileText,
    Search,
} from "lucide-react";

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
            .filter((unavailableTime) =>
                isUnavailableOnDate(unavailableTime, targetDate),
            )
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
            date: assignment.slot.job.workDate,
            title: assignment.slot.job.title,
            status: "confirmed" as CalendarStatus,
            timeText: `${assignment.slot.startTime}〜${assignment.slot.endTime}`,
            locationText: assignment.slot.job.location,
            meetingPlaceText: assignment.slot.job.meetingPlace || "未設定",
            href: `/staff/jobs/${assignment.slot.jobId}`,
        })),
        ...unavailableListItems,
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    return (
        <PageShell>
            <PageHeader
                title="月間シフトカレンダー"
                description="月ごとの勤務予定とNGの日時を色分けして確認します。"
            />

            <div className="space-y-6">
                <AppCard>
                    <CardContent className="p-5">
                        <form
                            className="flex flex-col gap-3 sm:flex-row sm:items-end"
                            action="/staff/calendar"
                        >
                            <div className="space-y-2">
                                <label
                                    htmlFor="month"
                                    className={appStyles.form.label}
                                >
                                    対象月
                                </label>
                                <Input
                                    id="month"
                                    name="month"
                                    type="month"
                                    defaultValue={targetMonth}
                                    className={appStyles.form.input}
                                />
                            </div>

                            <SubmitButton
                                pendingText="表示中..."
                                className={[
                                    appStyles.button.primary,
                                    "h-11 px-6",
                                ].join(" ")}
                            >
                                <Search className="mr-2 h-4 w-4" />
                                表示
                            </SubmitButton>
                        </form>
                    </CardContent>
                </AppCard>

                <section className="flex flex-wrap gap-2">
                    {(["confirmed", "unavailable", "open"] as CalendarStatus[]).map(
                        (status) => (
                            <div
                                key={status}
                                className={[
                                    appStyles.radius.full,
                                    "border px-3 py-1 text-xs font-medium shadow-sm",
                                    getCalendarStatusClassName(status),
                                ].join(" ")}
                            >
                                {getCalendarStatusLabel(status)}
                            </div>
                        ),
                    )}
                </section>

                <AppCard className="overflow-hidden">
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
                                    {targetMonth}
                                </CardTitle>
                                <p className={["mt-1", appStyles.text.muted].join(" ")}>
                                    勤務予定と勤務不可情報をカレンダー形式で確認します。
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-2">
                        <div
                            className={[
                                "grid grid-cols-7 overflow-hidden border",
                                appStyles.radius["2xl"],
                                appStyles.border.default,
                                appStyles.background.whiteGlass,
                                appStyles.tokens.shadow.card,
                            ].join(" ")}
                        >
                            {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
                                <div
                                    key={day}
                                    className={[
                                        "border-b p-2 text-center text-sm font-medium",
                                        appStyles.border.default,
                                        appStyles.background.warmHover,
                                        appStyles.textColor.tableHead,
                                    ].join(" ")}
                                >
                                    {day}
                                </div>
                            ))}

                            {blankDays.map((blankDay) => (
                                <div
                                    key={`blank-${blankDay}`}
                                    className={[
                                        "min-h-32 border-r border-b p-2",
                                        appStyles.border.soft,
                                        appStyles.background.warmSoft,
                                    ].join(" ")}
                                />
                            ))}

                            {days.map((day) => {
                                const targetDate = getDateByYearMonthAndDay(
                                    targetMonth,
                                    day,
                                );

                                const assignmentsOfDay = assignments.filter((assignment) => {
                                    return isSameDate(
                                        assignment.slot.job.workDate,
                                        targetDate,
                                    );
                                });

                                const unavailableTimesOfDay = unavailableTimes.filter(
                                    (unavailableTime) => {
                                        return isUnavailableOnDate(
                                            unavailableTime,
                                            targetDate,
                                        );
                                    },
                                );

                                return (
                                    <div
                                        key={day}
                                        className={[
                                            "min-h-32 border-r border-b p-2 transition",
                                            appStyles.border.soft,
                                            appStyles.background.whiteSoft,
                                            appStyles.tokens.color.background.hoverWarmSubtle,
                                        ].join(" ")}
                                    >
                                        <p
                                            className={[
                                                "mb-2 text-sm font-medium",
                                                appStyles.textColor.tableHead,
                                            ].join(" ")}
                                        >
                                            {day}
                                        </p>

                                        <div className="space-y-2">
                                            {assignmentsOfDay.map((assignment) => (
                                                <Link
                                                    key={assignment.id}
                                                    href={`/staff/jobs/${assignment.slot.jobId}`}
                                                    className={[
                                                        "block border px-2 py-1.5 text-xs shadow-sm transition hover:opacity-80 active:scale-[0.98]",
                                                        appStyles.radius.xl,
                                                        getCalendarStatusClassName("confirmed"),
                                                    ].join(" ")}
                                                >
                                                    <p className="line-clamp-2 font-medium leading-snug">
                                                        {assignment.slot.job.title}
                                                    </p>

                                                    <p className="mt-1">
                                                        {assignment.slot.startTime}〜
                                                        {assignment.slot.endTime}
                                                    </p>
                                                </Link>
                                            ))}

                                            {unavailableTimesOfDay.map((unavailableTime) => (
                                                <div
                                                    key={`${unavailableTime.id}-${day}`}
                                                    className={[
                                                        "border px-2 py-1.5 text-xs shadow-sm",
                                                        appStyles.radius.xl,
                                                        getCalendarStatusClassName("unavailable"),
                                                    ].join(" ")}
                                                >
                                                    <p className="font-medium">
                                                        {getUnavailableTimeText(unavailableTime)}
                                                    </p>

                                                    <p className="mt-1 line-clamp-2 leading-snug">
                                                        {getUnavailableTitle(unavailableTime)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </AppCard>

                <AppCard className="overflow-hidden">
                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-start gap-3">
                            <div className={appStyles.icon.circle}>
                                <FileText className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle
                                    className={[
                                        appStyles.text.title,
                                        "text-xl",
                                    ].join(" ")}
                                >
                                    一覧表示
                                </CardTitle>
                                <p className={["mt-1", appStyles.text.muted].join(" ")}>
                                    対象月の勤務予定と勤務不可情報を一覧で確認します。
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-2">
                        <div className={appStyles.table.wrapper}>
                            <Table>
                                <TableHeader>
                                    <TableRow className={appStyles.table.headerRow}>
                                        <TableHead className={appStyles.table.head}>
                                            日付
                                        </TableHead>

                                        <TableHead className={appStyles.table.head}>
                                            状態
                                        </TableHead>

                                        <TableHead className={appStyles.table.head}>
                                            内容
                                        </TableHead>

                                        <TableHead className={appStyles.table.head}>
                                            時間
                                        </TableHead>

                                        <TableHead className={appStyles.table.head}>
                                            場所・種別
                                        </TableHead>

                                        <TableHead className={appStyles.table.head}>
                                            集合場所
                                        </TableHead>

                                        <TableHead
                                            className={[
                                                appStyles.table.head,
                                                "text-right",
                                            ].join(" ")}
                                        >
                                            操作
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {listItems.map((item) => (
                                        <TableRow
                                            key={`${item.status}-${item.id}`}
                                            className={appStyles.table.row}
                                        >
                                            <TableCell
                                                className={[
                                                    "whitespace-nowrap",
                                                    appStyles.table.cellMuted,
                                                ].join(" ")}
                                            >
                                                {formatDate(item.date)}
                                            </TableCell>

                                            <TableCell>
                                                <span
                                                    className={[
                                                        "inline-flex border px-2 py-1 text-xs font-medium",
                                                        appStyles.radius.full,
                                                        getCalendarStatusClassName(item.status),
                                                    ].join(" ")}
                                                >
                                                    {getCalendarStatusLabel(item.status)}
                                                </span>
                                            </TableCell>

                                            <TableCell>
                                                <p
                                                    className={[
                                                        appStyles.text.title,
                                                        "text-base",
                                                    ].join(" ")}
                                                >
                                                    {item.title}
                                                </p>
                                            </TableCell>

                                            <TableCell
                                                className={[
                                                    "whitespace-nowrap",
                                                    appStyles.table.cellMuted,
                                                ].join(" ")}
                                            >
                                                {item.timeText || "-"}
                                            </TableCell>

                                            <TableCell className={appStyles.table.cellMuted}>
                                                {item.locationText || "-"}
                                            </TableCell>

                                            <TableCell className={appStyles.table.cellMuted}>
                                                {item.meetingPlaceText || "-"}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                {item.href ? (
                                                    <LinkButton
                                                        href={item.href}
                                                        size="sm"
                                                        variant="outline"
                                                        className={appStyles.button.secondary}
                                                    >
                                                        詳細
                                                    </LinkButton>
                                                ) : (
                                                    <span
                                                        className={[
                                                            "text-sm",
                                                            appStyles.textColor.muted,
                                                        ].join(" ")}
                                                    >
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {listItems.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className={appStyles.table.empty}
                                            >
                                                対象月に予定はありません。
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </AppCard>
            </div>
        </PageShell>
    );
};

export default StaffCalendarPage;