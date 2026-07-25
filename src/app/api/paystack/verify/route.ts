import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTransaction } from "@/lib/paystack/server";
import { PLANS } from "@/lib/paystack/plans";

export async function POST(request: NextRequest) {
  let reference: string | null = null;

  try {
    const body = await request.json();
    reference = body.reference;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  try {
    const data = await verifyTransaction(reference);

    if (data.status !== "success") {
      return NextResponse.json(
        { error: "Transaction not successful", status: data.status },
        { status: 400 }
      );
    }

    if (data.currency !== PLANS.premium.currency) {
      return NextResponse.json(
        { error: "Invalid currency", expected: PLANS.premium.currency, received: data.currency },
        { status: 400 }
      );
    }

    if (typeof data.amount === "number" && data.amount < PLANS.premium.amount) {
      return NextResponse.json(
        { error: "Insufficient amount", expected: PLANS.premium.amount, received: data.amount },
        { status: 400 }
      );
    }

    const customerEmail = data.customer?.email;
    if (!customerEmail) {
      return NextResponse.json(
        { error: "No customer email in transaction" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from("subscriptions")
      .select("user_id, paystack_customer_code")
      .eq("paystack_customer_code", data.customer?.customer_code)
      .maybeSingle();

    let userId: string | null = existing?.user_id ?? null;

    if (!userId) {
      const { data: byEmail } = await supabase
        .from("subscriptions")
        .select("user_id, paystack_customer_code")
        .eq("user_email", customerEmail)
        .maybeSingle();
      userId = byEmail?.user_id ?? null;
    }

    if (!userId) {
      return NextResponse.json(
        { error: "No subscription found for this customer" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {
      status: "active",
      plan_tier: "premium",
      user_email: customerEmail,
    };
    if (data.customer?.customer_code) {
      updateData.paystack_customer_code = data.customer.customer_code;
    }
    if (data.subscription?.subscription_code) {
      updateData.paystack_subscription_code = data.subscription.subscription_code;
    }

    await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("user_id", userId);

    return NextResponse.json({ success: true, status: "active" });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Verification failed" },
      { status: 500 }
    );
  }
}
