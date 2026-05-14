import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
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

      async authorize(credentials) {
        const email = String(credentials?.email ?? "");
        const password = String(credentials?.password ?? "");

        if (!email || !password) {
          return null;
        }

        const employee = await prisma.employee.findUnique({
          where: {
            email,
          },
        });

        if (!employee) {
          return null;
        }

        if (employee.employmentStatus !== "ACTIVE") {
          return null;
        }

        if (!employee.passwordHash) {
          return null;
        }

        const passwordMatched = await bcrypt.compare(
          password,
          employee.passwordHash,
        );

        if (!passwordMatched) {
          return null;
        }

        return {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
        };
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
      if (session.user && token.id && token.role) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
});