-- CreateTable
CREATE TABLE "JobTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "meetingPlace" TEXT,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "breakMinutes" INTEGER NOT NULL DEFAULT 0,
    "hasMeal" BOOLEAN NOT NULL DEFAULT false,
    "transportationFee" INTEGER NOT NULL DEFAULT 0,
    "dressCode" TEXT,
    "belongings" TEXT,
    "note" TEXT,
    "wageType" "WageType" NOT NULL DEFAULT 'EMPLOYEE',
    "fixedHourlyWage" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobTemplate_pkey" PRIMARY KEY ("id")
);
