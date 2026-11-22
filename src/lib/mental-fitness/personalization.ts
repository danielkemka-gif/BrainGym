/**
 * AKUCHE MENTAL FITNESS PERSONALIZATION & ADAPTIVE PROGRESSION ENGINE
 *
 * Selects varied, non-repetitive activities calibrated to user preferences,
 * enjoyment scores, recent history, and difficulty feedback.
 */

import { MENTAL_FITNESS_CATALOG } from "./catalog/activities";
import type {
  DifficultyLevel,
  MentalFitnessActivity,
  MentalFitnessCategory,
} from "./catalog/schema";

export interface ActivityLogSummary {
  activity_id: string;
  category: string;
  difficulty: DifficultyLevel;
  enjoyment_rating?: number | null;
  difficulty_feedback?: "too_easy" | "just_right" | "too_hard" | null;
  completed_at: string;
}

export interface CategoryPreference {
  category: string;
  current_difficulty: DifficultyLevel;
  enjoyment_score: number;
  completions_count: number;
  last_completed_at?: string | null;
}

export interface PersonalizedRecommendation {
  activity: MentalFitnessActivity;
  reason: string;
  slot: "cognitive" | "creative_or_reflective" | "mindfulness_or_lifestyle";
}

const COGNITIVE_CATS = new Set<MentalFitnessCategory>([
  "memory",
  "focus",
  "attention",
  "logical_reasoning",
  "problem_solving",
  "learning",
  "comprehension",
  "strategic_thinking",
  "cognitive_flexibility",
  "reaction_coordination",
]);

const CREATIVE_REFLECTIVE_CATS = new Set<MentalFitnessCategory>([
  "creativity",
  "imagination",
  "verbal_ability",
  "vocabulary",
  "communication",
  "observation",
  "dexterity",
  "reflection",
]);

const WELLBEING_CATS = new Set<MentalFitnessCategory>([
  "mindfulness",
  "healthy_lifestyle",
]);

export function computeNextDifficulty(
  current: DifficultyLevel,
  feedback: "too_easy" | "just_right" | "too_hard" | null | undefined
): DifficultyLevel {
  if (feedback === "too_easy") {
    if (current === "beginner") return "intermediate";
    if (current === "intermediate") return "advanced";
    return "advanced";
  }
  if (feedback === "too_hard") {
    if (current === "advanced") return "intermediate";
    if (current === "intermediate") return "beginner";
    return "beginner";
  }
  return current;
}

export function getPersonalizedRecommendations(
  recentLogs: ActivityLogSummary[],
  preferences: CategoryPreference[],
  timeBudgetMins = 15
): PersonalizedRecommendation[] {
  const prefMap = new Map(preferences.map((p) => [p.category, p]));
  const recentIds = new Set(recentLogs.slice(0, 10).map((l) => l.activity_id));
  const lastThreeIds = new Set(recentLogs.slice(0, 3).map((l) => l.activity_id));
  const recentCategoryCounts = new Map<string, number>();

  for (const log of recentLogs.slice(0, 12)) {
    recentCategoryCounts.set(
      log.category,
      (recentCategoryCounts.get(log.category) || 0) + 1
    );
  }

  // Deterministic daily salt so recommendations refresh each day without flickering on reload
  const daySeed = new Date().toISOString().slice(0, 10);
  function hashSeed(id: string): number {
    let h = 0;
    const str = `${daySeed}:${id}`;
    for (let i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) % 1000;
    }
    return h / 1000;
  }

  function scoreCandidate(a: MentalFitnessActivity): { score: number; reason: string } {
    let score = 50 + hashSeed(a.id) * 12;
    let reason = `Fresh ${a.categoryLabel.toLowerCase()} practice (${a.durationMins} min)`;

    // Anti-repetition penalties
    if (lastThreeIds.has(a.id)) {
      score -= 60;
    } else if (recentIds.has(a.id)) {
      score -= 25;
    }

    const catRecentCount = recentCategoryCounts.get(a.category) || 0;
    if (catRecentCount === 0) {
      score += 14;
      reason = `Varied pick: you haven't practiced ${a.categoryLabel} recently`;
    } else if (catRecentCount >= 3) {
      score -= 18;
    }

    // Match user's adaptive difficulty for this category
    const pref = prefMap.get(a.category);
    const targetDiff: DifficultyLevel = pref?.current_difficulty || "beginner";
    if (a.difficulty === targetDiff) {
      score += 15;
      if (pref && pref.completions_count > 0) {
        reason = `Calibrated to your ${targetDiff} level in ${a.categoryLabel}`;
      }
    }

    // Respect user enjoyment
    if (pref && pref.enjoyment_score >= 4) {
      score += 8;
    } else if (pref && pref.enjoyment_score < 2.5) {
      score -= 12;
    }

    // Respect user time budget
    if (a.durationMins <= timeBudgetMins) {
      score += 10;
    } else {
      score -= 10;
    }

    return { score, reason };
  }

  function pickBest(
    filter: (a: MentalFitnessActivity) => boolean,
    slot: PersonalizedRecommendation["slot"]
  ): PersonalizedRecommendation {
    const candidates = MENTAL_FITNESS_CATALOG.filter(filter)
      .map((a) => ({ activity: a, ...scoreCandidate(a) }))
      .sort((x, y) => y.score - x.score);

    const best = candidates[0];
    return {
      activity: best.activity,
      reason: best.reason,
      slot,
    };
  }

  return [
    pickBest((a) => COGNITIVE_CATS.has(a.category), "cognitive"),
    pickBest((a) => CREATIVE_REFLECTIVE_CATS.has(a.category), "creative_or_reflective"),
    pickBest((a) => WELLBEING_CATS.has(a.category), "mindfulness_or_lifestyle"),
  ];
}
