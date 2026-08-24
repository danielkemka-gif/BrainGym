import { HabitStack, WeeklyMission, PhysicalBrainScore } from "./types";

export const HABIT_STACKS: HabitStack[] = [
  {
    id: "stack-morning",
    title: "The Morning High-Performance Stack",
    description: "Hydrate, meditate, walk, and sharpen your focus before the digital workday starts.",
    timeOfDay: "morning",
    activities: ["nut-act-01", "foc-act-01", "mov-act-01"],
    totalMinutes: 30,
    bonusXp: 50,
    bonusCoins: 20,
  },
  {
    id: "stack-learning",
    title: "The Deep Learning & Memory Stack",
    description: "Read 15 pages, learn 3 new concepts, and teach what you learned using the Feynman method.",
    timeOfDay: "afternoon",
    activities: ["lrn-act-03", "mem-act-01", "lrn-act-02"],
    totalMinutes: 40,
    bonusXp: 65,
    bonusCoins: 25,
  },
  {
    id: "stack-evening",
    title: "The Evening Wind-Down & Brain Recovery Stack",
    description: "Reflect on gratitude, plan tomorrow's 3 MITs, and initiate digital sunset for deep sleep.",
    timeOfDay: "evening",
    activities: ["eq-act-01", "exec-act-01", "slp-act-01"],
    totalMinutes: 45,
    bonusXp: 60,
    bonusCoins: 25,
  },
];

export const WEEKLY_MISSIONS: WeeklyMission[] = [
  {
    id: "mis-focus",
    title: "Digital Fasting Vanguard",
    category: "Focus & Concentration",
    description: "Complete 5 mornings with no social media for the first 30 minutes.",
    targetDays: 5,
    xpReward: 150,
    coinReward: 50,
    badgeName: "Focus Vanguard",
  },
  {
    id: "mis-movement",
    title: "Cerebral Oxygenator",
    category: "Movement & Physical Health",
    description: "Complete a 15-minute outdoor walk on 5 separate days this week.",
    targetDays: 5,
    xpReward: 150,
    coinReward: 50,
    badgeName: "Oxygenator",
  },
  {
    id: "mis-learning",
    title: "Linguistic Explorer",
    category: "Learning & Language",
    description: "Learn 15 new words or greetings across the week.",
    targetDays: 5,
    xpReward: 150,
    coinReward: 50,
    badgeName: "Polymath",
  },
];

export function calculatePhysicalBrainScore(completedActivities: string[]): PhysicalBrainScore {
  const count = completedActivities.length;
  const base = Math.min(100, Math.round(50 + count * 3.5));

  return {
    totalScore: base,
    focusScore: Math.min(95, base + 4),
    movementScore: Math.min(92, base - 2),
    learningScore: Math.min(96, base + 6),
    recoveryScore: Math.min(88, base - 5),
    emotionalScore: Math.min(94, base + 2),
    completedCount: count,
    currentStreak: Math.max(1, Math.floor(count / 2) + 1),
  };
}
