import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const getCurrentSession = async () => {
  return await auth();
};

export const getCurrentUserId = async () => {
  const session = await getCurrentSession();

  return session?.user?.id ?? null;
};

export const getRequiredCurrentUserId = async () => {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  return userId;
};

export const getCurrentUser = async () => {
  const userId = await getCurrentUserId();

  if (!userId) {
    return null;
  }

  return await prisma.employee.findUnique({
    where: {
      id: userId,
    },
  });
};

export const getRequiredCurrentUser = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
};

export const getCurrentEmployeeId = async () => {
  return await getRequiredCurrentUserId();
};

export const getCurrentAdminId = async () => {
  return await getRequiredCurrentUserId();
};

export const getCurrentEmployee = async () => {
  return await getRequiredCurrentUser();
};

export const getCurrentAdmin = async () => {
  return await getRequiredCurrentUser();
};