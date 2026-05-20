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
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "unavailable":
      return "border-red-200 bg-red-50 text-red-700";
    case "open":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
};