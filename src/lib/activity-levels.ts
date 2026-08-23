export interface LevelConfig {
  level: number;
  title: string;
  minPoints: number;
  badge: string;
  description: string;
}

export const ACTIVITY_LEVELS: LevelConfig[] = [
  {
    level: 1,
    title: "Novice (Level 1)",
    minPoints: 0,
    badge: "🌱",
    description: "Beginner foundations unlocked for all members.",
  },
  {
    level: 2,
    title: "Practitioner (Level 2)",
    minPoints: 120,
    badge: "⚡",
    description: "Requires 120 points in this category to unlock.",
  },
  {
    level: 3,
    title: "Master (Level 3)",
    minPoints: 300,
    badge: "🔥",
    description: "Requires 300 points in this category to unlock.",
  },
  {
    level: 4,
    title: "Grandmaster (Level 4)",
    minPoints: 550,
    badge: "👑",
    description: "Requires 550 points in this category to unlock.",
  },
];

/**
 * Maps an activity's difficulty to its required progression level.
 */
export function getActivityRequiredLevel(difficulty: string): number {
  const normalized = difficulty.toLowerCase().trim();
  if (normalized === "intermediate") return 2;
  if (normalized === "advanced") return 3;
  if (normalized === "expert" || normalized === "grandmaster") return 4;
  return 1; // beginner
}

/**
 * Checks if a specific activity is unlocked for a user based on their category points/XP.
 */
export function isActivityUnlocked(
  activityDifficulty: string,
  userCategoryPoints: number = 0
): {
  unlocked: boolean;
  requiredLevel: number;
  requiredPoints: number;
  pointsNeeded: number;
  levelTitle: string;
} {
  const requiredLevel = getActivityRequiredLevel(activityDifficulty);
  const config = ACTIVITY_LEVELS.find((l) => l.level === requiredLevel) || ACTIVITY_LEVELS[0];

  const unlocked = userCategoryPoints >= config.minPoints;
  const pointsNeeded = Math.max(0, config.minPoints - userCategoryPoints);

  return {
    unlocked,
    requiredLevel,
    requiredPoints: config.minPoints,
    pointsNeeded,
    levelTitle: config.title,
  };
}

/**
 * Computes the user's current level & next unlock progress for a specific category.
 */
export function getCategoryLevelProgress(userCategoryPoints: number = 0) {
  let currentLevelConfig = ACTIVITY_LEVELS[0];
  let nextLevelConfig: LevelConfig | null = ACTIVITY_LEVELS[1];

  for (let i = ACTIVITY_LEVELS.length - 1; i >= 0; i--) {
    if (userCategoryPoints >= ACTIVITY_LEVELS[i].minPoints) {
      currentLevelConfig = ACTIVITY_LEVELS[i];
      nextLevelConfig = ACTIVITY_LEVELS[i + 1] || null;
      break;
    }
  }

  if (!nextLevelConfig) {
    return {
      currentLevel: currentLevelConfig.level,
      levelTitle: currentLevelConfig.title,
      badge: currentLevelConfig.badge,
      progressPercent: 100,
      pointsNeeded: 0,
      nextLevel: null,
      nextLevelPoints: currentLevelConfig.minPoints,
      isMaxLevel: true,
    };
  }

  const range = nextLevelConfig.minPoints - currentLevelConfig.minPoints;
  const earnedInRange = userCategoryPoints - currentLevelConfig.minPoints;
  const progressPercent = Math.min(100, Math.max(0, Math.round((earnedInRange / range) * 100)));
  const pointsNeeded = Math.max(0, nextLevelConfig.minPoints - userCategoryPoints);

  return {
    currentLevel: currentLevelConfig.level,
    levelTitle: currentLevelConfig.title,
    badge: currentLevelConfig.badge,
    progressPercent,
    pointsNeeded,
    nextLevel: nextLevelConfig.level,
    nextLevelPoints: nextLevelConfig.minPoints,
    isMaxLevel: false,
  };
}
