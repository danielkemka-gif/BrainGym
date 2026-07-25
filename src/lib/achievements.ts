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

    // Build UUID→slug mapping for category achievement checks
    const catIdToSlug: Record<string, string> = {};
    for (const c of CATEGORIES) {
      catIdToSlug[c.id] = c.slug;
    }

    // Category-specific achievements (10 activities each)
    const CATEGORY_ACHIEVEMENTS: Record<string, AchievementId> = {
      memory: "memory_whiz",
      focus: "focus_fiend",
      creativity: "creative_spark",
      thinking: "thinker",
      learning: "scholar",
      health: "healthy_mind",
      "emotional-intelligence": "empath",
    };

    for (const [catId, count] of Object.entries(categoryCounts)) {
      const slug = catIdToSlug[catId];
      if (slug && count >= 10) {
        const achievementId = CATEGORY_ACHIEVEMENTS[slug];
        if (achievementId) await tryUnlock(achievementId, 150);
      }
    }

    // Renaissance Mind: at least one activity in every category
    if (CATEGORIES.every((c) => (categoryCounts[c.id] ?? 0) > 0))
      await tryUnlock("all_categories", 250);

    // Time-based achievements
    const hour = new Date(ctx.completedAt).getHours();
    if (hour >= 21 || hour < 2) await tryUnlock("night_owl", 75);
    if (hour < 7) await tryUnlock("early_bird", 75);

    // Speed Demon: completed a Quick-Fire quiz (called from quiz page)
    // perfect_week: 7 consecutive workout days
    const last7Days = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
    const { data: recentLogs } = await supabase
      .from("activity_logs")
      .select("date")
      .eq("user_id", ctx.userId)
      .gte("date", last7Days);
    const recentDays = new Set(recentLogs?.map((l) => l.date) ?? []);
    if (recentDays.size >= 7) {
      // Check if all 7 days have at least one log
      const today = new Date(ctx.completedAt);
      let allDaysPresent = true;
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        if (!recentDays.has(dateStr)) {
          allDaysPresent = false;
          break;
        }
      }
      if (allDaysPresent) await tryUnlock("perfect_week", 300);
    }

    return toUnlock;
  } catch {
    return [];
  }
}

/**
 * Unlock Speed Demon achievement (called after Quick-Fire quiz completion).
 */
export async function unlockSpeedDemon(userId: string): Promise<AchievementId[]> {
  try {
    const supabase = createClient();
    const { data: existing } = await supabase
      .from("achievements")
      .select("achievement_type")
      .eq("user_id", userId)
      .eq("achievement_type", "speed_demon");

    if (existing && existing.length > 0) return [];

    await supabase.from("achievements").insert({
      user_id: userId,
      achievement_type: "speed_demon",
      xp_reward: 100,
    });
    await supabase.from("xp_ledger").insert({
      user_id: userId,
      amount: 100,
      reason: "achievement_speed_demon",
    });

    return ["speed_demon"];
  } catch {
    return [];
  }
}
