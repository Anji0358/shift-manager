import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

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
  /**
   * 削除順序に注意
   * relation の子テーブルから先に削除する
   */
  await prisma.workReport.deleteMany();
  await prisma.shiftAssignment.deleteMany();
  await prisma.unavailableTime.deleteMany();

  await prisma.jobShiftSlot.deleteMany();
  await prisma.job.deleteMany();

  await prisma.jobTemplateShiftSlot.deleteMany();
  await prisma.jobTemplate.deleteMany();

  await prisma.employee.deleteMany();

  const passwordHash = await bcrypt.hash("password", 10);

  const admin = await prisma.employee.create({
    data: {
      id: "emp_1",
      name: "管理者 太郎",
      email: "admin@example.com",
      role: "ADMIN",
      hourlyWage: 0,
      startedWorkingAt: new Date("2024-01-01"),
      employmentStatus: "ACTIVE",
      passwordHash,
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
      passwordHash,
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
      passwordHash,
    },
  });

  /**
   * 案件テンプレート
   * JobTemplate 本体には案件共通情報を持たせる
   * 勤務時間・必要人数は JobTemplateShiftSlot に持たせる
   */
  const jobTemplate = await prisma.jobTemplate.create({
    data: {
      id: "template_1",
      name: "ホテル宴会テンプレート",
      title: "ホテル宴会サービス",
      location: "横浜ベイホテル",
      meetingPlace: "正面入口",
      breakMinutes: 60,
      hasMeal: true,
      transportationFee: 800,
      dressCode: "黒スラックス・白シャツ",
      belongings: "メモ帳、筆記用具",
      note: "集合後に担当卓を確認してください。",
      wageType: "EMPLOYEE",
      fixedHourlyWage: null,
      shiftSlots: {
        create: [
          {
            id: "template_slot_1",
            name: "通し勤務",
            startTime: "10:00",
            endTime: "18:00",
            requiredPeople: 2,
          },
        ],
      },
    },
    include: {
      shiftSlots: true,
    },
  });

  const today = new Date();

  const futureWorkDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 7,
  );

  /**
   * 実際の案件
   * Job には startTime / endTime / requiredPeople を持たせない
   * 勤務時間・必要人数は JobShiftSlot に保存する
   */
  const job = await prisma.job.create({
    data: {
      id: "job_1",
      title: "ホテル宴会サービス",
      workDate: futureWorkDate,
      location: "横浜ベイホテル",
      meetingPlace: "正面入口",
      breakMinutes: 60,
      hasMeal: true,
      transportationFee: 800,
      dressCode: "黒スラックス・白シャツ",
      belongings: "メモ帳、筆記用具",
      note: "集合後に担当卓を確認してください。",
      wageType: "EMPLOYEE",
      fixedHourlyWage: null,
      shiftSlots: {
        create: [
          {
            id: "slot_1",
            name: "通し勤務",
            startTime: "10:00",
            endTime: "18:00",
            requiredPeople: 2,
          },
        ],
      },
    },
    include: {
      shiftSlots: true,
    },
  });

  const slot = job.shiftSlots[0];

  if (!slot) {
    throw new Error("勤務枠の作成に失敗しました。");
  }

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

  console.log("Seed completed.");

  console.log({
    admin: {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
    staff: {
      id: staff.id,
      email: staff.email,
      role: staff.role,
    },
    staff2: {
      id: staff2.id,
      email: staff2.email,
      role: staff2.role,
    },
    jobTemplate: {
      id: jobTemplate.id,
      name: jobTemplate.name,
      shiftSlots: jobTemplate.shiftSlots.map((templateSlot) => ({
        id: templateSlot.id,
        name: templateSlot.name,
        startTime: templateSlot.startTime,
        endTime: templateSlot.endTime,
        requiredPeople: templateSlot.requiredPeople,
      })),
    },
    job: {
      id: job.id,
      title: job.title,
      shiftSlots: job.shiftSlots.map((jobSlot) => ({
        id: jobSlot.id,
        name: jobSlot.name,
        startTime: jobSlot.startTime,
        endTime: jobSlot.endTime,
        requiredPeople: jobSlot.requiredPeople,
      })),
    },
    assignment: {
      id: "assign_1",
      employeeId: staff.id,
      slotId: slot.id,
    },
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