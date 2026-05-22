import type { GroupMessageOptions, GroupMessageType } from "./types";
import {
    formatDateWithDay,
    formatShortDate,
    formatSlotTime,
    getDisplayName,
    removeEmptyLines,
} from "./utils";

type GroupMessageJob = {
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
        startTime: Date;
        endTime: Date;
        assignments: {
            employee: {
                name: string;
            };
        }[];
    }[];
};

export const defaultScheduleConfirmClosing = `スケジュール如何ですか？

厳しければ返信を。
問題なければ、リアクションをお願いします。

時間変更や現場チェンジする場合には、再度連絡を入れますが、現状上記のスケジュールで抑えて頂きたいと思います。

宜しくお願い致します。`;

const buildSlotLines = (job: GroupMessageJob) => {
    return job.shiftSlots
        .map((slot) => {
            const names = slot.assignments
                .map((assignment) => getDisplayName(assignment.employee.name))
                .join("、");

            return `${formatSlotTime(slot.startTime, slot.endTime)}\n${names || "未割当"}`;
        })
        .join("\n\n");
};

const generateScheduleConfirmMessage = (
    job: GroupMessageJob,
    options: GroupMessageOptions
) => {
    return removeEmptyLines([
        "お疲れ様です。",
        "",
        formatShortDate(job.workDate),
        job.title,
        "",
        buildSlotLines(job),
        "",
        options.includeNote ? job.note : null,
        "",
        defaultScheduleConfirmClosing,
    ]);
};

const generateDetailMessage = (
    job: GroupMessageJob,
    options: GroupMessageOptions
) => {
    return removeEmptyLines([
        "お疲れ様ですm(__)m",
        `${formatShortDate(job.workDate)}の詳細です`,
        "",
        formatDateWithDay(job.workDate),
        job.title,
        job.location,
        options.includeMeetingPlace ? job.meetingPlace : null,
        "",
        buildSlotLines(job),
        "",
        options.includeNote ? job.note : null,
        "",
        options.includeDressCode && job.dressCode
            ? `服装:\n${job.dressCode}`
            : null,
        "",
        options.includeBelongings && job.belongings
            ? `持ち物\n${job.belongings}`
            : null,
    ]);
};

export const generateGroupJobMessage = ({
    job,
    type,
    options,
}: {
    job: GroupMessageJob;
    type: GroupMessageType;
    options: GroupMessageOptions;
}) => {
    if (type === "scheduleConfirm") {
        return generateScheduleConfirmMessage(job, options);
    }

    return generateDetailMessage(job, options);
};