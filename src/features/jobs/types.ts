import type {
  Employee,
  Job,
  JobShiftSlot,
  ShiftAssignment,
  WorkReport,
} from "@prisma/client";

export type JobDetail = Job & {
  shiftSlots: JobShiftSlot[];
  shiftAssignments: Array<
    ShiftAssignment & {
      employee: Employee;
      slot: JobShiftSlot;
    }
  >;
  workReports: Array<
    WorkReport & {
      employee: Employee;
    }
  >;
};

export type StaffCandidate = Pick<
  Employee,
  "id" | "name" | "email" | "startedWorkingAt" | "hourlyWage"
>;