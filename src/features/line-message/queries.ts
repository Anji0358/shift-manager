import { prisma } from "@/lib/prisma";

const getMonthRange = (yearMonth: string) => {
    const [year, month] = yearMonth.split("-").map(Number);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    return {
        startDate,
        endDate,
    };
};

export const getJobsForGroupMessages = async (yearMonth: string) => {
    const { startDate, endDate } = getMonthRange(yearMonth);

    return prisma.job.findMany({
        where: {
            workDate: {
                gte: startDate,
                lt: endDate,
            },
        },
        orderBy: [
            {
                workDate: "asc",
            },
            {
                title: "asc",
            },
        ],
        include: {
            shiftSlots: {
                orderBy: {
                    startTime: "asc",
                },
                include: {
                    shiftAssignments: {
                        where: {
                            status: "ASSIGNED",
                        },
                        include: {
                            employee: true,
                        },
                    },
                    externalStaffAssignments: {
                        where: {
                            status: "ASSIGNED",
                        },
                    },
                },
            },
        },
    });
};

export const getEmployeesForPersonalMessages = async () => {
    return prisma.employee.findMany({
        where: {
            employmentStatus: "ACTIVE",
        },
        orderBy: {
            startedWorkingAt: "asc",
        },
        select: {
            id: true,
            name: true,
        },
    });
};