import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./src/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = Boolean(req.auth?.user);
  const role = req.auth?.user?.role;

  const pathname = req.nextUrl.pathname;

  const isAdminRoute = pathname.startsWith("/admin");
  const isStaffRoute = pathname.startsWith("/staff");

  if ((isAdminRoute || isStaffRoute) && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && role !== "ADMIN") {
    const staffUrl = new URL("/staff", req.nextUrl.origin);
    return NextResponse.redirect(staffUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*"],
};