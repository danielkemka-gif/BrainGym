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

    const key = process.env.PAYSTACK_SECRET_KEY ?? "";
    const res = await fetch("https://api.paystack.co/subscription/disable", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: sub.paystack_subscription_code,
        token: sub.paystack_subscription_code,
      }),
    });

    const paystackResponse = await res.json();

    if (!paystackResponse.status && !paystackResponse.message?.includes("already disabled")) {
      return NextResponse.json(
        { error: paystackResponse.message ?? "Paystack cancellation failed" },
        { status: 502 }
      );
    }

    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();
    await admin
      .from("subscriptions")
      .update({ status: "canceled" })
      .eq("user_id", user.id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}
