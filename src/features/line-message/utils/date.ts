const dayLabels = ["日", "月", "火", "水", "木", "金", "土"];

export const formatDateWithDay = (date: Date) => {
    const day = dayLabels[date.getDay()];
    return `${date.getMonth() + 1}/${date.getDate()}(${day})`;
};

export const formatShortDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
};

export const isSameDate = (dateA: Date, dateB: Date) => {
    return (
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate()
    );
};