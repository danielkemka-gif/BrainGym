import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Refresh Supabase session cookies safely and resolve user
  const { supabaseResponse, user, isAdminInDb } = await updateSession(request);

  // 2. Defensive HTTP Security Headers (OWASP ASVS 5.0 L2 Baseline)
  supabaseResponse.headers.set("X-Content-Type-Options", "nosniff");
  supabaseResponse.headers.set("X-Frame-Options", "DENY");
  supabaseResponse.headers.set("X-XSS-Protection", "1; mode=block");
  supabaseResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  supabaseResponse.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(self), geolocation=(), payment=(self)"
  );

  // 3. Admin Route Protection: require authenticated admin user (verified via env or admins table)
  if (pathname.startsWith("/admin")) {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const isAdminByEnv = Boolean(adminEmail && user?.email?.toLowerCase() === adminEmail);
    if (!user || (!isAdminByEnv && !isAdminInDb)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. Edge Route Protection for strictly private personal areas
  // Retains full guest exploratory access to /dashboard, /dashboard/clarity, and the 4 audience workspaces
  const isPrivateDataRoute =
    pathname.startsWith("/dashboard/settings") ||
    pathname.startsWith("/dashboard/profile") ||
    pathname.startsWith("/dashboard/shop");

  if (isPrivateDataRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sw.js, manifest.json, manifest.webmanifest (PWA service worker / manifests)
     * - icons, public images
     */
    "/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.json|manifest.webmanifest|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
