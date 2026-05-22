"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { timeTextToMinutes } from "@/lib/time";
import { requireAdmin } from "@/lib/auth/guards";

const redirectToNewSlotPage = (jobId: string, message: string): never => {
  redirect(
    `/admin/jobs/${jobId}/slots/new?message=${encodeURIComponent(message)}`,
  );
};

const redirectToAssignmentsPage = (jobId: string, message: string): never => {
  redirect(
    `/admin/jobs/${jobId}/assignments?message=${encodeURIComponent(message)}`,
  );
};

export const createJobShiftSlot = async (formData: FormData) => {
  await requireAdmin();

  const jobId = String(formData.get("jobId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const startTime = String(formData.get("startTime") ?? "");
  const endTime = String(formData.get("endTime") ?? "");
  const startTimeMinutes = timeTextToMinutes(startTime);
const endTimeMinutes = timeTextToMinutes(endTime);
  const requiredPeopleText = String(formData.get("requiredPeople") ?? "");

  if (!jobId) {
    throw new Error("案件IDが取得できませんでした。");
  }

  if (!name) {
    redirectToNewSlotPage(jobId, "勤務枠名を入力してください。");
  }

  if (!startTime || !endTime) {
    redirectToNewSlotPage(jobId, "開始時刻と終了時刻を入力してください。");
  }

  if (startTime >= endTime) {
    redirectToNewSlotPage(
      jobId,
      "終了時刻は開始時刻より後にしてください。",
    );
  }

  const requiredPeople = Number(requiredPeopleText);

  if (!Number.isInteger(requiredPeople) || requiredPeople <= 0) {
    redirectToNewSlotPage(
      jobId,
      "必要人数は1以上の整数で入力してください。",
    );
  }

  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    redirectToNewSlotPage(jobId, "案件が見つかりません。");
  }

await prisma.jobShiftSlot.create({
  data: {
    jobId,
    name,
    startTime,
    endTime,
    startTimeMinutes,
    endTimeMinutes,
    requiredPeople,
  },
});

  revalidatePath(`/admin/jobs/${jobId}`);
  revalidatePath(`/admin/jobs/${jobId}/assignments`);
  revalidatePath("/admin/jobs");

  redirectToAssignmentsPage(jobId, "勤務枠を追加しました。");
};