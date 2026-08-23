import { type NextRequest, NextResponse } from "next/server";

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Pass API and Next.js internal requests
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  // 2. Allow all public marketing & auth routes
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // 3. For protected routes (like /dashboard or /admin), check for auth session cookies
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    const cookies = request.cookies.getAll();
    const hasAuthCookie = cookies.some(
      (c) =>
        c.name.includes("-auth-token") ||
        c.name.includes("sb-") ||
        c.name.includes("supabase")
    );

    // If clearly unauthenticated, redirect to login
    if (!hasAuthCookie && cookies.length === 0) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest|json|js|css|txt|xml)$).*)",
  ],
};
