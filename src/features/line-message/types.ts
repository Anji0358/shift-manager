export type GroupMessageType = "scheduleConfirm" | "detail";

export type GroupMessageOptions = {
    includeMeetingPlace: boolean;
    includeDressCode: boolean;
    includeBelongings: boolean;
    includeNote: boolean;
};

export type LineMessageEmployee = {
    id: string;
    name: string;
};

export type LineMessageUnavailableTime = {
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
};

export type LineMessageShiftSlot = {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    startTimeMinutes: number;
    endTimeMinutes: number;
    requiredPeople: number;
    shiftAssignments: {
        employee: {
            id?: string;
            name: string;
        };
    }[];
    externalStaffAssignments: {
        name: string;
        headCount: number;
    }[];
};

export type GroupLineMessageJob = {
    id: string;
    title: string;
    workDate: Date;
    location: string;
    meetingPlace: string | null;
    dressCode: string | null;
    belongings: string | null;
    note: string | null;
    shiftSlots: LineMessageShiftSlot[];
};

export type PersonalLineMessageJob = {
    id: string;
    title: string;
    workDate: Date;
    location: string;
    meetingPlace: string | null;
    note: string | null;
    shiftSlots: LineMessageShiftSlot[];
};

export type AvailablePersonalSlot = {
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