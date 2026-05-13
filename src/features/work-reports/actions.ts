"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const createWorkReport = async (formData: FormData) => {
  const employeeId = String(formData.get("employeeId"));
  const jobId = String(formData.get("jobId"));
  const actualStartTime = String(formData.get("actualStartTime"));
  const actualEndTime = String(formData.get("actualEndTime"));
  const actualBreakMinutes = Number(formData.get("actualBreakMinutes"));
  const transportationFee = Number(formData.get("transportationFee"));
  const hasMeal = String(formData.get("hasMeal")) === "true";

  if (
    !employeeId ||
    !jobId ||
    !actualStartTime ||
    !actualEndTime ||
    Number.isNaN(actualBreakMinutes) ||
    Number.isNaN(transportationFee)
  ) {
    throw new Error("就労報告の入力内容が不足しています。");
  }

  await prisma.workReport.create({
    data: {
      employeeId,
      jobId,
      actualStartTime,
      actualEndTime,
      actualBreakMinutes,
      transportationFee,
      hasMeal,
      status: "SUBMITTED",
    },
  });

  revalidatePath("/staff/work-history");
  revalidatePath("/staff/monthly-summary");
  revalidatePath("/admin/work-reports");

  redirect("/staff/work-history");
};