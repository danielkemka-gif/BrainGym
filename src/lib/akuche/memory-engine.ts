/**
 * AKUCHE MEMORY, CONTEXT PROFILE, THINKING MIRROR & CLARITY SNAPSHOT ENGINE
 *
 * Implements:
 * - Structured user long-term memory (Profile, Goals, Decisions, Commitments, Patterns, Projects)
 * - Explicit distinction between User-Confirmed Facts ("confirmed") vs. AI Interpretations ("ai_interpreted")
 * - Duplicate memory prevention, outdated memory superseding, and relevance-scored retrieval
 * - Live Clarity Snapshot (dealingWith, majorChallenges, attentionAreas, opportunities, nextActions)
 * - Thinking Mirror recurring pattern detection
 * - Persistent multi-turn conversation threads for Ask Akuche
 * - Transparent Memory architecture with full user visibility, editing, and deletion
 * - Offline-first localStorage with optional Supabase sync
 */

export type MemoryVerificationStatus = "confirmed" | "ai_interpreted";

export interface AkucheMemoryItem {
  id: string;
  category: "profile" | "goal" | "decision" | "commitment" | "pattern" | "project";
  title: string;
  content: string;
  sourceContext?: string;
  verificationStatus?: MemoryVerificationStatus; // Distinguishes confirmed user facts from AI interpretations
  confidence?: number; // 0.0 - 1.0
  tags?: string[];
  supersededById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AkucheClaritySnapshotItem {
  text: string;
  source: "confirmed" | "ai_interpreted";
}

export interface AkucheClaritySnapshot {
  id: string;
  subject: string;
  currentlyDealingWith: AkucheClaritySnapshotItem[];
  majorChallenges: AkucheClaritySnapshotItem[];
  areasRequiringAttention: AkucheClaritySnapshotItem[];
  possibleOpportunities: AkucheClaritySnapshotItem[];
  recommendedNextActions: string[];
  updatedAt: string;
}

export interface AkucheThinkingMirrorPattern {
  id: string;
  patternName: string;
  type: "strength" | "blind_spot" | "habit";
  observation: string;
  evidenceCount: number;
  selfAwarenessPrompt: string;
  lastObservedAt: string;
}

export interface AkucheConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode?: string;
  cards?: any;
  createdAt: string;
}

export interface AkucheConversationThread {
  id: string;
  title: string;
  subject?: string;
  mode?: "coaching_chat" | "devils_advocate" | "decision_lab" | "thinking_mirror";
  summary?: string;
  messages: AkucheConversationMessage[];
  updatedAt: string;
  createdAt?: string;
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
  obstacleReason?: string;
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
const CLARITY_SNAPSHOT_KEY = "akuche_clarity_snapshot_v1";
const THINKING_MIRROR_KEY = "akuche_thinking_mirror_v1";
const CONVERSATIONS_KEY = "akuche_conversations_v1";
const DELETED_MEMORIES_KEY = "akuche_deleted_memory_ids_v1";

function getDeletedMemoryIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DELETED_MEMORIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addDeletedMemoryId(id: string): void {
  if (typeof window === "undefined") return;
  const existing = new Set(getDeletedMemoryIds());
  existing.add(id);
  localStorage.setItem(DELETED_MEMORIES_KEY, JSON.stringify(Array.from(existing)));
}

function clearDeletedMemoryIds(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DELETED_MEMORIES_KEY);
}

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
          title: "Primary Focus",
          content: "Focused on making clear, well-reasoned decisions across business, career, and personal life.",
          sourceContext: "Initial onboarding calibration",
          verificationStatus: "confirmed",
          confidence: 1.0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "mem-init-2",
          category: "pattern",
          title: "Thinking Preference",
          content: "Values direct analysis, honest blind-spot challenges, and practical next steps over generic advice.",
          sourceContext: "Thinking Mirror observation",
          verificationStatus: "ai_interpreted",
          confidence: 0.85,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(MEMORY_ITEMS_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed: AkucheMemoryItem[] = JSON.parse(raw);
    return parsed.map((item) => ({
      ...item,
      verificationStatus:
        item.verificationStatus ||
        (item.category === "pattern" ? "ai_interpreted" : "confirmed"),
    }));
  } catch {
    return [];
  }
}

