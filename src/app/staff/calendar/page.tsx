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
import { formatDate } from "@/lib/format";
import { getCurrentYearMonth, getMonthRange } from "@/lib/month";
import { getCurrentEmployeeId } from "@/lib/auth/current-user";

type StaffCalendarPageProps = {
    searchParams: Promise<{
        month?: string;
    }>;
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

    const days = Array.from(
        { length: getDaysInMonth(targetMonth) },
        (_, index) => index + 1,
    );

    return (
        <div className="space-y-8">
            <section>
                <h1 className="text-3xl font-bold">月間シフトカレンダー</h1>
                <p className="mt-2 text-slate-600">
                    月ごとの勤務予定をカレンダー形式と一覧形式で確認します。
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

                            return (
                                <div key={day} className="min-h-32 border-r border-b p-2">
                                    <p className="mb-2 text-sm font-medium">{day}</p>

                                    <div className="space-y-2">
                                        {assignmentsOfDay.map((assignment) => (
                                            <div
                                                key={assignment.id}
                                                className="rounded-md border bg-white p-2 text-xs shadow-sm"
                                            >
                                                <p className="font-medium">{assignment.job.title}</p>
                                                <p className="text-slate-500">
                                                    {assignment.slot.startTime}〜{assignment.slot.endTime}
                                                </p>
                                                <p className="text-slate-500">
                                                    集合：{assignment.job.meetingPlace}
                                                </p>
                                                <Badge variant="secondary" className="mt-2">
                                                    確定
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
                                <TableHead>案件名</TableHead>
                                <TableHead>勤務枠</TableHead>
                                <TableHead>勤務時間</TableHead>
                                <TableHead>場所</TableHead>
                                <TableHead>集合場所</TableHead>
                                <TableHead>食事</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {assignments.map((assignment) => (
                                <TableRow key={assignment.id}>
                                    <TableCell>{formatDate(assignment.job.workDate)}</TableCell>
                                    <TableCell className="font-medium">
                                        {assignment.job.title}
                                    </TableCell>
                                    <TableCell>{assignment.slot.name}</TableCell>
                                    <TableCell>
                                        {assignment.slot.startTime}〜{assignment.slot.endTime}
                                    </TableCell>
                                    <TableCell>{assignment.job.location}</TableCell>
                                    <TableCell>{assignment.job.meetingPlace}</TableCell>
                                    <TableCell>
                                        <Badge variant={assignment.job.hasMeal ? "default" : "outline"}>
                                            {assignment.job.hasMeal ? "あり" : "なし"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {assignments.length === 0 && (
                        <p className="mt-4 text-sm text-slate-500">
                            対象月に確定しているシフトはありません。
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffCalendarPage;