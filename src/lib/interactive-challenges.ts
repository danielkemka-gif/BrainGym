export type ChallengeType =
  | "visual_memory"
  | "reaction_speed"
  | "pattern_recognition"
  | "decision_room"
  | "focus_fire"
  | "memory_recall"
  | "speed_round"
  | "whats_missing"
  | "odd_one_out"
  | "mental_maths"
  | "mental_rotation";

export interface ChallengeOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface InteractiveChallenge {
  id: string;
  type: ChallengeType;
  category: "Memory" | "Focus" | "Speed" | "Reasoning" | "Problem Solving";
  roundNumber: number;
  title: string;
  instruction: string;
  memorizeDurationSec?: number;
  memorizeItems?: string[];
  remainingItems?: string[];
  memorizeStory?: string;
  visualPromptA?: string;
  visualPromptB?: string;
  question: string;
  options: ChallengeOption[];
  educationalWhy: string;
  xpReward: number;
  coinReward: number;
  difficulty: "beginner" | "intermediate" | "advanced";
}

// ─────────────────────────────────────────────────────────────────────────────
// EXACT 7-ROUND PROGRESSIVE DAILY WORKOUT
// ─────────────────────────────────────────────────────────────────────────────
export const SEVEN_ROUND_DAILY_WORKOUT: InteractiveChallenge[] = [
  // ─── Challenge 1: Visual Memory ──────────────────────────────────────────
  {
    id: "round-1",
    roundNumber: 1,
    type: "visual_memory",
    category: "Memory",
    title: "Challenge 1: Visual Memory",
    instruction: "Study these 6 objects carefully for 6 seconds. Remember what they are.",
    memorizeDurationSec: 6,
    memorizeItems: ["🎒 Backpack", "⚡ Lightning", "🎨 Palette", "🚀 Rocket", "💎 Diamond", "🧩 Puzzle"],
    question: "Which of these objects was NOT in the picture you just studied?",
    options: [
      { id: "o1", label: "🎸 Guitar", isCorrect: true },
      { id: "o2", label: "🚀 Rocket", isCorrect: false },
      { id: "o3", label: "💎 Diamond", isCorrect: false },
      { id: "o4", label: "🎒 Backpack", isCorrect: false },
    ],
    educationalWhy: "The guitar was not in the original grid. Your visual cortex rapidly stores spatial arrangements in working memory for up to 10 seconds.",
    xpReward: 45,
    coinReward: 10,
    difficulty: "beginner",
  },

  // ─── Challenge 2: Reaction Speed ─────────────────────────────────────────
  {
    id: "round-2",
    roundNumber: 2,
    type: "reaction_speed",
    category: "Speed",
    title: "Challenge 2: Reaction Speed",
    instruction: "Identify the directional anomaly as fast as you can.",
    question: "Which arrow is pointing in the OPPOSITE direction: ➡️ ➡️ ⬅️ ➡️ ?",
    options: [
      { id: "o1", label: "3rd Arrow (⬅️ Left)", isCorrect: true },
      { id: "o2", label: "1st Arrow (➡️ Right)", isCorrect: false },
      { id: "o3", label: "2nd Arrow (➡️ Right)", isCorrect: false },
      { id: "o4", label: "4th Arrow (➡️ Right)", isCorrect: false },
    ],
    educationalWhy: "Arrow #3 points Left while all others point Right. Fast directional discrepancy tests optic reflex speed.",
    xpReward: 40,
    coinReward: 10,
    difficulty: "beginner",
  },

  // ─── Challenge 3: Pattern Recognition ────────────────────────────────────
  {
    id: "round-3",
    roundNumber: 3,
    type: "pattern_recognition",
    category: "Reasoning",
    title: "Challenge 3: Pattern Recognition",
    instruction: "Identify the geometric rule governing this pattern.",
    question: "Complete the sequence: ▲  ●  ▲  ●  ▲  ?",
    options: [
      { id: "o1", label: "● (Circle)", isCorrect: true },
      { id: "o2", label: "▲ (Triangle)", isCorrect: false },
      { id: "o3", label: "■ (Square)", isCorrect: false },
      { id: "o4", label: "◆ (Diamond)", isCorrect: false },
    ],
    educationalWhy: "The pattern alternates between Triangle and Circle (A-B-A-B-A-B).",
    xpReward: 45,
    coinReward: 12,
    difficulty: "intermediate",
  },

  // ─── Challenge 4: Decision Room ──────────────────────────────────────────
  {
    id: "round-4",
    roundNumber: 4,
    type: "decision_room",
    category: "Problem Solving",
    title: "Challenge 4: Decision Room",
    instruction: "Evaluate the scenario and pick the smartest strategic decision.",
    question: "You have ₦20,000 for weekly food & data. An acquaintance asks to borrow ₦15,000 and promises to return it tomorrow. What is the smartest decision?",
    options: [
      { id: "o1", label: "Politely decline or offer only a non-critical amount you can afford to lose (e.g. ₦2,000)", isCorrect: true },
      { id: "o2", label: "Lend the full ₦15,000 because they promised to return it tomorrow", isCorrect: false },
      { id: "o3", label: "Borrow money from someone else to lend them the ₦15,000", isCorrect: false },
      { id: "o4", label: "Ignore the message completely without replying", isCorrect: false },
    ],
    educationalWhy: "Financial risk management: Never risk capital required for essential weekly survival on unsecured promises, as loan defaults immediately jeopardize your own essential cash flow.",
    xpReward: 60,
    coinReward: 20,
    difficulty: "intermediate",
  },

  // ─── Challenge 5: Focus Fire ─────────────────────────────────────────────
  {
    id: "round-5",
    roundNumber: 5,
    type: "focus_fire",
    category: "Focus",
    title: "Challenge 5: Focus Fire",
    instruction: "Read the target rule carefully before answering.",
    question: "RULE: Tap ONLY if the shape is BLUE and has 4 sides.",
    options: [
      { id: "o1", label: "🟦 Blue Square", isCorrect: true },
      { id: "o2", label: "🔵 Blue Circle", isCorrect: false },
      { id: "o3", label: "🟥 Red Square", isCorrect: false },
      { id: "o4", label: "🔺 Blue Triangle", isCorrect: false },
    ],
    educationalWhy: "Only the Blue Square meets BOTH conditions (Blue color + 4 sides). Conjunction filtering exercises prefrontal focus control.",
    xpReward: 50,
    coinReward: 15,
    difficulty: "intermediate",
  },

  // ─── Challenge 6: Memory Recall ──────────────────────────────────────────
  {
    id: "round-6",
    roundNumber: 6,
    type: "memory_recall",
    category: "Memory",
    title: "Challenge 6: Memory Recall (The Story)",
    instruction: "Read and memorize the story details in 10 seconds.",
    memorizeDurationSec: 10,
    memorizeStory: "David left his apartment in Lagos at 8:15 AM carrying a blue backpack. On his way to work, he stopped at a bakery, purchased 2 loaves of wheat bread and 1 bottle of juice, then boarded a red express bus at 8:35 AM.",
    question: "How many loaves of wheat bread did David purchase?",
    options: [
      { id: "o1", label: "2 Loaves", isCorrect: true },
      { id: "o2", label: "3 Loaves", isCorrect: false },
      { id: "o3", label: "1 Loaf", isCorrect: false },
      { id: "o4", label: "4 Loaves", isCorrect: false },
    ],
    educationalWhy: "David bought 2 loaves. Episodic narrative recall tests hippocampus binding and retrieval under time limits.",
    xpReward: 55,
    coinReward: 18,
    difficulty: "intermediate",
  },

  // ─── Challenge 7: Speed Round (Mini Brain Test) ──────────────────────────
  {
    id: "round-7",
    roundNumber: 7,
    type: "speed_round",
    category: "Speed",
    title: "Challenge 7: Speed Round (Mini Brain Test)",
    instruction: "Quick! Select the largest value number immediately.",
    question: "Which of these numbers has the highest value: 37, 73, 27, 63 ?",
    options: [
      { id: "o1", label: "73", isCorrect: true },
      { id: "o2", label: "63", isCorrect: false },
      { id: "o3", label: "37", isCorrect: false },
      { id: "o4", label: "27", isCorrect: false },
    ],
    educationalWhy: "73 is the largest value. Rapid visual magnitude comparison exercises parietal number processing.",
    xpReward: 50,
    coinReward: 15,
    difficulty: "advanced",
  },
];
