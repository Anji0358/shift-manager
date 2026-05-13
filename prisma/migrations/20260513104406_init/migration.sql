-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "WageType" AS ENUM ('EMPLOYEE', 'JOB_FIXED');

-- CreateEnum
CREATE TYPE "UnavailableType" AS ENUM ('FULL_DAY', 'TIME_RANGE', 'WEEKLY_FIXED', 'TEMPORARY');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "ShiftAssignmentStatus" AS ENUM ('ASSIGNED', 'CANCELED');

-- CreateEnum
CREATE TYPE "WorkReportStatus" AS ENUM ('NOT_SUBMITTED', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" "EmployeeRole" NOT NULL DEFAULT 'STAFF',
    "hourlyWage" INTEGER NOT NULL,
    "startedWorkingAt" TIMESTAMP(3) NOT NULL,
    "employmentStatus" "EmploymentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "workDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "meetingPlace" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "breakMinutes" INTEGER NOT NULL,
    "hasMeal" BOOLEAN NOT NULL DEFAULT false,
    "transportationFee" INTEGER NOT NULL,
    "dressCode" TEXT NOT NULL,
    "belongings" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "wageType" "WageType" NOT NULL DEFAULT 'EMPLOYEE',
    "fixedHourlyWage" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobShiftSlot" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "requiredPeople" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobShiftSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShiftAssignment" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "status" "ShiftAssignmentStatus" NOT NULL DEFAULT 'ASSIGNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShiftAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnavailableTime" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "type" "UnavailableType" NOT NULL,
    "date" TIMESTAMP(3),
    "dayOfWeek" "DayOfWeek",
    "startTime" TEXT,
    "endTime" TEXT,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnavailableTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkReport" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "actualStartTime" TEXT NOT NULL,
    "actualEndTime" TEXT NOT NULL,
    "actualBreakMinutes" INTEGER NOT NULL,
    "transportationFee" INTEGER NOT NULL,
    "hasMeal" BOOLEAN NOT NULL DEFAULT false,
    "status" "WorkReportStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE INDEX "JobShiftSlot_jobId_idx" ON "JobShiftSlot"("jobId");

-- CreateIndex
CREATE INDEX "ShiftAssignment_jobId_idx" ON "ShiftAssignment"("jobId");

-- CreateIndex
CREATE INDEX "ShiftAssignment_slotId_idx" ON "ShiftAssignment"("slotId");

-- CreateIndex
CREATE INDEX "ShiftAssignment_employeeId_idx" ON "ShiftAssignment"("employeeId");

-- CreateIndex
CREATE INDEX "UnavailableTime_employeeId_idx" ON "UnavailableTime"("employeeId");

-- CreateIndex
CREATE INDEX "WorkReport_jobId_idx" ON "WorkReport"("jobId");

-- CreateIndex
CREATE INDEX "WorkReport_employeeId_idx" ON "WorkReport"("employeeId");

-- AddForeignKey
ALTER TABLE "JobShiftSlot" ADD CONSTRAINT "JobShiftSlot_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftAssignment" ADD CONSTRAINT "ShiftAssignment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftAssignment" ADD CONSTRAINT "ShiftAssignment_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "JobShiftSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftAssignment" ADD CONSTRAINT "ShiftAssignment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnavailableTime" ADD CONSTRAINT "UnavailableTime_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkReport" ADD CONSTRAINT "WorkReport_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkReport" ADD CONSTRAINT "WorkReport_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
