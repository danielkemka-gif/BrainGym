import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const publicPaths = [
  "/",
  "/features",
  "/pricing",
  "/about",
  "/login",
  "/signup",
  "/forgot-password",
  "/auth/callback",
  "/invite",
  "/join",
];

const adminPattern = /^\/admin(\/|$)/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Whitelist API endpoints
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 2. Immediately allow public paths without edge session blocking
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // 3. For protected routes (like /dashboard or /admin), check session
  try {
    const { supabaseResponse, user } = await updateSession(request);

    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return supabaseResponse;
  } catch (err) {
    console.warn("Session check fallback:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest|json|js|css|txt|xml)$).*)",
  ],
};
