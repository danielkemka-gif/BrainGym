import { NextResponse } from "next/server";
import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization") ?? "";
  return auth === `Bearer ${secret}`;
}

interface SubscriptionRow {
  id: string;
  user_id: string;
  endpoint: string;
  keys_json: string;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:support@braingym.app";

  if (!publicKey || !privateKey) {
    return NextResponse.json(
      { error: "VAPID keys not configured" },
      { status: 500 }
    );
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  const admin = createAdminClient();

  // Due, unsent reminders
  const { data: reminders, error: remindersError } = await admin
    .from("smart_reminders")
    .select("id, user_id, title, message, action_url")
    .lte("scheduled_for", new Date().toISOString())
    .is("sent_at", null)
    .is("dismissed_at", null)
    .limit(500);

  if (remindersError) {
    return NextResponse.json({ error: remindersError.message }, { status: 500 });
  }
  if (!reminders || reminders.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const userIds = [...new Set(reminders.map((r) => r.user_id))];

  const { data: subscriptions, error: subsError } = await admin
    .from("push_subscriptions")
    .select("id, user_id, endpoint, keys_json")
    .in("user_id", userIds);

  if (subsError) {
    return NextResponse.json({ error: subsError.message }, { status: 500 });
  }

  const byUser = new Map<string, string[]>();
  for (const r of reminders) {
    byUser.set(r.user_id, [...(byUser.get(r.user_id) ?? []), r.id]);
  }

  let sent = 0;
  let failures = 0;
  const stale: string[] = [];

  for (const sub of (subscriptions ?? []) as SubscriptionRow[]) {
    let keys: { p256dh: string; auth: string } | null = null;
    try {
      keys = JSON.parse(sub.keys_json);
    } catch {
      stale.push(sub.id);
      continue;
    }
    if (!keys?.p256dh || !keys?.auth) {
      stale.push(sub.id);
      continue;
    }

    const userReminders = reminders.filter((r) => r.user_id === sub.user_id);
    const first = userReminders[0];
    if (!first) continue;

    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys,
        },
        JSON.stringify({
          title: first.title ?? "BrainGym",
          body: first.message ?? "Time for your brain workout!",
          url: first.action_url ?? "/dashboard",
        })
      );
      sent += 1;
    } catch (err) {
      failures += 1;
      // 404/410 = subscription is gone; clean it up
      const code = (err as { statusCode?: number }).statusCode;
      if (code === 404 || code === 410) stale.push(sub.id);
    }
  }

  if (stale.length > 0) {
    await admin.from("push_subscriptions").delete().in("id", stale);
  }

  // Mark sent, unless sending failed outright
  const sentIds = [...new Set(reminders.map((r) => r.id))];
  await admin
    .from("smart_reminders")
    .update({ sent_at: new Date().toISOString(), is_read: true })
    .in("id", sentIds);

  return NextResponse.json({
    sent,
    failures,
    reminders: sentIds.length,
    subscriptions: (subscriptions ?? []).length,
  });
}
