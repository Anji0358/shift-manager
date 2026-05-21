-- CreateEnum
CREATE TYPE "ExternalStaffAssignmentStatus" AS ENUM ('ASSIGNED', 'CANCELED');

-- CreateTable
CREATE TABLE "ExternalStaffAssignment" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "headCount" INTEGER NOT NULL DEFAULT 1,
    "status" "ExternalStaffAssignmentStatus" NOT NULL DEFAULT 'ASSIGNED',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalStaffAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExternalStaffAssignment_jobId_idx" ON "ExternalStaffAssignment"("jobId");

-- CreateIndex
CREATE INDEX "ExternalStaffAssignment_slotId_idx" ON "ExternalStaffAssignment"("slotId");

-- AddForeignKey
ALTER TABLE "ExternalStaffAssignment" ADD CONSTRAINT "ExternalStaffAssignment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalStaffAssignment" ADD CONSTRAINT "ExternalStaffAssignment_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "JobShiftSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
