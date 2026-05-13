export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

export const formatMonth = (date: Date): string => {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
  }).format(date);
};

export const formatYen = (amount: number): string => {
  return `${amount.toLocaleString()}円`;
};