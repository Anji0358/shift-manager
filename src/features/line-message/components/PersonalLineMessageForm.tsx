"use client";

import { useMemo, useState } from "react";

type PersonalLineMessageFormProps = {
    selectedMonth: string;
    employees: {
        id: string;
        name: string;
    }[];
    jobs: {
        id: string;
        title: string;
        workDate: Date;
        location: string;
        meetingPlace: string | null;
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
                    id: string;
                    name: string;
                };
            }[];
            externalStaffAssignments: {
                name: string;
                headCount: number;
            }[];
        }[];
    }[];
    unavailableTimes: {
        id: string;
        employeeId: string;
        type: "FULL_DAY" | "TIME_RANGE" | "WEEKLY_FIXED" | "TEMPORARY";
        date: Date | null;
        dayOfWeek:
        | "MONDAY"
        | "TUESDAY"
        | "WEDNESDAY"
        | "THURSDAY"
        | "FRIDAY"
        | "SATURDAY"
        | "SUNDAY"
        | null;
        startTime: string | null;
        endTime: string | null;
        reason: string | null;
    }[];
};

type AvailablePersonalSlot = {
    jobId: string;
    slotId: string;
    title: string;
    workDate: Date;
    location: string;
    startTime: string;
    endTime: string;
    startTimeMinutes: number;
    endTimeMinutes: number;
};

const dayOfWeekMap = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
] as const;

const isSameDate = (dateA: Date, dateB: Date) => {
    return (
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate()
    );
};

const isTimeOverlapping = (
    slotStartMinutes: number,
    slotEndMinutes: number,
    unavailableStartTime: string | null,
    unavailableEndTime: string | null
) => {
    if (!unavailableStartTime || !unavailableEndTime) {
        return true;
    }

    const [unavailableStartHour, unavailableStartMinute] =
        unavailableStartTime.split(":").map(Number);
    const [unavailableEndHour, unavailableEndMinute] =
        unavailableEndTime.split(":").map(Number);

    const unavailableStartMinutes =
        unavailableStartHour * 60 + unavailableStartMinute;
    const unavailableEndMinutes =
        unavailableEndHour * 60 + unavailableEndMinute;

    return (
        slotStartMinutes < unavailableEndMinutes &&
        unavailableStartMinutes < slotEndMinutes
    );
};

const isSlotUnavailable = (
    slot: AvailablePersonalSlot,
    unavailableTimes: PersonalLineMessageFormProps["unavailableTimes"]
) => {
    return unavailableTimes.some((unavailableTime) => {
        if (unavailableTime.type === "FULL_DAY") {
            return unavailableTime.date
                ? isSameDate(slot.workDate, unavailableTime.date)
                : false;
        }

        if (
            unavailableTime.type === "TIME_RANGE" ||
            unavailableTime.type === "TEMPORARY"
        ) {
            if (!unavailableTime.date) {
                return false;
            }

            return (
                isSameDate(slot.workDate, unavailableTime.date) &&
                isTimeOverlapping(
                    slot.startTimeMinutes,
                    slot.endTimeMinutes,
                    unavailableTime.startTime,
                    unavailableTime.endTime
                )
            );
        }

        if (unavailableTime.type === "WEEKLY_FIXED") {
            const slotDayOfWeek = dayOfWeekMap[slot.workDate.getDay()];

            return (
                unavailableTime.dayOfWeek === slotDayOfWeek &&
                isTimeOverlapping(
                    slot.startTimeMinutes,
                    slot.endTimeMinutes,
                    unavailableTime.startTime,
                    unavailableTime.endTime
                )
            );
        }

        return false;
    });
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

    const handleToggleSlot = (slotId: string) => {
        setSelectedSlotIds((current) => {
            if (current.includes(slotId)) {
                return current.filter((id) => id !== slotId);
            }

            return [...current, slotId];
        });
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
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">個人依頼文</h2>
            <p className="mt-2 text-sm text-slate-500">
                スタッフのNG日時と重複しない勤務枠を選び、個人LINEに送る依頼文を作成します。
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">対象月</label>
                    <input
                        type="month"
                        value={selectedMonth}
                        readOnly
                        className="w-full rounded-xl border bg-slate-100 px-3 py-2 text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">スタッフ</label>
                    <select
                        value={selectedEmployeeId}
                        onChange={(event) => {
                            setSelectedEmployeeId(event.target.value);
                            setSelectedSlotIds([]);
                        }}
                        className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
                    >
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-6 rounded-xl border bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-700">
                    選択中のスタッフ
                </p>
                <p className="mt-1 text-sm text-slate-500">
                    {selectedEmployee?.name ?? "未選択"}
                </p>

                <p className="mt-4 text-sm font-medium text-slate-700">
                    登録されているNG件数
                </p>
                <p className="mt-1 text-sm text-slate-500">
                    {selectedEmployeeUnavailableTimes.length}件
                </p>

                <p className="mt-4 text-sm font-medium text-slate-700">
                    対象月の案件数
                </p>
                <p className="mt-1 text-sm text-slate-500">
                    {jobs.length}件
                </p>

                <p className="mt-4 text-sm font-medium text-slate-700">
                    対象月の勤務枠数
                </p>
                <p className="mt-1 text-sm text-slate-500">
                    {availableSlots.length}件
                </p>

                <p className="mt-4 text-sm font-medium text-slate-700">
                    NGと被っていない勤務枠数
                </p>
                <p className="mt-1 text-sm text-slate-500">
                    {requestableSlots.length}件
                </p>
            </div>

            <div className="mt-6 space-y-3">
                <div>
                    <p className="text-sm font-medium text-slate-700">
                        依頼可能な勤務枠一覧
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        選択中：{selectedSlotIds.length}件
                    </p>
                </div>

                {requestableSlots.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        NGと被っていない勤務枠がありません。
                    </p>
                ) : (
                    <div className="space-y-2">
                        {requestableSlots.map((slot) => {
                            const checked = selectedSlotIds.includes(slot.slotId);

                            return (
                                <label
                                    key={slot.slotId}
                                    className={[
                                        "flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-3 text-sm transition",
                                        checked ? "border-slate-900 bg-slate-50" : "hover:bg-slate-50",
                                    ].join(" ")}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleToggleSlot(slot.slotId)}
                                        className="mt-1"
                                    />

                                    <div>
                                        <p className="font-medium text-slate-800">
                                            {`${slot.workDate.getMonth() + 1}/${slot.workDate.getDate()} ${slot.title}`}
                                        </p>
                                        <p className="mt-1 text-slate-500">
                                            {slot.location}
                                        </p>
                                        <p className="mt-1 text-slate-500">
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
    );
};