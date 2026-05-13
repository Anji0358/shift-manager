import type {
  Candidate,
  Employee,
  Job,
  JobShiftSlot,
  ShiftAssignment,
  UnavailableTime,
  WorkReport,
} from "./types";

export const mockEmployees: Employee[] = [
  {
    id: "emp_1",
    name: "山田 太郎",
    email: "yamada@example.com",
    role: "ADMIN",
    hourlyWage: 1500,
    startedWorkingAt: "2023-04-01",
    employmentStatus: "ACTIVE",
  },
  {
    id: "emp_2",
    name: "佐藤 花子",
    email: "sato@example.com",
    role: "STAFF",
    hourlyWage: 1400,
    startedWorkingAt: "2024-05-01",
    employmentStatus: "ACTIVE",
  },
  {
    id: "emp_3",
    name: "鈴木 一郎",
    email: "suzuki@example.com",
    role: "STAFF",
    hourlyWage: 1350,
    startedWorkingAt: "2025-01-01",
    employmentStatus: "ACTIVE",
  },
];

export const mockJobs: Job[] = [
  {
    id: "job_1",
    title: "横浜ホテル宴会",
    workDate: "2026-05-20",
    location: "横浜ホテル",
    meetingPlace: "横浜駅中央改札",
    startTime: "16:00",
    endTime: "21:00",
    breakMinutes: 30,
    hasMeal: true,
    transportationFee: 800,
    dressCode: "黒スラックス・白シャツ",
    belongings: "メモ帳、黒靴",
    note: "宴会場での配膳業務",
    wageType: "JOB_FIXED",
    fixedHourlyWage: 1400,
  },
  {
    id: "job_2",
    title: "みなとみらい企業懇親会",
    workDate: "2026-05-21",
    location: "みなとみらいホール",
    meetingPlace: "桜木町駅南改札",
    startTime: "10:00",
    endTime: "15:00",
    breakMinutes: 45,
    hasMeal: false,
    transportationFee: 600,
    dressCode: "黒スラックス・黒靴",
    belongings: "筆記用具",
    note: "設営と受付補助あり",
    wageType: "EMPLOYEE",
    fixedHourlyWage: null,
  },
];

export const mockJobShiftSlots: JobShiftSlot[] = [
  {
    id: "slot_1",
    jobId: "job_1",
    name: "設営",
    startTime: "14:00",
    endTime: "16:00",
    requiredPeople: 3,
  },
  {
    id: "slot_2",
    jobId: "job_1",
    name: "本番",
    startTime: "16:00",
    endTime: "21:00",
    requiredPeople: 8,
  },
  {
    id: "slot_3",
    jobId: "job_1",
    name: "撤収",
    startTime: "21:00",
    endTime: "23:00",
    requiredPeople: 4,
  },
];

export const mockCandidates: Candidate[] = [
  {
    employee: mockEmployees[1],
    status: "AVAILABLE",
    workExperienceText: "2年1か月",
  },
  {
    employee: mockEmployees[2],
    status: "PARTIALLY_AVAILABLE",
    workExperienceText: "1年4か月",
  },
];

export const mockShiftAssignments: ShiftAssignment[] = [
  {
    id: "assign_1",
    employeeId: "emp_2",
    jobId: "job_1",
    slotId: "slot_2",
    status: "ASSIGNED",
  },
];

export const mockWorkReports: WorkReport[] = [
  {
    id: "report_1",
    employeeId: "emp_2",
    jobId: "job_1",
    slotId: "slot_2",
    actualStartTime: "16:00",
    actualEndTime: "21:00",
    actualBreakMinutes: 30,
    hasMeal: true,
    transportationFee: 800,
    status: "NOT_SUBMITTED",
  },
];

export const mockUnavailableTimes: UnavailableTime[] = [
  {
    id: "unavailable_1",
    employeeId: "emp_2",
    type: "FULL_DAY",
    date: "2026-05-22",
    dayOfWeek: null,
    startTime: null,
    endTime: null,
    reason: "大学の予定",
  },
  {
    id: "unavailable_2",
    employeeId: "emp_2",
    type: "TIME_RANGE",
    date: "2026-05-23",
    dayOfWeek: null,
    startTime: "10:00",
    endTime: "14:00",
    reason: "授業",
  },
  {
    id: "unavailable_3",
    employeeId: "emp_2",
    type: "WEEKLY_FIXED",
    date: null,
    dayOfWeek: "MONDAY",
    startTime: "09:00",
    endTime: "12:00",
    reason: "毎週の授業",
  },
  {
    id: "unavailable_4",
    employeeId: "emp_2",
    type: "TEMPORARY",
    date: "2026-05-25",
    dayOfWeek: null,
    startTime: "18:00",
    endTime: "21:00",
    reason: "予定あり",
  },
];