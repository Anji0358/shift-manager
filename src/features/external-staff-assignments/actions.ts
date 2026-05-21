"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth/current-user";

export const createExternalStaffAssignment = async (formData: FormData) => {
  await getCurrentAdmin();

  const jobId = String(formData.get("jobId") ?? "");
  const slotId = String(formData.get("slotId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const headCount = Number(formData.get("headCount") ?? 1);
  const note = String(formData.get("note") ?? "").trim();

  if (!jobId || !slotId) {
    throw new Error("案件または勤務枠が指定されていません。");
  }

  if (!name) {
    throw new Error("外部スタッフ名を入力してください。");
  }

  if (!Number.isInteger(headCount) || headCount < 1) {
    throw new Error("人数は1以上の整数で入力してください。");
  }

  await prisma.externalStaffAssignment.create({
    data: {
      jobId,
      slotId,
      name,
      headCount,
      note: note || null,
    },
  });

  revalidatePath(`/admin/jobs/${jobId}/assignments`);
  redirect(`/admin/jobs/${jobId}/assignments?message=外部スタッフを追加しました`);
};

export const cancelExternalStaffAssignment = async (formData: FormData) => {
  await getCurrentAdmin();

  const assignmentId = String(formData.get("assignmentId") ?? "");
  const jobId = String(formData.get("jobId") ?? "");

  if (!assignmentId || !jobId) {
    throw new Error("外部スタッフ割り振りが指定されていません。");
  }

  await prisma.externalStaffAssignment.update({
    where: {
      id: assignmentId,
    },
    data: {
      status: "CANCELED",
    },
  });

  revalidatePath(`/admin/jobs/${jobId}/assignments`);
  redirect(`/admin/jobs/${jobId}/assignments?message=外部スタッフをキャンセルしました`);
};