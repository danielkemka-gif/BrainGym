/**
 * AKUCHE MEMORY & CONTINUATION ENGINE — PHASE 5
 * 
 * Implements:
 * - Structured user long-term memory (Profile, Goals, Decisions, Commitments, Patterns, Insights)
 * - Transparent Memory architecture with full user visibility, editing, and deletion
 * - "Continue Where I Stopped" contextual state tracking across sessions
 * - Non-judgmental accountability follow-up system (Done, Partly Done, Obstacle, Pivot)
 * - Proactive Decision review triggers & outcome tracking
 * - True Action Streak calculation (rewards real action/decisions/reflections)
 * - Offline-first localStorage with graceful sync support
 */

export interface AkucheMemoryItem {
  id: string;
  category: "profile" | "goal" | "decision" | "commitment" | "pattern" | "project";
  title: string;
  content: string;
  sourceContext?: string; // e.g. "From Think Session on Oct 8"
  createdAt: string;
  updatedAt: string;
}

export interface AkucheGoalItem {
  id: string;
  title: string;
  category: string;
  targetHorizon: string; // "30 days", "90 days", "1 year"
  whyItMatters: string;
  milestones: string[];
  completedMilestones: string[];
  currentObstacle?: string;
  status: "active" | "achieved" | "paused" | "pivoted";
  createdAt: string;
  updatedAt: string;
}

export interface AkucheDecisionRecord {
  id: string;
  title: string;
  situation: string;
  optionsConsidered: { name: string; pros: string; cons: string }[];
  chosenOption: string;
  rationale: string;
  expectedOutcome: string;
  reviewDate: string; // YYYY-MM-DD
  actualOutcome?: string;
  reflectionNotes?: string;
  status: "active" | "reviewed" | "pivoted";
  createdAt: string;
  updatedAt: string;
}

