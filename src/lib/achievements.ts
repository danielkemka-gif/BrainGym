import { CATEGORIES } from "@/lib/constants";
import type { AchievementId } from "@/components/achievements/achievements-grid";
import { createClient } from "@/lib/supabase/client";

interface CheckContext {
  userId: string;
  workoutCompleted: boolean;
  completedAt: string;
}

export async function checkAndUnlockAchievements(ctx: CheckContext) {
  try {
    const supabase = createClient();
    const { data: existing } = await supabase
      .from("achievements")
      .select("achievement_type")
      .eq("user_id", ctx.userId);

    const unlocked = new Set(existing?.map((a) => a.achievement_type) ?? []);
    const toUnlock: AchievementId[] = [];

    async function tryUnlock(id: AchievementId, xp: number) {
      if (unlocked.has(id)) return;
      toUnlock.push(id);
      await supabase.from("achievements").insert({
        user_id: ctx.userId,
        achievement_type: id,
        xp_reward: xp,
      });
      await supabase.from("xp_ledger").insert({
        user_id: ctx.userId,
        amount: xp,
        reason: `achievement_${id}`,
      });
    }

    const { data: allLogs } = await supabase
      .from("activity_logs")
      .select("activity_id, date")
      .eq("user_id", ctx.userId);

    const totalWorkouts = allLogs
      ? new Set(allLogs.map((l) => l.date)).size
      : 0;

    const categoryCounts: Record<string, number> = {};
    if (allLogs) {
      const { data: activities } = await supabase
        .from("activities")
        .select("id, category_id");
      const actCat = Object.fromEntries(
        (activities ?? []).map((a) => [a.id, a.category_id])
      );
      for (const log of allLogs) {
        const cat = actCat[log.activity_id];
        if (cat) categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
      }
    }

    const { data: streak } = await supabase
      .from("streaks")
      .select("current_streak")
      .eq("user_id", ctx.userId)
      .maybeSingle();

    const currentStreak = streak?.current_streak ?? 0;

    // First workout: only if this is the very first activity_log entry
    if (ctx.workoutCompleted && totalWorkouts === 1)
      await tryUnlock("first_workout", 50);
    if (currentStreak >= 7) await tryUnlock("week_streak", 100);
    if (currentStreak >= 30) await tryUnlock("month_streak", 500);
    if (totalWorkouts >= 10) await tryUnlock("ten_workouts", 200);
    if (totalWorkouts >= 50) await tryUnlock("fifty_workouts", 1000);
    if (totalWorkouts >= 100) await tryUnlock("hundred_workouts", 2500);

    for (const [catId, count] of Object.entries(categoryCounts)) {
      if (count >= 10) {
        if (catId === "memory") await tryUnlock("memory_whiz", 150);
        if (catId === "focus") await tryUnlock("focus_fiend", 150);
        if (catId === "creativity") await tryUnlock("creative_spark", 150);
        if (catId === "thinking") await tryUnlock("thinker", 150);
        if (catId === "learning") await tryUnlock("scholar", 150);
        if (catId === "health") await tryUnlock("healthy_mind", 150);
        if (catId === "emotional-intelligence") await tryUnlock("empath", 150);
      }
    }

    if (CATEGORIES.every((c) => (categoryCounts[c.id] ?? 0) > 0))
      await tryUnlock("all_categories", 250);

    const hour = new Date(ctx.completedAt).getHours();
    if (hour >= 21 || hour < 2) await tryUnlock("night_owl", 75);
    if (hour < 7) await tryUnlock("early_bird", 75);

    return toUnlock;
  } catch {
    return [];
  }
}
