import { ReminderSchedule } from "./types";

const REMINDER_STORAGE_KEY = "braingym_reminder_schedule";

export const DEFAULT_REMINDER_SCHEDULE: ReminderSchedule = {
  enabled: true,
  frequency: "everyday",
  days: [0, 1, 2, 3, 4, 5, 6], // All days
  time: "06:30",
  message: "Good morning! Your brain needs training too. Ready for today's workout?",
  alarmEnabled: true,
};

export function getSavedReminderSchedule(): ReminderSchedule {
  if (typeof window === "undefined") return DEFAULT_REMINDER_SCHEDULE;
  try {
    const raw = localStorage.getItem(REMINDER_STORAGE_KEY);
    if (!raw) return DEFAULT_REMINDER_SCHEDULE;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_REMINDER_SCHEDULE;
  }
}

export function saveReminderSchedule(schedule: ReminderSchedule): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(schedule));
  } catch (err) {
    console.warn("Failed to persist reminder schedule:", err);
  }
}

// Generate an .ics calendar file for iOS / Android calendar integration
export function generateBrainGymCalendarICS(schedule: ReminderSchedule): string {
  const [hours, minutes] = schedule.time.split(":");
  const now = new Date();
  const startStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}T${hours}${minutes}00`;

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BrainGym//Brain Habit Alarm//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:🧠 BrainGym Daily Mental Workout
DESCRIPTION:${schedule.message}\\nOpen BrainGym: https://braingym-live.vercel.app/dashboard
STATUS:CONFIRMED
RRULE:FREQ=DAILY;INTERVAL=1
BEGIN:VALARM
TRIGGER:-PT0M
ACTION:DISPLAY
DESCRIPTION:Time to train your brain!
END:VALARM
END:VEVENT
END:VCALENDAR`;
}

export function downloadCalendarReminderFile(schedule: ReminderSchedule) {
  if (typeof window === "undefined") return;
  const icsContent = generateBrainGymCalendarICS(schedule);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "braingym-daily-reminder.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
