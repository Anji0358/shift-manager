"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const createExternalShiftAssignment = async (formData: FormData) => {
  const jobId = String(formData.get("jobId") ?? "");
  const slotId = String(formData.get("slotId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const memo = String(formData.get("memo") ?? "").trim();

  if (!jobId || !slotId) {
    throw new Error("案件または勤務枠が指定されていません。");
  }

  if (!name) {
    throw new Error("外部人員の名前を入力してください。");
  }

  await prisma.externalStaffAssignment.create({
    data: {
      jobId,
      slotId,
      name,
      memo: memo || null,
    },
  });

  revalidatePath(`/admin/jobs/${jobId}`);
  revalidatePath(`/admin/jobs/${jobId}/assignments`);

  redirect(`/admin/jobs/${jobId}/assignments?message=external-created`);
};

export const deleteExternalShiftAssignment = async (formData: FormData) => {
  const externalAssignmentId = String(
    formData.get("externalAssignmentId") ?? "",
  );
  const jobId = String(formData.get("jobId") ?? "");

  if (!externalAssignmentId || !jobId) {
    throw new Error("削除対象の外部人員が指定されていません。");
  }

  await prisma.externalStaffAssignment.delete({
    where: {
      id: externalAssignmentId,
    },
  });

  revalidatePath(`/admin/jobs/${jobId}`);
  revalidatePath(`/admin/jobs/${jobId}/assignments`);

  redirect(`/admin/jobs/${jobId}/assignments?message=external-deleted`);
};