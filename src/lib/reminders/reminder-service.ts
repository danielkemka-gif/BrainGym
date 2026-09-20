/**
 * BRAINGYM INTELLIGENT DAILY REMINDER & HABIT ENGINE
 * 
 * 3-Layer System:
 * 1. In-App Reminder Configuration & Preferences
 * 2. Web Push / PWA Native Device Notification Scheduling
 * 3. Intelligent Suppression: If user completes today's workout before reminder time,
 *    do NOT send the reminder. Avoid spam; keep user in control.
 */

export interface DailyReminderConfig {
  enabled: boolean;
  time: string; // "07:00", "12:00", "18:00", "20:00"
  secondReminderEnabled: boolean;
  secondReminderTime?: string;
  days: string[]; // ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  sound: boolean;
  vibrate: boolean;
  lastCompletedDate?: string;
}

const STORAGE_KEY_REMINDER = "braingym_daily_reminder_config_v2";

export const DEFAULT_REMINDER_CONFIG: DailyReminderConfig = {
  enabled: true,
  time: "20:00", // 8:00 PM default habit window
  secondReminderEnabled: false,
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  sound: true,
  vibrate: true,
};

const MOTIVATIONAL_NOTIFICATION_MESSAGES = [
  {
    title: "🧠 BrainGym Mental Fitness",
    body: "Your 5-minute brain workout is waiting. Take a moment for yourself today! 🔥",
  },
  {
    title: "🔥 Keep Your Streak Alive",
    body: "5 minutes of mental practice today keeps your brain-training habit strong.",
  },
  {
    title: "⚡ Ready for Today's Mental Workout?",
    body: "Sharpen your decision-making and focus with today's real-life challenge.",
  },
  {
    title: "🎯 Train Your Mind for Real Life",
    body: "A fresh cognitive scenario is ready for you on BrainGym.",
  },
];

/**
 * Get active daily reminder configuration
 */
export function getDailyReminderConfig(): DailyReminderConfig {
  if (typeof window === "undefined") return DEFAULT_REMINDER_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REMINDER);
    if (raw) return { ...DEFAULT_REMINDER_CONFIG, ...JSON.parse(raw) };
  } catch (err) {
    console.warn("Could not read reminder config", err);
  }
  return DEFAULT_REMINDER_CONFIG;
}

/**
 * Save daily reminder configuration
 */
export function saveDailyReminderConfig(config: DailyReminderConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_REMINDER, JSON.stringify(config));
  } catch (err) {
    console.warn("Could not save reminder config", err);
  }
}

/**
 * Check device notification permission status
 */
export function getNotificationPermissionStatus(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

/**
 * Request notification permission from the browser/OS
 */
export async function requestDailyReminderPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }
  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (err) {
    console.warn("Permission request error:", err);
    return false;
  }
}

/**
 * Play a pleasant acoustic chime via Web Audio API (gentle & respectful)
 */
export function playGentleReminderChime(): void {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const notes = [
      { freq: 587.33, time: 0.0, duration: 0.3 }, // D5
      { freq: 739.99, time: 0.2, duration: 0.35 }, // F#5
      { freq: 880.0, time: 0.4, duration: 0.5 },  // A5
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

      gain.gain.setValueAtTime(0.01, ctx.currentTime + note.time);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + note.time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + note.time);
      osc.stop(ctx.currentTime + note.time + note.duration);
    });
  } catch {
    // audio fallback
  }
}

/**
 * Vibrate smartphone if supported
 */
export function triggerReminderVibration(): void {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate([200, 100, 200]);
    } catch {
      // ignore
    }
  }
}

/**
 * Send an immediate test reminder notification to verify device support
 */
export async function sendTestReminderNotification(): Promise<{
  success: boolean;
  permissionGranted: boolean;
}> {
  let permissionGranted = false;

  playGentleReminderChime();
  triggerReminderVibration();

  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "granted") {
      permissionGranted = true;
      dispatchNotification();
    } else if (Notification.permission !== "denied") {
      const granted = await requestDailyReminderPermission();
      permissionGranted = granted;
      if (granted) {
        dispatchNotification();
      }
    }
  }

  return { success: true, permissionGranted };
}

function dispatchNotification() {
  const msg = MOTIVATIONAL_NOTIFICATION_MESSAGES[
    Math.floor(Math.random() * MOTIVATIONAL_NOTIFICATION_MESSAGES.length)
  ];

  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then((reg) => {
      reg.showNotification(msg.title, {
        body: msg.body,
        icon: "/favicon.png",
        badge: "/favicon.png",
        tag: "braingym-daily-reminder",
        vibrate: [200, 100, 200],
        data: { url: "/dashboard" },
      } as any);
    });
  } else {
    new Notification(msg.title, {
      body: msg.body,
      icon: "/favicon.png",
      tag: "braingym-daily-reminder",
    });
  }
}

/**
 * Checks if reminder should fire based on:
 * 1. Is reminder enabled for today's day of week?
 * 2. Has the user already completed today's workout? (If YES -> Suppress reminder)
 */
export function shouldFireDailyReminder(isTodayWorkoutCompleted = false): boolean {
  if (isTodayWorkoutCompleted) return false; // Intelligent suppression!

  const config = getDailyReminderConfig();
  if (!config.enabled) return false;

  const todayDayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];
  if (!config.days.includes(todayDayName)) return false;

  return true;
}
