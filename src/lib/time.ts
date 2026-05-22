export const timeTextToMinutes = (timeText: string) => {
  const [hourText, minuteText] = timeText.split(":");

  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new Error("時刻は HH:mm 形式で入力してください。");
  }

  return hour * 60 + minute;
};

export const minutesToTimeText = (minutes: number) => {
  if (!Number.isInteger(minutes) || minutes < 0 || minutes >= 24 * 60) {
    throw new Error("分単位の時刻が不正です。");
  }

  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};