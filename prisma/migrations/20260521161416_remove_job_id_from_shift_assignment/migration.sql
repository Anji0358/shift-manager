/*
  Warnings:

  - You are about to drop the column `jobId` on the `ShiftAssignment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slotId,employeeId]` on the table `ShiftAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ShiftAssignment" DROP CONSTRAINT "ShiftAssignment_jobId_fkey";

-- DropIndex
DROP INDEX "ShiftAssignment_jobId_idx";

-- AlterTable
ALTER TABLE "ShiftAssignment" DROP COLUMN "jobId";

-- CreateIndex
CREATE UNIQUE INDEX "ShiftAssignment_slotId_employeeId_key" ON "ShiftAssignment"("slotId", "employeeId");
