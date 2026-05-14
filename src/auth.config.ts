import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { EmployeeRole } from "@prisma/client";

const authConfig = {
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "メールアドレス",
          type: "email",
        },
        password: {
          label: "パスワード",
          type: "password",
        },
      },

      async authorize() {
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && typeof token.id === "string" && token.role) {
        session.user.id = token.id;
        session.user.role = token.role as EmployeeRole;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;