import { createClient } from "@/lib/supabase/server";

export async function checkPremiumAccess(userId: string): Promise<{
  subscribed: boolean;
  plan: string;
}> {
  try {
    const supabase = await createClient();
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status, plan_tier, current_period_end")
      .eq("user_id", userId)
      .maybeSingle();

    if (!sub) return { subscribed: false, plan: "free" };

    if (sub.status === "active") {
      return { subscribed: true, plan: sub.plan_tier };
    }

    if (sub.status === "trialing") {
      if (sub.current_period_end && new Date(sub.current_period_end) > new Date()) {
        return { subscribed: true, plan: sub.plan_tier };
      }
      return { subscribed: false, plan: "free" };
    }

    return { subscribed: false, plan: "free" };
  } catch {
    return { subscribed: false, plan: "free" };
  }
}
