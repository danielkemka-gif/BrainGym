/**
 * AKUCHE DECISION LAB ENGINE
 * 
 * 12-Step Guided Thinking Framework:
 * Problem -> Options -> Advantages/Downsides -> Worst-Case Survival -> 
 * Reversibility -> 24-Hour Micro-Test -> Final Decision -> Action Plan -> 30-Day Review Loop
 */

import { recordActionStreakActivity, saveMemoryItem, setLastSession } from "./memory-engine";

export interface AkucheDecisionRecord {
  id: string;
  title: string;
  category: "Business" | "Career" | "Money" | "Personal" | "Education" | "Relationships";
  optionA: string;
  optionB: string;
  advantagesA: string[];
  advantagesB: string[];
  risksA: string[];
  risksB: string[];
  worstCaseA: string;
  worstCaseB: string;
  isReversible: boolean; // Two-way door vs One-way door
  experiment24h: string; // Small test to gather evidence
  finalChoice: string;
  rationale: string;
  actionSteps: string[];
  status: "active" | "reviewed";
  reviewDueAt: string; // 30 days from creation
  outcomeReview?: {
    actualOutcome: string;
    wasChoiceCorrect: boolean;
    lessonsLearned: string;
    reviewedAt: string;
  };
  createdAt: string;
}

const DECISIONS_KEY = "akuche_decision_lab_records_v2";
const LEGACY_DECISIONS_KEY = "akuche_decisions_v2";

/**
 * Authoritative Decision Lab store reader (Phase 3).
 * Preserves and reconciles both `akuche_decision_lab_records_v2` and legacy `akuche_decisions_v2`
 * without deleting either store.
 */
export function getDecisionRecords(): AkucheDecisionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const rawPrimary = localStorage.getItem(DECISIONS_KEY);
    const primaryRecords: AkucheDecisionRecord[] = rawPrimary ? JSON.parse(rawPrimary) : [];

    // Safe non-destructive reconciliation with legacy store (`akuche_decisions_v2`)
    const rawLegacy = localStorage.getItem(LEGACY_DECISIONS_KEY);
    if (!rawLegacy) return primaryRecords;

    const legacyRecords: any[] = JSON.parse(rawLegacy);
    if (!Array.isArray(legacyRecords) || legacyRecords.length === 0) {
      return primaryRecords;
    }

    const existingIds = new Set(primaryRecords.map((r) => r.id));
    const existingTitles = new Set(
      primaryRecords.map((r) => r.title.toLowerCase().trim())
    );

    const reconciled = [...primaryRecords];
    for (const leg of legacyRecords) {
      if (!leg || typeof leg.title !== "string") continue;
      const normTitle = leg.title.toLowerCase().trim();
      if (existingIds.has(leg.id) || existingTitles.has(normTitle)) continue;

      reconciled.push({
        id: leg.id || `dec-leg-${Date.now()}`,
        title: leg.title,
        category: "Business",
        optionA: leg.optionsConsidered?.[0]?.name || leg.chosenOption || "Option A",
        optionB: leg.optionsConsidered?.[1]?.name || "Alternative Option",
        advantagesA: [leg.optionsConsidered?.[0]?.pros || "Primary path advantage"],
        advantagesB: [leg.optionsConsidered?.[1]?.pros || "Alternative path advantage"],
        risksA: [leg.optionsConsidered?.[0]?.cons || "Execution risk"],
        risksB: [leg.optionsConsidered?.[1]?.cons || "Opportunity cost"],
        worstCaseA: "Manageable downside",
        worstCaseB: "Manageable downside",
        isReversible: true,
        experiment24h: leg.expectedOutcome || "Monitor initial outcome",
        finalChoice: leg.chosenOption || leg.finalChoice || "Selected Option",
        rationale: leg.rationale || leg.expectedOutcome || "",
        actionSteps: [],
        status: leg.status === "reviewed" ? "reviewed" : "active",
        reviewDueAt: leg.reviewDate || new Date().toISOString(),
        createdAt: leg.createdAt || new Date().toISOString(),
      });
    }

    return reconciled;
  } catch {
    return [];
  }
}

export function saveDecisionRecord(
  decision: Omit<AkucheDecisionRecord, "id" | "createdAt" | "status" | "reviewDueAt">
): AkucheDecisionRecord {
  const records = getDecisionRecords();
  const createdDate = new Date();
  const reviewDate = new Date();
  reviewDate.setDate(reviewDate.getDate() + 30);

  const newRecord: AkucheDecisionRecord = {
    ...decision,
    id: `dec-${Date.now()}`,
    status: "active",
    reviewDueAt: reviewDate.toISOString(),
    createdAt: createdDate.toISOString(),
  };

  records.unshift(newRecord);
  if (typeof window !== "undefined") {
    localStorage.setItem(DECISIONS_KEY, JSON.stringify(records));
  }

  // Record to memory
  saveMemoryItem({
    category: "decision",
    title: `Decision: ${newRecord.title}`,
    content: `Chose: ${newRecord.finalChoice}. Rationale: ${newRecord.rationale}`,
    sourceContext: "Decision Lab",
  });

  // Record action streak activity
  recordActionStreakActivity({
    type: "decision",
    title: `Decision Made: ${newRecord.title}`,
    details: `Selected: ${newRecord.finalChoice}`,
  });

  // Update continuation state
  setLastSession({
    type: "decision",
    title: "Decision Lab",
    subtitle: newRecord.title,
    route: "/dashboard/decisions",
    progressText: "Action Phase",
    timestamp: new Date().toISOString(),
  });

  return newRecord;
}

export function updateDecisionRecord(
  id: string,
  updates: Partial<Omit<AkucheDecisionRecord, "id" | "createdAt">>
): AkucheDecisionRecord | null {
  const records = getDecisionRecords();
  const index = records.findIndex((r) => r.id === id);
  if (index < 0) return null;

  const updated: AkucheDecisionRecord = {
    ...records[index],
    ...updates,
  };
  records[index] = updated;

  if (typeof window !== "undefined") {
    localStorage.setItem(DECISIONS_KEY, JSON.stringify(records));
  }

  // Keep Context Profile decision memory synchronized
  saveMemoryItem({
    category: "decision",
    title: `Decision: ${updated.title}`,
    content: `Chose: ${updated.finalChoice}. Rationale: ${updated.rationale}`,
    sourceContext: "Decision Lab",
  });

  return updated;
}

export function reopenDecisionRecord(id: string): AkucheDecisionRecord | null {
  const records = getDecisionRecords();
  const index = records.findIndex((r) => r.id === id);
  if (index < 0) return null;

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + 30);

  const reopened: AkucheDecisionRecord = {
    ...records[index],
    status: "active",
    reviewDueAt: nextReview.toISOString(),
  };
  records[index] = reopened;

  if (typeof window !== "undefined") {
    localStorage.setItem(DECISIONS_KEY, JSON.stringify(records));
  }

  return reopened;
}

export function submitDecisionReview(
  id: string,
  review: { actualOutcome: string; wasChoiceCorrect: boolean; lessonsLearned: string }
): void {
  const records = getDecisionRecords();
  const index = records.findIndex((r) => r.id === id);
  if (index >= 0) {
    records[index].status = "reviewed";
    records[index].outcomeReview = {
      ...review,
      reviewedAt: new Date().toISOString(),
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(DECISIONS_KEY, JSON.stringify(records));
    }

    recordActionStreakActivity({
      type: "reflection",
      title: `30-Day Decision Review: ${records[index].title}`,
      details: review.lessonsLearned,
    });
  }
}
