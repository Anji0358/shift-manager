import { appStyles } from "@/components/shared/design-tokens";

export type CalendarStatus = "confirmed" | "unavailable" | "open";

export const getCalendarStatusLabel = (status: CalendarStatus) => {
    switch (status) {
        case "confirmed":
            return "確定シフト";
        case "unavailable":
            return "NGの日時";
        case "open":
            return "未確定";
        default:
            return "未設定";
    }
};

export const getCalendarStatusClassName = (status: CalendarStatus) => {
    switch (status) {
        case "confirmed":
            return [
                appStyles.border.accent,
                appStyles.background.warm,
                appStyles.textColor.accentDark,
            ].join(" ");

        case "unavailable":
            return [
                appStyles.border.danger,
                appStyles.tokens.color.background.danger,
                appStyles.textColor.danger,
            ].join(" ");

        case "open":
            return [
                appStyles.border.pending,
                appStyles.tokens.color.background.pending,
                appStyles.textColor.pending,
            ].join(" ");

        default:
            return [
                appStyles.border.soft,
                appStyles.background.whiteSoft,
                appStyles.textColor.body,
            ].join(" ");
    }
};