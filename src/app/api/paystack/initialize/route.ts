import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { initializeSubscription, createPlanIfNotExists } from "@/lib/paystack/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const planCode = await createPlanIfNotExists();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://akuche.app";

    const { authorizationUrl, reference } = await initializeSubscription(
      user.email,
      planCode,
      `${appUrl}/api/paystack/verify`
    );

    // Use service-role admin client so 00035 RLS on subscriptions is respected
    const admin = createAdminClient();
    await admin.from("subscriptions").upsert({
      user_id: user.id,
      status: "incomplete",
    }, { onConflict: "user_id" });

    return NextResponse.json({ url: authorizationUrl, reference });
  } catch (err) {
    console.error("Initialize error:", err);
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
  }
}
