"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { BellRing, BellOff, Loader2 } from "lucide-react";
import {
  isPushSupported,
  subscribeToPush,
  unsubscribeFromPush,
  getPushEnabled,
} from "@/lib/push";

export function PushNotificationCard() {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [supported, setSupported] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSupported(isPushSupported());
    if (!user) return;
    getPushEnabled(user.id).then(setEnabled).catch(() => setEnabled(false));
  }, [user]);

  if (!supported) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <BellRing className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Phone Reminders</h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Your browser doesn&apos;t support web push notifications. Open BrainGym in
          a modern browser (Chrome, Safari, or Edge) to enable phone reminders.
        </p>
      </div>
    );
  }

  async function toggle() {
    if (!user || busy) return;
    setBusy(true);
    setError(null);
    try {
      const next = !enabled;
      if (next) {
        const ok = await subscribeToPush(user.id);
        if (!ok) {
          setError("Permission denied — allow notifications in your browser settings.");
          return;
        }
      } else {
        await unsubscribeFromPush(user.id);
      }
      setEnabled(next);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {enabled ? (
            <BellRing className="h-4 w-4 text-emerald-500" />
          ) : (
            <BellOff className="h-4 w-4 text-muted-foreground" />
          )}
          <div>
            <h3 className="text-sm font-semibold">Phone Reminders</h3>
            <p className="text-xs text-muted-foreground">
              Get notified on your phone when it&apos;s time to train — install the app
              from your browser menu for the best experience.
            </p>
          </div>
        </div>
        <button
          onClick={toggle}
          disabled={busy}
          aria-pressed={enabled}
          className={`flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold ${
            enabled
              ? "bg-muted text-foreground hover:bg-accent"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          } disabled:opacity-60`}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {enabled ? "Disable" : "Enable"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
