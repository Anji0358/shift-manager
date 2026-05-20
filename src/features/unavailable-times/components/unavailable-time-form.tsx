"use client";

import Link from "next/link";
import { useState } from "react";
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
import { SubmitButton } from "@/components/shared/submit-button";
import { createUnavailableTime } from "@/features/unavailable-times/actions";

type UnavailableFormType = "FULL_DAY" | "TIME_RANGE" | "WEEKLY_FIXED";

export const UnavailableTimeForm = () => {
    const [type, setType] = useState<UnavailableFormType>("FULL_DAY");

    const showDate = type === "FULL_DAY" || type === "TIME_RANGE";
    const showDayOfWeek = type === "WEEKLY_FIXED";
    const showTimeRange = type === "TIME_RANGE" || type === "WEEKLY_FIXED";

    return (
        <Card>
            <CardHeader>
                <CardTitle>勤務できない日時の内容</CardTitle>
            </CardHeader>

            <CardContent>
                <form action={createUnavailableTime} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="type">どのような予定ですか？</Label>

                        <Select
                            name="type"
                            value={type}
                            onValueChange={(value) => setType(value as UnavailableFormType)}
                        >
                            <SelectTrigger id="type">
                                <SelectValue placeholder="勤務できない日時の種類を選択" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="FULL_DAY">
                                    この日は終日勤務できない
                                </SelectItem>

                                <SelectItem value="TIME_RANGE">
                                    この日の一部時間だけ勤務できない
                                </SelectItem>

                                <SelectItem value="WEEKLY_FIXED">
                                    毎週決まった時間に勤務できない
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <p className="text-xs text-slate-500">
                            選択した内容に合わせて、必要な入力欄だけ表示されます。
                        </p>
                    </div>

                    {type === "FULL_DAY" && (
                        <div className="rounded-lg border bg-slate-50 p-4 text-sm text-slate-600">
                            例：試験、帰省、私用などで、その日まるごと勤務できない場合に使います。
                        </div>
                    )}

                    {type === "TIME_RANGE" && (
                        <div className="rounded-lg border bg-slate-50 p-4 text-sm text-slate-600">
                            例：13:00〜17:00は授業があるなど、その日の一部時間だけ勤務できない場合に使います。
                        </div>
                    )}

                    {type === "WEEKLY_FIXED" && (
                        <div className="rounded-lg border bg-slate-50 p-4 text-sm text-slate-600">
                            例：毎週月曜の9:00〜12:00は授業があるなど、毎週決まった予定がある場合に使います。
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        {showDate && (
                            <div className="space-y-2">
                                <Label htmlFor="date">日付</Label>
                                <Input id="date" name="date" type="date" required />
                            </div>
                        )}

                        {showDayOfWeek && (
                            <div className="space-y-2">
                                <Label htmlFor="dayOfWeek">曜日</Label>

                                <Select name="dayOfWeek" defaultValue="MONDAY">
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
                            </div>
                        )}

                        {showTimeRange && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="startTime">開始時間</Label>
                                    <Input id="startTime" name="startTime" type="time" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="endTime">終了時間</Label>
                                    <Input id="endTime" name="endTime" type="time" required />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reason">理由・メモ</Label>
                        <Textarea
                            id="reason"
                            name="reason"
                            placeholder="例：大学の授業、試験、帰省、別予定など"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button asChild variant="outline">
                            <Link href="/staff/unavailable-times">キャンセル</Link>
                        </Button>

                        <SubmitButton pendingText="登録中...">
                            勤務できない日時を登録
                        </SubmitButton>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};