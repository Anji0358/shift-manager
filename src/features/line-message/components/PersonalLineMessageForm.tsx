"use client";

import { Copy, MessageSquareText } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type {
    AvailablePersonalSlot,
    LineMessageEmployee,
    LineMessageUnavailableTime,
    PersonalLineMessageJob,
} from "../types";
import { formatDateWithDay } from "../utils/date";
import { isSlotUnavailable } from "../utils/unavailable-time";
import { generatePersonalRequestMessage } from "../message-generators/personal-message";

type PersonalLineMessageFormProps = {
    selectedMonth: string;
    employees: LineMessageEmployee[];
    jobs: PersonalLineMessageJob[];
    unavailableTimes: LineMessageUnavailableTime[];
};

const inputClassName =
    "w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const textareaClassName =
    "w-full rounded-xl border bg-white p-3 text-sm leading-6 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const resultTextareaClassName =
    "min-h-80 w-full rounded-xl border bg-slate-50 p-4 text-sm leading-7 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export const PersonalLineMessageForm = ({
    selectedMonth,
    employees,
    jobs,
    unavailableTimes,
}: PersonalLineMessageFormProps) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(
        employees[0]?.id ?? ""
    );
    const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const [copied, setCopied] = useState(false);
    const [greeting, setGreeting] = useState("おつかれさま～(^^)/");
    const [introText, setIntroText] = useState(
        `${Number(selectedMonth.split("-")[1])}月の現状お願いしたい日を共有するね！`
    );
    const [closing, setClosing] = useState("こんな感じだよぉ～");

    const selectedEmployee = useMemo(() => {
        return employees.find((employee) => employee.id === selectedEmployeeId);
    }, [employees, selectedEmployeeId]);

    const selectedEmployeeUnavailableTimes = useMemo(() => {
        return unavailableTimes.filter(
            (unavailableTime) =>
                unavailableTime.employeeId === selectedEmployeeId
        );
    }, [unavailableTimes, selectedEmployeeId]);

    const availableSlots = useMemo<AvailablePersonalSlot[]>(() => {
        return jobs.flatMap((job) =>
            job.shiftSlots.map((slot) => ({
                jobId: job.id,
                slotId: slot.id,
                title: job.title,
                workDate: job.workDate,
                location: job.location,
                startTime: slot.startTime,
                endTime: slot.endTime,
                startTimeMinutes: slot.startTimeMinutes,
                endTimeMinutes: slot.endTimeMinutes,
            }))
        );
    }, [jobs]);

    const requestableSlots = useMemo(() => {
        return availableSlots.filter(
            (slot) =>
                !isSlotUnavailable(slot, selectedEmployeeUnavailableTimes)
        );
    }, [availableSlots, selectedEmployeeUnavailableTimes]);

    const selectedSlots = useMemo(() => {
        return requestableSlots.filter((slot) =>
            selectedSlotIds.includes(slot.slotId)
        );
    }, [requestableSlots, selectedSlotIds]);

    const handleToggleSlot = (slotId: string) => {
        setSelectedSlotIds((current) => {
            if (current.includes(slotId)) {
                return current.filter((id) => id !== slotId);
            }

            return [...current, slotId];
        });
        setCopied(false);
    };

    const handleGenerateMessage = () => {
        const generatedMessage = generatePersonalRequestMessage({
            greeting,
            introText,
            closing,
            slots: selectedSlots,
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

    if (employees.length === 0) {
        return (
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold">個人依頼文</h2>
                <p className="mt-2 text-sm text-slate-500">
                    依頼文を作成できる有効なスタッフがいません。
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
                            個人依頼文
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            スタッフのNG日時と重複しない勤務枠を選び、個人LINEに送る依頼文を作成します。
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
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
                            スタッフ
                        </label>
                        <select
                            value={selectedEmployeeId}
                            onChange={(event) => {
                                setSelectedEmployeeId(event.target.value);
                                setSelectedSlotIds([]);
                                setMessage("");
                                setCopied(false);
                            }}
                            className={inputClassName}
                        >
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-6 grid gap-3 rounded-2xl bg-blue-50/60 p-4 md:grid-cols-5">
                    <div>
                        <p className="text-xs font-medium text-blue-600">
                            選択中のスタッフ
                        </p>
                        <p className="mt-2 font-semibold text-slate-900">
                            {selectedEmployee?.name ?? "未選択"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-blue-600">
                            登録NG件数
                        </p>
                        <p className="mt-2 font-semibold text-slate-900">
                            {selectedEmployeeUnavailableTimes.length}件
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-blue-600">
                            対象月の案件数
                        </p>
                        <p className="mt-2 font-semibold text-slate-900">
                            {jobs.length}件
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-blue-600">
                            勤務枠数
                        </p>
                        <p className="mt-2 font-semibold text-slate-900">
                            {availableSlots.length}件
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-blue-600">
                            依頼可能枠
                        </p>
                        <p className="mt-2 font-semibold text-slate-900">
                            {requestableSlots.length}件
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                冒頭の挨拶
                            </label>
                            <textarea
                                value={greeting}
                                onChange={(event) => {
                                    setGreeting(event.target.value);
                                    setCopied(false);
                                }}
                                className={`${textareaClassName} min-h-20`}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                案内文
                            </label>
                            <textarea
                                value={introText}
                                onChange={(event) => {
                                    setIntroText(event.target.value);
                                    setCopied(false);
                                }}
                                className={`${textareaClassName} min-h-24`}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                最後の文言
                            </label>
                            <textarea
                                value={closing}
                                onChange={(event) => {
                                    setClosing(event.target.value);
                                    setCopied(false);
                                }}
                                className={`${textareaClassName} min-h-24`}
                            />
                        </div>

                        <Button
                            type="button"
                            onClick={handleGenerateMessage}
                            disabled={selectedSlots.length === 0}
                        >
                            <MessageSquareText className="mr-2 h-4 w-4" />
                            文章生成
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium text-slate-700">
                                    依頼可能な勤務枠一覧
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    選択中：{selectedSlotIds.length}件
                                </p>
                            </div>
                        </div>

                        {requestableSlots.length === 0 ? (
                            <p className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-500">
                                NGと被っていない勤務枠がありません。
                            </p>
                        ) : (
                            <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
                                {requestableSlots.map((slot) => {
                                    const checked = selectedSlotIds.includes(
                                        slot.slotId
                                    );

                                    return (
                                        <label
                                            key={slot.slotId}
                                            className={[
                                                "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition",
                                                checked
                                                    ? "border-blue-400 bg-blue-50 shadow-sm"
                                                    : "bg-white hover:bg-slate-50",
                                            ].join(" ")}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() =>
                                                    handleToggleSlot(slot.slotId)
                                                }
                                                className="h-4 w-4"
                                            />

                                            <div className="flex flex-1 items-center justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {`${formatDateWithDay(slot.workDate)} ${slot.title}`}
                                                    </p>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {slot.location}
                                                    </p>
                                                </div>

                                                <p className="shrink-0 text-sm font-medium text-slate-500">
                                                    {slot.startTime}〜{slot.endTime}
                                                </p>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h3 className="font-semibold text-slate-900">
                            生成結果
                        </h3>
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
                    placeholder="ここに個人依頼文が表示されます。"
                    className={resultTextareaClassName}
                />
            </div>
        </div>
    );
};