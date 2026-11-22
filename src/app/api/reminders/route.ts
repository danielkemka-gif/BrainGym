import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_CATEGORIES = new Set([
  "assignment",
  "goal",
  "commitment",
  "mental_fitness",
  "reflection",
  "follow_up",
  "check_in",
]);

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [remindersRes, settingsRes, pushRes] = await Promise.allSettled([
    supabase
      .from("akuche_reminders")
      .select("*")
      .eq("user_id", user.id)
      .in("status", ["scheduled", "delivered", "snoozed"])
      .order("scheduled_for", { ascending: true })
      .limit(40),
    supabase
      .from("user_settings")
      .select(
        "notifications_enabled, workout_reminder_time, timezone, quiet_hours_start, quiet_hours_end, reminder_frequency, reminder_channels, reminder_categories, coaching_style, time_budget_mins"
      )
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("push_subscriptions")
      .select("id, endpoint, created_at")
      .eq("user_id", user.id),
  ]);

  const reminders =
    remindersRes.status === "fulfilled" && Array.isArray(remindersRes.value.data)
      ? remindersRes.value.data
      : [];
  const settings =
    settingsRes.status === "fulfilled" ? settingsRes.value.data : null;
  const pushDevicesCount =
    pushRes.status === "fulfilled" && Array.isArray(pushRes.value.data)
      ? pushRes.value.data.length
      : 0;

  return NextResponse.json({
    reminders,
    preferences: settings || {
      notifications_enabled: true,
      workout_reminder_time: "08:00:00",
      timezone: "Africa/Lagos",
      quiet_hours_start: "22:00:00",
      quiet_hours_end: "07:00:00",
      reminder_frequency: "daily",
      reminder_channels: { in_app: true, web_push: true },
      reminder_categories: {
        assignments: true,
        goals: true,
        mental_fitness: true,
        reflections: true,
        check_ins: true,
      },
      coaching_style: "balanced",
      time_budget_mins: 15,
    },
    pushDevicesCount,
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // Save reminder preferences if payload specifies type === "preferences"
  if (body?.type === "preferences") {
    const updates: Record<string, unknown> = {
      user_id: user.id,
      updated_at: new Date().toISOString(),
    };
    if (typeof body.notifications_enabled === "boolean") {
      updates.notifications_enabled = body.notifications_enabled;
    }
    if (typeof body.workout_reminder_time === "string") {
      updates.workout_reminder_time = body.workout_reminder_time;
    }
    if (typeof body.timezone === "string" && body.timezone.trim()) {
      updates.timezone = body.timezone.trim().slice(0, 64);
    }
    if (typeof body.quiet_hours_start === "string") {
      updates.quiet_hours_start = body.quiet_hours_start;
    }
    if (typeof body.quiet_hours_end === "string") {
      updates.quiet_hours_end = body.quiet_hours_end;
    }
    if (
      ["daily", "weekdays", "three_per_week", "weekly", "off"].includes(
        body.reminder_frequency
      )
    ) {
      updates.reminder_frequency = body.reminder_frequency;
    }
    if (body.reminder_channels && typeof body.reminder_channels === "object") {
      updates.reminder_channels = body.reminder_channels;
    }
    if (body.reminder_categories && typeof body.reminder_categories === "object") {
      updates.reminder_categories = body.reminder_categories;
    }
    if (
      ["direct", "balanced", "gentle", "deep_analytical"].includes(body.coaching_style)
    ) {
      updates.coaching_style = body.coaching_style;
    }
    if (typeof body.time_budget_mins === "number") {
      updates.time_budget_mins = Math.max(5, Math.min(180, Math.round(body.time_budget_mins)));
    }

    const { error } = await supabase
      .from("user_settings")
      .upsert(updates, { onConflict: "user_id" });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ saved: true });
  }

  // Otherwise schedule a specific user reminder
  const title = typeof body?.title === "string" ? body.title.trim().slice(0, 140) : "";
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, 400) : "";
  if (!title || !message) {
    return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
  }

  const category = VALID_CATEGORIES.has(body?.category) ? body.category : "follow_up";
  const scheduledFor =
    typeof body?.scheduled_for === "string" && body.scheduled_for
      ? body.scheduled_for
      : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("akuche_reminders")
    .insert({
      user_id: user.id,
      category,
      title,
      message,
      action_url: typeof body?.action_url === "string" ? body.action_url : "/dashboard",
      context_id: typeof body?.context_id === "string" ? body.context_id : null,
      scheduled_for: scheduledFor,
      timezone: typeof body?.timezone === "string" ? body.timezone : "Africa/Lagos",
      channel:
        body?.channel === "in_app" || body?.channel === "web_push" ? body.channel : "both",
      status: "scheduled",
      dedupe_key: body?.dedupe_key || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reminder: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const id = typeof body?.id === "string" ? body.id : "";
  const action = typeof body?.action === "string" ? body.action : "read";

  if (!id) return NextResponse.json({ error: "Reminder id is required" }, { status: 400 });

  const nowIso = new Date().toISOString();
  const updates: Record<string, unknown> = { updated_at: nowIso };

  if (action === "snooze") {
    const hours = Math.max(1, Math.min(168, Number(body?.hours) || 4));
    const nextTime = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
    updates.status = "snoozed";
    updates.snoozed_until = nextTime;
    updates.scheduled_for = nextTime;
  } else if (action === "reschedule" && typeof body?.scheduled_for === "string") {
    updates.status = "scheduled";
    updates.scheduled_for = body.scheduled_for;
  } else if (action === "dismiss") {
    updates.status = "dismissed";
  } else {
    updates.status = "read";
    updates.read_at = nowIso;
  }

  const { data, error } = await supabase
    .from("akuche_reminders")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reminder: data });
}
