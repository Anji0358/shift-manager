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

const addDays = (baseDate: Date, days: number) => {
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate() + days,
  );
};

const main = async () => {
  await prisma.workReport.deleteMany();
  await prisma.externalStaffAssignment.deleteMany();
  await prisma.shiftAssignment.deleteMany();
  await prisma.unavailableTime.deleteMany();

  await prisma.jobShiftSlot.deleteMany();
  await prisma.job.deleteMany();

  await prisma.jobTemplateShiftSlot.deleteMany();
  await prisma.jobTemplate.deleteMany();

  await prisma.employee.deleteMany();

  const passwordHash = await bcrypt.hash("password", 10);

  await prisma.employee.createMany({
    data: [
      {
        id: "emp_admin_1",
        name: "管理者A",
        email: "admin@example.com",
        role: "ADMIN",
        hourlyWage: 0,
        startedWorkingAt: new Date("2024-01-01"),
        employmentStatus: "ACTIVE",
        passwordHash,
      },
      {
        id: "emp_staff_1",
        name: "スタッフA",
        email: "staff1@example.com",
        role: "STAFF",
        hourlyWage: 1200,
        startedWorkingAt: new Date("2024-04-01"),
        employmentStatus: "ACTIVE",
        passwordHash,
      },
      {
        id: "emp_staff_2",
        name: "スタッフB",
        email: "staff2@example.com",
        role: "STAFF",
        hourlyWage: 1250,
        startedWorkingAt: new Date("2024-05-01"),
        employmentStatus: "ACTIVE",
        passwordHash,
      },
      {
        id: "emp_staff_3",
        name: "スタッフC",
        email: "staff3@example.com",
        role: "STAFF",
        hourlyWage: 1300,
        startedWorkingAt: new Date("2023-10-01"),
        employmentStatus: "ACTIVE",
        passwordHash,
      },
      {
        id: "emp_staff_4",
        name: "スタッフD",
        email: "staff4@example.com",
        role: "STAFF",
        hourlyWage: 1350,
        startedWorkingAt: new Date("2023-08-01"),
        employmentStatus: "ACTIVE",
        passwordHash,
      },
      {
        id: "emp_staff_5",
        name: "スタッフE",
        email: "staff5@example.com",
        role: "STAFF",
        hourlyWage: 1400,
        startedWorkingAt: new Date("2022-12-01"),
        employmentStatus: "ACTIVE",
        passwordHash,
      },
    ],
  });

  await prisma.jobTemplate.create({
    data: {
      id: "template_1",
      name: "テンプレートA",
      title: "案件A",
      location: "会場A",
      meetingPlace: "入口前",
      breakMinutes: 45,
      hasMeal: false,
      transportationFee: 700,
      dressCode: "黒パンツ・白シャツ",
      belongings: "筆記用具、メモ",
      note: "サービス業務を行います。",
      wageType: "EMPLOYEE",
      fixedHourlyWage: null,
      shiftSlots: {
        create: [
          {
            id: "template_slot_1",
            name: "午前枠",
            startTime: "09:00",
            endTime: "13:00",
            requiredPeople: 3,
          },
          {
            id: "template_slot_2",
            name: "午後枠",
            startTime: "13:00",
            endTime: "18:00",
            requiredPeople: 3,
          },
        ],
      },
    },
  });

  const today = new Date();

  const jobs = [
    {
      id: "job_1",
      title: "案件A",
      workDate: addDays(today, 3),
      location: "会場A",
      meetingPlace: "入口前",
      breakMinutes: 45,
      hasMeal: false,
      transportationFee: 700,
      dressCode: "黒パンツ・白シャツ",
      belongings: "筆記用具、メモ",
      note: "サービス業務を行います。",
      wageType: "EMPLOYEE" as const,
      fixedHourlyWage: null,
      shiftSlots: {
        create: [
          {
            id: "slot_1_1",
            name: "午前枠",
            startTime: "09:00",
            endTime: "13:00",
            requiredPeople: 3,
          },
          {
            id: "slot_1_2",
            name: "午後枠",
            startTime: "13:00",
            endTime: "18:00",
            requiredPeople: 3,
          },
        ],
      },
    },
    {
      id: "job_2",
      title: "案件B",
      workDate: addDays(today, 5),
      location: "会場B",
      meetingPlace: "集合場所B",
      breakMinutes: 60,
      hasMeal: true,
      transportationFee: 800,
      dressCode: "黒パンツ・白シャツ",
      belongings: "筆記用具、メモ",
      note: "サービス業務を行います。",
      wageType: "EMPLOYEE" as const,
      fixedHourlyWage: null,
      shiftSlots: {
        create: [
          {
            id: "slot_2_1",
            name: "通し枠",
            startTime: "10:00",
            endTime: "18:00",
            requiredPeople: 4,
          },
        ],
      },
    },
    {
      id: "job_3",
      title: "案件C",
      workDate: addDays(today, 7),
      location: "会場C",
      meetingPlace: "集合場所C",
      breakMinutes: 60,
      hasMeal: true,
      transportationFee: 900,
      dressCode: "黒パンツ・白シャツ",
      belongings: "筆記用具、メモ",
      note: "サービス業務を行います。",
      wageType: "EMPLOYEE" as const,
      fixedHourlyWage: null,
      shiftSlots: {
        create: [
          {
            id: "slot_3_1",
            name: "前半枠",
            startTime: "10:00",
            endTime: "15:00",
            requiredPeople: 2,
          },
          {
            id: "slot_3_2",
            name: "後半枠",
            startTime: "15:00",
            endTime: "20:00",
            requiredPeople: 2,
          },
        ],
      },
    },
    {
      id: "job_4",
      title: "案件D",
      workDate: addDays(today, 10),
      location: "会場D",
      meetingPlace: "集合場所D",
      breakMinutes: 30,
      hasMeal: false,
      transportationFee: 600,
      dressCode: "黒パンツ・白シャツ",
      belongings: "筆記用具、メモ",
      note: "サービス業務を行います。",
      wageType: "JOB_FIXED" as const,
      fixedHourlyWage: 1500,
      shiftSlots: {
        create: [
          {
            id: "slot_4_1",
            name: "短時間枠",
            startTime: "14:00",
            endTime: "17:00",
            requiredPeople: 3,
          },
        ],
      },
    },
    {
      id: "job_5",
      title: "案件E",
      workDate: addDays(today, 14),
      location: "会場E",
      meetingPlace: "集合場所E",
      breakMinutes: 45,
      hasMeal: false,
      transportationFee: 700,
      dressCode: "黒パンツ・白シャツ",
      belongings: "筆記用具、メモ",
      note: "サービス業務を行います。",
      wageType: "EMPLOYEE" as const,
      fixedHourlyWage: null,
      shiftSlots: {
        create: [
          {
            id: "slot_5_1",
            name: "運営枠",
            startTime: "12:00",
            endTime: "18:00",
            requiredPeople: 4,
          },
        ],
      },
    },
  ];

  for (const jobData of jobs) {
    await prisma.job.create({
      data: jobData,
    });
  }

  await prisma.shiftAssignment.createMany({
    data: [
      {
        id: "assign_1",
        slotId: "slot_1_1",
        employeeId: "emp_staff_1",
        status: "ASSIGNED",
      },
      {
        id: "assign_2",
        slotId: "slot_1_1",
        employeeId: "emp_staff_2",
        status: "ASSIGNED",
      },
      {
        id: "assign_3",
        slotId: "slot_2_1",
        employeeId: "emp_staff_3",
        status: "ASSIGNED",
      },
      {
        id: "assign_4",
        slotId: "slot_3_1",
        employeeId: "emp_staff_4",
        status: "ASSIGNED",
      },
      {
        id: "assign_5",
        slotId: "slot_5_1",
        employeeId: "emp_staff_5",
        status: "ASSIGNED",
      },
    ],
  });

  await prisma.externalStaffAssignment.createMany({
    data: [
      {
        id: "external_assign_1",
        jobId: "job_2",
        slotId: "slot_2_1",
        name: "外部スタッフA",
        headCount: 2,
        status: "ASSIGNED",
        note: "サービス業務を行います。",
      },
      {
        id: "external_assign_2",
        jobId: "job_4",
        slotId: "slot_4_1",
        name: "外部スタッフB",
        headCount: 1,
        status: "ASSIGNED",
        note: "サービス業務を行います。",
      },
    ],
  });

  await prisma.unavailableTime.createMany({
    data: [
      {
        id: "unavailable_1",
        employeeId: "emp_staff_2",
        type: "WEEKLY_FIXED",
        date: null,
        dayOfWeek: "MONDAY",
        startTime: "09:00",
        endTime: "18:00",
        reason: "固定NG",
      },
      {
        id: "unavailable_2",
        employeeId: "emp_staff_3",
        type: "TIME_RANGE",
        date: addDays(today, 5),
        dayOfWeek: null,
        startTime: "09:00",
        endTime: "12:00",
        reason: "時間帯NG",
      },
      {
        id: "unavailable_3",
        employeeId: "emp_staff_4",
        type: "FULL_DAY",
        date: addDays(today, 10),
        dayOfWeek: null,
        startTime: null,
        endTime: null,
        reason: "終日NG",
      },
    ],
  });

  console.log("Seed completed.");

  console.log({
    login: {
      admin: {
        email: "admin@example.com",
        password: "password",
      },
      staff: {
        email: "staff1@example.com",
        password: "password",
      },
    },
    jobs: jobs.map((job) => ({
      id: job.id,
      title: job.title,
      workDate: job.workDate,
    })),
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