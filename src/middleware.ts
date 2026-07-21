import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
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
];

const authPaths = ["/login", "/signup", "/forgot-password"];
const onboardingPath = "/onboarding";
const dashboardPattern = /^\/dashboard(\/|$)/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabaseResponse, user } = await updateSession(request);

  if (user && authPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!user && !publicPaths.includes(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Onboarding guard — check profile only if needed
  if (user) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll() {},
        },
      }
    );

    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_complete")
      .eq("user_id", user.id)
      .maybeSingle();

    const onboarded = profile?.onboarding_complete === true;

    if (onboarded && pathname === onboardingPath) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!onboarded && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL(onboardingPath, request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
