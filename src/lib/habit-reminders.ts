/**
 * Contextual Daily Habit Notification Engine
 * Generates personalized, streak- and score-aware notifications
 * to encourage regular morning training rituals.
 */

export interface HabitNotificationContext {
  userName?: string;
  streak: number;
  yesterdayScore: number;
  durationMinutes?: number;
  missionTitle?: string;
}

export function generateHabitNotification(ctx: HabitNotificationContext): { title: string; body: string; url: string } {
  const { streak, yesterdayScore, durationMinutes = 7 } = ctx;

  const notificationTemplates = [
    {
      title: `⚡ Your ${durationMinutes}-Minute Brain Workout is Ready`,
      body: yesterdayScore > 0
        ? `Yesterday you scored ${yesterdayScore}. Can you beat it this morning?`
        : `Wake up your memory and focus with today's 5-step cognitive routine!`,
    },
    {
      title: `🔥 Day ${streak + 1}. Your Brain Streak is Waiting!`,
      body: `Complete 5 quick drills today to lock in your ${streak + 1}-day streak and boost momentum.`,
    },
    {
      title: `🧠 Morning Brain Activation Ready`,
      body: `Take 7 minutes before your workday to sharpen executive function and reaction speed.`,
    },
    {
      title: `🎯 Today's Brain Score Challenge`,
      body: `Yesterday's baseline: ${yesterdayScore}. Train now to set a NEW PERSONAL BEST!`,
    },
  ];

  const index = Math.floor(Math.random() * notificationTemplates.length);
  const selected = notificationTemplates[index];

  return {
    title: selected.title,
    body: selected.body,
    url: "/dashboard/workout",
  };
}

export const REMINDER_TIME_OPTIONS = [
  { value: "06:30", label: "6:30 AM (Early Riser)" },
  { value: "07:00", label: "7:00 AM (Recommended Morning Ritual)" },
  { value: "07:30", label: "7:30 AM (Before Work)" },
  { value: "08:00", label: "8:00 AM (Workday Start)" },
  { value: "08:30", label: "8:30 AM (Morning Coffee)" },
  { value: "09:00", label: "9:00 AM (Mid-Morning Focus)" },
  { value: "12:30", label: "12:30 PM (Lunch Recharge)" },
  { value: "18:00", label: "6:00 PM (Evening Wind-Down)" },
];
