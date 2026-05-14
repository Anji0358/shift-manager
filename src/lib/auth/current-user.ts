import { prisma } from "@/lib/prisma";

export const getCurrentEmployeeId = () => {
  return "emp_2";
};

export const getCurrentAdminId = () => {
  return "emp_1";
};

export const getCurrentEmployee = async () => {
  const employeeId = getCurrentEmployeeId();

  return await prisma.employee.findUnique({
    where: {
      id: employeeId,
    },
  });
};

export const getCurrentAdmin = async () => {
  const adminId = getCurrentAdminId();

  return await prisma.employee.findUnique({
    where: {
      id: adminId,
    },
  });
};