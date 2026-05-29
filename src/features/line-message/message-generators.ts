import type {
    GroupLineMessageJob,
    GroupMessageOptions,
    GroupMessageType,
} from "./types";
import { formatDateWithDay, formatShortDate } from "./utils/date";
import {
    getDisplayName,
    removeEmptyLines,
} from "./utils";

export const defaultScheduleConfirmClosing = `スケジュール如何ですか？

厳しければ返信を。
問題なければ、リアクションをお願いします。

時間変更や現場チェンジする場合には、再度連絡を入れますが、現状上記のスケジュールで抑えて頂きたいと思います。

宜しくお願い致します。`;

const buildSlotLines = (job: GroupLineMessageJob) => {
    return job.shiftSlots
        .map((slot) => {
            const employeeNames = slot.shiftAssignments.map((assignment) =>
                getDisplayName(assignment.employee.name)
            );

            const externalNames = slot.externalStaffAssignments.flatMap(
                (assignment) => {
                    if (assignment.headCount <= 1) {
                        return [assignment.name];
                    }

                    return [`${assignment.name}×${assignment.headCount}`];
                }
            );

            const names = [...employeeNames, ...externalNames].join("、");

            return `${slot.startTime}〜${slot.endTime}予定\n${names || "未割当"}`;
        })
        .join("\n\n");
};

const generateScheduleConfirmMessage = (
    job: GroupLineMessageJob,
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
    job: GroupLineMessageJob,
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
    job: GroupLineMessageJob;
    type: GroupMessageType;
    options: GroupMessageOptions;
}) => {
    if (type === "scheduleConfirm") {
        return generateScheduleConfirmMessage(job, options);
    }

    return generateDetailMessage(job, options);
};