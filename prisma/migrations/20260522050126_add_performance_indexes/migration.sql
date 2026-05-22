/*
  Warnings:

  - A unique constraint covering the columns `[jobId,employeeId]` on the table `WorkReport` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Employee_role_employmentStatus_idx" ON "Employee"("role", "employmentStatus");

-- CreateIndex
CREATE INDEX "Employee_employmentStatus_startedWorkingAt_idx" ON "Employee"("employmentStatus", "startedWorkingAt");

-- CreateIndex
CREATE INDEX "ExternalStaffAssignment_slotId_status_idx" ON "ExternalStaffAssignment"("slotId", "status");

-- CreateIndex
CREATE INDEX "Job_workDate_idx" ON "Job"("workDate");

-- CreateIndex
CREATE INDEX "JobShiftSlot_jobId_startTime_idx" ON "JobShiftSlot"("jobId", "startTime");

-- CreateIndex
CREATE INDEX "ShiftAssignment_slotId_status_idx" ON "ShiftAssignment"("slotId", "status");

-- CreateIndex
CREATE INDEX "ShiftAssignment_employeeId_status_idx" ON "ShiftAssignment"("employeeId", "status");

-- CreateIndex
CREATE INDEX "UnavailableTime_employeeId_date_idx" ON "UnavailableTime"("employeeId", "date");

-- CreateIndex
CREATE INDEX "UnavailableTime_employeeId_dayOfWeek_idx" ON "UnavailableTime"("employeeId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "WorkReport_jobId_status_idx" ON "WorkReport"("jobId", "status");

-- CreateIndex
CREATE INDEX "WorkReport_employeeId_status_idx" ON "WorkReport"("employeeId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "WorkReport_jobId_employeeId_key" ON "WorkReport"("jobId", "employeeId");
