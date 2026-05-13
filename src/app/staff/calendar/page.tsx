import { Badge } from "@/components/ui/badge";
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
import {
    mockJobs,
    mockJobShiftSlots,
    mockShiftAssignments,
    mockWorkReports,
} from "@/features/shared/mock-data";

const getDayNumber = (dateText: string) => {
    return Number(dateText.split("-")[2]);
};

const StaffCalendarPage = () => {
    const currentEmployeeId = "emp_2";

    const myAssignments = mockShiftAssignments.filter(
        (assignment) => assignment.employeeId === currentEmployeeId,
    );

    const shiftRows = myAssignments.map((assignment) => {
        const job = mockJobs.find((job) => job.id === assignment.jobId);
        const slot = mockJobShiftSlots.find((slot) => slot.id === assignment.slotId);
        const report = mockWorkReports.find(
            (report) =>
                report.employeeId === currentEmployeeId && report.jobId === job?.id,
        );

        return {
            assignment,
            job,
            slot,
            report,
        };
    });

    const days = Array.from({ length: 31 }, (_, index) => index + 1);

    return (
        <div className="space-y-8">
            <section>
                <h1 className="text-3xl font-bold">月間シフトカレンダー</h1>
                <p className="mt-2 text-slate-600">
                    月ごとの勤務予定をカレンダー形式と一覧形式で確認します。
                </p>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>2026年5月</CardTitle>
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
                            const shiftsOfDay = shiftRows.filter(({ job }) => {
                                if (!job) {
                                    return false;
                                }

                                return getDayNumber(job.workDate) === day;
                            });

                            return (
                                <div key={day} className="min-h-32 border-r border-b p-2">
                                    <p className="mb-2 text-sm font-medium">{day}</p>

                                    <div className="space-y-2">
                                        {shiftsOfDay.map(({ assignment, job, slot, report }) => (
                                            <div
                                                key={assignment.id}
                                                className="rounded-md border bg-white p-2 text-xs shadow-sm"
                                            >
                                                <p className="font-medium">{job?.title}</p>
                                                <p className="text-slate-500">
                                                    {slot?.startTime}〜{slot?.endTime}
                                                </p>
                                                <p className="text-slate-500">
                                                    集合：{job?.meetingPlace}
                                                </p>
                                                {report?.status === "NOT_SUBMITTED" && (
                                                    <Badge variant="destructive" className="mt-2">
                                                        報告未提出
                                                    </Badge>
                                                )}
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
                                <TableHead>勤務時間</TableHead>
                                <TableHead>場所</TableHead>
                                <TableHead>集合場所</TableHead>
                                <TableHead>食事</TableHead>
                                <TableHead>報告状態</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {shiftRows.map(({ assignment, job, slot, report }) => (
                                <TableRow key={assignment.id}>
                                    <TableCell>{job?.workDate}</TableCell>
                                    <TableCell className="font-medium">{job?.title}</TableCell>
                                    <TableCell>
                                        {slot?.startTime}〜{slot?.endTime}
                                    </TableCell>
                                    <TableCell>{job?.location}</TableCell>
                                    <TableCell>{job?.meetingPlace}</TableCell>
                                    <TableCell>
                                        <Badge variant={job?.hasMeal ? "default" : "outline"}>
                                            {job?.hasMeal ? "あり" : "なし"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                report?.status === "NOT_SUBMITTED"
                                                    ? "destructive"
                                                    : "secondary"
                                            }
                                        >
                                            {report?.status === "NOT_SUBMITTED"
                                                ? "未提出"
                                                : "提出済み"}
                                        </Badge>
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

export default StaffCalendarPage;