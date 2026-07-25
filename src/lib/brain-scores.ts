import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/constants";

/**
 * Recalculates brain scores based on recent activity performance.
 * Uses a weighted algorithm: recent activities count more, higher difficulty = more impact.
 * Scores decay toward baseline (50) if no recent activity in a category.
 */
export async function recalculateBrainScores(userId: string): Promise<void> {
  try {
    const supabase = createClient();

    // Fetch last 60 days of activity logs with activity details
    const sixtyDaysAgo = new Date(Date.now() - 60 * 86400000).toISOString().split("T")[0];

    const { data: logs } = await supabase
      .from("activity_logs")
      .select("activity_id, date, xp_earned, created_at, activities!inner(category_id, difficulty)")
      .eq("user_id", userId)
      .gte("date", sixtyDaysAgo)
      .order("date", { ascending: false });

    if (!logs || logs.length === 0) return;

    // Fetch existing scores (for users with no recent activity, keep existing)
    const { data: existingScores } = await supabase
      .from("brain_scores")
      .select("category_id, score")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(50);

    const existingByCategory = new Map<string, number>();
    for (const s of existingScores ?? []) {
      if (!existingByCategory.has(s.category_id)) {
        existingByCategory.set(s.category_id, s.score);
      }
    }

    // Difficulty multiplier
    const diffMultiplier: Record<string, number> = {
      beginner: 1.0,
      intermediate: 1.5,
      advanced: 2.0,
    };

    // Calculate per-category performance
    const categoryPerformance: Record<string, { weightedSum: number; totalWeight: number; count: number }> = {};

    for (const log of logs) {
      const catId = (log.activities as unknown as { category_id: string })?.category_id;
      if (!catId) continue;

      const difficulty = (log.activities as unknown as { difficulty: string })?.difficulty ?? "beginner";
      const daysAgo = Math.max(0, (Date.now() - new Date(log.date).getTime()) / 86400000);

      // Recency weight: exponential decay (half-life = 14 days)
      const recencyWeight = Math.pow(0.5, daysAgo / 14);

      // Difficulty weight
      const diffWeight = diffMultiplier[difficulty] ?? 1.0;

      // Activity impact: base 10 points per activity, scaled by difficulty and recency
      const impact = 10 * diffWeight * recencyWeight;

      if (!categoryPerformance[catId]) {
        categoryPerformance[catId] = { weightedSum: 0, totalWeight: 0, count: 0 };
      }

      categoryPerformance[catId].weightedSum += impact;
      categoryPerformance[catId].totalWeight += recencyWeight;
      categoryPerformance[catId].count++;
    }

    // Fetch total days active for consistency bonus
    const uniqueDays = new Set(logs.map((l) => l.date)).size;
    const consistencyBonus = Math.min(uniqueDays * 0.5, 15); // Max +15 points for consistency

    // Calculate new scores
    const now = new Date().toISOString().split("T")[0];
    const newScores: { user_id: string; category_id: string; score: number; date: string }[] = [];

    for (const cat of CATEGORIES) {
      const perf = categoryPerformance[cat.id];
      const baseline = existingByCategory.get(cat.id) ?? 50;

      if (!perf || perf.count === 0) {
        // No recent activity: decay toward baseline (50)
        const decayed = baseline + (50 - baseline) * 0.1; // 10% decay per recalculation
        const finalScore = Math.round(Math.max(0, Math.min(100, decayed)));
        if (finalScore !== baseline) {
          newScores.push({ user_id: userId, category_id: cat.id, score: finalScore, date: now });
        }
        continue;
      }

      // Activity score: weighted average of impacts, capped at 85
      const activityScore = Math.min(85, (perf.weightedSum / Math.max(perf.totalWeight, 1)) * 8);

      // Volume bonus: more activities = higher ceiling
      const volumeBonus = Math.min(10, perf.count * 0.5);

      // Combine: activity score + volume bonus + consistency bonus, blended with baseline
      const rawScore = activityScore + volumeBonus + consistencyBonus;
      const blendedScore = baseline * 0.3 + rawScore * 0.7; // 70% new data, 30% baseline
      const finalScore = Math.round(Math.max(0, Math.min(100, blendedScore)));

      newScores.push({ user_id: userId, category_id: cat.id, score: finalScore, date: now });
    }

    // Batch insert new scores
    if (newScores.length > 0) {
      await supabase.from("brain_scores").insert(newScores);
    }
  } catch {
    // Silently fail — score recalculation is non-critical
  }
}

/**
 * Quick score update for a single category (e.g., after a quiz in that category).
 */
export async function updateCategoryScore(
  userId: string,
  categoryId: string,
  correct: boolean,
  difficulty: string = "beginner"
): Promise<void> {
  try {
    const supabase = createClient();

    // Get current score
    const { data: current } = await supabase
      .from("brain_scores")
      .select("score")
      .eq("user_id", userId)
      .eq("category_id", categoryId)
      .order("date", { ascending: false })
      .limit(1)
      .maybeSingle();

    const baseScore = current?.score ?? 50;

    // Calculate adjustment
    const diffMultiplier = difficulty === "advanced" ? 3 : difficulty === "intermediate" ? 2 : 1;
    const adjustment = correct ? diffMultiplier * 1.5 : -diffMultiplier * 0.8;
    const newScore = Math.round(Math.max(0, Math.min(100, baseScore + adjustment)));

    await supabase.from("brain_scores").insert({
      user_id: userId,
      category_id: categoryId,
      score: newScore,
      date: new Date().toISOString().split("T")[0],
    });
  } catch {
    // Silently fail
  }
}
