export type EmployeeRole = "ADMIN" | "STAFF";

export type EmploymentStatus = "ACTIVE" | "INACTIVE";

export type WageType = "EMPLOYEE" | "JOB_FIXED";

export type MealStatus = "YES" | "NO";

export type CandidateStatus =
  | "AVAILABLE"
  | "NOT_SUBMITTED"
  | "PARTIALLY_AVAILABLE"
  | "UNAVAILABLE";

export type ShiftAssignmentStatus = "ASSIGNED" | "CANCELED";

export type WorkReportStatus =
  | "NOT_SUBMITTED"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED";

export type UnavailableType =
  | "FULL_DAY"
  | "TIME_RANGE"
  | "WEEKLY_FIXED"
  | "TEMPORARY";

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  hourlyWage: number;
  startedWorkingAt: string;
  employmentStatus: EmploymentStatus;
};

export type Job = {
  id: string;
  title: string;
  workDate: string;
  location: string;
  meetingPlace: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  hasMeal: boolean;
  transportationFee: number;
  dressCode: string;
  belongings: string;
  note: string;
  wageType: WageType;
  fixedHourlyWage: number | null;
};

export type JobShiftSlot = {
  id: string;
  jobId: string;
  name: string;
  startTime: string;
  endTime: string;
  requiredPeople: number;
};

export type Candidate = {
  employee: Employee;
  status: CandidateStatus;
  workExperienceText: string;
};

export type ShiftAssignment = {
  id: string;
  employeeId: string;
  jobId: string;
  slotId: string;
  status: ShiftAssignmentStatus;
};

export type WorkReport = {
  id: string;
  employeeId: string;
  jobId: string;
  slotId: string;
  actualStartTime: string;
  actualEndTime: string;
  actualBreakMinutes: number;
  hasMeal: boolean;
  transportationFee: number;
  status: WorkReportStatus;
};

export type UnavailableTime = {
  id: string;
  employeeId: string;
  type: UnavailableType;
  date: string | null;
  dayOfWeek: DayOfWeek | null;
  startTime: string | null;
  endTime: string | null;
  reason: string;
};