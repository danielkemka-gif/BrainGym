"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GOALS, CHALLENGES, WORKOUT_TIMES } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/i18n/types";
import { Avatar } from "@/components/ui/avatar";
import { Camera, X, Globe } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { t, locale, setLocale: setI18nLocale } = useI18n();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
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
  const [localeSetting, setLocaleSetting] = useState<Locale>("en");

  const [subStatus, setSubStatus] = useState<string | null>(null);
  const [subPlan, setSubPlan] = useState<string>("free");
  const [subPeriodEnd, setSubPeriodEnd] = useState<string | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

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
          setUsername(profile.username ?? "");
          setAge(profile.age?.toString() ?? "");
          setOccupation(profile.occupation ?? "");
          setGoals(profile.goals ?? []);
          setChallenges(profile.challenges ?? []);
          setPreferredTime(profile.preferred_workout_time ?? "");
          setAvatarUrl(profile.avatar_url ?? null);
        }

        const settings = settingsRes.data;
        if (settings) {
          setNotificationsEnabled(settings.notifications_enabled ?? true);
          setReminderTime(settings.workout_reminder_time?.slice(0, 5) ?? "08:00");
          setDarkMode(settings.dark_mode ?? true);
          if (settings.locale && LOCALES.some((l) => l.id === settings.locale)) {
            setLocaleSetting(settings.locale as Locale);
          }
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
        username: username || null,
        avatar_url: avatarUrl || null,
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
        locale: localeSetting,
      });
      if (settingsErr) throw settingsErr;

      setSaved(true);
      setI18nLocale(localeSetting);
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

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const dataUrl = await compressImage(file);
      setAvatarUrl(dataUrl);
    } catch {
      alert("Could not process image. Please try another.");
    } finally {
      setUploadingAvatar(false);
    }
  }

  function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const size = 200;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("No canvas context"));
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function handleRemoveAvatar() {
    setAvatarUrl(null);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
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
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-border bg-muted transition-colors hover:border-primary/50 hover:bg-accent"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                ) : uploadingAvatar ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Camera className="h-6 w-6 text-muted-foreground" />
                )}
              </button>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div>
              <p className="text-sm font-medium">Profile picture</p>
              <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 10MB.</p>
            </div>
          </div>
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
          <div>
            <label className="mb-1.5 block text-sm font-medium">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              placeholder="yourname"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Lowercase letters, numbers, and underscores only
            </p>
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

      {/* Language */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">{t.settings_language}</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {LOCALES.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setLocaleSetting(loc.id)}
              className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                localeSetting === loc.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <span className="text-2xl">{loc.flag}</span>
              <div className="text-left">
                <p className="text-sm font-medium">{loc.nativeLabel}</p>
                <p className="text-xs text-muted-foreground">{loc.label}</p>
              </div>
            </button>
          ))}
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
            <span className="text-sm font-medium capitalize">
              {subStatus === "trialing"
                ? `Free Trial (${Math.max(0, Math.ceil((new Date(subPeriodEnd ?? 0).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days left)`
                : subStatus ?? "none"}
            </span>
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
