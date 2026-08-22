import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/constants";

export interface HabitMetricState {
  userName: string;
  greeting: string;
  // 1. Streak
  streak: number;
  streakMilestone: {
    title: string;
    tier: number; // 1 to 5
    nextMilestone: number;
    daysRemaining: number;
  };
  streakShields: number;
  // 2. Brain Score
  brainScore: number;
  yesterdayScore: number;
  scoreDelta: number;
  isPersonalBest: boolean;
  categoryScores: {
    id: string;
    label: string;
    score: number;
    delta: number;
    color: string;
  }[];
  // 3. Brain Age
  brainAge: number;
  previousBrainAge: number;
  ageImprovementYears: number;
  brainAgeLabel: string;
  // 4. Brain Momentum
  momentumScore: number;
  previousMomentumScore: number;
  momentumLabel: string;
  momentumEmoji: string;
  momentumReason: string;
  // 5. Today's Brain Workout
  workout: {
    id: string;
    isCompleted: boolean;
    durationMinutes: number;
    activityCount: number;
    objective: string;
    activities: {
      id: string;
      title: string;
      category: string;
      color: string;
      durationSec: number;
      difficulty: string;
      xp: number;
      coins: number;
    }[];
  };
  // 6. Daily Mission
  dailyMission: {
    id: string;
    title: string;
    description: string;
    target: number;
    current: number;
    xpReward: number;
    coinReward: number;
    isCompleted: boolean;
    isClaimed: boolean;
  };
  // 7. Weekly Report Summary
  weeklyReport: {
    workoutsCompleted: number;
    totalTrainingMinutes: number;
    bestBrainScore: number;
    avgBrainScore: number;
    nextWeekGoal: string;
  };
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  const firstName = name ? name.split(" ")[0] : "Thinker";
  if (hour < 12) return `Good Morning, ${firstName}`;
  if (hour < 17) return `Good Afternoon, ${firstName}`;
  return `Good Evening, ${firstName}`;
}

export function getStreakMilestoneInfo(streak: number) {
  if (streak >= 100) return { title: "Brain Elite", tier: 5, nextMilestone: 100, daysRemaining: 0 };
  if (streak >= 60) return { title: "Brain Master", tier: 4, nextMilestone: 100, daysRemaining: 100 - streak };
  if (streak >= 30) return { title: "Brain Athlete", tier: 3, nextMilestone: 60, daysRemaining: 60 - streak };
  if (streak >= 14) return { title: "Brain Builder", tier: 2, nextMilestone: 30, daysRemaining: 30 - streak };
  if (streak >= 7) return { title: "Brain Starter", tier: 1, nextMilestone: 14, daysRemaining: 14 - streak };
  return { title: "Brain Explorer", tier: 0, nextMilestone: 7, daysRemaining: Math.max(1, 7 - streak) };
}

export function scoreToBrainAge(avgScore: number): number {
  const normalized = Math.max(0, Math.min(100, avgScore));
  return Math.round(80 - (normalized / 100) * 60);
}

export function getBrainAgeLabel(age: number): string {
  if (age <= 25) return "Exceptional Sharpness";
  if (age <= 35) return "Peak Cognitive Agility";
  if (age <= 45) return "Solid & Focused";
  if (age <= 55) return "Building Capacity";
  return "Warming Up";
}

export function getMomentumInfo(score: number, workoutsThisWeek: number) {
  let label = "Getting Started";
  let emoji = "🌱";
  let reason = "Complete today's workout to start building cognitive momentum.";

  if (score >= 90) {
    label = "Unstoppable";
    emoji = "🔥";
    reason = `Your momentum is peak because you've maintained a flawless streak with ${workoutsThisWeek} workouts this week!`;
  } else if (score >= 75) {
    label = "Soaring";
    emoji = "🚀";
    reason = `Your momentum is high because you've completed ${workoutsThisWeek} workouts this week.`;
  } else if (score >= 60) {
    label = "Building";
    emoji = "📈";
    reason = `Consistent training is accelerating your brain plasticity (${workoutsThisWeek} sessions logged).`;
  } else if (score >= 40) {
    label = "Warming Up";
    emoji = "⚡";
    reason = "A 5-minute workout today will boost your momentum velocity by +8 points.";
  } else if (score >= 20) {
    label = "Recovering";
    emoji = "🔄";
    reason = "Missed a day? Complete today's workout to immediately recover your momentum.";
  }

  return { label, emoji, reason };
}

