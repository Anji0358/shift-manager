import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/current-user";

export const requireLogin = async () => {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
};

export const requireAdmin = async () => {
  const session = await requireLogin();

  if (session.user.role !== "ADMIN") {
    redirect("/staff");
  }

  return session;
};

export const requireStaff = async () => {
  const session = await requireLogin();

  if (session.user.role !== "STAFF") {
    redirect("/admin");
  }

  return session;
};