/**
 * Normalizes text for duplicate and superseding memory detection.
 */
function normalizeForComparison(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Saves a memory item while preventing duplicates and updating outdated entries with the same title/category.
 */
export function saveMemoryItem(
  item: Omit<AkucheMemoryItem, "id" | "createdAt" | "updatedAt">
): AkucheMemoryItem {
  const items = getMemoryItems();
  const normTitle = normalizeForComparison(item.title);
  const normContent = normalizeForComparison(item.content);
  const now = new Date().toISOString();

  // Check for exact or near-duplicate in the same category
  const existingIndex = items.findIndex(
    (existing) =>
      existing.category === item.category &&
      (normalizeForComparison(existing.title) === normTitle ||
        normalizeForComparison(existing.content) === normContent)
  );

  if (existingIndex >= 0) {
    // Update the existing memory in-place instead of creating a duplicate
    const updated: AkucheMemoryItem = {
      ...items[existingIndex],
      ...item,
      verificationStatus:
        item.verificationStatus ?? items[existingIndex].verificationStatus ?? "confirmed",
      updatedAt: now,
    };
    items.splice(existingIndex, 1);
    items.unshift(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(MEMORY_ITEMS_KEY, JSON.stringify(items.slice(0, 60)));
    }
    return updated;
  }

  const newItem: AkucheMemoryItem = {
    ...item,
    verificationStatus:
      item.verificationStatus ?? (item.category === "pattern" ? "ai_interpreted" : "confirmed"),
    confidence: item.confidence ?? (item.verificationStatus === "ai_interpreted" ? 0.8 : 1.0),
    id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: now,
    updatedAt: now,
  };
  items.unshift(newItem);
  if (typeof window !== "undefined") {
    localStorage.setItem(MEMORY_ITEMS_KEY, JSON.stringify(items.slice(0, 60)));
  }
  return newItem;
}

export function confirmMemoryItem(id: string): AkucheMemoryItem | null {
  return updateMemoryItem(id, { verificationStatus: "confirmed", confidence: 1.0 });
}

export function updateMemoryItem(
  id: string,
  updates: Partial<Omit<AkucheMemoryItem, "id" | "createdAt">>
): AkucheMemoryItem | null {
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
    return items[index];
  }
  return null;
}

export function deleteMemoryItem(id: string): void {
  const items = getMemoryItems().filter((i) => i.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(MEMORY_ITEMS_KEY, JSON.stringify(items));
    addDeletedMemoryId(id);
  }
}

export function clearAllMemories(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(MEMORY_ITEMS_KEY);
    localStorage.removeItem(COMMITMENTS_KEY);
    localStorage.removeItem(GOALS_KEY);
    localStorage.removeItem(DECISIONS_KEY);
    localStorage.removeItem(INSIGHTS_KEY);
    localStorage.removeItem(CLARITY_SNAPSHOT_KEY);
    localStorage.removeItem(THINKING_MIRROR_KEY);
    localStorage.removeItem(CONVERSATIONS_KEY);
  }
}

/**
 * Relevance-scored memory retrieval (Part 4 & Part 7).
 * Scores memories by keyword overlap, category priority, confirmation status, and recency.
 */
