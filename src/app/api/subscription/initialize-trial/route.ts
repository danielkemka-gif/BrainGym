import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const TRIAL_DAYS = 14;

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id, status, current_period_end")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing && existing.status !== "incomplete") {
      return NextResponse.json({
        status: existing.status,
        periodEnd: existing.current_period_end,
      });
    }

    const now = new Date();
    const periodEnd = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

    const { error } = await supabase
      .from("subscriptions")
      .upsert(
        {
          user_id: user.id,
          status: "trialing",
          plan_tier: "premium",
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "trialing", periodEnd: periodEnd.toISOString() });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
