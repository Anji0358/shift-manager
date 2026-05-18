import type { WageType, WorkReportStatus } from "@prisma/client";

export const wageTypeLabel: Record<WageType, string> = {
  EMPLOYEE: "スタッフごとの時給",
  JOB_FIXED: "案件一律時給",
};

export const workReportStatusLabel: Record<WorkReportStatus, string> = {
  NOT_SUBMITTED: "未提出",
  SUBMITTED: "提出済み",
  APPROVED: "承認済み",
  REJECTED: "差し戻し",
};