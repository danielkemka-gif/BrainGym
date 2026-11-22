import { NextResponse } from "next/server";
import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function isAuthorizedCron(req: Request): boolean {
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

interface UserPrefsRow {
  user_id: string;
  notifications_enabled?: boolean;
  timezone?: string;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  reminder_frequency?: string;
  reminder_channels?: { in_app?: boolean; web_push?: boolean };
}

function parseMinutes(timeStr: string | undefined, fallbackMinutes: number): number {
  if (!timeStr) return fallbackMinutes;
  const [h, m] = timeStr.split(":").map((n) => parseInt(n, 10));
  if (Number.isNaN(h)) return fallbackMinutes;
  return h * 60 + (Number.isNaN(m) ? 0 : m);
}

/**
 * Checks whether the current instant falls inside a user's quiet hours in their IANA timezone.
 */
function isInQuietHours(prefs: UserPrefsRow | undefined): boolean {
  if (!prefs) return false;
  const tz = prefs.timezone || "Africa/Lagos";
  const startMin = parseMinutes(prefs.quiet_hours_start, 22 * 60);
  const endMin = parseMinutes(prefs.quiet_hours_end, 7 * 60);

  let currentMin = 0;
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date());
    const hh = parseInt(parts.find((p) => p.type === "hour")?.value || "12", 10);
    const mm = parseInt(parts.find((p) => p.type === "minute")?.value || "0", 10);
    currentMin = hh * 60 + mm;
  } catch {
    const now = new Date();
    currentMin = now.getUTCHours() * 60 + now.getUTCMinutes();
  }

  if (startMin === endMin) return false;
  if (startMin < endMin) {
    return currentMin >= startMin && currentMin < endMin;
  }
  // Overnight quiet hours (e.g., 22:00 to 07:00)
  return currentMin >= startMin || currentMin < endMin;
}

