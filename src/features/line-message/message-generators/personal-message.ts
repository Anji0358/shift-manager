import type { AvailablePersonalSlot } from "../types";
import { formatDateWithDay } from "../utils/date";

type GeneratePersonalRequestMessageArgs = {
    greeting: string;
    introText: string;
    closing: string;
    slots: AvailablePersonalSlot[];
};

export const generatePersonalRequestMessage = ({
    greeting,
    introText,
    closing,
    slots,
}: GeneratePersonalRequestMessageArgs) => {
    if (slots.length === 0) {
        return "";
    }

    const groupedSlots = slots.reduce<Record<string, AvailablePersonalSlot[]>>(
        (groups, slot) => {
            const key = `${slot.workDate.toISOString()}-${slot.title}-${slot.location}`;

            return {
                ...groups,
                [key]: [...(groups[key] ?? []), slot],
            };
        },
        {}
    );

    const slotBlocks = Object.values(groupedSlots)
        .map((group) => {
            const sortedGroup = [...group].sort(
                (a, b) => a.startTimeMinutes - b.startTimeMinutes
            );
            const firstSlot = sortedGroup[0];

            if (!firstSlot) {
                return null;
            }

            const timeLines = sortedGroup
                .map((slot, index) => {
                    if (index === 0) {
                        return `${slot.startTime}-${slot.endTime}`;
                    }

                    return `or\n${slot.startTime}-${slot.endTime}`;
                })
                .join("\n");

            return [
                formatDateWithDay(firstSlot.workDate),
                firstSlot.title,
                timeLines,
            ].join("\n");
        })
        .filter((block): block is string => Boolean(block))
        .join("\n\n");

    return [greeting, "", introText, "", slotBlocks, "", closing].join("\n");
};