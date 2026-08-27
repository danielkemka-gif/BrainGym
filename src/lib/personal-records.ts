export interface PersonalRecordsState {
  highestAccuracyPercent: number;
  fastestReactionTimeMs: number;
  longestStreakDays: number;
  highestBrainMomentum: number;
  mostWeeklyActivities: number;
  bestBaselineImprovementPct: number;
  lastUpdated: string;
}

export interface BrokenRecord {
  type: keyof PersonalRecordsState;
  title: string;
  previousValue: string | number;
  newValue: string | number;
  unit: string;
  insight: string;
}

const STORAGE_KEY = "braingym_personal_records_v1";

const DEFAULT_RECORDS: PersonalRecordsState = {
  highestAccuracyPercent: 85,
  fastestReactionTimeMs: 1450,
  longestStreakDays: 14,
  highestBrainMomentum: 78,
  mostWeeklyActivities: 5,
  bestBaselineImprovementPct: 8.5,
  lastUpdated: new Date().toISOString(),
};

export function getPersonalRecords(): PersonalRecordsState {
  if (typeof window === "undefined") return DEFAULT_RECORDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_RECORDS;
    return { ...DEFAULT_RECORDS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_RECORDS;
  }
}

export function evaluatePersonalRecords(currentMetrics: {
  accuracyPercent?: number;
  reactionTimeMs?: number;
  streakDays?: number;
  brainMomentum?: number;
  weeklyActivities?: number;
  baselineImprovementPct?: number;
}): { newRecords: BrokenRecord[]; updatedState: PersonalRecordsState } {
  const records = getPersonalRecords();
  const newRecords: BrokenRecord[] = [];
  const updated: PersonalRecordsState = { ...records };

  // 1. Accuracy
  if (currentMetrics.accuracyPercent && currentMetrics.accuracyPercent > records.highestAccuracyPercent) {
    newRecords.push({
      type: "highestAccuracyPercent",
      title: "Highest Accuracy Record",
      previousValue: records.highestAccuracyPercent,
      newValue: currentMetrics.accuracyPercent,
      unit: "%",
      insight: "Your attention to detail and precision reached a new all-time high.",
    });
    updated.highestAccuracyPercent = currentMetrics.accuracyPercent;
  }

  // 2. Reaction Time (lower is faster)
  if (
    currentMetrics.reactionTimeMs &&
    currentMetrics.reactionTimeMs > 200 &&
    currentMetrics.reactionTimeMs < records.fastestReactionTimeMs
  ) {
    newRecords.push({
      type: "fastestReactionTimeMs",
      title: "Fastest Processing Speed",
      previousValue: (records.fastestReactionTimeMs / 1000).toFixed(2),
      newValue: (currentMetrics.reactionTimeMs / 1000).toFixed(2),
      unit: "s",
      insight: "Your neural transmission and visual-motor response velocity peaked.",
    });
    updated.fastestReactionTimeMs = currentMetrics.reactionTimeMs;
  }

  // 3. Streak
  if (currentMetrics.streakDays && currentMetrics.streakDays > records.longestStreakDays) {
    newRecords.push({
      type: "longestStreakDays",
      title: "Longest Habit Streak",
      previousValue: records.longestStreakDays,
      newValue: currentMetrics.streakDays,
      unit: "days",
      insight: "Your cognitive habit consistency just crossed into uncharted territory.",
    });
    updated.longestStreakDays = currentMetrics.streakDays;
  }

  // 4. Brain Momentum
  if (currentMetrics.brainMomentum && currentMetrics.brainMomentum > records.highestBrainMomentum) {
    newRecords.push({
      type: "highestBrainMomentum",
      title: "Peak Brain Momentum",
      previousValue: records.highestBrainMomentum,
      newValue: currentMetrics.brainMomentum,
      unit: "pts",
      insight: "Your training velocity, frequency, and cognitive balance reached an all-time peak.",
    });
    updated.highestBrainMomentum = currentMetrics.brainMomentum;
  }

  if (typeof window !== "undefined" && newRecords.length > 0) {
    try {
      updated.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage write errors
    }
  }

  return { newRecords, updatedState: updated };
}