const DEFAULT_OBJECTIVES = [
  "Wake up executive function, working memory recall, and reaction speed.",
  "Sharpen focus under cognitive pressure and reduce mental fatigue.",
  "Boost mental flexibility, lateral problem solving, and decision speed.",
  "Reinforce neural pathways for memory retention and active learning.",
  "Calibrate emotional regulation and sustained attention for peak workday performance.",
];

export async function fetchHabitEngineState(userId?: string): Promise<HabitMetricState> {
  const supabase = createClient();
  let userName = "Thinker";
  let streak = 14;
  let streakShields = 2;
  let rawAvgScore = 82;
  let yesterdayScore = 77;
  let previousBrainAge = 37;
  let isWorkoutCompleted = false;
  let workoutsThisWeek = 5;

  if (userId) {
    try {
      // 1. Fetch Profile & Streak
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, full_name, streak_count, current_streak, best_streak, total_xp, streak_freeze_count")
        .eq("user_id", userId)
        .maybeSingle();

      if (profile) {
        userName = profile.name || profile.full_name || "Thinker";
        streak = profile.current_streak ?? profile.streak_count ?? 14;
        streakShields = profile.streak_freeze_count ?? 2;
      }

      // 2. Fetch Brain Scores
      const todayStr = new Date().toISOString().split("T")[0];
      const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split("T")[0];

      const { data: scores } = await supabase
        .from("brain_scores")
        .select("category_id, score, date")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(20);

      if (scores && scores.length > 0) {
        const todayScores = scores.filter((s) => s.date === todayStr);
        const yScores = scores.filter((s) => s.date === yesterdayDate);

        if (todayScores.length > 0) {
          rawAvgScore = Math.round(todayScores.reduce((acc, curr) => acc + curr.score, 0) / todayScores.length);
        }
        if (yScores.length > 0) {
          yesterdayScore = Math.round(yScores.reduce((acc, curr) => acc + curr.score, 0) / yScores.length);
        } else {
          yesterdayScore = Math.max(40, rawAvgScore - 5);
        }
      }

      // 3. Fetch Today's Daily Workout Status
      const { data: dailyWorkout } = await supabase
        .from("daily_workouts")
        .select("id, status, workout_items(id, status, activity_id)")
        .eq("user_id", userId)
        .eq("date", todayStr)
        .maybeSingle();

      if (dailyWorkout) {
        isWorkoutCompleted = dailyWorkout.status === "completed";
      }

      // 4. Count workouts this week
      const dayOfWeek = new Date().getDay();
      const monday = new Date();
      monday.setDate(monday.getDate() - ((dayOfWeek + 6) % 7));
      const mondayStr = monday.toISOString().split("T")[0];

      const { count } = await supabase
        .from("daily_workouts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "completed")
        .gte("date", mondayStr);

      if (typeof count === "number") {
        workoutsThisWeek = count;
      }
    } catch (err) {
      console.warn("Habit engine data fetch fallback:", err);
    }
  }

  // Derive Beat Yourself Metrics
  const brainScore = Math.max(0, Math.min(100, rawAvgScore));
  const scoreDelta = brainScore - yesterdayScore;
  const isPersonalBest = scoreDelta > 0;

  // Category Breakdown with deltas
  const categoryScores = CATEGORIES.map((cat, idx) => {
    const baseOffset = [3, -1, 4, 2, 5][idx % 5];
    const catScore = Math.max(45, Math.min(98, brainScore + baseOffset));
    const catDelta = [4, 2, 5, 3, 4][idx % 5];
    return {
      id: cat.id,
      label: cat.label,
      score: catScore,
      delta: catDelta,
      color: cat.color || "#8B5CF6",
    };
  });

  // Derive Brain Age
  const brainAge = scoreToBrainAge(brainScore);
  const calculatedPrevAge = scoreToBrainAge(yesterdayScore);
  previousBrainAge = calculatedPrevAge > brainAge ? calculatedPrevAge : brainAge + 3;
  const ageImprovementYears = Math.max(1, previousBrainAge - brainAge);

  // Derive Momentum
  const momentumScore = Math.min(98, Math.max(25, 50 + (streak * 2) + (workoutsThisWeek * 5)));
  const previousMomentum = Math.max(20, momentumScore - (isWorkoutCompleted ? 3 : 0));
  const { label: momentumLabel, emoji: momentumEmoji, reason: momentumReason } = getMomentumInfo(momentumScore, workoutsThisWeek);

  // Derive 5 Balanced Activities for Today's Workout
  const dayIndex = new Date().getDate() % DEFAULT_OBJECTIVES.length;
  const todayObjective = DEFAULT_OBJECTIVES[dayIndex];

  const balancedActivities = [
    { id: "act-1", title: "Dual N-Back Recall", category: "Memory", color: "#3B82F6", durationSec: 90, difficulty: "intermediate", xp: 50, coins: 15 },
    { id: "act-2", title: "Stroop Speed Filter", category: "Focus", color: "#8B5CF6", durationSec: 60, difficulty: "intermediate", xp: 45, coins: 12 },
    { id: "act-3", title: "Rapid Visual Reflex", category: "Speed", color: "#EC4899", durationSec: 60, difficulty: "beginner", xp: 40, coins: 10 },
    { id: "act-4", title: "Syllogism Logic Gate", category: "Logic", color: "#10B981", durationSec: 90, difficulty: "intermediate", xp: 55, coins: 18 },
    { id: "act-5", title: "Rule-Switch Flex", category: "Flexibility", color: "#F59E0B", durationSec: 90, difficulty: "intermediate", xp: 50, coins: 15 },
  ];

  // Daily Habit Mission (1 Clear mission for today)
  const dailyMission = {
    id: "mission-today",
    title: "Morning Habit Anchor",
    description: isWorkoutCompleted
      ? "Workout completed! Your streak is locked in for today."
      : "Complete your 5-minute morning workout without skipping an activity.",
    target: 1,
    current: isWorkoutCompleted ? 1 : 0,
    xpReward: 75,
    coinReward: 30,
    isCompleted: isWorkoutCompleted,
    isClaimed: isWorkoutCompleted,
  };

  return {
    userName,
    greeting: getGreeting(userName),
    streak,
    streakMilestone: getStreakMilestoneInfo(streak),
    streakShields,
    brainScore,
    yesterdayScore,
    scoreDelta,
    isPersonalBest,
    categoryScores,
    brainAge,
    previousBrainAge,
    ageImprovementYears,
    brainAgeLabel: getBrainAgeLabel(brainAge),
    momentumScore,
    previousMomentumScore: previousMomentum,
    momentumLabel,
    momentumEmoji,
    momentumReason,
    workout: {
      id: "today-workout",
      isCompleted: isWorkoutCompleted,
      durationMinutes: 7,
      activityCount: balancedActivities.length,
      objective: todayObjective,
      activities: balancedActivities,
    },
    dailyMission,
    weeklyReport: {
      workoutsCompleted: workoutsThisWeek,
      totalTrainingMinutes: workoutsThisWeek * 7,
      bestBrainScore: Math.max(brainScore, yesterdayScore + 3),
      avgBrainScore: Math.round((brainScore + yesterdayScore) / 2),
      nextWeekGoal: "Complete 5 workouts and beat your current Brain Score of " + brainScore + ".",
    },
  };
}
