import { LEVELS, XP, COINS } from "@/lib/constants";

export function getLevel(totalXp: number) {
  let level: (typeof LEVELS)[number] = LEVELS[0];
  for (const l of LEVELS) {
    if (totalXp >= l.xpRequired) level = l;
  }
  return level;
}

export function getNextLevel(totalXp: number) {
  const current = getLevel(totalXp);
  const nextIndex = LEVELS.findIndex((l) => l.level === current.level) + 1;
  return nextIndex < LEVELS.length ? LEVELS[nextIndex] : null;
}

export function getLevelProgress(totalXp: number) {
  const current = getLevel(totalXp);
  const next = getNextLevel(totalXp);

  if (!next) return { level: current, progress: 1, xpInLevel: 0, xpForNext: 0 };

  const xpInLevel = totalXp - current.xpRequired;
  const xpForNext = next.xpRequired - current.xpRequired;
  const progress = Math.min(xpInLevel / xpForNext, 1);

  return { level: current, progress, xpInLevel, xpForNext };
}

export function calculateXpAward(
  type: keyof typeof XP,
  streakMultiplier = 1
) {
  return XP[type] * streakMultiplier;
}

export function calculateCoinsAward(type: keyof typeof COINS) {
  return COINS[type];
}

export function calculateStreakMultiplier(streak: number) {
  return 1 + Math.floor(streak / XP.STREAK_MULTIPLIER) * 0.5;
}
