import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // 1. Authenticate calling user using anon client with session cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized: You must be signed in to delete your account." },
        { status: 401 }
      );
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      console.error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
      return NextResponse.json(
        { error: "Server configuration error. Please contact support at privacy@akuche.app." },
        { status: 500 }
      );
    }

    // 2. Instantiate admin client with service role key
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceKey,
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {},
        },
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      }
    );

    const userId = user.id;

    // 3. Cascade delete associated user data
    const userTables = [
      "user_settings",
      "activity_logs",
      "brain_scores",
      "streaks",
      "xp_ledger",
      "coins_ledger",
      "achievements",
      "mission_progress",
      "notifications",
      "daily_workouts",
      "subscriptions",
      "profiles",
    ];

    for (const table of userTables) {
      try {
        await supabaseAdmin.from(table).delete().eq("user_id", userId);
      } catch (tableErr) {
        console.warn(`Non-fatal error clearing table ${table} for user ${userId}:`, tableErr);
      }
    }

    // 4. Delete the user identity from Supabase Auth
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteAuthError) {
      console.error("Failed to delete user from Supabase auth:", deleteAuthError);
      return NextResponse.json(
        { error: "Could not completely delete authentication credentials: " + deleteAuthError.message },
        { status: 500 }
      );
    }

    // 5. Build response and clear cookies
    const response = NextResponse.json({
      success: true,
      message: "Your account and all associated data have been permanently deleted.",
    });

    // Invalidate auth cookies
    const authCookies = cookieStore.getAll();
    for (const cookie of authCookies) {
      if (cookie.name.includes("sb-") || cookie.name.includes("auth")) {
        response.cookies.set(cookie.name, "", { path: "/", maxAge: 0 });
      }
    }

    return response;
  } catch (err) {
    console.error("Delete account error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while deleting your account." },
      { status: 500 }
    );
  }
}
