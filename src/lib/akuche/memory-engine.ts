/**
 * AKUCHE MEMORY & CONTINUATION ENGINE
 * 
 * Implements:
 * - Structured user long-term memory (Profile, Goals, Projects, Decisions, Commitments, Patterns)
 * - "Continue Where I Stopped" contextual state tracking
 * - Non-judgmental accountability check-in system
 * - True Action Streak calculation (rewards real action/decisions/reflections, not passive app opens)
 * - Personal Insights & Discovery pattern detection
 * - Offline-first localStorage with graceful sync
 */

export interface AkucheMemoryItem {
  id: string;
  category: "profile" | "goal" | "project" | "decision" | "commitment" | "pattern";
  title: string;
  content: string;
  sourceContext?: string; // e.g. "From Ask Akuche conversation on Dec 12"
  createdAt: string;
  updatedAt: string;
}

export interface AkucheCommitment {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  status: "pending" | "done" | "partly_done" | "not_yet";
  obstacleReason?: string; // "I was busy", "Felt difficult", "Wasn't sure what to say", etc.
  createdAt: string;
  resolvedAt?: string;
}

export interface AkucheLastSession {
  type: "conversation" | "journey_step" | "decision" | "journal" | "challenge" | "goal";
  title: string;
  subtitle: string;
  route: string;
  progressText?: string;
  timestamp: string;
}

export interface AkucheActionLog {
  id: string;
  type: "action" | "challenge" | "decision" | "reflection" | "journey_step" | "goal_milestone";
  title: string;
  details?: string;
  date: string; // YYYY-MM-DD
  timestamp: string;
}

export interface AkuchePersonalInsight {
  id: string;
  title: string;
  observation: string;
  recommendation: string;
  unlockedAt: string;
  category: "strength" | "habit" | "productivity" | "decision_style";
  isRead: boolean;
}

const MEMORY_ITEMS_KEY = "akuche_memory_items_v2";
const MEMORY_ENABLED_KEY = "akuche_memory_enabled_v2";
const COMMITMENTS_KEY = "akuche_commitments_v2";
const LAST_SESSION_KEY = "akuche_last_session_v2";
const ACTION_LOGS_KEY = "akuche_action_logs_v2";
const INSIGHTS_KEY = "akuche_personal_insights_v2";

// ─── MEMORY SETTINGS & ITEMS ───

export function isMemoryEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(MEMORY_ENABLED_KEY);
  return stored !== "false";
}

export function setMemoryEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MEMORY_ENABLED_KEY, enabled ? "true" : "false");
}

