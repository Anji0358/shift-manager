import type { DefaultSession } from "next-auth";
import type { EmployeeRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: EmployeeRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: EmployeeRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: EmployeeRole;
  }
}