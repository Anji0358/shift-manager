"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  getPositiveNumber,
  getRequiredString,
  validateEmail,
} from "@/lib/validation";
import type { EmployeeRole, EmploymentStatus } from "@prisma/client";

export const createEmployee = async (formData: FormData) => {
  const name = getRequiredString(formData, "name");
  const email = getRequiredString(formData, "email");
  const role = getRequiredString(formData, "role") as EmployeeRole;
  const hourlyWage = getPositiveNumber(formData, "hourlyWage");
  const startedWorkingAt = getRequiredString(formData, "startedWorkingAt");
  const employmentStatus = getRequiredString(
    formData,
    "employmentStatus",
  ) as EmploymentStatus;

  validateEmail(email);

  await prisma.employee.create({
    data: {
      name,
      email,
      role,
      hourlyWage,
      startedWorkingAt: new Date(startedWorkingAt),
      employmentStatus,
      passwordHash: "not_set_yet",
    },
  });

  revalidatePath("/admin/employees");
  redirect("/admin/employees?message=created");
};

export const deactivateEmployee = async (formData: FormData) => {
  const employeeId = String(formData.get("employeeId"));

  if (!employeeId) {
    throw new Error("従業員IDが取得できません。");
  }

  await prisma.employee.update({
    where: {
      id: employeeId,
    },
    data: {
      employmentStatus: "INACTIVE",
    },
  });

  await prisma.shiftAssignment.updateMany({
    where: {
      employeeId,
      status: "ASSIGNED",
    },
    data: {
      status: "CANCELED",
    },
  });

  revalidatePath("/admin/employees");
  revalidatePath("/admin/jobs");
  revalidatePath("/staff/shifts");

  redirect("/admin/employees?message=deactivated");
};