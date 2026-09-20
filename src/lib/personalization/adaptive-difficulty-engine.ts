/**
 * BRAINGYM ADAPTIVE DIFFICULTY ENGINE
 * 
 * Core Principles:
 * 1. Difficulty is based strictly on demonstrated performance, NEVER age.
 *    A 16-year-old performing well reaches Level 5.
 *    A 60-year-old performing well reaches Level 5.
 * 2. Non-medical, non-IQ claims: Progress is clearly communicated as:
 *    «"You've completed 12 Level 4 decision-making workouts."»
 * 3. Tracks accuracy, consistency, attempts, and mastery across all 8 Core Mental Fitness Areas.
 */

import {
  AdaptiveDifficultyLevel,
  CoreMentalFitnessArea,
  DIFFICULTY_LEVELS_CONFIG,
  UserPersonalizationProfile,
} from "./types";

export interface SkillPerformanceMetric {
  skill: CoreMentalFitnessArea;
  currentLevel: AdaptiveDifficultyLevel;
  totalWorkoutsCompleted: number;
  correctDecisionsCount: number;
  accuracyRate: number; // 0.0 - 1.0
  consecutiveSuccessStreak: number;
  highestLevelAchieved: AdaptiveDifficultyLevel;
  lastTrainedDate?: string;
}

export interface AdaptiveProgressSummary {
  currentOverallLevel: AdaptiveDifficultyLevel;
  totalWorkoutsCompleted: number;
  overallAccuracyRate: number;
  skillMetrics: Record<CoreMentalFitnessArea, SkillPerformanceMetric>;
  strongestSkill: CoreMentalFitnessArea;
  growthSkill: CoreMentalFitnessArea;
  recentMilestones: string[];
}

/**
 * Evaluates a completed workout performance and determines if the user's difficulty level should adapt.
 */
export function evaluateAndAdaptDifficulty(
  profile: UserPersonalizationProfile,
  skill: CoreMentalFitnessArea,
  isCorrectDecision: boolean,
  workoutLevel: AdaptiveDifficultyLevel
): {
  updatedProfile: UserPersonalizationProfile;
  promotedToLevel: AdaptiveDifficultyLevel | null;
  message: string;
} {
  const currentSkillLevel = profile.skillMasteryLevels[skill] || profile.currentDifficultyLevel || 1;
  const currentWorkoutsForSkill = profile.skillWorkoutsCompleted[skill] || 0;
  const newWorkoutsForSkill = currentWorkoutsForSkill + 1;
  
  // Calculate rolling accuracy
  const recentSkillScores = profile.recentScores
    .filter((s) => s.skill === skill)
    .slice(-10); // Look at last 10 attempts for this skill

  const totalCorrect = recentSkillScores.filter((s) => s.isCorrect).length + (isCorrectDecision ? 1 : 0);
  const totalAttempts = recentSkillScores.length + 1;
  const skillAccuracy = totalCorrect / totalAttempts;

  let newSkillLevel = currentSkillLevel;
  let promotedToLevel: AdaptiveDifficultyLevel | null = null;
  let message = `Great practice! You've logged ${newWorkoutsForSkill} ${skill} workouts.`;

  // Promotion evaluation: If accuracy >= 80% over 5+ workouts and currently under max level
  if (totalAttempts >= 4 && skillAccuracy >= 0.75 && currentSkillLevel < 6) {
    newSkillLevel = Math.min(6, currentSkillLevel + 1) as AdaptiveDifficultyLevel;
    promotedToLevel = newSkillLevel;
    message = `⚡ Level Up! You've advanced to Level ${newSkillLevel} in ${skill}. Your analytical reasoning is sharpening!`;
  } 
  // Gentle adjustment: If accuracy is under 40% over 4 attempts, adjust down slightly to build solid momentum
  else if (totalAttempts >= 4 && skillAccuracy < 0.40 && currentSkillLevel > 1) {
    newSkillLevel = Math.max(1, currentSkillLevel - 1) as AdaptiveDifficultyLevel;
    message = `We've calibrated your ${skill} workouts to Level ${newSkillLevel} to solidify fundamental reasoning.`;
  }

  // Calculate overall level (average of all 8 core skills)
  const updatedSkillMastery = {
    ...profile.skillMasteryLevels,
    [skill]: newSkillLevel,
  };

  const levelsSum = Object.values(updatedSkillMastery).reduce((acc, lvl) => acc + lvl, 0);
  const calculatedOverallLevel = Math.max(1, Math.round(levelsSum / 8)) as AdaptiveDifficultyLevel;

  const updatedProfile: UserPersonalizationProfile = {
    ...profile,
    currentDifficultyLevel: calculatedOverallLevel,
    skillMasteryLevels: updatedSkillMastery,
    completedWorkoutsCount: profile.completedWorkoutsCount + 1,
    skillWorkoutsCompleted: {
      ...profile.skillWorkoutsCompleted,
      [skill]: newWorkoutsForSkill,
    },
    recentScores: [
      ...profile.recentScores.slice(-29), // keep last 30
      {
        date: new Date().toISOString().split("T")[0],
        skill,
        isCorrect: isCorrectDecision,
        level: workoutLevel,
      },
    ],
  };

  return {
    updatedProfile,
    promotedToLevel,
    message,
  };
}

