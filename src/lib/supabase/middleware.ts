import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // 1. Check if ANY Supabase session cookie exists
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) => c.name.startsWith("sb-") || c.name.includes("auth-token")
  );

  // If user has no auth cookie, they are definitely an unauthenticated guest.
  // Do NOT make a remote network request to Supabase!
  if (!hasAuthCookie) {
    return { supabaseResponse, user: null, isAdminInDb: false };
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://qxivwyyompzpipfzcufl.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "sb_publishable_2AwU9whNSoohKmLAdq6wtw_VC7Oydiu";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  let user = null;
  let isAdminInDb = false;

  try {
    // Strict 1.2-second timeout to prevent Edge Middleware 504 timeouts if Supabase is slow/paused
    const authPromise = supabase.auth.getUser();
    const timeoutPromise = new Promise<{ data: { user: null }; error: any }>((resolve) =>
      setTimeout(
        () => resolve({ data: { user: null }, error: new Error("Supabase auth timeout in middleware") }),
        1200
      )
    );
    const res = await Promise.race([authPromise, timeoutPromise]);
    user = res.data?.user ?? null;

    if (user && request.nextUrl.pathname.startsWith("/admin")) {
      const adminPromise = supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      const adminTimeout = new Promise<{ data: null }>((resolve) =>
        setTimeout(() => resolve({ data: null }), 800)
      );
      const { data: adminRow } = await Promise.race([adminPromise, adminTimeout]);
      isAdminInDb = Boolean(adminRow);
    }
  } catch {
    // If Supabase is unreachable, paused, or timed out, fall back gracefully
    user = null;
  }

  return { supabaseResponse, user, isAdminInDb };
}
