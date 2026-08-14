import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://brain-gym-nsu6.vercel.app";

async function createServiceClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    }
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error") || searchParams.get("error_description");
    const pendingRef = request.cookies.get("pending_ref")?.value ?? null;
    const refCode =
      searchParams.get("ref") ??
      (pendingRef ? decodeURIComponent(pendingRef) : null);

    if (code) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const ref = refCode || user.user_metadata?.ref_code;
          if (ref) {
            try {
              const admin = await createServiceClient();
              await admin.rpc("attribute_referral", {
                p_user_id: user.id,
                p_ref: ref,
              });
            } catch (err) {
              console.error("Failed to attribute referral:", err);
            }
          }

          const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();

          if (!profile) {
            const res = NextResponse.redirect(`${origin}/onboarding`);
            res.cookies.set("pending_ref", "", { path: "/", maxAge: 0 });
            return res;
          }

          const res = NextResponse.redirect(`${origin}/dashboard`);
          res.cookies.set("pending_ref", "", { path: "/", maxAge: 0 });
          return res;
        }
      }
    }

    const res = NextResponse.redirect(
      `${origin}/login?error=${errorParam || "auth_callback_error"}`
    );
    res.cookies.set("pending_ref", "", { path: "/", maxAge: 0 });
    return res;
  } catch (err) {
    console.error("Auth callback error:", err);
    return NextResponse.redirect(`${APP_URL}/login?error=auth_callback_error`);
  }
}