function configureWebPush(): boolean {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:support@akuche.app";
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

/**
 * GET /api/push/send (Cron-triggered background dispatcher)
 * - Generates contextual human follow-ups for due assignments (deduped)
 * - Enforces user timezone, quiet hours, frequency, and opt-out settings
 * - Delivers Web Push with retry tracking + dead-subscription cleanup
 * - Marks unsubscribed users' reminders cleanly as in-app delivered (never starves queue)
 * - Writes delivery telemetry to `akuche_reminder_logs`
 */
export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pushConfigured = configureWebPush();
  const admin = createAdminClient();
  const nowIso = new Date().toISOString();
  const todayKey = nowIso.slice(0, 10);

  // 1. Auto-queue gentle human check-ins for active assignments past their deadline (deduped per day)
  try {
    const { data: overdueAssignments } = await admin
      .from("akuche_assignments")
      .select("id, user_id, title, deadline")
      .in("status", ["accepted", "in_progress"])
      .lte("deadline", nowIso)
      .limit(200);

    if (Array.isArray(overdueAssignments) && overdueAssignments.length > 0) {
      const generatedRows = overdueAssignments.map((a) => ({
        user_id: a.user_id,
        category: "assignment",
        title: `Quick check-in: ${String(a.title).slice(0, 75)}`,
        message: `You planned to tackle "${a.title}". Did you get a chance to try it, or would a shorter 5-minute version fit today better?`,
        action_url: "/dashboard/goals",
        context_id: a.id,
        scheduled_for: nowIso,
        channel: "both",
        status: "scheduled",
        dedupe_key: `overdue_assignment_${a.id}_${todayKey}`,
      }));

      await admin
        .from("akuche_reminders")
        .upsert(generatedRows, { onConflict: "user_id,dedupe_key", ignoreDuplicates: true });
    }
  } catch {
    // Non-fatal if migration 00041 hasn't been applied yet
  }

  // 2. Fetch due reminders from akuche_reminders
  const { data: dueReminders, error: dueErr } = await admin
    .from("akuche_reminders")
    .select("*")
    .in("status", ["scheduled", "snoozed"])
    .lte("scheduled_for", nowIso)
    .lt("retry_count", 3)
    .order("scheduled_for", { ascending: true })
    .limit(300);

  if (dueErr) {
    return NextResponse.json({
      error: dueErr.message,
      hint: "Ensure migration 00041_akuche_core_platform_tables.sql has been applied.",
    }, { status: 500 });
  }

  if (!dueReminders || dueReminders.length === 0) {
    return NextResponse.json({
      processed: 0,
      webPushSent: 0,
      inAppDelivered: 0,
      deferredQuietHours: 0,
      failures: 0,
    });
  }

  const userIds = [...new Set(dueReminders.map((r) => r.user_id))];

  const [prefsRes, subsRes] = await Promise.all([
    admin
      .from("user_settings")
      .select(
        "user_id, notifications_enabled, timezone, quiet_hours_start, quiet_hours_end, reminder_frequency, reminder_channels"
      )
      .in("user_id", userIds),
    admin
      .from("push_subscriptions")
      .select("id, user_id, endpoint, keys_json")
      .in("user_id", userIds),
  ]);

  const prefsByUser = new Map<string, UserPrefsRow>(
    ((prefsRes.data ?? []) as UserPrefsRow[]).map((p) => [p.user_id, p])
  );
  const subsByUser = new Map<string, SubscriptionRow[]>();
  for (const s of (subsRes.data ?? []) as SubscriptionRow[]) {
    subsByUser.set(s.user_id, [...(subsByUser.get(s.user_id) ?? []), s]);
  }

  let webPushSent = 0;
  let inAppDelivered = 0;
  let deferredQuietHours = 0;
  let failures = 0;
  const staleSubIds: string[] = [];

  for (const reminder of dueReminders) {
    const prefs = prefsByUser.get(reminder.user_id);

    // Respect opt-out preferences
    if (prefs?.notifications_enabled === false || prefs?.reminder_frequency === "off") {
      await admin
        .from("akuche_reminders")
        .update({ status: "cancelled", updated_at: nowIso })
        .eq("id", reminder.id);
      continue;
    }

    // Respect user timezone quiet hours: defer by 2 hours instead of waking them
    if (isInQuietHours(prefs)) {
      deferredQuietHours += 1;
      const deferTo = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      await admin
        .from("akuche_reminders")
        .update({ scheduled_for: deferTo, updated_at: nowIso })
        .eq("id", reminder.id);
      await admin.from("akuche_reminder_logs").insert({
        reminder_id: reminder.id,
        user_id: reminder.user_id,
        channel: "web_push",
        delivery_status: "skipped_quiet_hours",
      });
      continue;
    }

    const userSubs = subsByUser.get(reminder.user_id) ?? [];
    const allowWebPush =
      pushConfigured &&
      reminder.channel !== "in_app" &&
      prefs?.reminder_channels?.web_push !== false &&
      userSubs.length > 0;

    if (!allowWebPush) {
      // Deliver cleanly to in-app inbox and mark delivered so unsubscribed rows never clog the queue
      inAppDelivered += 1;
      await admin
        .from("akuche_reminders")
        .update({ status: "delivered", delivered_at: nowIso, updated_at: nowIso })
        .eq("id", reminder.id);
      await admin.from("akuche_reminder_logs").insert({
        reminder_id: reminder.id,
        user_id: reminder.user_id,
        channel: "in_app",
        delivery_status: userSubs.length === 0 ? "skipped_unsubscribed" : "sent",
      });
      continue;
    }

    let deliveredAnyDevice = false;
    let lastHttpStatus: number | null = null;
    let lastErrMsg: string | null = null;

    for (const sub of userSubs) {
      let keys: { p256dh: string; auth: string } | null = null;
      try {
        keys = JSON.parse(sub.keys_json);
      } catch {
        staleSubIds.push(sub.id);
        continue;
      }
      if (!keys?.p256dh || !keys?.auth) {
        staleSubIds.push(sub.id);
        continue;
      }

      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys },
          JSON.stringify({
            title: reminder.title || "Akuche Check-In",
            body: reminder.message,
            url: reminder.action_url || "/dashboard",
            tag: reminder.dedupe_key || `akuche-${reminder.id}`,
          })
        );
        deliveredAnyDevice = true;
        webPushSent += 1;
        await admin.from("akuche_reminder_logs").insert({
          reminder_id: reminder.id,
          user_id: reminder.user_id,
          channel: "web_push",
          delivery_status: "sent",
          http_status: 201,
        });
      } catch (err) {
        const code = (err as { statusCode?: number }).statusCode;
        lastHttpStatus = code ?? null;
        lastErrMsg = err instanceof Error ? err.message : "push_error";
        if (code === 404 || code === 410) {
          staleSubIds.push(sub.id);
          await admin.from("akuche_reminder_logs").insert({
            reminder_id: reminder.id,
            user_id: reminder.user_id,
            channel: "web_push",
            delivery_status: "expired_subscription",
            http_status: code,
            error_message: lastErrMsg.slice(0, 200),
          });
        } else {
          failures += 1;
          await admin.from("akuche_reminder_logs").insert({
            reminder_id: reminder.id,
            user_id: reminder.user_id,
            channel: "web_push",
            delivery_status: "failed",
            http_status: code ?? null,
            error_message: lastErrMsg.slice(0, 200),
          });
        }
      }
    }

    if (deliveredAnyDevice) {
      await admin
        .from("akuche_reminders")
        .update({
          status: "delivered",
          delivered_at: nowIso,
          updated_at: nowIso,
          last_error: null,
        })
        .eq("id", reminder.id);
    } else {
      const nextRetry = (reminder.retry_count || 0) + 1;
      // Exponential backoff (30m, 120m), then fall back to in-app delivered after 3rd attempt
      const backoffMs = nextRetry * nextRetry * 30 * 60 * 1000;
      await admin
        .from("akuche_reminders")
        .update({
          retry_count: nextRetry,
          status: nextRetry >= 3 ? "delivered" : "scheduled",
          scheduled_for:
            nextRetry >= 3
              ? reminder.scheduled_for
              : new Date(Date.now() + backoffMs).toISOString(),
          delivered_at: nextRetry >= 3 ? nowIso : null,
          last_error: lastErrMsg ? lastErrMsg.slice(0, 200) : `HTTP ${lastHttpStatus}`,
          updated_at: nowIso,
        })
        .eq("id", reminder.id);
    }
  }

  if (staleSubIds.length > 0) {
    await admin.from("push_subscriptions").delete().in("id", [...new Set(staleSubIds)]);
  }

  return NextResponse.json({
    processed: dueReminders.length,
    webPushSent,
    inAppDelivered,
    deferredQuietHours,
    failures,
    prunedSubscriptions: staleSubIds.length,
  });
}

