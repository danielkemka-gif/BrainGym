import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyTransaction } from "@/lib/paystack/server";

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference");
  if (!reference) {
    return NextResponse.redirect(
      new URL("/dashboard/settings?subscription=failed", request.url)
    );
  }

  try {
    const data = await verifyTransaction(reference);

    if (data.status === "success") {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Extract customer and subscription info from Paystack response
        const customerCode = data.customer?.customer_code ?? null;
        const subscriptionCode = data.subscription?.subscription_code ?? null;

        const updateData: Record<string, unknown> = {
          status: "active",
          plan_tier: "premium",
        };
        if (customerCode) updateData.paystack_customer_code = customerCode;
        if (subscriptionCode) updateData.paystack_subscription_code = subscriptionCode;

        await supabase.from("subscriptions").update(updateData).eq("user_id", user.id);
      }
    }

    return NextResponse.redirect(
      new URL(
        data.status === "success"
          ? "/dashboard/settings?subscription=success"
          : "/dashboard/settings?subscription=failed",
        request.url
      )
    );
  } catch {
    return NextResponse.redirect(
      new URL("/dashboard/settings?subscription=failed", request.url)
    );
  }
}
