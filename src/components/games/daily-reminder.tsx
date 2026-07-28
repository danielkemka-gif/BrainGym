"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Clock, Check } from "lucide-react";

const STORAGE_KEY = "braingym_daily_reminder";

interface ReminderSettings {
  enabled: boolean;
  hour: number;
  minute: number;
  days: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
}

function getStoredSettings(): ReminderSettings {
  if (typeof window === "undefined") return { enabled: false, hour: 8, minute: 0, days: [1, 2, 3, 4, 5] };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { enabled: false, hour: 8, minute: 0, days: [1, 2, 3, 4, 5] };
}

function saveSettings(settings: ReminderSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function DailyReminder() {
  const [settings, setSettings] = useState<ReminderSettings>(getStoredSettings);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  async function requestPermission() {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }

  function toggleDay(day: number) {
    setSettings(prev => {
      const newDays = prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day].sort();
      const updated = { ...prev, days: newDays };
      saveSettings(updated);
      return updated;
    });
  }

  function toggleEnabled() {
    setSettings(prev => {
      const updated = { ...prev, enabled: !prev.enabled };
      if (updated.enabled && permission !== "granted") {
        requestPermission();
      }
      saveSettings(updated);
      return updated;
    });
  }

  function setTime(hour: number, minute: number) {
    setSettings(prev => {
      const updated = { ...prev, hour, minute };
      saveSettings(updated);
      return updated;
    });
  }

  function sendTestNotification() {
    if (permission !== "granted") {
      requestPermission();
      return;
    }
    new Notification("BrainGym 🧠", {
      body: "Time to train your brain! Quick-Fire quiz is waiting.",
      icon: "/logo.png",
      badge: "/logo.png",
      tag: "braingym-test",
    });
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  }

  const timeStr = `${settings.hour.toString().padStart(2, "0")}:${settings.minute.toString().padStart(2, "0")}`;

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {settings.enabled ? (
            <Bell className="h-4 w-4 text-primary" />
          ) : (
            <BellOff className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm font-semibold">Daily Reminder</span>
        </div>
        <button
          onClick={toggleEnabled}
          className={`relative h-7 w-12 rounded-full transition-colors ${
            settings.enabled ? "bg-primary" : "bg-muted"
          }`}
        >
          <div className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
            settings.enabled ? "left-[24px]" : "left-1"
          }`} />
        </button>
      </div>

      {settings.enabled && (
        <div className="space-y-3">
          {/* Time picker */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Remind me at</span>
            <select
              value={settings.hour}
              onChange={e => setTime(parseInt(e.target.value), settings.minute)}
              className="rounded-lg border border-border bg-background px-2 py-1 text-sm"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i.toString().padStart(2, "0")}</option>
              ))}
            </select>
            <span className="text-sm font-bold">:</span>
            <select
              value={settings.minute}
              onChange={e => setTime(settings.hour, parseInt(e.target.value))}
              className="rounded-lg border border-border bg-background px-2 py-1 text-sm"
            >
              {[0, 15, 30, 45].map(m => (
                <option key={m} value={m}>{m.toString().padStart(2, "0")}</option>
              ))}
            </select>
          </div>

          {/* Days */}
          <div className="flex gap-1">
            {DAY_LABELS.map((label, i) => (
              <button
                key={i}
                onClick={() => toggleDay(i)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-[10px] font-bold transition-all ${
                  settings.days.includes(i)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Test notification */}
          <button
            onClick={sendTestNotification}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            {testSent ? (
              <><Check className="h-3 w-3 text-green-500" /> Sent!</>
            ) : (
              <>🔔 Send test notification</>
            )}
          </button>
        </div>
      )}

      {settings.enabled && permission !== "granted" && (
        <p className="mt-2 text-xs text-amber-500">
          Allow notifications in your browser to receive daily reminders.
        </p>
      )}
    </div>
  );
}

// Check if it's time to show a reminder (call on page load / interval)
export function checkAndShowReminder() {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const settings = getStoredSettings();
  if (!settings.enabled) return;

  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  if (!settings.days.includes(currentDay)) return;

  // Show if within 5 minutes of the reminder time
  const reminderMinutes = settings.hour * 60 + settings.minute;
  const currentMinutes = currentHour * 60 + currentMinute;
  const diff = Math.abs(currentMinutes - reminderMinutes);

  if (diff <= 5) {
    const lastShownKey = `braingym_reminder_shown_${settings.hour}_${settings.minute}`;
    const lastShown = sessionStorage.getItem(lastShownKey);
    if (lastShown) return;

    new Notification("BrainGym 🧠 Time to Train!", {
      body: "Your daily brain workout is ready. Quick-Fire quiz takes just 60 seconds!",
      icon: "/logo.png",
      badge: "/logo.png",
      tag: "braingym-daily",
      requireInteraction: false,
    });
    sessionStorage.setItem(lastShownKey, "true");
  }
}
