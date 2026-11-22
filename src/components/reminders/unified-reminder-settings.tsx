"use client";

import React, { useEffect, useState } from "react";
import { Bell, CheckCircle2, Clock, Moon, Send, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { subscribeToPush, unsubscribeFromPush, getPushEnabled, isPushSupported } from "@/lib/push";

interface ReminderPrefs {
  notifications_enabled: boolean;
  workout_reminder_time: string;
  timezone: string;
  quiet_hours_start: string;
  quiet_hours_end: string;
  reminder_frequency: "daily" | "weekdays" | "three_per_week" | "weekly" | "off";
  reminder_channels: { in_app: boolean; web_push: boolean };
  reminder_categories: {
    assignments: boolean;
    goals: boolean;
    mental_fitness: boolean;
    reflections: boolean;
    check_ins: boolean;
  };
  coaching_style: "direct" | "balanced" | "gentle" | "deep_analytical";
  time_budget_mins: number;
}

const DEFAULT_PREFS: ReminderPrefs = {
  notifications_enabled: true,
  workout_reminder_time: "08:00",
  timezone: "Africa/Lagos",
  quiet_hours_start: "22:00",
  quiet_hours_end: "07:00",
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
};

export function UnifiedReminderSettings() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<ReminderPrefs>(DEFAULT_PREFS);
  const [pushDevices, setPushDevices] = useState(0);
  const [pushStatus, setPushStatus] = useState<string>("checking");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const detectedTz =
      typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "Africa/Lagos";

    fetch("/api/reminders")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.preferences) {
          const p = data.preferences;
          setPrefs({
            notifications_enabled: p.notifications_enabled ?? true,
            workout_reminder_time: String(p.workout_reminder_time || "08:00").slice(0, 5),
            timezone: p.timezone || detectedTz,
            quiet_hours_start: String(p.quiet_hours_start || "22:00").slice(0, 5),
            quiet_hours_end: String(p.quiet_hours_end || "07:00").slice(0, 5),
            reminder_frequency: p.reminder_frequency || "daily",
            reminder_channels: p.reminder_channels || { in_app: true, web_push: true },
            reminder_categories: p.reminder_categories || DEFAULT_PREFS.reminder_categories,
            coaching_style: p.coaching_style || "balanced",
            time_budget_mins: p.time_budget_mins || 15,
          });
        }
        if (typeof data?.pushDevicesCount === "number") {
          setPushDevices(data.pushDevicesCount);
        }
      })
      .catch(() => {});

    if (!isPushSupported()) {
      setPushStatus("unsupported");
    } else if (user?.id) {
      getPushEnabled(user.id)
        .then((enabled) => setPushStatus(enabled ? "subscribed" : "prompt"))
        .catch(() => setPushStatus("prompt"));
    }
  }, [user?.id]);

  async function handleSave() {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "preferences", ...prefs }),
      });
      if (res.ok) {
        setFeedback("Reminder & coaching preferences saved and synced.");
      } else {
        setFeedback("Could not save preferences right now.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleWebPush() {
    if (!user?.id) return;
    setFeedback(null);
    if (pushStatus === "subscribed") {
      await unsubscribeFromPush(user.id);
      setPushStatus("prompt");
      setPushDevices((c) => Math.max(0, c - 1));
      setFeedback("Background push notifications disabled on this device. In-app reminders remain available.");
    } else {
      const ok = await subscribeToPush(user.id);
      if (ok) {
        setPushStatus("subscribed");
        setPushDevices((c) => c + 1);
        setFeedback("Background push notifications enabled! Works even when the browser tab is closed.");
      } else {
        setFeedback(
          "Browser push permission was not granted or VAPID keys are not set—Akuche will deliver your reminders cleanly in-app."
        );
      }
    }
  }

  async function handleTestPush() {
    setTesting(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/push/send", { method: "POST" });
      const data = await res.json();
      if (data.delivered) {
        setFeedback(`Test notification delivered to ${data.devicesReached} device(s).`);
      } else {
        setFeedback(data.message || "In-app reminders are active; enable Push above to test background push.");
      }
    } catch {
      setFeedback("Could not reach reminder delivery endpoint.");
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Bell className="h-4 w-4 text-emerald-600" />
            Proactive Check-Ins & Reminder Controls
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Human, contextual follow-ups on your terms—never spammy, never guilt-driven.
          </p>
        </div>
        <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={prefs.notifications_enabled}
            onChange={(e) =>
              setPrefs((p) => ({ ...p, notifications_enabled: e.target.checked }))
            }
            className="h-4 w-4 accent-emerald-600"
          />
          Active
        </label>
      </div>

      {/* Time, Frequency & Quiet Hours */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="space-y-1 text-xs">
          <span className="font-semibold text-foreground flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-emerald-600" /> Preferred Check-In Time
          </span>
          <input
            type="time"
            value={prefs.workout_reminder_time}
            onChange={(e) => setPrefs((p) => ({ ...p, workout_reminder_time: e.target.value }))}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        </label>

        <label className="space-y-1 text-xs">
          <span className="font-semibold text-foreground">Frequency</span>
          <select
            value={prefs.reminder_frequency}
            onChange={(e) =>
              setPrefs((p) => ({
                ...p,
                reminder_frequency: e.target.value as ReminderPrefs["reminder_frequency"],
              }))
            }
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="daily">Daily gentle check-in</option>
            <option value="weekdays">Weekdays only</option>
            <option value="three_per_week">3 times a week</option>
            <option value="weekly">Weekly reflection only</option>
            <option value="off">Paused</option>
          </select>
        </label>

        <label className="space-y-1 text-xs">
          <span className="font-semibold text-foreground flex items-center gap-1">
            <Moon className="h-3.5 w-3.5 text-emerald-600" /> Quiet Hours Start
          </span>
          <input
            type="time"
            value={prefs.quiet_hours_start}
            onChange={(e) => setPrefs((p) => ({ ...p, quiet_hours_start: e.target.value }))}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        </label>

        <label className="space-y-1 text-xs">
          <span className="font-semibold text-foreground">Quiet Hours End</span>
          <input
            type="time"
            value={prefs.quiet_hours_end}
            onChange={(e) => setPrefs((p) => ({ ...p, quiet_hours_end: e.target.value }))}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        </label>
      </div>

      {/* Coaching Style & Timezone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="space-y-1 text-xs">
          <span className="font-semibold text-foreground">Preferred Coaching Style</span>
          <select
            value={prefs.coaching_style}
            onChange={(e) =>
              setPrefs((p) => ({
                ...p,
                coaching_style: e.target.value as ReminderPrefs["coaching_style"],
              }))
            }
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="balanced">Balanced & Practical</option>
            <option value="direct">Direct & Concise</option>
            <option value="gentle">Calm & Gentle Pacing</option>
            <option value="deep_analytical">Deep Analytical</option>
          </select>
        </label>

        <label className="space-y-1 text-xs">
          <span className="font-semibold text-foreground">Your Timezone</span>
          <input
            type="text"
            value={prefs.timezone}
            onChange={(e) => setPrefs((p) => ({ ...p, timezone: e.target.value }))}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        </label>
      </div>

      {/* Category Toggles */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground">Remind me about:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(
            [
              ["assignments", "Assignments"],
              ["goals", "Goals"],
              ["mental_fitness", "Mental Fitness"],
              ["reflections", "Weekly Reflections"],
              ["check_ins", "Coaching Check-ins"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs cursor-pointer hover:bg-muted/40"
            >
              <input
                type="checkbox"
                checked={prefs.reminder_categories[key]}
                onChange={(e) =>
                  setPrefs((p) => ({
                    ...p,
                    reminder_categories: {
                      ...p.reminder_categories,
                      [key]: e.target.checked,
                    },
                  }))
                }
                className="accent-emerald-600"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Background Web Push Status */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Background Push Delivery ({pushDevices} device{pushDevices === 1 ? "" : "s"} linked)
          </p>
          <p className="text-[11px] text-muted-foreground">
            Works via Service Worker even when Akuche is closed. In-app reminders are always active as fallback.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleToggleWebPush}
            className="rounded-xl border border-emerald-600 bg-background px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10"
          >
            {pushStatus === "subscribed" ? "Disable Push on Device" : "Enable Push on Device"}
          </button>
          <button
            type="button"
            disabled={testing}
            onClick={handleTestPush}
            className="inline-flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2 text-xs font-semibold hover:bg-muted/80 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            {testing ? "Testing..." : "Test Push"}
          </button>
        </div>
      </div>

      {feedback && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {feedback}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Reminder Preferences"}
        </button>
      </div>
    </div>
  );
}
