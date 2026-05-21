"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";

export const createExternalShiftAssignment = async (formData: FormData) => {
  await requireAdmin();

  const jobId = String(formData.get("jobId") ?? "");
  const slotId = String(formData.get("slotId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const note = String(formData.get("memo") ?? "").trim();

  if (!jobId || !slotId) {
    throw new Error("案件または勤務枠が指定されていません。");
  }

  if (!name) {
    throw new Error("外部人員の名前を入力してください。");
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
      note: note || null,
      status: "ASSIGNED",
    },
  });

  revalidatePath(`/admin/jobs/${jobId}`);
  revalidatePath(`/admin/jobs/${jobId}/assignments`);
  revalidatePath("/admin/jobs");

  redirect(`/admin/jobs/${jobId}/assignments?message=external-created`);
};

export const deleteExternalShiftAssignment = async (formData: FormData) => {
  await requireAdmin();

  const externalAssignmentId = String(
    formData.get("externalAssignmentId") ?? "",
  );
  const jobId = String(formData.get("jobId") ?? "");

  if (!externalAssignmentId || !jobId) {
    throw new Error("削除対象の外部人員が指定されていません。");
  }

  const externalAssignment = await prisma.externalStaffAssignment.findUnique({
    where: {
      id: externalAssignmentId,
    },
    include: {
      slot: true,
    },
  });

  if (!externalAssignment) {
    throw new Error("削除対象の外部人員が見つかりません。");
  }

  if (externalAssignment.slot.jobId !== jobId) {
    throw new Error("指定された案件に属していない外部人員は削除できません。");
  }

  await prisma.externalStaffAssignment.delete({
    where: {
      id: externalAssignmentId,
    },
  });

  revalidatePath(`/admin/jobs/${jobId}`);
  revalidatePath(`/admin/jobs/${jobId}/assignments`);
  revalidatePath("/admin/jobs");

  redirect(`/admin/jobs/${jobId}/assignments?message=external-deleted`);
};