export function retrieveRelevantMemories(
  query: string,
  allMemories?: AkucheMemoryItem[],
  maxItems = 8
): AkucheMemoryItem[] {
  const source = allMemories ?? getMemoryItems();
  if (source.length === 0) return [];

  const queryTokens = normalizeForComparison(query)
    .split(" ")
    .filter((w) => w.length >= 3);

  const scored = source.map((item) => {
    let score = 0;
    const text = normalizeForComparison(`${item.title} ${item.content} ${item.category}`);

    // 1. Keyword match score
    for (const token of queryTokens) {
      if (text.includes(token)) {
        score += 15;
      }
    }

    // 2. Category base priority (Profile & Active Goals always carry baseline relevance)
    if (item.category === "profile") score += 12;
    else if (item.category === "goal") score += 10;
    else if (item.category === "project") score += 9;
    else if (item.category === "decision") score += 8;
    else if (item.category === "commitment") score += 8;
    else if (item.category === "pattern") score += 6;

    // 3. Confirmed user facts outrank unconfirmed AI interpretations
    if (item.verificationStatus === "confirmed") {
      score += 5;
    }

    // 4. Recency bonus (decays over 30 days)
    const ageDays = Math.max(
      0,
      (Date.now() - new Date(item.updatedAt || item.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    score += Math.max(0, 8 - ageDays * 0.25);

    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxItems).map((s) => s.item);
}

// ─── LIVE CLARITY SNAPSHOT (VERSION 1 CORE COMPONENT C) ───

export function getLatestClaritySnapshot(): AkucheClaritySnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CLARITY_SNAPSHOT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveClaritySnapshot(
  snapshot: Omit<AkucheClaritySnapshot, "id" | "updatedAt">
): AkucheClaritySnapshot {
  const record: AkucheClaritySnapshot = {
    ...snapshot,
    id: `snap-${Date.now()}`,
    updatedAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(CLARITY_SNAPSHOT_KEY, JSON.stringify(record));
  }
  return record;
}

// ─── THINKING MIRROR (SIGNATURE SYSTEM #2) ───

export function getThinkingMirrorPatterns(): AkucheThinkingMirrorPattern[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(THINKING_MIRROR_KEY);
    if (!raw) {
      const defaults: AkucheThinkingMirrorPattern[] = [
        {
          id: "tm-1",
          patternName: "Outcome-Oriented Framing",
          type: "strength",
          observation: "You naturally look for practical actions and measurable outcomes rather than staying stuck in abstract theory.",
          evidenceCount: 3,
          selfAwarenessPrompt: "Before locking in your next action, pause for 60 seconds and ask: 'What is the main assumption that must be true for this action to work?'",
          lastObservedAt: new Date().toISOString(),
        },
        {
          id: "tm-2",
          patternName: "Unverified Premise Risk",
          type: "blind_spot",
          observation: "When under pressure to get results quickly, it is easy to treat an initial hypothesis about why people aren't responding as a proven fact.",
          evidenceCount: 2,
          selfAwarenessPrompt: "Separate what you have directly verified with real people from what you are assuming about their motives.",
          lastObservedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(THINKING_MIRROR_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function recordThinkingMirrorObservation(
  pattern: Omit<AkucheThinkingMirrorPattern, "id" | "evidenceCount" | "lastObservedAt">
): AkucheThinkingMirrorPattern {
  const fallbackRecord: AkucheThinkingMirrorPattern = {
    ...pattern,
    id: `tm-${Date.now()}`,
    evidenceCount: 1,
    lastObservedAt: new Date().toISOString(),
  };
  if (typeof window === "undefined") return fallbackRecord;
  const patterns = getThinkingMirrorPatterns();
  const normName = normalizeForComparison(pattern.patternName);
  const existingIdx = patterns.findIndex(
    (p) => normalizeForComparison(p.patternName) === normName
  );

  let saved: AkucheThinkingMirrorPattern;
  if (existingIdx >= 0) {
    patterns[existingIdx].evidenceCount += 1;
    patterns[existingIdx].observation = pattern.observation;
    patterns[existingIdx].selfAwarenessPrompt = pattern.selfAwarenessPrompt;
    patterns[existingIdx].lastObservedAt = new Date().toISOString();
    saved = patterns[existingIdx];
  } else {
    saved = fallbackRecord;
    patterns.unshift(saved);
  }
  localStorage.setItem(THINKING_MIRROR_KEY, JSON.stringify(patterns.slice(0, 12)));
  return saved;
}

// ─── PERSISTENT CONVERSATION THREADS FOR ASK AKUCHE ───

export function getConversationThreads(): AkucheConversationThread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveConversationThread(thread: AkucheConversationThread): void {
  if (typeof window === "undefined") return;
  const threads = getConversationThreads();
  const idx = threads.findIndex((t) => t.id === thread.id);
  if (idx >= 0) {
    threads[idx] = { ...thread, updatedAt: new Date().toISOString() };
  } else {
    threads.unshift({ ...thread, updatedAt: new Date().toISOString() });
  }
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(threads.slice(0, 25)));
}

export function deleteConversationThread(threadId: string): void {
  if (typeof window === "undefined") return;
  const threads = getConversationThreads().filter((t) => t.id !== threadId);
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(threads));
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

export function saveGoalMemory(
  goal: Omit<AkucheGoalItem, "id" | "createdAt" | "updatedAt">
): AkucheGoalItem {
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

  saveMemoryItem({
    category: "goal",
    title: newGoal.title,
    content: `${newGoal.whyItMatters} (Target: ${newGoal.targetHorizon})`,
    sourceContext: "Goals Engine",
    verificationStatus: "confirmed",
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

export function saveDecisionRecord(
  decision: Omit<AkucheDecisionRecord, "id" | "createdAt" | "updatedAt">
): AkucheDecisionRecord {
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

  saveMemoryItem({
    category: "decision",
    title: `Decision: ${newRecord.title}`,
    content: `Chosen: ${newRecord.chosenOption}. Rationale: ${newRecord.rationale}`,
    sourceContext: "Think & Decision Lab",
    verificationStatus: "confirmed",
  });

  recordActionStreakActivity({
    type: "decision",
    title: newRecord.title,
    details: `Chosen: ${newRecord.chosenOption}`,
  });

  return newRecord;
}

export function updateDecisionOutcome(
  id: string,
  actualOutcome: string,
  reflectionNotes: string
): void {
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

// ─── ACTION STREAK ───

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

export function recordActionStreakActivity(
  entry: Omit<AkucheActionLog, "id" | "date" | "timestamp">
): void {
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

export function calculateActionStreak(): {
  currentStreak: number;
  bestStreak: number;
  totalActionsCompleted: number;
} {
  const logs = getActionLogs();
  if (logs.length === 0) return { currentStreak: 1, bestStreak: 3, totalActionsCompleted: 0 };

  const uniqueDays = Array.from(new Set(logs.map((l) => l.date))).sort().reverse();
  const totalActionsCompleted = logs.length;

  const todayStr = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let currentStreak = 0;
  const checkDate = new Date();

  const hasToday = uniqueDays.includes(todayStr);
  const hasYesterday = uniqueDays.includes(yesterdayStr);

  if (!hasToday && !hasYesterday) {
    return {
      currentStreak: 0,
      bestStreak: Math.max(uniqueDays.length, 3),
      totalActionsCompleted,
    };
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
          observation:
            "You make the fastest measurable progress when ambitious goals are converted into immediate 15-minute actions with clear numbers.",
          recommendation: "Continue defining clear daily priorities and single next actions.",
          unlockedAt: new Date().toISOString(),
          category: "productivity",
          isRead: false,
        },
        {
          id: "ins-2",
          title: "Diagnostic Problem Solving",
          observation:
            "Your decisions yield higher confidence when you separate verifiable facts from initial assumptions before selecting options.",
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

export function generateMemoryContextPrompt(query = ""): string {
  if (!isMemoryEnabled()) return "";
  const items = query ? retrieveRelevantMemories(query) : getMemoryItems().slice(0, 8);
  if (items.length === 0) return "";

  const confirmed = items.filter((i) => i.verificationStatus !== "ai_interpreted");
  const interpreted = items.filter((i) => i.verificationStatus === "ai_interpreted");

  const confirmedBlock =
    confirmed.length > 0
      ? "Confirmed User Facts (Explicitly provided/verified by user):\n" +
        confirmed
          .map((item) => `- [${item.category.toUpperCase()}] ${item.title}: ${item.content}`)
          .join("\n")
      : "";

  const interpretedBlock =
    interpreted.length > 0
      ? "\nAI-Observed Patterns (Treat as working hypotheses, not absolute facts):\n" +
        interpreted
          .map((item) => `- [${item.category.toUpperCase()}] ${item.title}: ${item.content}`)
          .join("\n")
      : "";

  const commitments = getCommitments()
    .filter((c) => c.status === "pending")
    .slice(0, 3);
  const commitmentText =
    commitments.length > 0
      ? "\nActive Pending Commitments:\n" +
        commitments
          .map((c) => `- ${c.title} (Deadline: ${c.deadline || "Today"})`)
          .join("\n")
      : "";

  return `\n\n## AKUCHE CONTEXTUAL MEMORY (SHORT-TERM & LONG-TERM RECALL)\n${confirmedBlock}${interpretedBlock}${commitmentText}\n\nUse this context only where relevant to the user's current question. Never force unrelated profile details into a simple answer, and never treat AI-observed patterns as immutable facts.`;
}

// ─── PHASE 4: AUTHENTICATED SUPABASE SYNCHRONISATION & RECONCILIATION ───

export interface SyncStatusResult {
  synced: boolean;
  memoriesCount: number;
  threadsCount: number;
  patternsCount: number;
  error?: string;
}

/**
 * Reconciles and synchronises local `localStorage` memories, conversations,
 * clarity snapshots, and thinking mirror patterns with Supabase for an authenticated user.
 *
 * - Preserves all existing localStorage data.
 * - Prevents duplicate records via normalized title/content matching and `client_id` upserts.
 * - Handles offline states or unmigrated tables gracefully without throwing.
 */
export async function syncAkucheIntelligenceWithSupabase(
  supabase: any,
  userId: string
): Promise<SyncStatusResult> {
  if (!supabase || !userId) {
    return {
      synced: false,
      memoriesCount: getMemoryItems().length,
      threadsCount: getConversationThreads().length,
      patternsCount: getThinkingMirrorPatterns().length,
      error: "No authenticated user session",
    };
  }

  try {
    // 1. Synchronise Context Profile Memories (`akuche_memories`)
    const deletedIds = getDeletedMemoryIds();
    const deletedSet = new Set(deletedIds);

    if (deletedIds.length > 0 && typeof supabase.from("akuche_memories").delete === "function") {
      try {
        const { error: delErr } = await supabase
          .from("akuche_memories")
          .delete()
          .eq("user_id", userId)
          .in("client_id", deletedIds);
        if (!delErr) {
          clearDeletedMemoryIds();
        }
      } catch {
        // Retain tombstones if delete fails transiently
      }
    }

    const localMemories = getMemoryItems().filter((m) => !deletedSet.has(m.id));
    const { data: remoteMemories, error: memFetchErr } = await supabase
      .from("akuche_memories")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(60);

    if (!memFetchErr && Array.isArray(remoteMemories)) {
      const mergedMap = new Map<string, AkucheMemoryItem>();

      // Seed with local memories first (preserving all local items)
      for (const localItem of localMemories) {
        const key = `${localItem.category}:${normalizeForComparison(localItem.title)}`;
        mergedMap.set(key, localItem);
      }

      // Reconcile remote memories (updating if remote is newer or missing locally, skipping deleted items)
      for (const rem of remoteMemories) {
        const remClientId = rem.client_id || rem.id;
        if (deletedSet.has(remClientId)) continue;
        const mapped: AkucheMemoryItem = {
          id: remClientId,
          category: rem.category,
          title: rem.title,
          content: rem.content,
          sourceContext: rem.source_context || undefined,
          verificationStatus: rem.verification_status === "ai_interpreted" ? "ai_interpreted" : "confirmed",
          confidence: typeof rem.confidence === "number" ? rem.confidence : Number(rem.confidence || 1.0),
          tags: Array.isArray(rem.tags) ? rem.tags : [],
          supersededById: rem.superseded_by_id || undefined,
          createdAt: rem.created_at || new Date().toISOString(),
          updatedAt: rem.updated_at || new Date().toISOString(),
        };
        const key = `${mapped.category}:${normalizeForComparison(mapped.title)}`;
        const existing = mergedMap.get(key);
        if (!existing || new Date(mapped.updatedAt).getTime() > new Date(existing.updatedAt).getTime()) {
          mergedMap.set(key, mapped);
        }
      }

      const reconciledMemories = Array.from(mergedMap.values()).slice(0, 60);
      if (typeof window !== "undefined") {
        localStorage.setItem(MEMORY_ITEMS_KEY, JSON.stringify(reconciledMemories));
      }

      // Upsert reconciled memories to Supabase
      if (reconciledMemories.length > 0) {
        const upsertRows = reconciledMemories.map((m) => ({
          user_id: userId,
          client_id: m.id,
          category: m.category,
          title: m.title,
          content: m.content,
          source_context: m.sourceContext || null,
          verification_status: m.verificationStatus || "confirmed",
          confidence: typeof m.confidence === "number" ? m.confidence : 1.0,
          tags: m.tags || [],
          superseded_by_id: m.supersededById || null,
          updated_at: m.updatedAt,
        }));
        await supabase
          .from("akuche_memories")
          .upsert(upsertRows, { onConflict: "user_id,client_id" });
      }
    }

    // 2. Synchronise Live Clarity Snapshot (`akuche_clarity_snapshots`)
    const localSnap = getLatestClaritySnapshot();
    const { data: remoteSnaps, error: snapErr } = await supabase
      .from("akuche_clarity_snapshots")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (!snapErr && Array.isArray(remoteSnaps)) {
      const remoteSnap = remoteSnaps[0];
      if (
        remoteSnap &&
        (!localSnap ||
          new Date(remoteSnap.updated_at).getTime() > new Date(localSnap.updatedAt).getTime())
      ) {
        const mappedSnap: AkucheClaritySnapshot = {
          id: remoteSnap.client_id || remoteSnap.id,
          subject: remoteSnap.subject,
          currentlyDealingWith: remoteSnap.currently_dealing_with || [],
          majorChallenges: remoteSnap.major_challenges || [],
          areasRequiringAttention: remoteSnap.areas_requiring_attention || [],
          possibleOpportunities: remoteSnap.possible_opportunities || [],
          recommendedNextActions: remoteSnap.recommended_next_actions || [],
          updatedAt: remoteSnap.updated_at,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(CLARITY_SNAPSHOT_KEY, JSON.stringify(mappedSnap));
        }
      } else if (localSnap) {
        await supabase.from("akuche_clarity_snapshots").upsert(
          {
            user_id: userId,
            client_id: localSnap.id,
            subject: localSnap.subject,
            currently_dealing_with: localSnap.currentlyDealingWith,
            major_challenges: localSnap.majorChallenges,
            areas_requiring_attention: localSnap.areasRequiringAttention,
            possible_opportunities: localSnap.possibleOpportunities,
            recommended_next_actions: localSnap.recommendedNextActions,
            updated_at: localSnap.updatedAt,
          },
          { onConflict: "user_id,client_id" }
        );
      }
    }

    // 3. Synchronise Thinking Mirror Patterns (`akuche_thinking_patterns`)
    const localPatterns = getThinkingMirrorPatterns();
    const { data: remotePatterns, error: patErr } = await supabase
      .from("akuche_thinking_patterns")
      .select("*")
      .eq("user_id", userId)
      .order("last_observed_at", { ascending: false })
      .limit(15);

    if (!patErr && Array.isArray(remotePatterns)) {
      const patMap = new Map<string, AkucheThinkingMirrorPattern>();
      for (const lp of localPatterns) {
        patMap.set(normalizeForComparison(lp.patternName), lp);
      }
      for (const rp of remotePatterns) {
        const key = normalizeForComparison(rp.pattern_name);
        const existing = patMap.get(key);
        const mappedPat: AkucheThinkingMirrorPattern = {
          id: rp.id,
          patternName: rp.pattern_name,
          type: rp.type === "blind_spot" ? "blind_spot" : rp.type === "habit" ? "habit" : "strength",
          observation: rp.observation,
          evidenceCount: Math.max(rp.evidence_count || 1, existing?.evidenceCount || 1),
          selfAwarenessPrompt: rp.self_awareness_prompt,
          lastObservedAt: rp.last_observed_at,
        };
        if (
          !existing ||
          new Date(mappedPat.lastObservedAt).getTime() >= new Date(existing.lastObservedAt).getTime()
        ) {
          patMap.set(key, mappedPat);
        }
      }

      const reconciledPatterns = Array.from(patMap.values()).slice(0, 12);
      if (typeof window !== "undefined") {
        localStorage.setItem(THINKING_MIRROR_KEY, JSON.stringify(reconciledPatterns));
      }

      if (reconciledPatterns.length > 0) {
        await supabase.from("akuche_thinking_patterns").upsert(
          reconciledPatterns.map((p) => ({
            user_id: userId,
            pattern_name: p.patternName,
            type: p.type,
            observation: p.observation,
            evidence_count: p.evidenceCount,
            self_awareness_prompt: p.selfAwarenessPrompt,
            last_observed_at: p.lastObservedAt,
          })),
          { onConflict: "user_id,pattern_name" }
        );
      }
    }

    // 4. Synchronise Conversation Threads (`akuche_conversations` & `akuche_messages`)
    const localThreads = getConversationThreads();
    const { data: remoteThreads, error: convErr } = await supabase
      .from("akuche_conversations")
      .select("id, client_id, title, subject, summary, mode, updated_at, created_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(15);

    if (!convErr && Array.isArray(remoteThreads)) {
      const threadMap = new Map<string, AkucheConversationThread>();
      for (const lt of localThreads) {
        threadMap.set(lt.id, lt);
      }

      for (const rt of remoteThreads) {
        const clientId = rt.client_id || rt.id;
        if (!threadMap.has(clientId)) {
          const { data: remMsgs } = await supabase
            .from("akuche_messages")
            .select("client_id, role, content, mode, structured_cards, created_at")
            .eq("conversation_id", rt.id)
            .eq("user_id", userId)
            .order("created_at", { ascending: true });

          threadMap.set(clientId, {
            id: clientId,
            title: rt.title,
            subject: rt.subject,
            summary: rt.summary || undefined,
            mode: rt.mode || "coaching_chat",
            messages: Array.isArray(remMsgs)
              ? remMsgs.map((m: any) => ({
                  id: m.client_id,
                  role: m.role,
                  content: m.content,
                  mode: m.mode || undefined,
                  cards: m.structured_cards || undefined,
                  createdAt: m.created_at,
                }))
              : [],
            updatedAt: rt.updated_at,
            createdAt: rt.created_at,
          });
        }
      }

      const reconciledThreads = Array.from(threadMap.values())
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 25);

      if (typeof window !== "undefined") {
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(reconciledThreads));
      }

      // Upsert latest active thread & its messages
      const latestThread = reconciledThreads[0];
      if (latestThread && latestThread.messages.length > 0) {
        const { data: upsertedConv } = await supabase
          .from("akuche_conversations")
          .upsert(
            {
              user_id: userId,
              client_id: latestThread.id,
              title: latestThread.title,
              subject: latestThread.subject || latestThread.title,
              mode: latestThread.mode || "coaching_chat",
              updated_at: latestThread.updatedAt,
            },
            { onConflict: "user_id,client_id" }
          )
          .select("id")
          .maybeSingle();

        if (upsertedConv?.id) {
          const msgRows = latestThread.messages.slice(-20).map((m) => ({
            conversation_id: upsertedConv.id,
            user_id: userId,
            client_id: m.id,
            role: m.role,
            content: m.content,
            mode: m.mode || latestThread.mode || "coaching_chat",
            structured_cards: m.cards || null,
            created_at: m.createdAt || new Date().toISOString(),
          }));
          await supabase
            .from("akuche_messages")
            .upsert(msgRows, { onConflict: "user_id,client_id" });
        }
      }
    }

    return {
      synced: true,
      memoriesCount: getMemoryItems().length,
      threadsCount: getConversationThreads().length,
      patternsCount: getThinkingMirrorPatterns().length,
    };
  } catch (err: any) {
    // Graceful offline / unmigrated database tolerance
    return {
      synced: false,
      memoriesCount: getMemoryItems().length,
      threadsCount: getConversationThreads().length,
      patternsCount: getThinkingMirrorPatterns().length,
      error: err?.message || "Sync deferred (offline or local-only mode)",
    };
  }
}

/**
 * Export all personal intelligence data (Clarity Vault) as a portable JSON package.
 */
export function exportClarityVaultData(): string {
  if (typeof window === "undefined") return "{}";
  const data = {
    exportedAt: new Date().toISOString(),
    platform: "AKUCHE 2.0 Personal Clarity Intelligence",
    memories: getMemoryItems(),
    commitments: getCommitments(),
    threads: getConversationThreads(),
    thinkingMirrorPatterns: getThinkingMirrorPatterns(),
    claritySnapshot: getLatestClaritySnapshot(),
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Irreversibly wipe all local intelligence, memories, and patterns for this browser session.
 */
export function purgeAllIntelligenceData(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(MEMORY_ITEMS_KEY);
    localStorage.removeItem(CLARITY_SNAPSHOT_KEY);
    localStorage.removeItem(THINKING_MIRROR_KEY);
    localStorage.removeItem(CONVERSATIONS_KEY);
    localStorage.removeItem(GOALS_KEY);
    localStorage.removeItem(COMMITMENTS_KEY);
    localStorage.removeItem(DELETED_MEMORIES_KEY);
  } catch (err) {
    console.error("Error purging intelligence data:", err);
  }
}
