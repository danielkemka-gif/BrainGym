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

export async function POST(req: Request) {
  try {
    const { email, password, refCode } = await req.json();

    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const admin = getAdminClient();

    // Check if user already exists
    const { data: userList } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const existing = userList?.users?.find(
      (u) => u.email?.toLowerCase() === trimmedEmail
    );

    if (existing) {
      return NextResponse.json(
        {
          error: "An account with this email already exists. Please sign in.",
          isExisting: true,
        },
        { status: 409 }
      );
    }

    // Create user with admin API
    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
      email: trimmedEmail,
      password: password,
      email_confirm: true, // Auto-confirm email so test runners and new users can immediately log in without email delays
      user_metadata: {
        ref_code: refCode || undefined,
      },
    });

    if (createError) {
      console.error("[api/auth/signup] Admin createUser error:", createError);
      return NextResponse.json(
        {
          error:
            createError.message ||
            "Unable to create account right now. Please try again or use Google sign-in.",
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
