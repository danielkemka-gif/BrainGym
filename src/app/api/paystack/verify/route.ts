import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTransaction } from "@/lib/paystack/server";
import { PLANS } from "@/lib/paystack/plans";

async function verifyAndActivate(reference: string) {
  const data = await verifyTransaction(reference);

  if (data.status !== "success") {
    return { success: false, error: "Transaction not successful", status: data.status };
  }

  if (data.currency !== PLANS.premium.currency) {
    return { success: false, error: "Invalid currency" };
  }

  if (typeof data.amount === "number" && data.amount < PLANS.premium.amount) {
    return { success: false, error: "Insufficient amount" };
  }

  const customerEmail = data.customer?.email;
  if (!customerEmail) {
    return { success: false, error: "No customer email in transaction" };
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
    return { success: false, error: "No subscription found for this customer" };
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

  return { success: true };
}

// GET handler — Paystack redirects here after payment
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(`${origin}/dashboard/settings?payment=error&reason=no_reference`);
  }

  try {
    const result = await verifyAndActivate(reference);
    if (result.success) {
      return NextResponse.redirect(`${origin}/dashboard/settings?payment=success`);
    }
    return NextResponse.redirect(`${origin}/dashboard/settings?payment=error&reason=${encodeURIComponent(result.error ?? "unknown")}`);
  } catch {
    return NextResponse.redirect(`${origin}/dashboard/settings?payment=error&reason=verification_failed`);
  }
}

// POST handler — for client-side verification calls
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
    const result = await verifyAndActivate(reference);
    if (result.success) {
      return NextResponse.json({ success: true, status: "active" });
    }
    return NextResponse.json({ error: result.error }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Verification failed" },
      { status: 500 }
    );
  }
}
