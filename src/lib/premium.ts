import { createClient } from "@/lib/supabase/server";

export async function checkPremiumAccess(userId: string): Promise<{
  subscribed: boolean;
  plan: string;
}> {
  try {
    const supabase = await createClient();
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status, plan_tier")
      .eq("user_id", userId)
      .maybeSingle();

    const subscribed = sub?.status === "active" || sub?.status === "trialing";
    return { subscribed, plan: subscribed ? sub.plan_tier : "free" };
  } catch {
    return { subscribed: false, plan: "free" };
  }
}
