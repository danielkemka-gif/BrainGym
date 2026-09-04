/**
 * SMARTPHONE ALARM & NOTIFICATION ENGINE
 * Connects BrainGym daily workouts to the user's smartphone via:
 * 1. Native Web Notifications
 * 2. Web Audio API Acoustic Chime Synthesizer
 * 3. Smartphone Vibration API
 */

export interface AlarmScheduleConfig {
  enabled: boolean;
  time: string; // "07:30", "13:00", "19:30"
  label: string; // "Morning Focus Workout", "Midday Reset", "Evening Composure"
  days: string[]; // ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  sound: boolean;
  vibrate: boolean;
  lastFiredDate?: string;
}

const STORAGE_KEY_ALARM = "braingym_alarm_config_v1";

const DEFAULT_ALARM: AlarmScheduleConfig = {
  enabled: true,
  time: "07:30",
  label: "Daily BrainGym Workout",
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  sound: true,
  vibrate: true,
};

/**
 * Get current alarm configuration
 */
export function getAlarmConfig(): AlarmScheduleConfig {
  if (typeof window === "undefined") return DEFAULT_ALARM;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ALARM);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return DEFAULT_ALARM;
}

/**
 * Save alarm configuration
 */
export function saveAlarmConfig(config: AlarmScheduleConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_ALARM, JSON.stringify(config));
  } catch (err) {
    console.warn("Could not save alarm config", err);
  }
}

/**
 * Request native device notification permissions
 */
export async function requestAlarmNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }
  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch {
    return false;
  }
}

/**
 * Synthesize a pleasant acoustic chime melody using Web Audio API
 * (Works without downloading external sound assets)
 */
export function playAcousticAlarmChime(): void {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const notes = [
      { freq: 523.25, time: 0.0, duration: 0.35 }, // C5
      { freq: 659.25, time: 0.25, duration: 0.35 }, // E5
      { freq: 783.99, time: 0.5, duration: 0.4 }, // G5
      { freq: 1046.5, time: 0.75, duration: 0.6 }, // C6
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

      gain.gain.setValueAtTime(0.01, ctx.currentTime + note.time);
      gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + note.time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + note.time);
      osc.stop(ctx.currentTime + note.time + note.duration);
    });
  } catch (err) {
    console.warn("Could not play synthesized chime", err);
  }
}

/**
 * Trigger smartphone vibration pattern
 */
export function triggerSmartphoneVibration(): void {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate([300, 150, 300, 150, 500]);
    } catch {
      // ignore
    }
  }
}

/**
 * Trigger an immediate Test Alarm on device
 */
export async function testAlarmNow(): Promise<{ success: boolean; notificationGranted: boolean }> {
  let notificationGranted = false;

  // 1. Play Acoustic Chime
  playAcousticAlarmChime();

  // 2. Vibrate phone
  triggerSmartphoneVibration();

  // 3. Show native notification
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "granted") {
      notificationGranted = true;
      new Notification("⏰ BrainGym Daily Workout Alarm!", {
        body: "Your daily 2-phase brain workout is ready. Tap to sharpen your mind today! 🧠⚡",
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-192.png",
        vibrate: [300, 150, 300, 150, 500],
      } as any);
    } else if (Notification.permission !== "denied") {
      const perm = await requestAlarmNotificationPermission();
      notificationGranted = perm;
      if (perm) {
        new Notification("⏰ BrainGym Daily Workout Alarm!", {
          body: "Your daily 2-phase brain workout is ready. Tap to sharpen your mind today! 🧠⚡",
          icon: "/icons/icon-192.png",
          badge: "/icons/icon-192.png",
          vibrate: [300, 150, 300, 150, 500],
        } as any);
      }
    }
  }

  return { success: true, notificationGranted };
}

/**
 * Calculate countdown to the next scheduled alarm
 */
export function getNextAlarmCountdown(alarmTime: string): {
  hours: number;
  minutes: number;
  formattedText: string;
} {
  const now = new Date();
  const [targetH, targetM] = alarmTime.split(":").map(Number);

  const target = new Date();
  target.setHours(targetH, targetM, 0, 0);

  if (target.getTime() <= now.getTime()) {
    // Tomorrow
    target.setDate(target.getDate() + 1);
  }

  const diffMs = target.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;

  let formattedText = "";
  if (hours > 0) {
    formattedText = `in ${hours}h ${minutes}m`;
  } else {
    formattedText = `in ${minutes} minutes`;
  }

  return { hours, minutes, formattedText };
}
