import type { Candidate, CandidateStatus } from "@/features/shared/types";

export const candidateStatusLabel: Record<CandidateStatus, string> = {
  AVAILABLE: "勤務可能",
  NOT_SUBMITTED: "未提出",
  PARTIALLY_AVAILABLE: "一部可能",
  UNAVAILABLE: "勤務不可",
};

export const candidateStatusBadgeVariant: Record<
  CandidateStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  AVAILABLE: "default",
  NOT_SUBMITTED: "secondary",
  PARTIALLY_AVAILABLE: "outline",
  UNAVAILABLE: "destructive",
};

export const getCandidatesForJob = (
  candidates: Candidate[],
  _jobId: string,
): Candidate[] => {
  return candidates;
};