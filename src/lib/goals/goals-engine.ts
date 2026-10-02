/**
 * Unified Goals & Results Loop Engine
 * Manages simple, action-oriented goals, progress tracking, outcome measurement,
 * and reflective learning adjustments.
 * 
 * Think → Act → Measure → Learn → Adjust.
 */

export interface GoalResultLog {
  id: string;
  goalId: string;
  date: string;
  metricLabel: string;
  metricValue: string | number;
  reflection: string;
  nextAdjustment: string;
}

export interface BrainGoal {
  id: string;
  userId?: string;
  title: string;
  currentSituation: string;
  target: number;
  currentProgress: number;
  unit: string;
  nextAction: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  resultsHistory: GoalResultLog[];
}

const STORAGE_KEY = "braingym_active_goals_v2";

const DEFAULT_INITIAL_GOAL: BrainGoal = {
  id: "default-goal-1",
  title: "Get 10 new customers this month",
  currentSituation: "Currently reaching out through referrals and WhatsApp",
  target: 10,
  currentProgress: 6,
  unit: "customers",
  nextAction: "Contact 10 qualified prospects before 6 PM",
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  resultsHistory: [
    {
      id: "res-init-1",
      goalId: "default-goal-1",
      date: new Date(Date.now() - 86400000).toISOString(),
      metricLabel: "Prospects Contacted",
      metricValue: "10 contacted · 4 replies · 1 signed",
      reflection: "Prospects responded faster when the message addressed their specific scheduling pain point.",
      nextAdjustment: "Personalize the opening sentence for the next batch of 10 prospects.",
    },
  ],
};

export async function getActiveGoal(userId?: string): Promise<BrainGoal | null> {
  if (typeof window === "undefined") return DEFAULT_INITIAL_GOAL;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([DEFAULT_INITIAL_GOAL]));
      return DEFAULT_INITIAL_GOAL;
    }
    const goals: BrainGoal[] = JSON.parse(raw);
    const active = goals.find((g) => g.isActive);
    return active || goals[0] || DEFAULT_INITIAL_GOAL;
  } catch {
    return DEFAULT_INITIAL_GOAL;
  }
}

export async function getAllGoals(userId?: string): Promise<BrainGoal[]> {
  if (typeof window === "undefined") return [DEFAULT_INITIAL_GOAL];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([DEFAULT_INITIAL_GOAL]));
      return [DEFAULT_INITIAL_GOAL];
    }
    return JSON.parse(raw);
  } catch {
    return [DEFAULT_INITIAL_GOAL];
  }
}

export async function saveGoal(goalData: Partial<BrainGoal>, userId?: string): Promise<BrainGoal> {
  const currentGoals = await getAllGoals(userId);
  const now = new Date().toISOString();

  let targetGoal: BrainGoal;

  if (goalData.id) {
    const existingIndex = currentGoals.findIndex((g) => g.id === goalData.id);
    if (existingIndex >= 0) {
      targetGoal = {
        ...currentGoals[existingIndex],
        ...goalData,
        updatedAt: now,
      };
      if (goalData.isActive) {
        currentGoals.forEach((g) => {
          if (g.id !== targetGoal.id) g.isActive = false;
        });
      }
      currentGoals[existingIndex] = targetGoal;
    } else {
      targetGoal = {
        id: goalData.id,
        userId,
        title: goalData.title || "My Goal",
        currentSituation: goalData.currentSituation || "",
        target: goalData.target || 10,
        currentProgress: goalData.currentProgress || 0,
        unit: goalData.unit || "units",
        nextAction: goalData.nextAction || "Take first concrete step",
        isActive: true,
        createdAt: now,
        updatedAt: now,
        resultsHistory: [],
      };
      currentGoals.forEach((g) => (g.isActive = false));
      currentGoals.unshift(targetGoal);
    }
  } else {
    targetGoal = {
      id: "goal_" + Date.now(),
      userId,
      title: goalData.title || "New Goal",
      currentSituation: goalData.currentSituation || "",
      target: goalData.target || 10,
      currentProgress: goalData.currentProgress || 0,
      unit: goalData.unit || "units",
      nextAction: goalData.nextAction || "Take next step",
      isActive: true,
      createdAt: now,
      updatedAt: now,
      resultsHistory: [],
    };
    currentGoals.forEach((g) => (g.isActive = false));
    currentGoals.unshift(targetGoal);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentGoals));
  }

  return targetGoal;
}

export async function updateGoalProgress(
  goalId: string,
  newProgress: number,
  userId?: string
): Promise<BrainGoal | null> {
  const currentGoals = await getAllGoals(userId);
  const goalIndex = currentGoals.findIndex((g) => g.id === goalId);
  if (goalIndex === -1) return null;

  currentGoals[goalIndex].currentProgress = Math.max(0, newProgress);
  currentGoals[goalIndex].updatedAt = new Date().toISOString();

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentGoals));
  }
  return currentGoals[goalIndex];
}

export async function logGoalResult(
  goalId: string,
  result: {
    metricLabel: string;
    metricValue: string | number;
    reflection: string;
    nextAdjustment: string;
    progressIncrement?: number;
  },
  userId?: string
): Promise<BrainGoal | null> {
  const currentGoals = await getAllGoals(userId);
  const goalIndex = currentGoals.findIndex((g) => g.id === goalId);
  if (goalIndex === -1) return null;

  const now = new Date().toISOString();
  const log: GoalResultLog = {
    id: "log_" + Date.now(),
    goalId,
    date: now,
    metricLabel: result.metricLabel,
    metricValue: result.metricValue,
    reflection: result.reflection,
    nextAdjustment: result.nextAdjustment,
  };

  currentGoals[goalIndex].resultsHistory = [log, ...(currentGoals[goalIndex].resultsHistory || [])];
  if (result.progressIncrement) {
    currentGoals[goalIndex].currentProgress += result.progressIncrement;
  }
  if (result.nextAdjustment) {
    currentGoals[goalIndex].nextAction = result.nextAdjustment;
  }
  currentGoals[goalIndex].updatedAt = now;

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentGoals));
  }
  return currentGoals[goalIndex];
}
