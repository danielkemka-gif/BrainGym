import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("paystack_subscription_code")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!sub?.paystack_subscription_code) {
      return NextResponse.json({ error: "No active subscription" }, { status: 404 });
    }

    // Disable the subscription via Paystack API
    const key = process.env.PAYSTACK_SECRET_KEY ?? "";
    await fetch(
      `https://api.paystack.co/subscription/${sub.paystack_subscription_code}/disable`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: sub.paystack_subscription_code, token: "" }),
      }
    );

    await supabase
      .from("subscriptions")
      .update({ status: "canceled" })
      .eq("user_id", user.id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}
