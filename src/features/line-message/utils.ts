const dayLabels = ["日", "月", "火", "水", "木", "金", "土"];

export const formatShortDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
};

export const formatDateWithDay = (date: Date) => {
    const day = dayLabels[date.getDay()];
    return `${date.getMonth() + 1}/${date.getDate()}(${day})`;
};

export const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

export const formatSlotTime = (startTime: Date, endTime: Date) => {
    return `${formatTime(startTime)}〜${formatTime(endTime)}予定`;
};

export const getDisplayName = (name: string) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
        return "未設定";
    }

    return trimmedName.split(/\s+/)[0];
};

export const removeEmptyLines = (lines: Array<string | null | undefined>) => {
    return lines.filter((line) => line && line.trim().length > 0).join("\n");
};