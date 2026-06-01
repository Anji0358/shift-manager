"use client";

import { MessageSquareText } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type {
    AvailablePersonalSlot,
    LineMessageEmployee,
    LineMessageUnavailableTime,
    PersonalLineMessageJob,
} from "../types";
import { isSlotUnavailable } from "../utils/unavailable-time";
import { generatePersonalRequestMessage } from "../message-generators/personal-message";
import { PersonalSummaryCards } from "./personal/PersonalSummaryCards";
import { PersonalMessageTextFields } from "./personal/PersonalMessageTextFields";
import { PersonalSlotList } from "./personal/PersonalSlotList";
import { GeneratedMessagePanel } from "./GeneratedMessagePanel";
import { inputClassName } from "../styles";

type PersonalLineMessageFormProps = {
    selectedMonth: string;
    employees: LineMessageEmployee[];
    jobs: PersonalLineMessageJob[];
    unavailableTimes: LineMessageUnavailableTime[];
};

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

                <PersonalSummaryCards
                    selectedEmployee={selectedEmployee}
                    unavailableCount={selectedEmployeeUnavailableTimes.length}
                    jobCount={jobs.length}
                    slotCount={availableSlots.length}
                    requestableSlotCount={requestableSlots.length}
                />

                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
                    <div className="space-y-4">
                        <PersonalMessageTextFields
                            greeting={greeting}
                            introText={introText}
                            closing={closing}
                            onGreetingChange={(value) => {
                                setGreeting(value);
                                setCopied(false);
                            }}
                            onIntroTextChange={(value) => {
                                setIntroText(value);
                                setCopied(false);
                            }}
                            onClosingChange={(value) => {
                                setClosing(value);
                                setCopied(false);
                            }}
                        />

                        <Button
                            type="button"
                            onClick={handleGenerateMessage}
                            disabled={selectedSlots.length === 0}
                        >
                            <MessageSquareText className="mr-2 h-4 w-4" />
                            文章生成
                        </Button>
                    </div>

                    <PersonalSlotList
                        slots={requestableSlots}
                        selectedSlotIds={selectedSlotIds}
                        onToggleSlot={handleToggleSlot}
                    />
                </div>
            </div>

            <GeneratedMessagePanel
                message={message}
                copied={copied}
                placeholder="ここに個人依頼文が表示されます。"
                onMessageChange={(value) => {
                    setMessage(value);
                    setCopied(false);
                }}
                onCopy={handleCopy}
            />
        </div>
    );
};