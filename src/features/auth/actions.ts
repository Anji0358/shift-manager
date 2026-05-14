"use server";

import { signIn,signOut } from "../../../auth";
import { AuthError } from 'next-auth';

export const loginAction = async (formData: FormData) => {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "メールアドレスまたはパスワードが正しくありません。",
      };
    }

    throw error;
  }
};

export const logoutAction = async () => {
  await signOut({
    redirectTo: "/login",
  });
};