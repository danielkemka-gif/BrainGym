import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    if (code) {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();

          const { data: sub } = await supabase
            .from("subscriptions")
            .select("id, status")
            .eq("user_id", user.id)
            .maybeSingle();

          if (sub && sub.status === "incomplete") {
            const now = new Date();
            const periodEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
            await supabase
              .from("subscriptions")
              .update({
                status: "trialing",
                plan_tier: "premium",
                current_period_start: now.toISOString(),
                current_period_end: periodEnd.toISOString(),
              })
              .eq("id", sub.id);
          }

          if (!profile) {
            return NextResponse.redirect(`${origin}/onboarding`);
          }

          return NextResponse.redirect(`${origin}/dashboard`);
        }
      }
    }

    return NextResponse.redirect(
      `${origin}/login?error=${errorParam || "auth_callback_error"}`
    );
  } catch {
    return NextResponse.redirect(`/login?error=auth_callback_error`);
  }
}
