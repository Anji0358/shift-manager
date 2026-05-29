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

export const PersonalLineMessageForm = ({
    selectedMonth,
    employees,
    jobs,
    unavailableTimes,
}: PersonalLineMessageFormProps) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(
        employees[0]?.id ?? ""
    );

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
                スタッフのNG日時と重複しない案件を選び、個人LINEに送る依頼文を作成します。
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
                        onChange={(event) =>
                            setSelectedEmployeeId(event.target.value)
                        }
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
            </div>

            <div className="mt-6 space-y-3">
                <p className="text-sm font-medium text-slate-700">
                    勤務枠一覧
                </p>

                {availableSlots.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        対象月に勤務枠がありません。
                    </p>
                ) : (
                    <div className="space-y-2">
                        {availableSlots.map((slot) => (
                            <div
                                key={slot.slotId}
                                className="rounded-xl border bg-white p-3 text-sm"
                            >
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};