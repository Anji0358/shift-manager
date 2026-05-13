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

const candidateStatusOrder: Record<CandidateStatus, number> = {
  AVAILABLE: 1,
  NOT_SUBMITTED: 2,
  PARTIALLY_AVAILABLE: 3,
  UNAVAILABLE: 4,
};

export const sortCandidatesByStatus = (
  candidates: Candidate[],
): Candidate[] => {
  return [...candidates].sort((a, b) => {
    return candidateStatusOrder[a.status] - candidateStatusOrder[b.status];
  });
};

export const getCandidatesForJob = (
  candidates: Candidate[],
  _jobId: string,
): Candidate[] => {
  return sortCandidatesByStatus(candidates);
};