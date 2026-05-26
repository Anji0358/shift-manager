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

export const getJobsForPersonalMessages = async (yearMonth: string) => {
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
                            employee: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
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

export const getUnavailableTimesForPersonalMessages = async (
    yearMonth: string
) => {
    const { startDate, endDate } = getMonthRange(yearMonth);

    return prisma.unavailableTime.findMany({
        where: {
            OR: [
                {
                    date: {
                        gte: startDate,
                        lt: endDate,
                    },
                },
                {
                    type: "WEEKLY_FIXED",
                },
            ],
        },
        select: {
            id: true,
            employeeId: true,
            type: true,
            date: true,
            dayOfWeek: true,
            startTime: true,
            endTime: true,
            reason: true,
        },
    });
};