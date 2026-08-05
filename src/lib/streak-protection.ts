import { createClient } from "@/lib/supabase/client";
import { STREAK } from "@/lib/constants";

/**
 * Check if a user has a streak freeze active for a given date.
 * Freeze protects the streak from resetting when the user misses a day.
 */
export async function hasStreakFreeze(userId: string, date: string): Promise<boolean> {
  const supabase = createClient();
  const { data } = await supabase
    .from("streak_freezes")
    .select("id")
    .eq("user_id", userId)
    .eq("freeze_date", date)
    .maybeSingle();

  return !!data;
}

/**
 * Use a streak freeze for a given date. Decrements the user's freeze count.
 */
export async function consumeStreakFreeze(userId: string, date: string): Promise<boolean> {
  const supabase = createClient();

  // Check user has freezes available
  const { data: profile } = await supabase
    .from("profiles")
    .select("streak_freezes_remaining")
    .eq("user_id", userId)
    .maybeSingle();

  const remaining = profile?.streak_freezes_remaining ?? 0;
  if (remaining <= 0) return false;

  // Insert freeze record
  const { error } = await supabase.from("streak_freezes").insert({
    user_id: userId,
    freeze_date: date,
  });

  if (error) return false;

  // Decrement remaining freezes
  await supabase
    .from("profiles")
    .update({ streak_freezes_remaining: remaining - 1 })
    .eq("user_id", userId);

  return true;
}

/**
 * Grant a streak freeze (e.g., for completing a 7-day streak milestone).
 */
export async function grantStreakFreeze(userId: string): Promise<void> {
  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("streak_freezes_remaining")
    .eq("user_id", userId)
    .maybeSingle();

  const remaining = profile?.streak_freezes_remaining ?? 0;
  await supabase
    .from("profiles")
    .update({ streak_freezes_remaining: remaining + 1 })
    .eq("user_id", userId);
}

/**
 * Calculate if a streak should be maintained using freezes.
 * Returns the new streak value and whether a freeze was consumed.
 */
export async function calculateStreakWithFreeze(
  userId: string,
  currentStreak: number,
  lastWorkoutDate: string | null,
  today: string
): Promise<{ newStreak: number; freezeUsed: boolean; newLastDate: string }> {
  if (!lastWorkoutDate) {
    return { newStreak: 1, freezeUsed: false, newLastDate: today };
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Same day — no change
  if (lastWorkoutDate === today) {
    return { newStreak: currentStreak, freezeUsed: false, newLastDate: today };
  }

  // Consecutive day — increment
  if (lastWorkoutDate === yesterday) {
    const newStreak = currentStreak + 1;

    // Grant a freeze every 7 days of streak
    if (newStreak % 7 === 0) {
      await grantStreakFreeze(userId);
    }

    return { newStreak, freezeUsed: false, newLastDate: today };
  }

  // Missed day(s) — check for freeze
  const lastDate = new Date(lastWorkoutDate);
  const todayDate = new Date(today);
  const daysMissed = Math.floor((todayDate.getTime() - lastDate.getTime()) / 86400000);

  if (daysMissed === 2) {
    // Missed exactly 1 day — check freeze for yesterday
    const freezeActive = await hasStreakFreeze(userId, yesterday);
    if (freezeActive) {
      // Freeze protects — streak continues as if yesterday was completed
      return { newStreak: currentStreak + 1, freezeUsed: false, newLastDate: today };
    }

    // Try to auto-use a freeze
    const used = await consumeStreakFreeze(userId, yesterday);
    if (used) {
      return { newStreak: currentStreak + 1, freezeUsed: true, newLastDate: today };
    }
  } else if (daysMissed === 3) {
    // Missed 2 days — check freezes for both
    const d1 = new Date(lastDate);
    d1.setDate(d1.getDate() + 1);
    const d2 = new Date(lastDate);
    d2.setDate(d2.getDate() + 2);

    const freeze1 = await hasStreakFreeze(userId, d1.toISOString().split("T")[0]);
    const freeze2 = await hasStreakFreeze(userId, d2.toISOString().split("T")[0]);

    if (freeze1 && freeze2) {
      return { newStreak: currentStreak + 1, freezeUsed: false, newLastDate: today };
    }

    // Try to use available freezes
    let freezesUsed = 0;
    if (await consumeStreakFreeze(userId, d1.toISOString().split("T")[0])) freezesUsed++;
    if (await consumeStreakFreeze(userId, d2.toISOString().split("T")[0])) freezesUsed++;

    if (freezesUsed === 2) {
      return { newStreak: currentStreak + 1, freezeUsed: true, newLastDate: today };
    }
  }

  // No freeze available — streak resets
  return { newStreak: 1, freezeUsed: false, newLastDate: today };
}
