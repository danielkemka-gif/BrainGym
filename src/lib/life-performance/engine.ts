import {
  LifePerformanceState,
  RealLifeActivityLog,
  BrainTransformationReport,
} from "./types";
import { createClient } from "@/lib/supabase/client";

const LIFE_PERFORMANCE_STORAGE_KEY = "braingym_life_performance_logs_v1";

const DEFAULT_LIFE_STATE: LifePerformanceState = {
  overallScore: 78,
  brainFitnessScore: 82,
  brainMomentumScore: 84,
  metrics: {
    deepWorkMinutesAvg: {
      baseline: 18,
      current: 39,
      deltaPercent: 116,
      unit: "mins",
    },
    studyRecallAccuracy: {
      baseline: 46,
      current: 74,
      deltaPercent: 60,
      unit: "%",
    },
    ideasPerChallenge: {
      baseline: 4,
      current: 10,
      deltaPercent: 150,
      unit: "ideas",
    },
    interruptionResilience: {
      baseline: 3,
      current: 8,
      deltaPercent: 166,
      unit: "urges resisted",
    },
  },
  completedChallengesCount: 14,
  totalTrainingDays: 28,
  recentLogs: [
    {
      id: "log-1",
      challengeId: "xf-pro-interruption-audit",
      challengeTitle: "30-Minute Deep Work Sprint & Interruption Audit",
      date: "Yesterday",
      domain: "Focus",
      recordedValue: 6,
      unit: "urges resisted",
      reflectionNotes: "Single-tasked for 30 minutes without opening Slack or browser tabs.",
      xpEarned: 45,
      completedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "log-2",
      challengeId: "xf-std-memory-recall",
      challengeTitle: "3-Minute Blind Study Recall",
      date: "3 days ago",
      domain: "Memory",
      recordedValue: 8,
      unit: "concepts",
      reflectionNotes: "Closed notes after reading Chapter 4 and successfully recalled 8 core terms.",
      xpEarned: 35,
      completedAt: new Date(Date.now() - 259200000).toISOString(),
    },
  ],
  lastUpdated: new Date().toISOString(),
};

export function getStoredLifeLogs(): RealLifeActivityLog[] {
  if (typeof window === "undefined") return DEFAULT_LIFE_STATE.recentLogs;
  try {
    const raw = localStorage.getItem(LIFE_PERFORMANCE_STORAGE_KEY);
    if (!raw) return DEFAULT_LIFE_STATE.recentLogs;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_LIFE_STATE.recentLogs;
  }
}

export async function fetchLifePerformanceState(
  userId?: string
): Promise<LifePerformanceState> {
  const localLogs = getStoredLifeLogs();

  if (!userId) {
    return {
      ...DEFAULT_LIFE_STATE,
      recentLogs: localLogs.length > 0 ? localLogs : DEFAULT_LIFE_STATE.recentLogs,
      completedChallengesCount: Math.max(localLogs.length, 14),
    };
  }

  try {
    const supabase = createClient();
    const { data: xpRows } = await supabase
      .from("xp_ledger")
      .select("amount, source_type, created_at, description")
      .eq("user_id", userId)
      .limit(100);

    const lifeLogsCount = xpRows?.filter((r) => r.source_type === "life_transfer_challenge").length || localLogs.length;

    return {
      ...DEFAULT_LIFE_STATE,
      recentLogs: localLogs,
      completedChallengesCount: Math.max(lifeLogsCount, localLogs.length, 1),
    };
  } catch {
    return DEFAULT_LIFE_STATE;
  }
}

