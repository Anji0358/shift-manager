/*
  Warnings:

  - Added the required column `endTimeMinutes` to the `JobShiftSlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTimeMinutes` to the `JobShiftSlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTimeMinutes` to the `JobTemplateShiftSlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTimeMinutes` to the `JobTemplateShiftSlot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobShiftSlot" ADD COLUMN     "endTimeMinutes" INTEGER NOT NULL,
ADD COLUMN     "startTimeMinutes" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "JobTemplateShiftSlot" ADD COLUMN     "endTimeMinutes" INTEGER NOT NULL,
ADD COLUMN     "startTimeMinutes" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "JobShiftSlot_jobId_startTimeMinutes_idx" ON "JobShiftSlot"("jobId", "startTimeMinutes");
