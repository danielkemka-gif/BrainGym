import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

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
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;
    const next = searchParams.get("next");
    const errorParam = searchParams.get("error") || searchParams.get("error_description");
    const pendingRef = request.cookies.get("pending_ref")?.value ?? null;
    const refCode =
      searchParams.get("ref") ??
      (pendingRef ? decodeURIComponent(pendingRef) : null);

    // Prepare cookie collection to synchronize onto the redirect response
    const cookiesToSetOnRedirect: { name: string; value: string; options: CookieOptions }[] = [];

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            cookiesToSet.forEach((cookieItem) =>
              cookiesToSetOnRedirect.push(cookieItem)
            );
          },
        },
      }
    );

    let authSuccess = false;

    // 1. Verify OTP token_hash (Email signup confirmation, magic links, recovery)
    if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });
      if (!error) {
        authSuccess = true;
      } else {
        console.error("verifyOtp error:", error);
      }
    }

    // 2. Exchange PKCE / OAuth authorization code for session
    if (!authSuccess && code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        authSuccess = true;
      } else {
        console.error("exchangeCodeForSession error:", error);
      }
    }

    if (authSuccess) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Attribute referral if present
        const ref = refCode || user.user_metadata?.ref_code;
        if (ref) {
          try {
            const admin = await createServiceClient();
            await admin.rpc("attribute_referral", {
              p_user_id: user.id,
              p_ref: ref,
            });
          } catch (err) {
            console.error("Failed to attribute referral in callback:", err);
          }
        }

        // Check or initialize profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, onboarding_complete")
          .eq("user_id", user.id)
          .maybeSingle();

        // If profile doesn't exist yet, create initial baseline row
        if (!profile) {
          const displayName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "User";
          await supabase.from("profiles").insert({
            user_id: user.id,
            name: displayName,
            onboarding_complete: false,
          });
        }

        // Determine destination target
        let targetPath = "/dashboard";
        if (type === "recovery") {
          targetPath = "/dashboard/settings";
        } else if (!profile || !profile.onboarding_complete) {
          targetPath = "/onboarding";
        } else if (next && next.startsWith("/") && !next.startsWith("//")) {
          targetPath = next;
        }

        const redirectResponse = NextResponse.redirect(`${origin}${targetPath}`);
        cookiesToSetOnRedirect.forEach(({ name, value, options }) => {
          redirectResponse.cookies.set(name, value, options);
        });
        redirectResponse.cookies.set("pending_ref", "", { path: "/", maxAge: 0 });
        return redirectResponse;
      }
    }

    // Auth verification failed or no code/token provided
    const redirectUrl = `${origin}/login?error=${encodeURIComponent(
      errorParam || "auth_callback_error"
    )}`;
    const failResponse = NextResponse.redirect(redirectUrl);
    failResponse.cookies.set("pending_ref", "", { path: "/", maxAge: 0 });
    return failResponse;
  } catch (err) {
    console.error("Auth callback unexpected error:", err);
    return NextResponse.redirect(`${APP_URL}/login?error=auth_callback_error`);
  }
}