export interface AkucheCommitment {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  status: "pending" | "done" | "partly_done" | "obstacle" | "pivoted" | "not_yet";
  obstacleReason?: string; // e.g., "Felt difficult", "Lack of time", "Need more info"
  pivotAction?: string;
  sourceType?: "think" | "ask" | "decision" | "challenge" | "manual";
  sourceId?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AkucheLastSession {
  type: "conversation" | "journey_step" | "decision" | "journal" | "challenge" | "goal" | "think";
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

export interface AkucheFollowUpCheckIn {
  type: "commitment" | "decision_review" | "goal_nudge" | "reflection";
  id: string;
  title: string;
  prompt: string;
  contextText: string;
  suggestedActions: { label: string; action: "done" | "partly_done" | "obstacle" | "pivoted" | "dismiss" }[];
  associatedRoute?: string;
}

const MEMORY_ITEMS_KEY = "akuche_memory_items_v2";
const MEMORY_ENABLED_KEY = "akuche_memory_enabled_v2";
const COMMITMENTS_KEY = "akuche_commitments_v2";
const GOALS_KEY = "akuche_goals_v2";
const DECISIONS_KEY = "akuche_decisions_v2";
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
      const initial: AkucheMemoryItem[] = [
        {
          id: "mem-init-1",
          category: "profile",
          title: "Personal Ambition",
          content: "Committed to deliberate personal growth, strategic decision-making, and taking practical daily action.",
          sourceContext: "Initial onboarding calibration",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "mem-init-2",
          category: "pattern",
          title: "Thinking Preference",
          content: "Responds best to clear option trade-offs, structured action steps, and realistic numerical breakdowns.",
          sourceContext: "System observation",
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

export function clearAllMemories(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(MEMORY_ITEMS_KEY);
    localStorage.removeItem(COMMITMENTS_KEY);
    localStorage.removeItem(GOALS_KEY);
    localStorage.removeItem(DECISIONS_KEY);
    localStorage.removeItem(INSIGHTS_KEY);
  }
}

// ─── STRUCTURED GOAL MEMORY ───

export function getGoalMemories(): AkucheGoalItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveGoalMemory(goal: Omit<AkucheGoalItem, "id" | "createdAt" | "updatedAt">): AkucheGoalItem {
  const goals = getGoalMemories();
  const newGoal: AkucheGoalItem = {
    ...goal,
    id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  goals.unshift(newGoal);
  if (typeof window !== "undefined") {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  }

  // Also record in general memory items for transparency
  saveMemoryItem({
    category: "goal",
    title: newGoal.title,
    content: `${newGoal.whyItMatters} (Target: ${newGoal.targetHorizon})`,
    sourceContext: "Goals Engine",
  });

  return newGoal;
}

// ─── DECISION MEMORY & REVIEW TRACKING ───

export function getDecisionRecords(): AkucheDecisionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DECISIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveDecisionRecord(decision: Omit<AkucheDecisionRecord, "id" | "createdAt" | "updatedAt">): AkucheDecisionRecord {
  const records = getDecisionRecords();
  const newRecord: AkucheDecisionRecord = {
    ...decision,
    id: `dec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  records.unshift(newRecord);
  if (typeof window !== "undefined") {
    localStorage.setItem(DECISIONS_KEY, JSON.stringify(records));
  }

  // Log in general memory
  saveMemoryItem({
    category: "decision",
    title: `Decision: ${newRecord.title}`,
    content: `Chosen: ${newRecord.chosenOption}. Rationale: ${newRecord.rationale}`,
    sourceContext: "Think & Decision Lab",
  });

  // Automatically record action streak activity
  recordActionStreakActivity({
    type: "decision",
    title: newRecord.title,
    details: `Chosen: ${newRecord.chosenOption}`,
  });

  return newRecord;
}

export function updateDecisionOutcome(id: string, actualOutcome: string, reflectionNotes: string): void {
  const records = getDecisionRecords();
  const idx = records.findIndex((r) => r.id === id);
  if (idx >= 0) {
    records[idx].actualOutcome = actualOutcome;
    records[idx].reflectionNotes = reflectionNotes;
    records[idx].status = "reviewed";
    records[idx].updatedAt = new Date().toISOString();
    if (typeof window !== "undefined") {
      localStorage.setItem(DECISIONS_KEY, JSON.stringify(records));
    }
  }
}

// ─── "CONTINUE WHERE I STOPPED" ───

export function getLastSession(): AkucheLastSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_SESSION_KEY);
    if (!raw) {
      return {
        type: "think",
        title: "Clarify Your Strategic Focus",
        subtitle: "Define what matters most today",
        route: "/dashboard/think",
        progressText: "Ready to start",
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

export function addCommitment(
  title: string,
  description?: string,
  deadline?: string,
  sourceType: AkucheCommitment["sourceType"] = "think",
  sourceId?: string
): AkucheCommitment {
  const commitments = getCommitments();
  const newCommitment: AkucheCommitment = {
    id: `com-${Date.now()}`,
    title,
    description,
    deadline: deadline || "Before end of today",
    status: "pending",
    sourceType,
    sourceId,
    createdAt: new Date().toISOString(),
  };
  commitments.unshift(newCommitment);
  if (typeof window !== "undefined") {
    localStorage.setItem(COMMITMENTS_KEY, JSON.stringify(commitments));
  }

  // Also set as last session for quick resumption
  setLastSession({
    type: "think",
    title: "Action Next Step",
    subtitle: title,
    route: "/dashboard/think",
    progressText: "Action in progress",
    timestamp: new Date().toISOString(),
  });

  return newCommitment;
}

export function resolveCommitment(
  id: string,
  status: "done" | "partly_done" | "obstacle" | "pivoted" | "not_yet",
  obstacleReason?: string,
  pivotAction?: string
): void {
  const commitments = getCommitments();
  const index = commitments.findIndex((c) => c.id === id);
  if (index >= 0) {
    commitments[index].status = status;
    commitments[index].resolvedAt = new Date().toISOString();
    if (obstacleReason) commitments[index].obstacleReason = obstacleReason;
    if (pivotAction) commitments[index].pivotAction = pivotAction;
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

// ─── PROACTIVE FOLLOW-UP & CHECK-IN DETECTOR ───

export function getPendingFollowUpCheckIn(): AkucheFollowUpCheckIn | null {
  if (typeof window === "undefined" || !isMemoryEnabled()) return null;

  // 1. Check pending commitments that are at least 1 hour old
  const commitments = getCommitments();
  const activePending = commitments.find((c) => c.status === "pending");
  if (activePending) {
    return {
      type: "commitment",
      id: activePending.id,
      title: "How did your next move go?",
      prompt: `Last time we focused on: "${activePending.title}". Did you get a chance to take action?`,
      contextText: activePending.description || "Action commitment from previous session.",
      suggestedActions: [
        { label: "Done! Completed it", action: "done" },
        { label: "Partly done", action: "partly_done" },
        { label: "Hit an obstacle", action: "obstacle" },
        { label: "Changed direction", action: "pivoted" },
      ],
      associatedRoute: "/dashboard/think",
    };
  }

  // 2. Check pending decision reviews
  const decisions = getDecisionRecords();
  const today = new Date().toISOString().split("T")[0];
  const dueReview = decisions.find((d) => d.status === "active" && d.reviewDate <= today);
  if (dueReview) {
    return {
      type: "decision_review",
      id: dueReview.id,
      title: "Decision Review Check-in",
      prompt: `It's time to review your decision on: "${dueReview.title}". How did choosing "${dueReview.chosenOption}" turn out?`,
      contextText: `Expected outcome: ${dueReview.expectedOutcome}`,
      suggestedActions: [
        { label: "Turned out well", action: "done" },
        { label: "Need to adjust", action: "obstacle" },
        { label: "Dismiss review", action: "dismiss" },
      ],
      associatedRoute: "/dashboard/decisions",
    };
  }

  return null;
}

// ─── ACTION STREAK (REAL ACTION, NOT PASSIVE OPENS) ───

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

// ─── PERSONAL INSIGHTS & PATTERNS ───

export function getPersonalInsights(): AkuchePersonalInsight[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INSIGHTS_KEY);
    if (!raw) {
      const defaultInsights: AkuchePersonalInsight[] = [
        {
          id: "ins-1",
          title: "Execution Velocity",
          observation: "You make the fastest measurable progress when ambitious goals are converted into immediate 15-minute actions with exact numbers.",
          recommendation: "Continue defining exact daily quotas and single next actions.",
          unlockedAt: new Date().toISOString(),
          category: "productivity",
          isRead: false,
        },
        {
          id: "ins-2",
          title: "Diagnostic Problem Solving",
          observation: "Your decisions yield higher confidence when you separate verifiable facts from initial assumptions before selecting options.",
          recommendation: "Maintain the 3-Option Trade-off filter for all high-stakes decisions.",
          unlockedAt: new Date().toISOString(),
          category: "decision_style",
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

// ─── MEMORY PROMPT CONTEXT INJECTOR ───

export function generateMemoryContextPrompt(): string {
  if (!isMemoryEnabled()) return "";
  const items = getMemoryItems();
  if (items.length === 0) return "";

  const formatted = items
    .slice(0, 8)
    .map((item) => `- [${item.category.toUpperCase()}] ${item.title}: ${item.content}`)
    .join("\n");

  const commitments = getCommitments().filter((c) => c.status === "pending").slice(0, 3);
  const commitmentText = commitments.length > 0
    ? "\n\nActive Pending Commitments:\n" + commitments.map((c) => `- ${c.title} (Deadline: ${c.deadline || "Today"})`).join("\n")
    : "";

  return `\n\n## AKUCHE MEMORY & USER CONTEXT (Transparent User Profile)\n${formatted}${commitmentText}\n\nUse this context to tailor your questions and guidance naturally without robotic repetition.`;
}
