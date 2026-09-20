"use client";

import { useState, useEffect } from "react";
import {
  getDailyReminderConfig,
  saveDailyReminderConfig,
  DailyReminderConfig,
  getNotificationPermissionStatus,
  requestDailyReminderPermission,
  sendTestReminderNotification,
} from "@/lib/reminders/reminder-service";
import {
  Bell,
  Clock,
  Calendar,
  CheckCircle2,
  Sparkles,
  Volume2,
  Smartphone,
  AlertCircle,
} from "lucide-react";

const TIME_PRESETS = [
  { label: "7:00 AM", value: "07:00", emoji: "☀️" },
  { label: "12:00 PM", value: "12:00", emoji: "🥪" },
  { label: "6:00 PM", value: "18:00", emoji: "🌆" },
  { label: "8:00 PM", value: "20:00", emoji: "🌙" },
];

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function DailyReminderSettings() {
  const [config, setConfig] = useState<DailyReminderConfig | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>("default");
  const [testSent, setTestSent] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    setConfig(getDailyReminderConfig());
    setPermissionStatus(getNotificationPermissionStatus());
  }, []);

  if (!config) return null;

  const handleToggle = (enabled: boolean) => {
    const updated = { ...config, enabled };
    setConfig(updated);
    saveDailyReminderConfig(updated);
    if (enabled && permissionStatus !== "granted") {
      requestDailyReminderPermission().then((granted) => {
        setPermissionStatus(granted ? "granted" : "denied");
      });
    }
    showSaved();
  };

  const handleTimeChange = (time: string) => {
    const updated = { ...config, time };
    setConfig(updated);
    saveDailyReminderConfig(updated);
    showSaved();
  };

  const toggleDay = (day: string) => {
    const days = config.days.includes(day)
      ? config.days.length > 1
        ? config.days.filter((d) => d !== day)
        : config.days
      : [...config.days, day];

    const updated = { ...config, days };
    setConfig(updated);
    saveDailyReminderConfig(updated);
    showSaved();
  };

  const handleSendTest = async () => {
    const result = await sendTestReminderNotification();
    setTestSent(true);
    setPermissionStatus(result.permissionGranted ? "granted" : "denied");
    setTimeout(() => setTestSent(false), 3000);
  };

  const showSaved = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bell className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Daily Brain Training Reminder
            </h2>
            <p className="text-xs text-muted-foreground">
              Build a consistent daily mental fitness habit
            </p>
          </div>
        </div>

        {/* Master Toggle */}
        <button
          onClick={() => handleToggle(!config.enabled)}
          className={`relative h-7 w-12 rounded-full transition-colors shrink-0 ${
            config.enabled ? "bg-primary" : "bg-muted"
          }`}
          aria-label="Toggle Daily Reminders"
        >
          <span
            className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-background transition-transform shadow-sm ${
              config.enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {config.enabled && (
        <div className="space-y-4 animate-in fade-in">
          {/* Time Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Preferred Reminder Time</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TIME_PRESETS.map((preset) => {
                const isSelected = config.time === preset.value;
                return (
                  <button
                    key={preset.value}
                    onClick={() => handleTimeChange(preset.value)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 px-3 text-xs font-bold transition active:scale-95 min-h-[44px] ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background text-foreground hover:border-primary/50"
                    }`}
                  >
                    <span>{preset.emoji}</span>
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Time */}
            <div className="pt-1 flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Or custom:</span>
              <input
                type="time"
                value={config.time}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="h-10 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Days of Week */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <label className="text-xs font-bold text-foreground uppercase flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>Days of the Week</span>
            </label>

            <div className="flex flex-wrap gap-1.5">
              {ALL_DAYS.map((day) => {
                const isSelected = config.days.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border text-xs font-black transition active:scale-95 ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {day.slice(0, 1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test & Permission Status */}
          <div className="pt-2 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Notification status:</span>
              <span
                className={`font-bold capitalize px-2 py-0.5 rounded-full text-[11px] ${
                  permissionStatus === "granted"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                }`}
              >
                {permissionStatus === "granted" ? "✓ Enabled on Device" : "Permission Needed"}
              </span>
            </div>

            <button
              onClick={handleSendTest}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background hover:bg-muted px-4 py-2.5 text-xs font-bold text-foreground transition active:scale-95 min-h-[44px]"
            >
              <Smartphone className="h-4 w-4 text-primary" />
              <span>{testSent ? "Test Sent! 🔔" : "Send Test Notification"}</span>
            </button>
          </div>

          {/* Intelligent Suppression Explainer */}
          <div className="rounded-xl bg-muted/50 p-3 text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2 border-l-2 border-primary">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p>
              <strong>Intelligent Reminder:</strong> If you complete today&apos;s workout before your scheduled time ({config.time}), BrainGym will automatically skip sending the reminder so you aren&apos;t bothered!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