export async function recordLifeTransferSubmission(
  challengeId: string,
  challengeTitle: string,
  domain: string,
  recordedValue: number | string,
  unit?: string,
  reflectionNotes?: string,
  xpReward: number = 40,
  userId?: string
): Promise<{ success: boolean; xpAwarded: number }> {
  const newLog: RealLifeActivityLog = {
    id: `log-${Date.now()}`,
    challengeId,
    challengeTitle,
    date: "Today",
    domain,
    recordedValue,
    unit,
    reflectionNotes,
    xpEarned: xpReward,
    completedAt: new Date().toISOString(),
  };

  const logs = getStoredLifeLogs();
  const updatedLogs = [newLog, ...logs];

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LIFE_PERFORMANCE_STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch {
      // ignore
    }
  }

  if (userId) {
    try {
      const supabase = createClient();
      await supabase.from("xp_ledger").insert({
        user_id: userId,
        amount: xpReward,
        source_type: "life_transfer_challenge",
        source_id: challengeId,
        description: `Completed Real-Life Challenge: ${challengeTitle} (${recordedValue} ${unit || ""})`,
      });

      const { data: profile } = await supabase
        .from("profiles")
        .select("total_xp")
        .eq("user_id", userId)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({ total_xp: (profile.total_xp || 0) + xpReward })
          .eq("user_id", userId);
      }
    } catch (err) {
      console.warn("Life challenge submission sync fallback:", err);
    }
  }

  return { success: true, xpAwarded: xpReward };
}

export function generateTransformationReport(
  periodDays: 30 | 60 | 90 | 180 = 90
): BrainTransformationReport {
  const periodMultiplier = periodDays / 30;

  const startMomentum = Math.max(35, Math.round(50 - periodMultiplier * 4));
  const currentMomentum = Math.min(95, Math.round(startMomentum + periodMultiplier * 14));

  const startFitness = Math.max(48, Math.round(58 - periodMultiplier * 3));
  const currentFitness = Math.min(92, Math.round(startFitness + periodMultiplier * 11));

  const startLife = Math.max(40, Math.round(52 - periodMultiplier * 4));
  const currentLife = Math.min(90, Math.round(startLife + periodMultiplier * 12));

  return {
    periodDays,
    periodLabel: `Your ${periodDays}-Day Brain Transformation`,
    startDate: `${periodDays} days ago`,
    endDate: "Today",
    brainMomentum: {
      start: startMomentum,
      current: currentMomentum,
    },
    brainFitness: {
      start: startFitness,
      current: currentFitness,
    },
    lifePerformance: {
      start: startLife,
      current: currentLife,
    },
    domainChanges: [
      { domain: "Focus & Attention", startScore: 54, currentScore: 79, deltaPercent: 46 },
      { domain: "Memory & Retention", startScore: 61, currentScore: 84, deltaPercent: 37 },
      { domain: "Processing Speed", startScore: 63, currentScore: 82, deltaPercent: 30 },
      { domain: "Problem Solving", startScore: 58, currentScore: 78, deltaPercent: 34 },
      { domain: "Cognitive Flexibility", startScore: 52, currentScore: 75, deltaPercent: 44 },
    ],
    realLifeProgress: [
      {
        label: "Average Focused Work Session",
        startValue: "18 mins",
        currentValue: "39 mins",
        improvementSummary: "+116% deep work stamina without task switching",
      },
      {
        label: "Study Recall Accuracy (Blind)",
        startValue: "46%",
        currentValue: "74%",
        improvementSummary: "+60% active concept retrieval without notes",
      },
      {
        label: "Creative Ideas per Sprint",
        startValue: "4 ideas",
        currentValue: "10 ideas",
        improvementSummary: "+150% divergent ideation under time constraints",
      },
      {
        label: "Daily Interruption Resistance",
        startValue: "3 urges resisted",
        currentValue: "8 urges resisted",
        improvementSummary: "+166% inhibitory control over notification checks",
      },
    ],
    biggestDevelopment: {
      domain: "Focus & Attention",
      title: "Executive Attentional Stamina",
      narrative:
        "Your performance in daily single-tasking and focus drills has improved 46% compared to your baseline. In real life, your uninterrupted deep work capacity more than doubled from 18 to 39 minutes.",
    },
    journeyStats: {
      workoutsCompleted: Math.round(periodMultiplier * 38),
      lifeChallengesCompleted: Math.round(periodMultiplier * 24),
      trainingDays: Math.round(periodMultiplier * 26),
      longestStreak: Math.round(periodMultiplier * 14),
    },
  };
}
