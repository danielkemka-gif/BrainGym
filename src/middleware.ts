import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { updateSession } from "@/lib/supabase/middleware";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://qxivwyyompzpipfzcufl.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_2AwU9whNSoohKmLAdq6wtw_VC7Oydiu";

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

const authPaths = ["/login", "/signup", "/forgot-password"];
const onboardingPath = "/onboarding";
const adminPattern = /^\/admin(\/|$)/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    const apiWhitelist = ["/api/paystack/webhook", "/api/health"];

    if (pathname.startsWith("/api/")) {
      if (apiWhitelist.some((p) => pathname.startsWith(p))) {
        return NextResponse.next();
      }
      const { supabaseResponse } = await updateSession(request);
      return supabaseResponse;
    }

    const { supabaseResponse, user } = await updateSession(request);

    if (user && authPaths.includes(pathname)) {
      const ref = request.nextUrl.searchParams.get("ref");
      const target = ref ? `/dashboard?ref=${encodeURIComponent(ref)}` : "/dashboard";
      return NextResponse.redirect(new URL(target, request.url));
    }

    if (!user && !publicPaths.includes(pathname)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Admin guard — non-admins redirected to dashboard
    if (user && adminPattern.test(pathname)) {
      const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {},
        },
      });

      const { data: adminRow } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!adminRow) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // Onboarding guard
    if (user && pathname === onboardingPath) {
      const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {},
        },
      });

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile?.onboarding_complete === true) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return supabaseResponse;
  } catch (err) {
    console.warn("Middleware error fallback:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest|json|js|css|txt|xml)$).*)",
  ],
};
