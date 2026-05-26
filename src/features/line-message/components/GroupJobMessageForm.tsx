"use client";

import { useMemo, useState } from "react";
import { Copy, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateGroupJobMessage } from "../message-generators";
import type { GroupMessageOptions, GroupMessageType } from "../types";

type GroupJobMessageFormProps = {
    selectedMonth: string;
    jobs: {
        id: string;
        title: string;
        workDate: Date;
        location: string;
        meetingPlace: string | null;
        dressCode: string | null;
        belongings: string | null;
        note: string | null;
        shiftSlots: {
            id: string;
            name: string;
            startTime: string;
            endTime: string;
            startTimeMinutes: number;
            endTimeMinutes: number;
            requiredPeople: number;
            shiftAssignments: {
                employee: {
                    name: string;
                };
            }[];
            externalStaffAssignments: {
                name: string;
                headCount: number;
            }[];
        }[];
    }[];
};

export const GroupJobMessageForm = ({
    jobs,
    selectedMonth,
}: GroupJobMessageFormProps) => {
    const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id ?? "");
    const [messageType, setMessageType] =
        useState<GroupMessageType>("scheduleConfirm");
    const [options, setOptions] = useState<GroupMessageOptions>({
        includeMeetingPlace: true,
        includeDressCode: true,
        includeBelongings: true,
        includeNote: true,
    });
    const [message, setMessage] = useState("");
    const [copied, setCopied] = useState(false);

    const selectedJob = useMemo(() => {
        return jobs.find((job) => job.id === selectedJobId);
    }, [jobs, selectedJobId]);

    const hasNoShiftSlots = selectedJob ? selectedJob.shiftSlots.length === 0 : false;

    const hasNoAssignedStaff = selectedJob
        ? selectedJob.shiftSlots.length > 0 &&
        selectedJob.shiftSlots.every(
            (slot) =>
                slot.shiftAssignments.length === 0 &&
                slot.externalStaffAssignments.length === 0
        )
        : false;

    const handleOptionChange = (key: keyof GroupMessageOptions) => {
        setOptions((current) => ({
            ...current,
            [key]: !current[key],
        }));
        setCopied(false);
    };

    const handleGenerate = () => {
        if (!selectedJob) {
            setMessage("");
            return;
        }

        const generatedMessage = generateGroupJobMessage({
            job: selectedJob,
            type: messageType,
            options,
        });

        setMessage(generatedMessage);
        setCopied(false);
    };

    const handleCopy = async () => {
        if (!message) {
            return;
        }

        await navigator.clipboard.writeText(message);
        setCopied(true);
    };

    if (jobs.length === 0) {
        return (
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold">
                    案件グループ用メッセージ
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    メッセージを作成できる案件がまだありません。
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-100 p-3">
                        <MessageSquareText className="h-5 w-5 text-slate-700" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold">
                            案件グループ用メッセージ
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            案件ごとのLINEグループに送る確認文・詳細文を作成します。
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <form className="space-y-2">
                        <label className="text-sm font-medium">対象月</label>
                        <input
                            type="month"
                            name="month"
                            defaultValue={selectedMonth}
                            onChange={(event) => {
                                event.currentTarget.form?.requestSubmit();
                            }}
                            className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
                        />
                    </form>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">案件</label>
                        <select
                            value={selectedJobId}
                            onChange={(event) => {
                                setSelectedJobId(event.target.value);
                                setMessage("");
                                setCopied(false);
                            }}
                            className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
                        >
                            {jobs.map((job) => (
                                <option key={job.id} value={job.id}>
                                    {`${job.workDate.getMonth() + 1}/${job.workDate.getDate()} ${job.title} / ${job.location}`}
                                </option>
                            ))}
                        </select>

                        {hasNoShiftSlots && (
                            <p className="text-sm text-amber-600">
                                この案件には勤務枠が登録されていません。
                            </p>
                        )}

                        {hasNoAssignedStaff && (
                            <p className="text-sm text-amber-600">
                                この案件にはまだ割当スタッフがいません。
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            メッセージ種類
                        </label>
                        <select
                            value={messageType}
                            onChange={(event) => {
                                setMessageType(event.target.value as GroupMessageType);
                                setMessage("");
                                setCopied(false);
                            }}
                            className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
                        >
                            <option value="scheduleConfirm">
                                スケジュール確認
                            </option>
                            <option value="detail">詳細連絡</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <p className="text-sm font-medium">表示する項目</p>

                    <div className="grid gap-3 md:grid-cols-2">
                        <label className="flex items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 text-sm">
                            <input
                                type="checkbox"
                                checked={options.includeMeetingPlace}
                                onChange={() => handleOptionChange("includeMeetingPlace")}
                            />
                            集合場所を含める
                        </label>

                        <label className="flex items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 text-sm">
                            <input
                                type="checkbox"
                                checked={options.includeDressCode}
                                onChange={() => handleOptionChange("includeDressCode")}
                            />
                            服装を含める
                        </label>

                        <label className="flex items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 text-sm">
                            <input
                                type="checkbox"
                                checked={options.includeBelongings}
                                onChange={() => handleOptionChange("includeBelongings")}
                            />
                            持ち物を含める
                        </label>

                        <label className="flex items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 text-sm">
                            <input
                                type="checkbox"
                                checked={options.includeNote}
                                onChange={() => handleOptionChange("includeNote")}
                            />
                            備考を含める
                        </label>
                    </div>
                </div>

                <div className="mt-6">
                    <Button
                        type="button"
                        onClick={handleGenerate}
                        disabled={!selectedJob || hasNoShiftSlots}
                    >
                        文章生成
                    </Button>
                </div>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h3 className="font-semibold">生成結果</h3>
                        <p className="mt-1 text-sm text-slate-500">
                            必要に応じて編集してからコピーできます。
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCopy}
                        disabled={!message}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        {copied ? "コピー済み" : "コピー"}
                    </Button>
                </div>

                <textarea
                    value={message}
                    onChange={(event) => {
                        setMessage(event.target.value);
                        setCopied(false);
                    }}
                    placeholder="ここに生成されたメッセージが表示されます。"
                    className="mt-4 min-h-96 w-full rounded-xl border bg-slate-50 p-4 text-sm leading-7"
                />
            </div>
        </div>
    );
};