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

  const slot = await prisma.jobShiftSlot.findUnique({
    where: {
      id: slotId,
    },
  });

  if (!slot) {
    throw new Error("勤務枠が見つかりません。");
  }

  if (slot.jobId !== jobId) {
    throw new Error("指定された勤務枠はこの案件に属していません。");
  }

  await prisma.externalStaffAssignment.create({
    data: {
      slotId,
      name,
      headCount,
      note: note || null,
      status: "ASSIGNED",
    },
  });

  revalidatePath(`/admin/jobs/${jobId}`);
  revalidatePath(`/admin/jobs/${jobId}/assignments`);
  revalidatePath("/admin/jobs");

  redirect(`/admin/jobs/${jobId}/assignments?message=外部スタッフを追加しました`);
};

export const cancelExternalStaffAssignment = async (formData: FormData) => {
  await getCurrentAdmin();

  const assignmentId = String(formData.get("assignmentId") ?? "");
  const jobId = String(formData.get("jobId") ?? "");

  if (!assignmentId || !jobId) {
    throw new Error("外部スタッフ割り振りが指定されていません。");
  }

  const assignment = await prisma.externalStaffAssignment.findUnique({
    where: {
      id: assignmentId,
    },
    include: {
      slot: true,
    },
  });

  if (!assignment) {
    throw new Error("外部スタッフ割り振りが見つかりません。");
  }

  if (assignment.slot.jobId !== jobId) {
    throw new Error("指定された案件に属していない外部スタッフ割り振りです。");
  }

  await prisma.externalStaffAssignment.update({
    where: {
      id: assignmentId,
    },
    data: {
      status: "CANCELED",
    },
  });

  revalidatePath(`/admin/jobs/${jobId}`);
  revalidatePath(`/admin/jobs/${jobId}/assignments`);
  revalidatePath("/admin/jobs");

  redirect(`/admin/jobs/${jobId}/assignments?message=外部スタッフをキャンセルしました`);
};