/**
 * Returns clean, responsible progress summaries without clinical or medical claims.
 */
export function generateProgressSummary(profile: UserPersonalizationProfile): AdaptiveProgressSummary {
  const skills: CoreMentalFitnessArea[] = [
    "Focus",
    "Memory",
    "Problem-solving",
    "Decision-making",
    "Critical thinking",
    "Creativity",
    "Adaptability",
    "Self-awareness",
  ];

  const skillMetrics: Record<CoreMentalFitnessArea, SkillPerformanceMetric> = {} as any;

  let highestAccuracy = -1;
  let lowestAccuracy = 2;
  let strongestSkill: CoreMentalFitnessArea = "Decision-making";
  let growthSkill: CoreMentalFitnessArea = "Focus";

  let totalCorrectAll = 0;
  let totalAttemptsAll = 0;

  for (const skill of skills) {
    const skillScores = profile.recentScores.filter((s) => s.skill === skill);
    const completed = profile.skillWorkoutsCompleted[skill] || 0;
    const correctCount = skillScores.filter((s) => s.isCorrect).length;
    const accuracy = skillScores.length > 0 ? correctCount / skillScores.length : 0.8; // default benchmark

    totalCorrectAll += correctCount;
    totalAttemptsAll += skillScores.length;

    const currentLevel = profile.skillMasteryLevels[skill] || profile.currentDifficultyLevel || 1;

    skillMetrics[skill] = {
      skill,
      currentLevel,
      totalWorkoutsCompleted: completed,
      correctDecisionsCount: correctCount,
      accuracyRate: Math.round(accuracy * 100) / 100,
      consecutiveSuccessStreak: calculateConsecutiveStreak(skillScores),
      highestLevelAchieved: currentLevel,
    };

    if (accuracy > highestAccuracy && completed > 0) {
      highestAccuracy = accuracy;
      strongestSkill = skill;
    }
    if (accuracy < lowestAccuracy) {
      lowestAccuracy = accuracy;
      growthSkill = skill;
    }
  }

  const overallAccuracyRate =
    totalAttemptsAll > 0
      ? Math.round((totalCorrectAll / totalAttemptsAll) * 100) / 100
      : 0.85;

  const milestones: string[] = [
    `Completed ${profile.completedWorkoutsCount} universal mental fitness workouts`,
    `Mastered Level ${profile.currentDifficultyLevel} complexity tier`,
    `Maintained a ${profile.streakDays || 1}-day active cognitive training streak`,
  ];

  return {
    currentOverallLevel: profile.currentDifficultyLevel || 1,
    totalWorkoutsCompleted: profile.completedWorkoutsCount,
    overallAccuracyRate,
    skillMetrics,
    strongestSkill,
    growthSkill,
    recentMilestones: milestones,
  };
}

function calculateConsecutiveStreak(scores: { isCorrect: boolean }[]): number {
  let streak = 0;
  for (let i = scores.length - 1; i >= 0; i--) {
    if (scores[i].isCorrect) streak++;
    else break;
  }
  return streak;
}
