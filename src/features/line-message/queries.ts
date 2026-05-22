import { prisma } from "@/lib/prisma";

export const getJobsForGroupMessages = async () => {
    return prisma.job.findMany({
        orderBy: [
            { workDate: "asc" },
            { title: "asc" },
        ],
        include: {
            shiftSlots: {
                orderBy: {
                    startTimeMinutes: "asc",
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