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

  const existingReport = await prisma.workReport.findFirst({
    where: {
      employeeId,
      jobId,
    },
  });

  if (existingReport) {
    throw new Error("この案件の就労報告はすでに提出済みです。");
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

  revalidatePath("/staff/shifts");
  revalidatePath("/staff/work-history");
  revalidatePath("/staff/monthly-summary");
  revalidatePath("/admin/work-reports");

  redirect("/staff/work-history");
};

export const approveWorkReport = async (formData: FormData) => {
  const reportId = String(formData.get("reportId"));

  if (!reportId) {
    throw new Error("就労報告IDが取得できません。");
  }

  await prisma.workReport.update({
    where: {
      id: reportId,
    },
    data: {
      status: "APPROVED",
    },
  });

  revalidatePath("/admin/work-reports");
  revalidatePath("/admin/monthly-summary");
  revalidatePath("/staff/work-history");
};

export const rejectWorkReport = async (formData: FormData) => {
  const reportId = String(formData.get("reportId"));

  if (!reportId) {
    throw new Error("就労報告IDが取得できません。");
  }

  await prisma.workReport.update({
    where: {
      id: reportId,
    },
    data: {
      status: "REJECTED",
    },
  });

  revalidatePath("/admin/work-reports");
  revalidatePath("/admin/monthly-summary");
  revalidatePath("/staff/work-history");
};