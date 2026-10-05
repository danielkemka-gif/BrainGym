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
