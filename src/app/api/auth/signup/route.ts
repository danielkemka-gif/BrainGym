import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin environment variables");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

const signupRateBuckets = new Map<string, number[]>();
const SIGNUP_WINDOW_MS = 15 * 60 * 1000;
const SIGNUP_MAX_PER_WINDOW = 5;

function checkSignupRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = (signupRateBuckets.get(ip) ?? []).filter(
    (ts) => now - ts < SIGNUP_WINDOW_MS
  );
  if (timestamps.length >= SIGNUP_MAX_PER_WINDOW) {
    signupRateBuckets.set(ip, timestamps);
    return false;
  }
  timestamps.push(now);
  signupRateBuckets.set(ip, timestamps);
  return true;
}

export async function POST(req: Request) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    if (!checkSignupRateLimit(clientIp)) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please wait a few minutes and try again." },
        { status: 429 }
      );
    }

    const { email, password, refCode } = await req.json();

    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const admin = getAdminClient();

    // Create user directly (avoids full listUsers scan and prevents scale bottleneck)
    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
      email: trimmedEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        ref_code: refCode || undefined,
      },
    });

    if (createError) {
      const msg = createError.message?.toLowerCase() ?? "";
      if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
        return NextResponse.json(
          {
            error: "Unable to create account with these details. If you already have an account, please sign in.",
          },
          { status: 400 }
        );
      }
      console.error("[api/auth/signup] Admin createUser error:", createError);
      return NextResponse.json(
        {
          error: "Unable to create account right now. Please try again or use Google sign-in.",
        },
        { status: 500 }
      );
    }

    const userId = newUser.user.id;

    // Ensure profile and baseline records exist
    try {
      await admin.from("profiles").upsert(
        {
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      await admin.from("user_settings").upsert(
        {
          user_id: userId,
          dark_mode: true,
          notifications_enabled: true,
          locale: "en",
        },
        { onConflict: "user_id" }
      );

      await admin.from("streaks").upsert(
        {
          user_id: userId,
          current_streak: 0,
          longest_streak: 0,
        },
        { onConflict: "user_id" }
      );

      await admin.from("user_levels").upsert(
        {
          user_id: userId,
          level: 1,
          title: "Bronze",
          total_xp: 0,
        },
        { onConflict: "user_id" }
      );

      await admin.from("subscriptions").upsert(
        {
          user_id: userId,
          status: "trialing",
          plan_tier: "premium",
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
        { onConflict: "user_id" }
      );

      // Attribute referral if present
      if (refCode) {
        try {
          await admin.rpc("attribute_referral", {
            p_user_id: userId,
            p_ref: refCode,
          });
        } catch (rErr) {
          console.warn("[api/auth/signup] Referral attribution warning:", rErr);
        }
      }
    } catch (dbErr) {
      console.warn("[api/auth/signup] Baseline data initialization warning:", dbErr);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: trimmedEmail,
      },
    });
  } catch (error: any) {
    console.error("[api/auth/signup] Unexpected error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
