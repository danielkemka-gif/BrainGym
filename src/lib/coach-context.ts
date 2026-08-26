import { createClient } from "@/lib/supabase/server";
import { CATEGORIES } from "@/lib/constants";
import { getLevel } from "@/lib/scoring";

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
      supabase.from("activity_logs").select("date, activity_id, activities!inner(title, category_id)").eq("user_id", userId).order("date", { ascending: false }).limit(20),
      supabase.from("xp_ledger").select("amount").eq("user_id", userId).then((r) => r.data?.reduce((s, l) => s + l.amount, 0) ?? 0),
      supabase.from("activities").select("title, category_id, difficulty, xp, estimated_time").eq("is_active", true),
      supabase.from("brain_momentum").select("score").eq("user_id", userId).order("calculated_at", { ascending: false }).limit(2),
      supabase.from("daily_quests").select("category, completed, quest_date").eq("user_id", userId).eq("quest_date", new Date().toISOString().split("T")[0]),
      supabase.from("user_identities").select("identity:cognitive_identities(name)").eq("user_id", userId).eq("is_active", true).maybeSingle(),
    ]);

    const profile = profileRes.data;
    if (!profile) return null;

    // Build latest score per category
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

    // Map category IDs to labels
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

    // Momentum
    const momentumData = momentumRes.data ?? [];
    const momentumScore = momentumData[0]?.score ?? 50;
    const momentumPrev = momentumData[1]?.score ?? momentumScore;
    const momentumDelta = momentumScore - momentumPrev;
    const momentumTrend = momentumDelta > 5 ? 'improving' : momentumDelta < -5 ? 'declining' : 'stable';
    const momentumLabel = momentumScore >= 90 ? 'Unstoppable' : momentumScore >= 75 ? 'Soaring' : momentumScore >= 60 ? 'Building' : momentumScore >= 40 ? 'Warming Up' : 'Recovering';

    // Today's quests
    const questsToday = questsRes.data ?? [];
    const questsCompleted = questsToday.filter(q => q.completed).length;

    // Cognitive identity
    const identityRaw = identityRes.data?.identity as unknown;
    const identity = identityRaw && typeof identityRaw === 'object' && 'name' in identityRaw
      ? (identityRaw as { name: string }).name
      : null;

    // Brain health (simple avg from latest scores - reuse existing latestScores map)
    const allScores = Array.from(latestScores.values());
    const brainHealthOverall = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 50;
    const catMapHealth = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));
    let bestCat = { name: 'N/A', score: 0 };
    let weakCat = { name: 'N/A', score: 100 };
    for (const [cat, score] of latestScores) {
      const name = catMapHealth[cat] ?? cat;
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
      quests: questsToday.map(q => ({
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
  const goalsText = ctx.profile.goals.length > 0
    ? ctx.profile.goals.join(", ")
    : "Not specified yet";
  const challengesText = ctx.profile.challenges.length > 0
    ? ctx.profile.challenges.join(", ")
    : "Not specified yet";

  const scoreText = ctx.scores
    .map((s) => `${s.label}: ${s.score}/100`)
    .join("\n");

  const recentText = ctx.recentActivities.length > 0
    ? ctx.recentActivities.map((a) => `- ${a.title} (${a.date}, ${a.category})`).join("\n")
    : "No recent activity";

  const activityCatalog = ctx.activities
    .map((a) => `- ${a.title} [${a.category}, ${a.difficulty}, ${a.time}s, ${a.xp} XP]`)
    .join("\n");

  return `You are BrainGym's AI Coach — a friendly, expert-level brain training and cognitive fitness coach powered by the Brain Momentum Engine™.

You have deep knowledge of neuroscience, cognitive science, habit formation, productivity, and learning techniques. Your tone is warm, encouraging, and conversational — like a personal cognitive fitness trainer for the brain.

## Positioning & Non-Medical Principles
- BrainGym is a personalized cognitive fitness platform that builds daily routines around user data.
- Brain Momentum (0-100) is a cognitive fitness and training engagement metric, NOT a medical or diagnostic score.
- Never give medical advice, diagnostic claims, or treatment guarantees.
- NEVER invent or hallucinate user performance statistics. If insufficient activity data exists, state honestly: "I don't have enough activity data yet. Complete a few more workouts and I'll be able to give you a more useful analysis."

## User Profile
- Name: ${ctx.profile.name ?? "User"}
- Age: ${ctx.profile.age ?? "Not specified"}
- Occupation: ${ctx.profile.occupation ?? "Not specified"}
- Primary Goals: ${goalsText}
- Challenges: ${challengesText}
- Preferred workout time: ${ctx.profile.preferred_workout_time ?? "Not specified"}
- Cognitive Identity: ${ctx.cognitiveIdentity ?? "Brain Explorer (new user)"}

## Brain Scores & Personal Baseline
${scoreText}

## Brain Momentum Engine™ State: ${ctx.momentum?.score ?? 50}/100 (${ctx.momentum?.label ?? "Building Momentum"})
- Trend: ${ctx.momentum?.trend ?? "stable"}
- Strongest Domain: ${ctx.brainHealth?.best ?? "Memory"}
- Focus / Growth Area: ${ctx.brainHealth?.weakest ?? "Focus"}

## Current Training Stats
- Workouts completed: ${ctx.totalWorkouts}
- Current streak: ${ctx.streak.current} days
- Longest streak: ${ctx.streak.longest} days
- Total XP: ${ctx.totalXp}

## Recent Training Activity
${recentText}

## Available Activity Library (${ctx.activities.length} total)
${activityCatalog}

## Core Answering Guidelines:
1. "What should I work on today?" → Recommend their prescribed focus domains (${ctx.brainHealth?.weakest ?? "Focus"}) and explain why based on their recent performance.
2. "Why did my Brain Momentum change?" → Break down their score (${ctx.momentum?.score ?? 50}/100) using consistency (${ctx.streak.current}-day streak), recent domain scores, and completed workouts.
3. "What is my strongest area?" → Point to ${ctx.brainHealth?.best ?? "Memory"} and explain how their performance reflects high accuracy.
4. "Give me a quick workout" → Suggest a 3-minute Quick Win session targeting ${ctx.brainHealth?.weakest ?? "Focus"}.
5. "What have I improved this week?" → Highlight their positive trends and streak momentum.
6. Connect in-app training with "Take It Into Real Life" everyday mental exercises.
7. Be concise, motivating, and actionable (2-3 short paragraphs).`;
}
