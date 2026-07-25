import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY ?? "")
    .update(body)
    .digest("hex");

  const sigBuf = Buffer.from(hash, "hex");
  const sigHeader = Buffer.from(signature, "hex");

  if (sigBuf.length !== sigHeader.length || !crypto.timingSafeEqual(sigBuf, sigHeader)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.event) {
    case "charge.success": {
      const charge = event.data as Record<string, unknown>;
      const customer = charge.customer as Record<string, unknown> | undefined;
      const subscription = charge.subscription as Record<string, unknown> | undefined;
      const customerCode = customer?.customer_code as string | undefined;
      const subscriptionCode = subscription?.subscription_code as string | undefined;
      const customerEmail = customer?.email as string | undefined;

      if (!customerCode) break;

      const { data: existing } = await supabase
        .from("subscriptions")
        .select("user_id, status")
        .eq("paystack_customer_code", customerCode)
        .maybeSingle();

      if (existing && existing.status !== "active") {
        const updateData: Record<string, unknown> = { status: "active", plan_tier: "premium" };
        if (subscriptionCode) updateData.paystack_subscription_code = subscriptionCode;
        if (customerEmail) updateData.user_email = customerEmail;
        await supabase.from("subscriptions").update(updateData).eq("user_id", existing.user_id);
      }
      break;
    }

    case "subscription.disable": {
      const subData = event.data as Record<string, unknown>;
      const subCode = subData.subscription_code as string | undefined;

      if (!subCode) break;

      const { data: existing } = await supabase
        .from("subscriptions")
        .select("user_id, status")
        .eq("paystack_subscription_code", subCode)
        .maybeSingle();

      if (existing && existing.status !== "canceled") {
        await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("user_id", existing.user_id);
      }
      break;
    }

    case "invoice.update":
    case "invoice.create": {
      const invoice = event.data as Record<string, unknown>;
      const invoiceSub = invoice.subscription as Record<string, unknown> | undefined;
      const subCode = invoiceSub?.subscription_code as string | undefined;

      if (!subCode) break;

      const { data: existing } = await supabase
        .from("subscriptions")
        .select("user_id, status")
        .eq("paystack_subscription_code", subCode)
        .maybeSingle();

      if (existing && invoice.status === "paid" && existing.status !== "active") {
        await supabase
          .from("subscriptions")
          .update({ status: "active" })
          .eq("user_id", existing.user_id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
