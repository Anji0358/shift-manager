import { notFound, redirect } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LinkButton } from "@/components/shared/link-button";
import { SubmitButton } from "@/components/shared/submit-button";
import { getAssignmentById } from "@/features/shift-assignments/queries";
import { createWorkReport } from "@/features/work-reports/actions";
import { getWorkReportByEmployeeIdAndJobId } from "@/features/work-reports/queries";
import { formatDate } from "@/lib/format";
import { getCurrentEmployeeId } from "@/lib/auth/current-user";

type StaffNewWorkReportPageProps = {
    searchParams: Promise<{
        assignmentId?: string;
    }>;
};

const StaffNewWorkReportPage = async ({
    searchParams,
}: StaffNewWorkReportPageProps) => {
    const { assignmentId } = await searchParams;

    if (!assignmentId) {
        notFound();
    }

    const currentEmployeeId = await getCurrentEmployeeId();

    const assignment = await getAssignmentById(assignmentId);

    if (!assignment) {
        notFound();
    }

    if (assignment.employeeId !== currentEmployeeId) {
        notFound();
    }

    const job = assignment.slot.job;
    const slot = assignment.slot;
    const employee = assignment.employee;

    const existingReport = await getWorkReportByEmployeeIdAndJobId(
        currentEmployeeId,
        job.id,
    );

    if (existingReport) {
        redirect("/staff/shifts");
    }

    return (
        <div className="space-y-6">
            <section className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">就労報告提出</h1>
                    <p className="mt-2 text-slate-600">
                        実際の勤務時間、休憩時間、交通費などを報告します。
                    </p>
                </div>

                <LinkButton href="/staff/shifts" variant="outline">
                    確定シフトへ戻る
                </LinkButton>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>報告対象の案件</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-3 text-sm md:grid-cols-2">
                    <p>スタッフ：{employee.name}</p>
                    <p>案件名：{job.title}</p>
                    <p>勤務日：{formatDate(job.workDate)}</p>
                    <p>勤務枠：{slot.name}</p>
                    <p>
                        勤務時間：{slot.startTime}〜{slot.endTime}
                    </p>
                    <p>場所：{job.location}</p>
                    <p>集合場所：{job.meetingPlace || "未設定"}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>就労報告内容</CardTitle>
                </CardHeader>

                <CardContent>
                    <form action={createWorkReport} className="space-y-6">
                        <input type="hidden" name="jobId" value={job.id} />

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="actualStartTime">
                                    実勤務開始時間
                                </Label>
                                <Input
                                    id="actualStartTime"
                                    name="actualStartTime"
                                    type="time"
                                    defaultValue={slot.startTime}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="actualEndTime">
                                    実勤務終了時間
                                </Label>
                                <Input
                                    id="actualEndTime"
                                    name="actualEndTime"
                                    type="time"
                                    defaultValue={slot.endTime}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="actualBreakMinutes">
                                    実休憩時間
                                </Label>
                                <Input
                                    id="actualBreakMinutes"
                                    name="actualBreakMinutes"
                                    type="number"
                                    min={0}
                                    defaultValue={job.breakMinutes}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="transportationFee">
                                    交通費
                                </Label>
                                <Input
                                    id="transportationFee"
                                    name="transportationFee"
                                    type="number"
                                    min={0}
                                    defaultValue={job.transportationFee}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hasMeal">
                                    食事の有無
                                </Label>

                                <Select
                                    name="hasMeal"
                                    defaultValue={
                                        job.hasMeal ? "true" : "false"
                                    }
                                >
                                    <SelectTrigger id="hasMeal">
                                        <SelectValue placeholder="食事の有無を選択" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="true">
                                            あり
                                        </SelectItem>
                                        <SelectItem value="false">
                                            なし
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <LinkButton
                                href="/staff/shifts"
                                variant="outline"
                            >
                                キャンセル
                            </LinkButton>

                            <SubmitButton pendingText="提出中...">
                                提出する
                            </SubmitButton>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffNewWorkReportPage;