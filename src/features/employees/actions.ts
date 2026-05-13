"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { EmployeeRole, EmploymentStatus } from "@prisma/client";

export const createEmployee = async (formData: FormData) => {
  const name = String(formData.get("name"));
  const email = String(formData.get("email"));
  const role = String(formData.get("role")) as EmployeeRole;
  const hourlyWage = Number(formData.get("hourlyWage"));
  const startedWorkingAt = String(formData.get("startedWorkingAt"));
  const employmentStatus = String(
    formData.get("employmentStatus"),
  ) as EmploymentStatus;

  if (
    !name ||
    !email ||
    !role ||
    !hourlyWage ||
    !startedWorkingAt ||
    !employmentStatus
  ) {
    throw new Error("従業員の入力内容が不足しています。");
  }

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
  redirect("/admin/employees");
};