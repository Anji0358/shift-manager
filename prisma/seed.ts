import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const main = async () => {
  await prisma.workReport.deleteMany();
  await prisma.shiftAssignment.deleteMany();
  await prisma.unavailableTime.deleteMany();
  await prisma.jobShiftSlot.deleteMany();
  await prisma.job.deleteMany();
  await prisma.employee.deleteMany();

  const admin = await prisma.employee.create({
    data: {
      id: "emp_1",
      name: "管理 太郎",
      email: "admin@example.com",
      passwordHash: "not_set_yet",
      role: "ADMIN",
      hourlyWage: 1800,
      startedWorkingAt: new Date("2024-04-01"),
      employmentStatus: "ACTIVE",
    },
  });

  const staff = await prisma.employee.create({
    data: {
      id: "emp_2",
      name: "佐藤 花子",
      email: "staff@example.com",
      passwordHash: "not_set_yet",
      role: "STAFF",
      hourlyWage: 1400,
      startedWorkingAt: new Date("2025-04-01"),
      employmentStatus: "ACTIVE",
    },
  });

  const staff2 = await prisma.employee.create({
    data: {
      id: "emp_3",
      name: "鈴木 一郎",
      email: "suzuki@example.com",
      passwordHash: "not_set_yet",
      role: "STAFF",
      hourlyWage: 1350,
      startedWorkingAt: new Date("2025-10-01"),
      employmentStatus: "ACTIVE",
    },
  });

  const job = await prisma.job.create({
    data: {
      id: "job_1",
      title: "横浜ホテル宴会",
      workDate: new Date("2026-05-20"),
      location: "横浜ホテル",
      meetingPlace: "横浜駅中央改札",
      startTime: "10:00",
      endTime: "21:00",
      breakMinutes: 60,
      hasMeal: true,
      transportationFee: 800,
      dressCode: "黒スラックス・白シャツ",
      belongings: "メモ帳、黒靴",
      note: "集合後、担当者の指示に従ってください。",
      wageType: "JOB_FIXED",
      fixedHourlyWage: 1500,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      id: "job_2",
      title: "みなとみらい立食パーティー",
      workDate: new Date("2026-05-25"),
      location: "みなとみらいホール",
      meetingPlace: "桜木町駅南改札",
      startTime: "15:00",
      endTime: "22:00",
      breakMinutes: 45,
      hasMeal: false,
      transportationFee: 600,
      dressCode: "黒スーツ",
      belongings: "黒靴、筆記用具",
      note: "接客経験者を優先します。",
      wageType: "EMPLOYEE",
      fixedHourlyWage: null,
    },
  });

  const setupSlot = await prisma.jobShiftSlot.create({
    data: {
      id: "slot_1",
      jobId: job.id,
      name: "設営",
      startTime: "10:00",
      endTime: "14:00",
      requiredPeople: 3,
    },
  });

  const mainSlot = await prisma.jobShiftSlot.create({
    data: {
      id: "slot_2",
      jobId: job.id,
      name: "本番",
      startTime: "16:00",
      endTime: "21:00",
      requiredPeople: 8,
    },
  });

  await prisma.jobShiftSlot.create({
    data: {
      id: "slot_3",
      jobId: job.id,
      name: "撤収",
      startTime: "21:00",
      endTime: "23:00",
      requiredPeople: 4,
    },
  });

  const job2MainSlot = await prisma.jobShiftSlot.create({
    data: {
      id: "slot_4",
      jobId: job2.id,
      name: "本番",
      startTime: "15:00",
      endTime: "22:00",
      requiredPeople: 5,
    },
  });

  await prisma.shiftAssignment.createMany({
    data: [
      {
        id: "assignment_1",
        jobId: job.id,
        slotId: setupSlot.id,
        employeeId: staff.id,
        status: "ASSIGNED",
      },
      {
        id: "assignment_2",
        jobId: job.id,
        slotId: mainSlot.id,
        employeeId: staff2.id,
        status: "ASSIGNED",
      },
      {
        id: "assignment_3",
        jobId: job2.id,
        slotId: job2MainSlot.id,
        employeeId: staff.id,
        status: "ASSIGNED",
      },
    ],
  });

  await prisma.unavailableTime.createMany({
    data: [
      {
        id: "unavailable_1",
        employeeId: staff.id,
        type: "FULL_DAY",
        date: new Date("2026-05-22"),
        dayOfWeek: null,
        startTime: null,
        endTime: null,
        reason: "大学の予定",
      },
      {
        id: "unavailable_2",
        employeeId: staff.id,
        type: "TIME_RANGE",
        date: new Date("2026-05-23"),
        dayOfWeek: null,
        startTime: "10:00",
        endTime: "14:00",
        reason: "授業",
      },
      {
        id: "unavailable_3",
        employeeId: staff.id,
        type: "WEEKLY_FIXED",
        date: null,
        dayOfWeek: "MONDAY",
        startTime: "09:00",
        endTime: "12:00",
        reason: "毎週の授業",
      },
    ],
  });

  await prisma.workReport.createMany({
    data: [
      {
        id: "report_1",
        jobId: job.id,
        employeeId: staff.id,
        actualStartTime: "10:00",
        actualEndTime: "14:00",
        actualBreakMinutes: 0,
        transportationFee: 800,
        hasMeal: true,
        status: "SUBMITTED",
      },
      {
        id: "report_2",
        jobId: job2.id,
        employeeId: staff.id,
        actualStartTime: "15:00",
        actualEndTime: "22:00",
        actualBreakMinutes: 45,
        transportationFee: 600,
        hasMeal: false,
        status: "NOT_SUBMITTED",
      },
    ],
  });

  console.log("Seed data created.");
  console.log({ admin: admin.email, staff: staff.email });
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });