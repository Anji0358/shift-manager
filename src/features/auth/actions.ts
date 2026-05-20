"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const loginAction = async (formData: FormData) => {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=credentials");
  }

  const employee = await prisma.employee.findUnique({
    where: {
      email,
    },
    select: {
      role: true,
    },
  });

  const redirectTo =
    employee?.role === "ADMIN"
      ? "/admin"
      : employee?.role === "STAFF"
        ? "/staff"
        : "/";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=credentials");
    }

    throw error;
  }
};

export const logoutAction = async () => {
  await signOut({
    redirectTo: "/login",
  });
};