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
import { createShiftAssignment } from "@/features/shift-assignments/actions";
import { isUnavailableForSlot } from "@/features/unavailable-times/services";

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

    return (
        <div className="space-y-3">
            <form
                action={createShiftAssignment}
                className="grid gap-4 md:grid-cols-[1fr_1fr_auto]"
            >
                <input type="hidden" name="jobId" value={jobId} />

                <Select
                    name="slotId"
                    value={slotId}
                    onValueChange={handleSlotChange}
                    required
                >
                    <SelectTrigger>
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

                <Select
                    name="employeeId"
                    value={employeeId}
                    onValueChange={setEmployeeId}
                    disabled={!selectedSlot || filteredCandidates.length === 0}
                    required
                >
                    <SelectTrigger>
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

                <Button
                    type="submit"
                    disabled={!selectedSlot || !employeeId || filteredCandidates.length === 0}
                >
                    割り振る
                </Button>
            </form>

            {selectedSlot && (
                <p className="text-sm text-slate-500">
                    選択した勤務枠に対して、勤務不可のスタッフと、すでに割り振り済みのスタッフを除外しています。
                </p>
            )}

            {selectedSlot && filteredCandidates.length === 0 && (
                <p className="text-sm text-red-600">
                    この勤務枠に割り振れるスタッフがいません。勤務不可設定、既存の割り振り、必要人数を確認してください。
                </p>
            )}
        </div>
    );
};