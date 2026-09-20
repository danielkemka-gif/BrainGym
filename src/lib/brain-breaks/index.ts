// ─────────────────────────────────────────────────────────────────────────────
// BRAIN BREAKS ENGINE: 60-Second Spontaneous Cognitive Refreshers
// ─────────────────────────────────────────────────────────────────────────────

export interface BrainBreakActivity {
  id: string;
  title: string;
  category: "focus" | "memory" | "logic" | "observation" | "speed";
  durationSeconds: number;
  description: string;
  tagline: string;
  pointsAwarded: number;
  xpAwarded: number;
}

export const QUICK_BRAIN_BREAKS: BrainBreakActivity[] = [
  {
    id: "memory-flash",
    title: "Memory Flash",
    category: "memory",
    durationSeconds: 60,
    description: "Memorize the sequence of 4 neural symbols and recall them in exact order.",
    tagline: "Sharp Working Memory Reset",
    pointsAwarded: 5,
    xpAwarded: 25,
  },
  {
    id: "odd-one-out",
    title: "Pattern Outlier",
    category: "observation",
    durationSeconds: 60,
    description: "Find the one pattern in the matrix that breaks the underlying rule.",
    tagline: "Rapid Visual Scan",
    pointsAwarded: 5,
    xpAwarded: 25,
  },
  {
    id: "rapid-logic",
    title: "Rapid Logic Drill",
    category: "logic",
    durationSeconds: 60,
    description: "Solve a fast-paced deductive logic statement before time runs out.",
    tagline: "Crisp Deductive Precision",
    pointsAwarded: 5,
    xpAwarded: 25,
  },
  {
    id: "reaction-reflex",
    title: "Neural Reflex",
    category: "speed",
    durationSeconds: 45,
    description: "Tap the instant the neural impulse changes to Emerald Green.",
    tagline: "Cognitive Processing Speed",
    pointsAwarded: 5,
    xpAwarded: 25,
  },
  {
    id: "focus-lock",
    title: "Focus Lock",
    category: "focus",
    durationSeconds: 60,
    description: "Track the shifting focus point across distracting background signals.",
    tagline: "Selective Attention Recharge",
    pointsAwarded: 5,
    xpAwarded: 25,
  },
];

export function getRandomBrainBreak(): BrainBreakActivity {
  const index = Math.floor(Math.random() * QUICK_BRAIN_BREAKS.length);
  return QUICK_BRAIN_BREAKS[index];
}

const BRAIN_BREAK_STATS_KEY = "braingym_brain_break_stats";

export interface BrainBreakStats {
  completedCount: number;
  lastCompletedDate: string;
  totalPointsEarned: number;
  bestReactionMs: number;
}

export function getBrainBreakStats(): BrainBreakStats {
  if (typeof window === "undefined") {
    return {
      completedCount: 4,
      lastCompletedDate: new Date().toISOString(),
      totalPointsEarned: 20,
      bestReactionMs: 240,
    };
  }

  try {
    const raw = localStorage.getItem(BRAIN_BREAK_STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Could not read brain break stats", e);
  }

  return {
    completedCount: 4,
    lastCompletedDate: new Date().toISOString(),
    totalPointsEarned: 20,
    bestReactionMs: 240,
  };
}

export function recordCompletedBrainBreak(points: number, reactionMs?: number): BrainBreakStats {
  const stats = getBrainBreakStats();
  const updated: BrainBreakStats = {
    completedCount: stats.completedCount + 1,
    lastCompletedDate: new Date().toISOString(),
    totalPointsEarned: stats.totalPointsEarned + points,
    bestReactionMs:
      reactionMs && (!stats.bestReactionMs || reactionMs < stats.bestReactionMs)
        ? reactionMs
        : stats.bestReactionMs,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(BRAIN_BREAK_STATS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save brain break stats", e);
    }
  }

  return updated;
}
