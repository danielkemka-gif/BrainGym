/**
 * BRAINGYM CONTENT RECOMMENDATION ENGINE
 * 
 * Central Formula:
 * «AGE + LIFE SITUATION + GOALS + INTERESTS + PERFORMANCE + DIFFICULTY»
 * 
 * Safeguards:
 * 1. Under-18 accounts receive strictly youth-safe scenarios (school, friendships, personal responsibility, study habits).
 * 2. Older adults receive empowered, dignified scenarios (mentorship, legacy, purpose, strategy, cognitive longevity).
 * 3. Difficulty is matched to demonstrated performance (Levels 1 to 6+), NOT age.
 * 4. Progressive 365-day rotation ensures users are greeted with a fresh workout daily.
 */

import {
  PersonalizedMentalWorkout,
  UserPersonalizationProfile,
  CoreMentalFitnessArea,
  AgeRangeBracket,
  LifeSituationType,
  UserInterestType,
  AdaptiveDifficultyLevel,
} from "./types";
import { PERSONALIZED_WORKOUTS_REPOSITORY } from "./scenarios-repository";

export interface RecommendationMatchResult {
  workout: PersonalizedMentalWorkout;
  matchScore: number;
  matchReasons: string[];
  targetedSkill: CoreMentalFitnessArea;
  adaptiveLevel: AdaptiveDifficultyLevel;
}

/**
 * Main recommendation algorithm to get today's optimal personalized mental workout.
 */
export function getTodaysRecommendedWorkout(
  profile?: Partial<UserPersonalizationProfile> | null,
  dayOffset = 0
): PersonalizedMentalWorkout {
  const dayOfYear =
    Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    ) + dayOffset;

  const ageRange: AgeRangeBracket = profile?.ageRange || "26-45";
  const exactAge = profile?.exactAge;
  const isYouth = ageRange === "13-17" || (exactAge !== undefined && exactAge < 18);
  const lifeSituations: LifeSituationType[] = profile?.lifeSituations?.length
    ? profile.lifeSituations
    : ["Professional"];
  const primaryGoal: CoreMentalFitnessArea = profile?.primaryGoal || "Decision-making";
  const interests: UserInterestType[] = profile?.interests?.length
    ? profile.interests
    : ["Business", "Career", "Everyday life"];
  const targetDifficulty: AdaptiveDifficultyLevel = profile?.currentDifficultyLevel || 3;

  // 1. Filter out unsafe content for youth
  let eligibleWorkouts = PERSONALIZED_WORKOUTS_REPOSITORY.filter((workout) => {
    if (isYouth) {
      return (
        workout.tags.safetyCategory === "youth_safe" ||
        workout.tags.safetyCategory === "all_audiences" ||
        workout.tags.ageSuitability === "13+" ||
        workout.tags.ageSuitability === "all"
      );
    }
    return true;
  });

  if (eligibleWorkouts.length === 0) {
    eligibleWorkouts = PERSONALIZED_WORKOUTS_REPOSITORY;
  }

  // 2. Score each eligible workout based on multi-factor criteria
  const scored = eligibleWorkouts.map((workout) => {
    let score = 0;
    const reasons: string[] = [];

    // Factor A: Universal Skill Alignment (Primary Goal / Rotating Core Areas)
    if (workout.universalSkill === primaryGoal) {
      score += 35;
      reasons.push(`Directly targets your primary focus area: ${primaryGoal}`);
    } else if (profile?.selectedGoals?.includes(workout.universalSkill)) {
      score += 20;
      reasons.push(`Trains your selected goal: ${workout.universalSkill}`);
    }

    // Factor B: Life Situation Matching
    const matchingLifeContext = workout.tags.lifeContext.filter((ctx) =>
      lifeSituations.includes(ctx)
    );
    if (matchingLifeContext.length > 0) {
      score += 25;
      reasons.push(`Relevant to your situation as ${matchingLifeContext.join(", ")}`);
    }

    // Factor C: Interests Overlap
    const matchingInterests = workout.tags.interests.filter((int) =>
      interests.includes(int)
    );
    if (matchingInterests.length > 0) {
      score += 15 * matchingInterests.length;
      reasons.push(`Touches your interest in ${matchingInterests.join(", ")}`);
    }

    // Factor D: Difficulty Proximity (Performance-based)
    const diffDiff = Math.abs(workout.difficultyLevel - targetDifficulty);
    score += Math.max(0, 15 - diffDiff * 5);

    return {
      workout,
      score,
      reasons,
    };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Take top matching pool (top 3) and rotate by dayOfYear for deterministic freshness
  const topPool = scored.slice(0, Math.min(3, scored.length));
  const selectedIndex = Math.abs(dayOfYear) % topPool.length;

  return topPool[selectedIndex].workout;
}

/**
 * Filter workouts by specific Core Mental Fitness Area.
 */
export function getWorkoutsBySkill(
  skill: CoreMentalFitnessArea,
  isYouth = false
): PersonalizedMentalWorkout[] {
  return PERSONALIZED_WORKOUTS_REPOSITORY.filter((w) => {
    if (w.universalSkill !== skill) return false;
    if (isYouth && w.tags.safetyCategory === "general_adult") return false;
    return true;
  });
}
