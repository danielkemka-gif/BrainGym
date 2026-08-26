import { createClient } from "@/lib/supabase/client";
import {
  BrainMomentumState,
  PrescribedDailyWorkout,
  UserCognitiveProfile,
  WorkoutDurationMode,
  WeeklyBrainReport,
  CognitiveDomain,
} from "./types";
import { calculateBrainMomentum } from "./calculator";
import { generatePrescribedWorkout } from "./adaptive-recommender";

const LOCAL_STORAGE_MOMENTUM_KEY = "braingym_momentum_state_v1";
const LOCAL_STORAGE_WORKOUT_KEY = "braingym_prescribed_workout_v1";

export interface EngineFullState {
  momentum: BrainMomentumState;
  prescribedWorkout: PrescribedDailyWorkout;
  profile: UserCognitiveProfile;
  weeklyReport: WeeklyBrainReport;
}

export async function fetchBrainMomentumEngineState(
  userId?: string,
  durationMode: WorkoutDurationMode = "standard",
  isSurpriseMode: boolean = false
): Promise<EngineFullState> {
  const supabase = createClient();
  let streak = 14;
  let weeklyWorkoutsCount = 4;
  let challengesCompletedWeekly = 2;
  let previousMomentumScore = 72;
  let primaryGoal = "Focus & Mental Agility";
  let recentScores: Record<string, number> = {
    Memory: 84,
    Focus: 71,
    "Processing Speed": 89,
    Attention: 73,
    "Problem Solving": 78,
    "Reaction Time": 82,
    "Working Memory": 79,
  };
  let historicalScores: Record<string, number[]> = {
    Memory: [76, 78, 80, 84],
    Focus: [78, 77, 74, 71],
    "Processing Speed": [82, 85, 87, 89],
    Attention: [76, 75, 74, 73],
    "Problem Solving": [74, 75, 77, 78],
    "Reaction Time": [78, 80, 81, 82],
    "Working Memory": [75, 76, 78, 79],
  };

  if (userId) {
    try {
      // 1. Fetch Profile & Streak
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_streak, streak_count, best_streak, total_xp, goals")
        .eq("user_id", userId)
        .maybeSingle();

      if (profile) {
        streak = profile.current_streak ?? profile.streak_count ?? 14;
        if (profile.goals && profile.goals.length > 0) {
          primaryGoal = profile.goals.join(", ");
        }
      }

      // 2. Fetch Weekly completed workouts
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

      if (typeof count === "number" && count > 0) {
        weeklyWorkoutsCount = count;
      }

      // 3. Fetch Recent Brain Scores
      const { data: scoreRows } = await supabase
        .from("brain_scores")
        .select("category_id, score, date")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(40);

      if (scoreRows && scoreRows.length > 0) {
        const catMap: Record<string, string> = {
          memory: "Memory",
          focus: "Focus",
          speed: "Processing Speed",
          thinking: "Problem Solving",
          learning: "Attention",
        };

        scoreRows.forEach((r) => {
          const dom = catMap[r.category_id] || "Memory";
          if (!recentScores[dom]) recentScores[dom] = r.score;
          if (!historicalScores[dom]) historicalScores[dom] = [];
          historicalScores[dom].push(r.score);
        });
      }
    } catch (err) {
      console.warn("Momentum Engine data fetch fallback:", err);
    }
  }

  // Calculate Momentum State
  const momentum = calculateBrainMomentum({
    streak,
    weeklyWorkoutsCount,
    challengesCompletedWeekly,
    recentScores,
    historicalDomainScores: historicalScores,
    previousMomentumScore,
  });

  const profile: UserCognitiveProfile = {
    userId: userId || "guest",
    primaryGoal,
    preferredDuration: durationMode,
    streak,
    bestStreak: Math.max(streak, 21),
    workoutsCompletedTotal: weeklyWorkoutsCount + 18,
    workoutsCompletedThisWeek: weeklyWorkoutsCount,
    domainBaselines: Object.fromEntries(
      Object.entries(momentum.domainProfiles).map(([k, v]) => [k, v.baselineScore])
    ) as Record<CognitiveDomain, number>,
    domainScores: recentScores as Record<CognitiveDomain, number>,
    momentumHistory: [
      { date: "6 days ago", score: Math.max(30, momentum.score - 8) },
      { date: "5 days ago", score: Math.max(30, momentum.score - 6) },
      { date: "4 days ago", score: Math.max(30, momentum.score - 4) },
      { date: "3 days ago", score: Math.max(30, momentum.score - 3) },
      { date: "2 days ago", score: Math.max(30, momentum.score - 1) },
      { date: "Yesterday", score: previousMomentumScore },
      { date: "Today", score: momentum.score },
    ],
    recentWorkoutIds: [],
  };

  // Generate Adaptive Prescribed Daily Workout
  const prescribedWorkout = generatePrescribedWorkout(
    momentum,
    profile,
    durationMode,
    isSurpriseMode
  );

  // Weekly Brain Report
  const weeklyReport: WeeklyBrainReport = {
    weekStart: "This Week",
    momentumScore: momentum.score,
    momentumDelta: momentum.weeklyDelta,
    strongestArea: momentum.strongestDomain,
    areaNeedingAttention: momentum.domainNeedingAttention,
    bestImprovement: `${momentum.strongestDomain} (+${momentum.domainProfiles[momentum.strongestDomain]?.trendPercentage ?? 8}%)`,
    consistencyDays: Math.min(7, weeklyWorkoutsCount),
    totalTrainingMinutes: weeklyWorkoutsCount * 8,
    challengesCompleted: challengesCompletedWeekly,
    nextWeekFocus: `We'll place slightly more emphasis on ${momentum.domainNeedingAttention} while consolidating your progress in ${momentum.strongestDomain}.`,
  };

  return {
    momentum,
    prescribedWorkout,
    profile,
    weeklyReport,
  };
}
