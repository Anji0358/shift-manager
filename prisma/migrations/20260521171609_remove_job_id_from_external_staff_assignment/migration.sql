/*
  Warnings:

  - You are about to drop the column `jobId` on the `ExternalStaffAssignment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExternalStaffAssignment" DROP CONSTRAINT "ExternalStaffAssignment_jobId_fkey";

-- DropIndex
DROP INDEX "ExternalStaffAssignment_jobId_idx";

-- AlterTable
ALTER TABLE "ExternalStaffAssignment" DROP COLUMN "jobId";
