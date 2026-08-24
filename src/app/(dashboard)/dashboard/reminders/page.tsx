"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getSavedReminderSchedule,
  saveReminderSchedule,
  downloadCalendarReminderFile,
  ReminderSchedule,
} from "@/lib/physical-activities";
import {
  Bell,
  AlarmClock,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
  Smartphone,
  ShieldCheck,
  Zap,
} from "lucide-react";

const DAYS = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 },
];

const PRESET_TIMES = ["06:30", "07:00", "08:00", "12:30", "18:00", "20:00"];

export default function SmartRemindersPage() {
  const [schedule, setSchedule] = useState<ReminderSchedule>(getSavedReminderSchedule());
  const [permissionStatus, setPermissionStatus] = useState<string>("default");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const handleRequestPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const result = await Notification.requestPermission();
      setPermissionStatus(result);
      if (result === "granted") {
        new Notification("BrainGym Smart Reminders Active 🧠", {
          body: "You will receive daily reminders to keep your brain training streak alive!",
          icon: "/logo.png",
        });
      }
    }
  };

  const handleToggleDay = (dayVal: number) => {
    const exists = schedule.days.includes(dayVal);
    let newDays: number[];
    if (exists) {
      newDays = schedule.days.filter((d) => d !== dayVal);
    } else {
      newDays = [...schedule.days, dayVal];
    }
    const updated = { ...schedule, days: newDays, frequency: "custom" as const };
    setSchedule(updated);
    saveReminderSchedule(updated);
  };

  const handleSetFrequency = (freq: "everyday" | "weekdays" | "weekends") => {
    let days: number[] = [];
    if (freq === "everyday") days = [0, 1, 2, 3, 4, 5, 6];
    else if (freq === "weekdays") days = [1, 2, 3, 4, 5];
    else if (freq === "weekends") days = [6, 0];

    const updated = { ...schedule, frequency: freq, days };
    setSchedule(updated);
    saveReminderSchedule(updated);
  };

  const handleTimeChange = (time: string) => {
    const updated = { ...schedule, time };
    setSchedule(updated);
    saveReminderSchedule(updated);
  };

  const handleSave = () => {
    saveReminderSchedule(schedule);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-3 sm:px-4 py-3 pb-20 overflow-x-hidden touch-manipulation">
      {/* Top Breadcrumb */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground min-h-[36px]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      {/* Header Banner */}
      <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-violet-600/10 p-5 sm:p-7 space-y-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-violet-600 text-white shadow-lg shadow-primary/25">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-primary">
              Daily Habit Anchor
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">
              SMART BRAIN REMINDERS
            </h1>
            <p className="text-xs text-muted-foreground">
              Anchor your daily mental fitness routine so you never miss a day.
            </p>
          </div>
        </div>
      </div>

      {/* Notification Permission Card */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Smartphone className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-sm sm:text-base font-black text-foreground">
                Phone &amp; Browser Notifications
              </h3>
              <p className="text-xs text-muted-foreground">
                {permissionStatus === "granted"
                  ? "✓ Push notifications are currently enabled."
                  : "Allow BrainGym to deliver gentle morning workout prompts."}
              </p>
            </div>
          </div>

          {permissionStatus !== "granted" ? (
            <button
              onClick={handleRequestPermission}
              className="shrink-0 rounded-xl bg-primary px-4 py-2 text-xs font-black text-white shadow-md shadow-primary/25 hover:brightness-110 active:scale-95 transition min-h-[38px]"
            >
              Enable Notifications
            </button>
          ) : (
            <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Active</span>
            </span>
          )}
        </div>
      </div>

      {/* Frequency & Days Selector */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-black text-foreground uppercase tracking-wider flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Choose Your Brain Training Days</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Select the days you want BrainGym to prompt your morning session.
          </p>
        </div>

        {/* Preset Pills */}
        <div className="flex gap-2">
          {(["everyday", "weekdays", "weekends"] as const).map((freq) => (
            <button
              key={freq}
              onClick={() => handleSetFrequency(freq)}
              className={`flex-1 rounded-xl py-2 text-xs font-bold capitalize transition min-h-[38px] ${
                schedule.frequency === freq
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-muted hover:bg-accent text-muted-foreground"
              }`}
            >
              {freq}
            </button>
          ))}
        </div>

        {/* Day of Week Buttons */}
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {DAYS.map((d) => {
            const isSelected = schedule.days.includes(d.value);
            return (
              <button
                key={d.label}
                onClick={() => handleToggleDay(d.value)}
                className={`flex flex-col items-center justify-center rounded-2xl py-3 text-xs font-black transition active:scale-95 min-h-[48px] ${
                  isSelected
                    ? "bg-gradient-to-b from-primary to-violet-600 text-white shadow-sm shadow-primary/20"
                    : "bg-muted/50 text-muted-foreground border border-border/80 hover:bg-muted"
                }`}
              >
                <span>{d.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Picker */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-black text-foreground uppercase tracking-wider flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>Choose Your Preferred Time</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Select an optimal morning or afternoon anchor time.
          </p>
        </div>

        {/* Preset Time Badges */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {PRESET_TIMES.map((t) => (
            <button
              key={t}
              onClick={() => handleTimeChange(t)}
              className={`rounded-2xl py-2.5 text-xs font-black transition min-h-[42px] ${
                schedule.time === t
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-muted/60 hover:bg-muted text-foreground border border-border"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Custom Time Input */}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-xs font-bold text-muted-foreground">Custom Time:</span>
          <input
            type="time"
            value={schedule.time}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Smart Alarm & Calendar Sync */}
      <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
            <AlarmClock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-foreground">
              Add to Smartphone Calendar / Native Alarm
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sync your chosen daily reminder directly with Apple Calendar, Google Calendar, or Outlook for guaranteed device-level sound alarms.
            </p>
          </div>
        </div>

        <button
          onClick={() => downloadCalendarReminderFile(schedule)}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3.5 text-xs font-black shadow-md shadow-amber-500/25 transition active:scale-95 min-h-[48px] touch-manipulation"
        >
          <Calendar className="h-4 w-4" />
          <span>Sync with Phone Calendar (.ics)</span>
        </button>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button
          onClick={handleSave}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 text-white px-6 py-4 text-sm sm:text-base font-black shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition min-h-[52px] touch-manipulation"
        >
          <CheckCircle2 className="h-5 w-5" />
          <span>{savedSuccess ? "Preferences Saved Successfully ✓" : "SAVE REMINDER PREFERENCES"}</span>
        </button>
      </div>
    </div>
  );
}
