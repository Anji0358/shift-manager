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
      name: "管理者 太郎",
      email: "admin@example.com",
      role: "ADMIN",
      hourlyWage: 0,
      startedWorkingAt: new Date("2024-01-01"),
      employmentStatus: "ACTIVE",
      passwordHash: "not_set_yet",
    },
  });

  const staff = await prisma.employee.create({
    data: {
      id: "emp_2",
      name: "スタッフ 花子",
      email: "staff@example.com",
      role: "STAFF",
      hourlyWage: 1200,
      startedWorkingAt: new Date("2024-04-01"),
      employmentStatus: "ACTIVE",
      passwordHash: "not_set_yet",
    },
  });

  const staff2 = await prisma.employee.create({
    data: {
      id: "emp_3",
      name: "スタッフ 次郎",
      email: "jiro@example.com",
      role: "STAFF",
      hourlyWage: 1300,
      startedWorkingAt: new Date("2023-10-01"),
      employmentStatus: "ACTIVE",
      passwordHash: "not_set_yet",
    },
  });

  const today = new Date();
  const futureWorkDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 7,
  );

  const job = await prisma.job.create({
    data: {
      id: "job_1",
      title: "ホテル宴会サービス",
      workDate: futureWorkDate,
      location: "横浜ベイホテル",
      meetingPlace: "正面入口",
      startTime: "10:00",
      endTime: "18:00",
      breakMinutes: 60,
      hasMeal: true,
      transportationFee: 800,
      dressCode: "黒スラックス・白シャツ",
      belongings: "メモ帳、筆記用具",
      note: "集合後に担当卓を確認してください。",
      wageType: "EMPLOYEE",
      fixedHourlyWage: null,
    },
  });

  const slot = await prisma.jobShiftSlot.create({
    data: {
      id: "slot_1",
      jobId: job.id,
      name: "通し勤務",
      startTime: "10:00",
      endTime: "18:00",
      requiredPeople: 2,
    },
  });

  await prisma.shiftAssignment.create({
    data: {
      id: "assign_1",
      jobId: job.id,
      slotId: slot.id,
      employeeId: staff.id,
      status: "ASSIGNED",
    },
  });

  await prisma.unavailableTime.create({
    data: {
      id: "unavailable_1",
      employeeId: staff2.id,
      type: "WEEKLY_FIXED",
      date: null,
      dayOfWeek: "MONDAY",
      startTime: "09:00",
      endTime: "18:00",
      reason: "授業",
    },
  });

  console.log({
    admin,
    staff,
    staff2,
    job,
    slot,
  });
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });