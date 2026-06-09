"use client";

import { useMemo, useState } from "react";
import type {
    Employee,
    JobShiftSlot,
    ShiftAssignment,
    UnavailableTime,
} from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { bridalStyles } from "@/components/shared/design-tokens";
import { createShiftAssignment } from "@/features/shift-assignments/actions";
import { isUnavailableForSlot } from "@/features/unavailable-times/services";
import { CheckCircle2, Info, TriangleAlert } from "lucide-react";

type Candidate = Employee & {
    unavailableTimes: UnavailableTime[];
};

type AssignmentForFilter = ShiftAssignment;

type StaffAssignmentFormProps = {
    jobId: string;
    workDate: string;
    shiftSlots: JobShiftSlot[];
    candidates: Candidate[];
    assignments: AssignmentForFilter[];
};

export const StaffAssignmentForm = ({
    jobId,
    workDate,
    shiftSlots,
    candidates,
    assignments,
}: StaffAssignmentFormProps) => {
    const [slotId, setSlotId] = useState("");
    const [employeeId, setEmployeeId] = useState("");

    const selectedSlot = useMemo(() => {
        return shiftSlots.find((slot) => slot.id === slotId);
    }, [shiftSlots, slotId]);

    const filteredCandidates = useMemo(() => {
        if (!selectedSlot) {
            return [];
        }

        const assignedEmployeeIds = new Set(
            assignments
                .filter((assignment) => assignment.slotId === selectedSlot.id)
                .map((assignment) => assignment.employeeId),
        );

        return candidates.filter((candidate) => {
            const alreadyAssigned = assignedEmployeeIds.has(candidate.id);

            const unavailable = isUnavailableForSlot(
                candidate.unavailableTimes,
                new Date(workDate),
                selectedSlot.startTime,
                selectedSlot.endTime,
            );

            return !alreadyAssigned && !unavailable;
        });
    }, [assignments, candidates, selectedSlot, workDate]);

    const handleSlotChange = (value: string) => {
        setSlotId(value);
        setEmployeeId("");
    };

    const cannotAssign =
        !selectedSlot || !employeeId || filteredCandidates.length === 0;

    return (
        <div className="space-y-4">
            <form
                action={createShiftAssignment}
                className="grid gap-4 md:grid-cols-[1fr_1fr_auto]"
            >
                <input type="hidden" name="jobId" value={jobId} />

                <div className="space-y-2">
                    <label className={bridalStyles.form.label}>
                        勤務枠
                    </label>

                    <Select
                        name="slotId"
                        value={slotId}
                        onValueChange={handleSlotChange}
                        required
                    >
                        <SelectTrigger className={bridalStyles.form.input}>
                            <SelectValue placeholder="勤務枠を選択" />
                        </SelectTrigger>

                        <SelectContent>
                            {shiftSlots.map((slot) => (
                                <SelectItem key={slot.id} value={slot.id}>
                                    {slot.name}：{slot.startTime}〜{slot.endTime}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className={bridalStyles.form.label}>
                        スタッフ
                    </label>

                    <Select
                        name="employeeId"
                        value={employeeId}
                        onValueChange={setEmployeeId}
                        disabled={!selectedSlot || filteredCandidates.length === 0}
                        required
                    >
                        <SelectTrigger className={bridalStyles.form.input}>
                            <SelectValue
                                placeholder={
                                    !selectedSlot
                                        ? "先に勤務枠を選択"
                                        : filteredCandidates.length === 0
                                            ? "割り振れるスタッフがいません"
                                            : "スタッフを選択"
                                }
                            />
                        </SelectTrigger>

                        <SelectContent>
                            {filteredCandidates.map((candidate) => (
                                <SelectItem key={candidate.id} value={candidate.id}>
                                    {candidate.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-end">
                    <Button
                        type="submit"
                        disabled={cannotAssign}
                        className={[
                            bridalStyles.button.primary,
                            "h-11 w-full px-6 md:w-auto",
                        ].join(" ")}
                    >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        割り振る
                    </Button>
                </div>
            </form>

            {selectedSlot ? (
                <div className="flex items-start gap-2 rounded-2xl border border-[#f0e5d0] bg-[#fffdf8]/70 p-4 text-sm text-slate-600">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#b8872d]" />
                    <p>
                        選択した勤務枠に対して、勤務不可のスタッフと、すでに割り振り済みのスタッフを除外しています。
                    </p>
                </div>
            ) : null}

            {selectedSlot && filteredCandidates.length === 0 ? (
                <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                        この勤務枠に割り振れるスタッフがいません。勤務不可設定、既存の割り振り、必要人数を確認してください。
                    </p>
                </div>
            ) : null}
        </div>
    );
};