/**
 * POST /api/push/send
 * Allows an authenticated user to verify real end-to-end Web Push delivery to their own device.
 */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pushConfigured = configureWebPush();
  if (!pushConfigured) {
    return NextResponse.json(
      {
        delivered: false,
        channel: "in_app",
        message:
          "Web Push VAPID keys are not configured on the server yet. In-app reminders are active and ready.",
      },
      { status: 200 }
    );
  }

  const admin = createAdminClient();
  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("id, endpoint, keys_json")
    .eq("user_id", user.id);

  if (!subs || subs.length === 0) {
    return NextResponse.json(
      {
        delivered: false,
        channel: "in_app",
        message: "No browser push subscription registered on this device yet. Enable Push Notifications first.",
      },
      { status: 200 }
    );
  }

  let sentCount = 0;
  for (const sub of subs) {
    try {
      const keys = JSON.parse(sub.keys_json);
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys },
        JSON.stringify({
          title: "Akuche Reminders Active",
          body: "Your gentle, user-controlled check-ins are connected and working on this device.",
          url: "/dashboard/goals",
          tag: "akuche-test-push",
        })
      );
      sentCount += 1;
    } catch {
      // Ignore single expired device
    }
  }

  return NextResponse.json({
    delivered: sentCount > 0,
    channel: sentCount > 0 ? "web_push" : "in_app",
    devicesReached: sentCount,
  });
}
