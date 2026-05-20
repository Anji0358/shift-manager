/*
  Warnings:

  - You are about to drop the column `endTime` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `JobTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `JobTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ALTER COLUMN "meetingPlace" DROP NOT NULL,
ALTER COLUMN "breakMinutes" SET DEFAULT 0,
ALTER COLUMN "transportationFee" SET DEFAULT 0,
ALTER COLUMN "dressCode" DROP NOT NULL,
ALTER COLUMN "belongings" DROP NOT NULL,
ALTER COLUMN "note" DROP NOT NULL;

-- AlterTable
ALTER TABLE "JobTemplate" DROP COLUMN "endTime",
DROP COLUMN "startTime";

-- CreateTable
CREATE TABLE "JobTemplateShiftSlot" (
    "id" TEXT NOT NULL,
    "jobTemplateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "requiredPeople" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobTemplateShiftSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobTemplateShiftSlot_jobTemplateId_idx" ON "JobTemplateShiftSlot"("jobTemplateId");

-- AddForeignKey
ALTER TABLE "JobTemplateShiftSlot" ADD CONSTRAINT "JobTemplateShiftSlot_jobTemplateId_fkey" FOREIGN KEY ("jobTemplateId") REFERENCES "JobTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
