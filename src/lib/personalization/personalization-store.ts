/**
 * BRAINGYM PERSONALIZATION STORE & STATE MANAGER
 * 
 * Manages active user profile, adaptive difficulty levels, persona switching for QA/testing,
 * and seamlessly synchronizes with Supabase / localStorage.
 */

import {
  UserPersonalizationProfile,
  BENCHMARK_PERSONAS,
  BenchmarkPersona,
  CoreMentalFitnessArea,
  AdaptiveDifficultyLevel,
} from "./types";
import { evaluateAndAdaptDifficulty } from "./adaptive-difficulty-engine";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY_PERSONALIZATION = "braingym_personalization_profile_v2";
const STORAGE_KEY_ACTIVE_BENCHMARK = "braingym_active_benchmark_persona_id";

export const DEFAULT_PERSONALIZATION_PROFILE: UserPersonalizationProfile = {
  name: "Thinker",
  ageRange: "26-45",
  exactAge: 32,
  lifeSituations: ["Professional"],
  primaryGoal: "Decision-making",
  selectedGoals: ["Decision-making", "Focus", "Problem-solving", "Critical thinking"],
  interests: ["Career", "Business", "Money", "Everyday life"],
  currentDifficultyLevel: 3,
  skillMasteryLevels: {
    "Focus": 3,
    "Memory": 3,
    "Problem-solving": 3,
    "Decision-making": 3,
    "Critical thinking": 3,
    "Creativity": 3,
    "Adaptability": 3,
    "Self-awareness": 3,
  },
  completedWorkoutsCount: 12,
  skillWorkoutsCompleted: {
    "Focus": 2,
    "Memory": 1,
    "Problem-solving": 2,
    "Decision-making": 3,
    "Critical thinking": 2,
    "Creativity": 1,
    "Adaptability": 1,
    "Self-awareness": 0,
  },
  totalAccuracyScore: 0.85,
  recentScores: [
    { date: "2026-09-18", skill: "Decision-making", isCorrect: true, level: 3 },
    { date: "2026-09-19", skill: "Focus", isCorrect: true, level: 3 },
    { date: "2026-09-20", skill: "Critical thinking", isCorrect: true, level: 3 },
  ],
  streakDays: 4,
};

/**
 * Get the current active user personalization profile.
 */
export function getActivePersonalizationProfile(): UserPersonalizationProfile {
  if (typeof window === "undefined") return DEFAULT_PERSONALIZATION_PROFILE;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_PERSONALIZATION);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PERSONALIZATION_PROFILE,
        ...parsed,
      };
    }
  } catch (err) {
    console.warn("Failed reading personalization profile from localStorage", err);
  }

  return DEFAULT_PERSONALIZATION_PROFILE;
}

/**
 * Save user personalization profile to localStorage and sync with Supabase.
 */
export async function savePersonalizationProfile(
  profile: Partial<UserPersonalizationProfile>,
  userId?: string
): Promise<UserPersonalizationProfile> {
  const current = getActivePersonalizationProfile();
  const updated: UserPersonalizationProfile = {
    ...current,
    ...profile,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY_PERSONALIZATION, JSON.stringify(updated));
    } catch (err) {
      console.warn("Failed saving personalization profile to localStorage", err);
    }
  }

  // Sync to Supabase if user is logged in
  try {
    const supabase = createClient();
    const activeUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    if (activeUserId) {
      await supabase
        .from("profiles")
        .update({
          age: updated.exactAge || null,
          age_group: mapAgeRangeToLegacyGroup(updated.ageRange),
          goals: updated.selectedGoals,
          preferred_difficulty: `level_${updated.currentDifficultyLevel}`,
        })
        .eq("user_id", activeUserId);
    }
  } catch (err) {
    console.warn("Supabase profile sync fallback:", err);
  }

  return updated;
}

/**
 * Switch active persona to one of the 5 benchmark test personas.
 */
export function applyBenchmarkPersona(personaId: string): UserPersonalizationProfile {
  const benchmark = BENCHMARK_PERSONAS.find((p) => p.id === personaId) || BENCHMARK_PERSONAS[0];

  const profile: UserPersonalizationProfile = {
    ...DEFAULT_PERSONALIZATION_PROFILE,
    name: benchmark.name,
    ageRange: benchmark.ageRange,
    exactAge: benchmark.age,
    lifeSituations: benchmark.lifeSituations,
    primaryGoal: benchmark.primaryGoal,
    selectedGoals: [benchmark.primaryGoal, "Focus", "Problem-solving"],
    interests: benchmark.interests,
    currentDifficultyLevel: benchmark.currentDifficultyLevel,
    skillMasteryLevels: {
      "Focus": benchmark.currentDifficultyLevel,
      "Memory": benchmark.currentDifficultyLevel,
      "Problem-solving": benchmark.currentDifficultyLevel,
      "Decision-making": benchmark.currentDifficultyLevel,
      "Critical thinking": benchmark.currentDifficultyLevel,
      "Creativity": benchmark.currentDifficultyLevel,
      "Adaptability": benchmark.currentDifficultyLevel,
      "Self-awareness": benchmark.currentDifficultyLevel,
    },
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_BENCHMARK, personaId);
      localStorage.setItem(STORAGE_KEY_PERSONALIZATION, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }

  return profile;
}

/**
 * Get active benchmark persona ID if one is set.
 */
export function getActiveBenchmarkPersonaId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_BENCHMARK);
  } catch {
    return null;
  }
}

/**
 * Record a completed workout in the personalization store and adapt difficulty.
 */
export function recordWorkoutResult(
  skill: CoreMentalFitnessArea,
  isCorrectDecision: boolean,
  workoutLevel: AdaptiveDifficultyLevel
): {
  profile: UserPersonalizationProfile;
  promotedToLevel: AdaptiveDifficultyLevel | null;
  message: string;
} {
  const currentProfile = getActivePersonalizationProfile();
  const { updatedProfile, promotedToLevel, message } = evaluateAndAdaptDifficulty(
    currentProfile,
    skill,
    isCorrectDecision,
    workoutLevel
  );

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY_PERSONALIZATION, JSON.stringify(updatedProfile));
    } catch {
      // ignore
    }
  }

  return {
    profile: updatedProfile,
    promotedToLevel,
    message,
  };
}

function mapAgeRangeToLegacyGroup(range: string): string {
  if (range === "13-17") return "teen";
  if (range === "18-25") return "young_adult";
  if (range === "26-45") return "adult";
  return "senior";
}
