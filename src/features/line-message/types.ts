export type GroupMessageType = "scheduleConfirm" | "detail";

export type GroupMessageOptions = {
    includeMeetingPlace: boolean;
    includeDressCode: boolean;
    includeBelongings: boolean;
    includeNote: boolean;
};

export type PersonalMessageOptions = {
    greeting: string;
    closing: string;
};

export type LineMessageTab = "personal" | "group";