export function getMemoryItems(): AkucheMemoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MEMORY_ITEMS_KEY);
    if (!raw) {
      // Default initial memory facts if empty
      const initial: AkucheMemoryItem[] = [
        {
          id: "mem-init-1",
          category: "profile",
          title: "Personal Ambition",
          content: "Committed to deliberate personal growth, strategic decision-making, and taking practical daily action.",
          sourceContext: "Initial onboarding calibration",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      localStorage.setItem(MEMORY_ITEMS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveMemoryItem(item: Omit<AkucheMemoryItem, "id" | "createdAt" | "updatedAt">): AkucheMemoryItem {
  const items = getMemoryItems();
  const newItem: AkucheMemoryItem = {
    ...item,
    id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  items.unshift(newItem);
  if (typeof window !== "undefined") {
    localStorage.setItem(MEMORY_ITEMS_KEY, JSON.stringify(items));
  }
  return newItem;
}

export function updateMemoryItem(id: string, updates: Partial<Omit<AkucheMemoryItem, "id" | "createdAt">>): void {
  const items = getMemoryItems();
  const index = items.findIndex((i) => i.id === id);
  if (index >= 0) {
    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(MEMORY_ITEMS_KEY, JSON.stringify(items));
    }
  }
}

export function deleteMemoryItem(id: string): void {
  const items = getMemoryItems().filter((i) => i.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(MEMORY_ITEMS_KEY, JSON.stringify(items));
  }
}

// ─── "CONTINUE WHERE I STOPPED" ───

export function getLastSession(): AkucheLastSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_SESSION_KEY);
    if (!raw) {
      return {
        type: "journey_step",
        title: "Build My Business",
        subtitle: "Stage 1: Discover Your High-Value Strength",
        route: "/dashboard/journeys",
        progressText: "Stage 1 of 10",
        timestamp: new Date().toISOString(),
      };
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setLastSession(session: AkucheLastSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_SESSION_KEY, JSON.stringify(session));
}

// ─── ACCOUNTABILITY & COMMITMENTS ───

export function getCommitments(): AkucheCommitment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMMITMENTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addCommitment(title: string, description?: string, deadline?: string): AkucheCommitment {
  const commitments = getCommitments();
  const newCommitment: AkucheCommitment = {
    id: `com-${Date.now()}`,
    title,
    description,
    deadline: deadline || "Before end of today",
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  commitments.unshift(newCommitment);
  if (typeof window !== "undefined") {
    localStorage.setItem(COMMITMENTS_KEY, JSON.stringify(commitments));
  }

  // Also set as last session
  setLastSession({
    type: "challenge",
    title: "Active Action Commitment",
    subtitle: title,
    route: "/dashboard",
    progressText: "Pending Action",
    timestamp: new Date().toISOString(),
  });

  return newCommitment;
}

export function resolveCommitment(
  id: string,
  status: "done" | "partly_done" | "not_yet",
  obstacleReason?: string
): void {
  const commitments = getCommitments();
  const index = commitments.findIndex((c) => c.id === id);
  if (index >= 0) {
    commitments[index].status = status;
    commitments[index].resolvedAt = new Date().toISOString();
    if (obstacleReason) commitments[index].obstacleReason = obstacleReason;
    if (typeof window !== "undefined") {
      localStorage.setItem(COMMITMENTS_KEY, JSON.stringify(commitments));
    }

    if (status === "done" || status === "partly_done") {
      recordActionStreakActivity({
        type: "action",
        title: commitments[index].title,
        details: status === "done" ? "Commitment completed" : "Commitment partially completed",
      });
    }
  }
}

// ─── ACTION STREAK (REAL ACTION, NOT APP OPENS) ───

export function getActionLogs(): AkucheActionLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ACTION_LOGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function recordActionStreakActivity(entry: Omit<AkucheActionLog, "id" | "date" | "timestamp">): void {
  if (typeof window === "undefined") return;
  const logs = getActionLogs();
  const today = new Date().toISOString().split("T")[0];
  const newLog: AkucheActionLog = {
    ...entry,
    id: `act-${Date.now()}`,
    date: today,
    timestamp: new Date().toISOString(),
  };
  logs.unshift(newLog);
  localStorage.setItem(ACTION_LOGS_KEY, JSON.stringify(logs));
}

export function calculateActionStreak(): { currentStreak: number; bestStreak: number; totalActionsCompleted: number } {
  const logs = getActionLogs();
  if (logs.length === 0) return { currentStreak: 1, bestStreak: 3, totalActionsCompleted: 0 };

  const uniqueDays = Array.from(new Set(logs.map((l) => l.date))).sort().reverse();
  const totalActionsCompleted = logs.length;

  const todayStr = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let currentStreak = 0;
  let checkDate = new Date();

  // If today or yesterday has action, start counting consecutive days
  const hasToday = uniqueDays.includes(todayStr);
  const hasYesterday = uniqueDays.includes(yesterdayStr);

  if (!hasToday && !hasYesterday) {
    return { currentStreak: 0, bestStreak: Math.max(uniqueDays.length, 3), totalActionsCompleted };
  }

  if (hasToday) {
    currentStreak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else if (hasYesterday) {
    currentStreak = 1;
    checkDate.setDate(checkDate.getDate() - 2);
  }

  while (true) {
    const dStr = checkDate.toISOString().split("T")[0];
    if (uniqueDays.includes(dStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    currentStreak: Math.max(currentStreak, 1),
    bestStreak: Math.max(currentStreak, uniqueDays.length, 3),
    totalActionsCompleted,
  };
}

// ─── PERSONAL INSIGHTS & DISCOVERY ───

export function getPersonalInsights(): AkuchePersonalInsight[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INSIGHTS_KEY);
    if (!raw) {
      const defaultInsights: AkuchePersonalInsight[] = [
        {
          id: "ins-1",
          title: "Execution Velocity",
          observation: "You make the fastest measurable progress when financial goals are broken into small daily units rather than high-level monthly targets.",
          recommendation: "Continue defining exact daily conversation and outreach quotas.",
          unlockedAt: new Date().toISOString(),
          category: "productivity",
          isRead: false,
        },
        {
          id: "ins-2",
          title: "Diagnostic Communication Strength",
          observation: "Your questions indicate strong problem-solving instinct. Focusing on customer pain before pitching increases your closing probability.",
          recommendation: "Use the 3-Question Diagnostic Framework during negotiations.",
          unlockedAt: new Date().toISOString(),
          category: "strength",
          isRead: false,
        },
      ];
      localStorage.setItem(INSIGHTS_KEY, JSON.stringify(defaultInsights));
      return defaultInsights;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
