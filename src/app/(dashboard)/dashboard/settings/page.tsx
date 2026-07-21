"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GOALS, CHALLENGES, WORKOUT_TIMES } from "@/lib/constants";

export default function SettingsPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<string[]>([]);
  const [preferredTime, setPreferredTime] = useState("");
  const [email, setEmail] = useState("");
  const [memberSince, setMemberSince] = useState("");

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("08:00");
  const [darkMode, setDarkMode] = useState(true);

  const [subStatus, setSubStatus] = useState<string | null>(null);
  const [subPlan, setSubPlan] = useState<string>("free");
  const [subPeriodEnd, setSubPeriodEnd] = useState<string | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setEmail(user.email ?? "");
      setMemberSince(new Date(user.created_at).toLocaleDateString());

      Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("user_settings").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("subscriptions").select("status, plan_tier, current_period_end").eq("user_id", user.id).maybeSingle(),
      ]).then(([profileRes, settingsRes, subRes]) => {
        const profile = profileRes.data;
        if (profile) {
          setName(profile.name ?? "");
          setAge(profile.age?.toString() ?? "");
          setOccupation(profile.occupation ?? "");
          setGoals(profile.goals ?? []);
          setChallenges(profile.challenges ?? []);
          setPreferredTime(profile.preferred_workout_time ?? "");
        }

        const settings = settingsRes.data;
        if (settings) {
          setNotificationsEnabled(settings.notifications_enabled ?? true);
          setReminderTime(settings.workout_reminder_time?.slice(0, 5) ?? "08:00");
          setDarkMode(settings.dark_mode ?? true);
        }

        const sub = subRes.data;
        if (sub) {
          setSubStatus(sub.status);
          setSubPlan(sub.plan_tier);
          setSubPeriodEnd(sub.current_period_end);
        }
        setLoading(false);
      });
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: profileErr } = await supabase.from("profiles").upsert({
        user_id: user.id,
        name,
        age: age ? Number(age) : null,
        occupation: occupation || null,
        goals,
        challenges,
        preferred_workout_time: preferredTime || null,
      });
      if (profileErr) throw profileErr;

      const { error: settingsErr } = await supabase.from("user_settings").upsert({
        user_id: user.id,
        notifications_enabled: notificationsEnabled,
        workout_reminder_time: reminderTime,
        dark_mode: darkMode,
      });
      if (settingsErr) throw settingsErr;

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  function toggleGoal(value: string) {
    setGoals((prev) =>
      prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value].slice(0, 5)
    );
  }

  function toggleChallenge(value: string) {
    setChallenges((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value].slice(0, 5)
    );
  }

  async function handleManageSubscription() {
    setLoadingPortal(true);
    try {
      const res = await fetch("/api/paystack/manage-subscription", { method: "POST" });
      if (res.ok) {
        window.location.reload();
      }
    } catch { /* */ }
    setLoadingPortal(false);
  }

  async function handleUpgrade() {
    setLoadingPortal(true);
    try {
      const res = await fetch("/api/paystack/initialize", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { /* */ }
    setLoadingPortal(false);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile and preferences</p>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Profile Section */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-5 text-lg font-semibold">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              value={email}
              disabled
              className="h-10 w-full rounded-lg border border-border bg-muted/50 px-3 text-sm text-muted-foreground"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Age</label>
              <input
                type="number"
                min={13}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Occupation</label>
              <input
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Goals & Challenges */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-1 text-lg font-semibold">Goals & Challenges</h2>
        <p className="mb-4 text-xs text-muted-foreground">Pick up to 5 of each</p>

        <div className="mb-5">
          <p className="mb-2 text-sm font-medium">What do you want to improve?</p>
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <button
                key={g.value}
                onClick={() => toggleGoal(g.value)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  goals.includes(g.value)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">What challenges do you face?</p>
          <div className="flex flex-wrap gap-2">
            {CHALLENGES.map((c) => (
              <button
                key={c.value}
                onClick={() => toggleChallenge(c.value)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  challenges.includes(c.value)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-medium">Preferred workout time</label>
          <select
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Any time</option>
            {WORKOUT_TIMES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-5 text-lg font-semibold">Notifications</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Daily workout reminder</p>
              <p className="text-xs text-muted-foreground">Get reminded to complete your daily workout</p>
            </div>
            <button
              onClick={() => setNotificationsEnabled((p) => !p)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                notificationsEnabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background transition-transform ${
                  notificationsEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </label>

          {notificationsEnabled && (
            <div>
              <label className="mb-1.5 block text-sm font-medium">Reminder time</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
        </div>
      </section>

      {/* Subscription */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-5 text-lg font-semibold">Subscription</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
            <span className="text-sm">Plan</span>
            <span className="text-sm font-medium capitalize">{subPlan}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
            <span className="text-sm">Status</span>
            <span className="text-sm font-medium capitalize">{subStatus ?? "none"}</span>
          </div>
          {subPeriodEnd && (
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
              <span className="text-sm">Current period ends</span>
              <span className="text-sm text-muted-foreground">
                {new Date(subPeriodEnd).toLocaleDateString()}
              </span>
            </div>
          )}
          <div className="pt-2">
            {subStatus === "active" || subStatus === "trialing" ? (
              <button
                onClick={handleManageSubscription}
                disabled={loadingPortal}
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm hover:bg-muted/50 disabled:opacity-50"
              >
                {loadingPortal ? "Loading..." : "Manage subscription"}
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loadingPortal}
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {loadingPortal ? "Redirecting..." : "Upgrade to Premium — ₦3,500/month"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Account */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-5 text-lg font-semibold">Account</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
            <span className="text-sm">Member since</span>
            <span className="text-sm text-muted-foreground">{memberSince}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full rounded-lg border border-destructive/30 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10"
          >
            Sign out
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between pb-8">
        <p className="text-xs text-muted-foreground">
          {saved && "Settings saved!"}
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {saving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Saving...
            </>
          ) : (
            "Save settings"
          )}
        </button>
      </div>
    </div>
  );
}
