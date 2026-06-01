"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateGroupJobMessage } from "../message-generators";
import type {
    GroupLineMessageJob,
    GroupMessageOptions,
    GroupMessageType,
} from "../types";
import { GeneratedMessagePanel } from "./GeneratedMessagePanel";

type GroupJobMessageFormProps = {
    selectedMonth: string;
    jobs: GroupLineMessageJob[];
};

const inputClassName =
    "w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

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

    const hasNoShiftSlots = selectedJob
        ? selectedJob.shiftSlots.length === 0
        : false;

    const hasNoAssignedStaff = selectedJob
        ? selectedJob.shiftSlots.length > 0 &&
        selectedJob.shiftSlots.every(
            (slot) =>
                slot.shiftAssignments.length === 0 &&
                slot.externalStaffAssignments.length === 0
        )
        : false;

    const assignedStaffCount = selectedJob
        ? selectedJob.shiftSlots.reduce((total, slot) => {
            const internalCount = slot.shiftAssignments.length;
            const externalCount = slot.externalStaffAssignments.reduce(
                (sum, assignment) => sum + assignment.headCount,
                0
            );

            return total + internalCount + externalCount;
        }, 0)
        : 0;

    const handleOptionChange = (key: keyof GroupMessageOptions) => {
        setOptions((current) => ({
            ...current,
            [key]: !current[key],
        }));
        setCopied(false);
    };

    const handleGenerate = () => {
        if (!selectedJob || hasNoShiftSlots) {
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

    useEffect(() => {
        if (!selectedJob || hasNoShiftSlots) {
            setMessage("");
            setCopied(false);
            return;
        }

        const generatedMessage = generateGroupJobMessage({
            job: selectedJob,
            type: messageType,
            options,
        });

        setMessage(generatedMessage);
        setCopied(false);
    }, [selectedJob, messageType, options, hasNoShiftSlots]);

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
                    <div className="rounded-2xl bg-blue-50 p-3 shadow-sm">
                        <MessageSquareText className="h-5 w-5 text-blue-600" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            案件グループ用メッセージ
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            案件ごとのLINEグループに送る確認文・詳細文を作成します。
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-3">
                    <form className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            対象月
                        </label>
                        <input
                            type="month"
                            name="month"
                            defaultValue={selectedMonth}
                            onChange={(event) => {
                                event.currentTarget.form?.requestSubmit();
                            }}
                            className={inputClassName}
                        />
                    </form>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            案件
                        </label>
                        <select
                            value={selectedJobId}
                            onChange={(event) => {
                                setSelectedJobId(event.target.value);
                                setMessage("");
                                setCopied(false);
                            }}
                            className={inputClassName}
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
                        <label className="text-sm font-medium text-slate-700">
                            メッセージ種類
                        </label>
                        <select
                            value={messageType}
                            onChange={(event) => {
                                setMessageType(event.target.value as GroupMessageType);
                                setMessage("");
                                setCopied(false);
                            }}
                            className={inputClassName}
                        >
                            <option value="scheduleConfirm">
                                スケジュール確認
                            </option>
                            <option value="detail">詳細連絡</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 grid gap-3 rounded-2xl bg-blue-50/60 p-4 md:grid-cols-4">
                    <div>
                        <p className="text-xs font-medium text-blue-600">
                            選択中の案件
                        </p>
                        <p className="mt-2 font-semibold text-slate-900">
                            {selectedJob?.title ?? "未選択"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-blue-600">
                            勤務枠数
                        </p>
                        <p className="mt-2 font-semibold text-slate-900">
                            {selectedJob?.shiftSlots.length ?? 0}件
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-blue-600">
                            割当人数
                        </p>
                        <p className="mt-2 font-semibold text-slate-900">
                            {assignedStaffCount}人
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-blue-600">
                            種類
                        </p>
                        <p className="mt-2 font-semibold text-slate-900">
                            {messageType === "scheduleConfirm"
                                ? "確認"
                                : "詳細"}
                        </p>
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <p className="text-sm font-medium text-slate-700">
                        表示する項目
                    </p>

                    <div className="grid gap-3 md:grid-cols-2">
                        {[
                            {
                                key: "includeMeetingPlace",
                                label: "集合場所を含める",
                            },
                            {
                                key: "includeDressCode",
                                label: "服装を含める",
                            },
                            {
                                key: "includeBelongings",
                                label: "持ち物を含める",
                            },
                            {
                                key: "includeNote",
                                label: "備考を含める",
                            },
                        ].map((item) => {
                            const optionKey =
                                item.key as keyof GroupMessageOptions;
                            const checked = options[optionKey];

                            return (
                                <label
                                    key={item.key}
                                    className={[
                                        "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition",
                                        checked
                                            ? "border-blue-400 bg-blue-50 text-slate-900"
                                            : "bg-white text-slate-600 hover:bg-slate-50",
                                    ].join(" ")}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() =>
                                            handleOptionChange(optionKey)
                                        }
                                    />
                                    {item.label}
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6">
                    <Button
                        type="button"
                        onClick={handleGenerate}
                        disabled={!selectedJob || hasNoShiftSlots}
                    >
                        <MessageSquareText className="mr-2 h-4 w-4" />
                        再生成
                    </Button>
                </div>
            </div>

            <GeneratedMessagePanel
                message={message}
                copied={copied}
                onMessageChange={(value) => {
                    setMessage(value);
                    setCopied(false);
                }}
                onCopy={handleCopy}
            />
        </div>
    );
};