import { prisma } from "@/lib/prisma";

export const getNextAssignmentByEmployeeId = async (employeeId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await prisma.shiftAssignment.findFirst({
    where: {
      employeeId,
      status: "ASSIGNED",
      job: {
        workDate: {
          gte: today,
        },
      },
    },
    include: {
      job: true,
      slot: true,
      employee: true,
    },
    orderBy: {
      job: {
        workDate: "asc",
      },
    },
  });
};

export const getStaffDashboardStats = async (employeeId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [nextAssignment, upcomingShiftCount, submittedReportCount] =
    await Promise.all([
      getNextAssignmentByEmployeeId(employeeId),
      prisma.shiftAssignment.count({
        where: {
          employeeId,
          status: "ASSIGNED",
          job: {
            workDate: {
              gte: today,
            },
          },
        },
      }),
      prisma.workReport.count({
        where: {
          employeeId,
        },
      }),
    ]);

  return {
    nextAssignment,
    upcomingShiftCount,
    submittedReportCount,
  };
};