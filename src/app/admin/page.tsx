import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockJobs, mockWorkReports } from "@/features/shared/mock-data";

const AdminDashboardPage = () => {
    const unsubmittedReports = mockWorkReports.filter(
        (report) => report.status === "NOT_SUBMITTED",
    );

    const submittedReports = mockWorkReports.filter(
        (report) => report.status === "SUBMITTED",
    );

    return (
        <div className="space-y-8">
            <section>
                <h1 className="text-3xl font-bold">管理者ダッシュボード</h1>
                <p className="mt-2 text-slate-600">
                    案件、人員状況、就労報告の状態を確認できます。
                </p>
            </section>

            <section className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">登録案件数</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{mockJobs.length}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            未提出レポート
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{unsubmittedReports.length}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            未承認レポート
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{submittedReports.length}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-500">
                            人員不足案件
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">0</p>
                    </CardContent>
                </Card>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">直近の案件</h2>

                <div className="grid gap-4 md:grid-cols-2">
                    {mockJobs.map((job) => (
                        <Card key={job.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>{job.title}</CardTitle>
                                    <Badge variant="secondary">{job.workDate}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-slate-600">
                                <p>場所：{job.location}</p>
                                <p>集合場所：{job.meetingPlace}</p>
                                <p>
                                    勤務時間：{job.startTime}〜{job.endTime}
                                </p>
                                <p>食事：{job.hasMeal ? "あり" : "なし"}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AdminDashboardPage;