import type {
  Employee,
  ExternalStaffAssignment,
  Job,
  JobShiftSlot,
  ShiftAssignment,
  WorkReport,
} from "@prisma/client";

export type JobDetail = Job & {
  shiftSlots: Array<
    JobShiftSlot & {
      shiftAssignments: Array<
        ShiftAssignment & {
          employee: Employee;
        }
      >;
      externalStaffAssignments: ExternalStaffAssignment[];
    }
  >;
  workReports: Array<
    WorkReport & {
      employee: Employee;
    }
  >;
  requiredPeople: number;
  assignedPeople: number;
  assignedInternalPeople: number;
  assignedExternalPeople: number;
  fulfillmentRate: number;
};

export type StaffCandidate = Pick<
  Employee,
  "id" | "name" | "email" | "startedWorkingAt" | "hourlyWage"
>;