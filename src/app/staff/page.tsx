import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    mockJobs,
    mockShiftAssignments,
    mockWorkReports,
} from "@/features/shared/mock-data";

const StaffDashboardPage = () => {
    const currentEmployeeId = "emp_2";

    const myAssignments = mockShiftAssignments.filter(
        (assignment) => assignment.employeeId === currentEmployeeId,
    );

    const myJobs = myAssignments
        .map((assignment) => mockJobs.find((job) => job.id === assignment.jobId))
        .filter((job) => job !== undefined);

    const nextJob = myJobs[0];

    const myUnsubmittedReports = mockWorkReports.filter(
        (report) =>
            report.employeeId === currentEmployeeId &&
            report.status === "NOT_SUBMITTED",
    );

    const estimatedSalary = myJobs.reduce((total, job) => {
        const hourlyWage = job.fixedHourlyWage ?? 1400;
        const startHour = Number(job.startTime.split(":")[0]);
        const endHour = Number(job.endTime.split(":")[0]);
        const workHours = endHour - startHour - job.breakMinutes / 60;

        return total + workHours * hourlyWage + job.transportationFee;
    }, 0);

    return (
        <div className="space-y-8">
            <section>
                <h1 className="text-3xl font-bold">従業員ダッシュボード</h1>
                <p className="mt-2 text-slate-600">
                    次の勤務、就労報告、今月の給与見込みを確認できます。
                </p>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            今月の勤務予定
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{myJobs.length}件</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            未提出の就労報告
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {myUnsubmittedReports.length}件
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            今月の給与見込み
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {estimatedSalary.toLocaleString()}円
                        </p>
                    </CardContent>
                </Card>
            </section>

            <section>
                <h2 className="mb-4 text-xl font-semibold">次の勤務</h2>

                {nextJob ? (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>{nextJob.title}</CardTitle>
                                <Badge>{nextJob.workDate}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-slate-600">
                            <p>場所：{nextJob.location}</p>
                            <p>集合場所：{nextJob.meetingPlace}</p>
                            <p>
                                勤務時間：{nextJob.startTime}〜{nextJob.endTime}
                            </p>
                            <p>服装：{nextJob.dressCode}</p>
                            <p>持ち物：{nextJob.belongings}</p>
                            <p>食事：{nextJob.hasMeal ? "あり" : "なし"}</p>
                            <p>備考：{nextJob.note}</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="py-6 text-sm text-slate-600">
                            次の勤務はありません。
                        </CardContent>
                    </Card>
                )}
            </section>
        </div>
    );
};

export default StaffDashboardPage;