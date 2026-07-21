import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  // Verify webhook signature
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY ?? "")
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  const supabase = await createClient();

  switch (event.event) {
    case "charge.success": {
      const charge = event.data;
      const customerEmail = charge.customer?.email;
      const customerCode = charge.customer?.customer_code;
      const subscriptionCode = charge.subscription?.subscription_code;

      if (customerEmail) {
        // Find user by email
        const { data: user } = await supabase
          .from("auth.users")
          .select("id")
          .eq("email", customerEmail)
          .maybeSingle()
          .throwOnError();

        // Actually, we can't query auth.users from the client. Let's use the subscriptions table.
        // We'll look up by paystack_customer_code or email
        const { data: existing } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("paystack_customer_code", customerCode)
          .maybeSingle();

        if (existing) {
          const updateData: Record<string, unknown> = {
            status: "active",
            plan_tier: "premium",
          };
          if (subscriptionCode) updateData.paystack_subscription_code = subscriptionCode;
          await supabase.from("subscriptions").update(updateData).eq("user_id", existing.user_id);
        }
      }
      break;
    }

    case "subscription.disable": {
      const subData = event.data;
      const subCode = subData.subscription_code;

      const { data: existing } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("paystack_subscription_code", subCode)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("user_id", existing.user_id);
      }
      break;
    }

    case "invoice.update":
    case "invoice.create": {
      const invoice = event.data;
      if (invoice.subscription?.subscription_code) {
        const { data: existing } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("paystack_subscription_code", invoice.subscription.subscription_code)
          .maybeSingle();

        if (existing && invoice.status === "paid") {
          await supabase
            .from("subscriptions")
            .update({ status: "active" })
            .eq("user_id", existing.user_id);
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
