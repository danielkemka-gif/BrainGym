"use client";

import { useState } from "react";
import {
  saveDailyReminderConfig,
  getDailyReminderConfig,
  requestDailyReminderPermission,
  DailyReminderConfig,
} from "@/lib/reminders/reminder-service";
import { Bell, Sparkles, X, Clock, CheckCircle2 } from "lucide-react";

interface HabitReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIME_OPTIONS = [
  { label: "☀️ Morning (7:00 AM)", value: "07:00" },
  { label: "🥪 Lunch Break (12:00 PM)", value: "12:00" },
  { label: "🌆 Evening (6:00 PM)", value: "18:00" },
  { label: "🌙 Night Routine (8:00 PM)", value: "20:00" },
];

export function HabitReminderModal({ isOpen, onClose }: HabitReminderModalProps) {
  const [selectedTime, setSelectedTime] = useState("20:00");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSaveReminder = async () => {
    setSaving(true);
    const current = getDailyReminderConfig();
    const updated: DailyReminderConfig = {
      ...current,
      enabled: true,
      time: selectedTime,
    };
    saveDailyReminderConfig(updated);
    await requestDailyReminderPermission();
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary text-xl shadow-sm">
            🔔
          </span>
          <div>
            <span className="text-[10px] font-black uppercase text-primary tracking-widest">
              BUILD YOUR HABIT
            </span>
            <h2 className="text-lg sm:text-xl font-black text-foreground">
              Daily Training Reminder
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Consistent 5-minute daily practice is what builds sharp, adaptable thinking. Choose what time you&apos;d like BrainGym to remind you:
        </p>

        <div className="space-y-2">
          {TIME_OPTIONS.map((opt) => {
            const isSelected = selectedTime === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSelectedTime(opt.value)}
                className={`w-full text-left rounded-xl border p-3 text-xs font-bold transition active:scale-95 flex items-center justify-between min-h-[44px] ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-background text-foreground hover:border-primary/40"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={handleSaveReminder}
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3 px-4 text-xs font-black shadow-lg shadow-primary/25 hover:bg-primary/90 transition active:scale-95 min-h-[48px]"
          >
            <span>{saving ? "Setting..." : "SET MY REMINDER ➔"}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full text-center py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
