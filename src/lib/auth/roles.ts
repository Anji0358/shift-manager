import type { EmployeeRole } from "@prisma/client";

export const isAdminRole = (role: EmployeeRole) => {
  return role === "ADMIN";
};

export const isStaffRole = (role: EmployeeRole) => {
  return role === "STAFF";
};