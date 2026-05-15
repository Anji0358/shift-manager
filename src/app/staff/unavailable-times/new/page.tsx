import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createUnavailableTime } from "@/features/unavailable-times/actions";
import { SubmitButton } from "@/components/shared/submit-button";

const StaffNewUnavailableTimePage = () => {
    const currentEmployeeId = "emp_2";

    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-bold">勤務不可情報の追加</h1>
                <p className="mt-2 text-slate-600">
                    一日NG、時間指定NG、毎週固定NG、一時的な予定NGを登録します。
                </p>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>勤務不可情報</CardTitle>
                </CardHeader>

                <CardContent>
                    <form action={createUnavailableTime} className="space-y-6">
                        <input type="hidden" name="employeeId" value={currentEmployeeId} />

                        <div className="space-y-2">
                            <Label htmlFor="type">種別</Label>
                            <Select name="type" defaultValue="FULL_DAY">
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="勤務不可の種別を選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FULL_DAY">一日NG</SelectItem>
                                    <SelectItem value="TIME_RANGE">時間指定NG</SelectItem>
                                    <SelectItem value="WEEKLY_FIXED">毎週固定NG</SelectItem>
                                    <SelectItem value="TEMPORARY">一時的な予定NG</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="date">日付</Label>
                                <Input id="date" name="date" type="date" />
                                <p className="text-xs text-slate-500">
                                    毎週固定NGの場合は空欄でも問題ありません。
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dayOfWeek">曜日</Label>
                                <Select name="dayOfWeek">
                                    <SelectTrigger id="dayOfWeek">
                                        <SelectValue placeholder="曜日を選択" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MONDAY">月曜日</SelectItem>
                                        <SelectItem value="TUESDAY">火曜日</SelectItem>
                                        <SelectItem value="WEDNESDAY">水曜日</SelectItem>
                                        <SelectItem value="THURSDAY">木曜日</SelectItem>
                                        <SelectItem value="FRIDAY">金曜日</SelectItem>
                                        <SelectItem value="SATURDAY">土曜日</SelectItem>
                                        <SelectItem value="SUNDAY">日曜日</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-slate-500">
                                    毎週固定NGの場合に使用します。
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="startTime">開始時間</Label>
                                <Input id="startTime" name="startTime" type="time" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endTime">終了時間</Label>
                                <Input id="endTime" name="endTime" type="time" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reason">理由・メモ</Label>
                            <Textarea
                                id="reason"
                                name="reason"
                                placeholder="例：大学の授業、予定あり、試験期間など"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button asChild variant="outline">
                                <Link href="/staff/unavailable-times">キャンセル</Link>
                            </Button>
                            <SubmitButton pendingText="登録中...">
                                勤務不可情報を登録
                            </SubmitButton>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffNewUnavailableTimePage;