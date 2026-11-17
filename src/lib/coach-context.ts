import { createClient } from "@/lib/supabase/server";
import { CATEGORIES } from "@/lib/constants";
import { getLevel } from "@/lib/scoring";
import {
  AKUCHE_MASTER_SYSTEM_PROMPT,
  getModeInstructionExtension,
} from "@/lib/akuche/master-intelligence";

interface ActivityRow {
  title: string;
  category_id: string;
  difficulty: string;
  xp: number;
  estimated_time: number;
}

export interface CoachContext {
  profile: {
    name: string | null;
    age: number | null;
    occupation: string | null;
    goals: string[];
    challenges: string[];
    preferred_workout_time: string | null;
  };
  scores: { category: string; label: string; score: number }[];
  streak: { current: number; longest: number };
  recentActivities: { title: string; date: string; category: string }[];
  totalWorkouts: number;
  level: number;
  totalXp: number;
  activities: { title: string; category: string; difficulty: string; xp: number; time: number }[];
  momentum: { score: number; trend: string; label: string } | null;
  quests: { completed: number; total: number; category: string }[];
  cognitiveIdentity: string | null;
  brainHealth: { overall: number; best: string; weakest: string } | null;
}

export async function buildCoachContext(userId: string): Promise<CoachContext | null> {
  try {
    const supabase = await createClient();

    const [profileRes, scoresRes, streakRes, logsRes, xpRes, activitiesRes, momentumRes, questsRes, identityRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("brain_scores").select("category_id, score").eq("user_id", userId).order("date", { ascending: false }).limit(50),
      supabase.from("streaks").select("current_streak, longest_streak").eq("user_id", userId).maybeSingle(),
      supabase.from("activity_logs").select("date, activity_id, activities!inner(title, category_id)").eq("user_id", userId).order("date", { ascending: false }).limit(12),
      supabase.from("xp_ledger").select("amount").eq("user_id", userId).then((r) => r.data?.reduce((s, l) => s + l.amount, 0) ?? 0),
      supabase.from("activities").select("title, category_id, difficulty, xp, estimated_time").eq("is_active", true).limit(20),
      supabase.from("brain_momentum").select("score").eq("user_id", userId).order("calculated_at", { ascending: false }).limit(2),
      supabase.from("daily_quests").select("category, completed, quest_date").eq("user_id", userId).eq("quest_date", new Date().toISOString().split("T")[0]),
      supabase.from("user_identities").select("identity:cognitive_identities(name)").eq("user_id", userId).eq("is_active", true).maybeSingle(),
    ]);

    const profile = profileRes.data;
    if (!profile) return null;

    const latestScores = new Map<string, number>();
    for (const s of scoresRes.data ?? []) {
      if (!latestScores.has(s.category_id)) {
        latestScores.set(s.category_id, s.score);
      }
    }

    const scores: CoachContext["scores"] = CATEGORIES.map((c) => ({
      category: c.id,
      label: c.label,
      score: latestScores.get(c.id) ?? 0,
    }));

    const catMap = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));

    const logs = (logsRes.data ?? []) as unknown as { date: string; activities: { title: string; category_id: string } | null }[];
    const recentActivities: CoachContext["recentActivities"] = logs.map((l) => ({
      title: l.activities?.title ?? "Unknown",
      date: l.date,
      category: (l.activities?.category_id && catMap[l.activities.category_id]) ?? "General",
    }));

    const activities: CoachContext["activities"] = (activitiesRes.data ?? []).map((a: ActivityRow) => ({
      title: a.title,
      category: catMap[a.category_id] ?? "General",
      difficulty: a.difficulty,
      xp: a.xp,
      time: a.estimated_time,
    }));

    const momentumData = momentumRes.data ?? [];
    const momentumScore = momentumData[0]?.score ?? 50;
    const momentumPrev = momentumData[1]?.score ?? momentumScore;
    const momentumDelta = momentumScore - momentumPrev;
    const momentumTrend = momentumDelta > 5 ? "improving" : momentumDelta < -5 ? "declining" : "stable";
    const momentumLabel =
      momentumScore >= 90
        ? "Unstoppable"
        : momentumScore >= 75
        ? "Soaring"
        : momentumScore >= 60
        ? "Building"
        : momentumScore >= 40
        ? "Warming Up"
        : "Recovering";

    const questsToday = questsRes.data ?? [];

    const identityRaw = identityRes.data?.identity as unknown;
    const identity =
      identityRaw && typeof identityRaw === "object" && "name" in identityRaw
        ? (identityRaw as { name: string }).name
        : null;

    const allScores = Array.from(latestScores.values());
    const brainHealthOverall =
      allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : 50;
    let bestCat = { name: "N/A", score: 0 };
    let weakCat = { name: "N/A", score: 100 };
    for (const [cat, score] of latestScores) {
      const name = catMap[cat] ?? cat;
      if (score > bestCat.score) bestCat = { name, score };
      if (score < weakCat.score) weakCat = { name, score };
    }

    return {
      profile: {
        name: profile.name ?? null,
        age: profile.age ?? null,
        occupation: profile.occupation ?? null,
        goals: profile.goals ?? [],
        challenges: profile.challenges ?? [],
        preferred_workout_time: profile.preferred_workout_time ?? null,
      },
      scores,
      streak: {
        current: streakRes.data?.current_streak ?? 0,
        longest: streakRes.data?.longest_streak ?? 0,
      },
      recentActivities,
      totalWorkouts: new Set(logs.map((l) => l.date)).size,
      level: getLevel(xpRes).level,
      totalXp: xpRes,
      activities,
      momentum: {
        score: momentumScore,
        trend: momentumTrend,
        label: momentumLabel,
      },
      quests: questsToday.map((q) => ({
        completed: q.completed ? 1 : 0,
        total: 1,
        category: q.category,
      })),
      cognitiveIdentity: identity,
      brainHealth: {
        overall: brainHealthOverall,
        best: bestCat.name,
        weakest: weakCat.name,
      },
    };
  } catch {
    return null;
  }
}

export function buildSystemPrompt(ctx: CoachContext): string {
  const goalsText =
    ctx.profile.goals.length > 0 ? ctx.profile.goals.join(", ") : "Not specified yet";
  const challengesText =
    ctx.profile.challenges.length > 0
      ? ctx.profile.challenges.join(", ")
      : "Not specified yet";

  const scoreText = ctx.scores.map((s) => `${s.label}: ${s.score}/100`).join("\n");

  const recentText =
    ctx.recentActivities.length > 0
      ? ctx.recentActivities
          .slice(0, 8)
          .map((a) => `- ${a.title} (${a.date}, ${a.category})`)
          .join("\n")
      : "No recent activity";

  // Select top 12 representative activities rather than dumping the entire database on every turn
  const activityCatalog = ctx.activities
    .slice(0, 12)
    .map((a) => `- ${a.title} [${a.category}, ${a.difficulty}, ${a.time}s, ${a.xp} XP]`)
    .join("\n");

  return `${AKUCHE_MASTER_SYSTEM_PROMPT}
${getModeInstructionExtension("brain_coach")}

## USER PROFILE & TRAINING CONTEXT (CONFIRMED DATA)
- Name: ${ctx.profile.name ?? "User"}
- Age: ${ctx.profile.age ?? "Not specified"}
- Occupation: ${ctx.profile.occupation ?? "Not specified"}
- Primary Goals: ${goalsText}
- Challenges: ${challengesText}
- Preferred workout time: ${ctx.profile.preferred_workout_time ?? "Not specified"}
- Cognitive Identity: ${ctx.cognitiveIdentity ?? "Brain Explorer"}

## Brain Scores & Personal Baseline
${scoreText}

## Brain Momentum State: ${ctx.momentum?.score ?? 50}/100 (${ctx.momentum?.label ?? "Building"})
- Trend: ${ctx.momentum?.trend ?? "stable"}
- Strongest Domain: ${ctx.brainHealth?.best ?? "Memory"}
- Focus / Growth Area: ${ctx.brainHealth?.weakest ?? "Focus"}
- Workouts completed: ${ctx.totalWorkouts} | Current streak: ${ctx.streak.current} days | Total XP: ${ctx.totalXp}

## Recent Training Activity
${recentText}

## Highlighted Activity Library
${activityCatalog}

Important Context Rules:
1. Answer the user's actual question directly first (whether it is about brain training, a business decision, career dilemma, or personal habit).
2. Only reference workout scores or activities when relevant to the user's question.
3. Never invent user performance statistics.`;
}
