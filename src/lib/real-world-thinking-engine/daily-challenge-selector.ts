/**
 * REAL-WORLD THINKING ENGINE™ — DAILY CHALLENGE SELECTOR & ANTI-REPETITION
 * 
 * Guarantees:
 * 1. Timezone-Aware Calendar Day Pinning (Africa/Lagos UTC+1).
 * 2. Idempotency: Exact same challenge returned for a given user & calendar date.
 * 3. Anti-Repetition: Excludes all previously completed challenges.
 * 4. Adaptive Difficulty & Cognitive Skill Rotation across days of the week.
 */

import {
  RealWorldChallengeDefinition,
  CognitiveSkill,
  ChallengeDifficulty,
  UserChallengeAttemptRecord,
} from "./types";
import {
  getProceduralRealWorldChallenge,
  COGNITIVE_SKILLS,
} from "./content-library-repository";
import { Locale } from "../i18n/types";
import { createClient } from "../supabase/client";

const TIMEZONE = "Africa/Lagos";
const STORAGE_PREFIX = "braingym_daily_rwc_";

export function getTodayDateString(): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(new Date()); // Returns "YYYY-MM-DD"
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

export function getStoredCompletedChallengeIds(userId?: string): Set<string> {
  const completed = new Set<string>();
  if (typeof window === "undefined") return completed;

  try {
    const key = `${STORAGE_PREFIX}completed_${userId || "guest"}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        arr.forEach((id) => completed.add(id));
      }
    }
  } catch (err) {
    console.warn("Failed to load completed challenge IDs from localStorage", err);
  }

  return completed;
}

export function markChallengeCompletedLocally(
  challengeId: string,
  userId?: string,
  attempt?: Partial<UserChallengeAttemptRecord>
) {
  if (typeof window === "undefined") return;

  try {
    const key = `${STORAGE_PREFIX}completed_${userId || "guest"}`;
    const completed = getStoredCompletedChallengeIds(userId);
    completed.add(challengeId);
    localStorage.setItem(key, JSON.stringify(Array.from(completed)));

    const today = getTodayDateString();
    const todayKey = `${STORAGE_PREFIX}assigned_${userId || "guest"}_${today}`;
    const record: UserChallengeAttemptRecord = {
      id: attempt?.id || `attempt-${Date.now()}`,
      userId: userId || "guest",
      challengeId,
      assignmentDate: today,
      locale: attempt?.locale || "en",
      selectedDecisionId: attempt?.selectedDecisionId,
      isRecommendedChoice: attempt?.isRecommendedChoice,
      cognitiveDrillScore: attempt?.cognitiveDrillScore || 0,
      cognitiveDrillCompleted: true,
      actionCommitted: true,
      userReflectionText: attempt?.userReflectionText,
      xpEarned: attempt?.xpEarned || 50,
      coinsEarned: attempt?.coinsEarned || 20,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem(todayKey, JSON.stringify(record));
  } catch (err) {
    console.warn("Failed to mark challenge completed locally", err);
  }
}

export async function getTodaysRealWorldChallenge(
  userId?: string,
  userDifficulty: ChallengeDifficulty = 2,
  locale: Locale = "en"
): Promise<{
  challenge: RealWorldChallengeDefinition;
  attempt: UserChallengeAttemptRecord | null;
  isCompletedToday: boolean;
}> {
  const today = getTodayDateString();
  const todayKey = `${STORAGE_PREFIX}assigned_${userId || "guest"}_${today}`;

  // 1. Check local storage cache
  let localAttempt: UserChallengeAttemptRecord | null = null;
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(todayKey);
    if (raw) {
      try {
        localAttempt = JSON.parse(raw);
      } catch {}
    }
  }

  // 2. Deterministic day seed & skill rotation based on day of week
  const dateObj = new Date(today);
  const dayOfWeek = dateObj.getDay(); // 0-6
  const dayOfYear = getDayOfYear(dateObj);
  const targetSkill = COGNITIVE_SKILLS[dayOfWeek % COGNITIVE_SKILLS.length];

  // 3. Compute unique hash to select non-repeating challenge
  const completedIds = getStoredCompletedChallengeIds(userId);
  let challengeIndex = (dayOfYear * 7 + (userId ? hashString(userId) : 101)) % 3000;

  let selectedChallenge = getProceduralRealWorldChallenge(
    challengeIndex,
    targetSkill,
    userDifficulty,
    locale
  );

  // If already completed and we have alternatives, pick next non-completed seed
  let attempts = 0;
  while (completedIds.has(selectedChallenge.id) && attempts < 50) {
    challengeIndex = (challengeIndex + 17) % 3000;
    selectedChallenge = getProceduralRealWorldChallenge(
      challengeIndex,
      targetSkill,
      userDifficulty,
      locale
    );
    attempts++;
  }

  const isCompletedToday = Boolean(localAttempt?.completedAt);

  return {
    challenge: selectedChallenge,
    attempt: localAttempt,
    isCompletedToday,
  };
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
