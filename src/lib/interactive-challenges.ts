export type ChallengeType =
  | "visual_memory"
  | "whats_missing"
  | "spot_difference"
  | "pattern_power"
  | "odd_one_out"
  | "focus_fire"
  | "reaction_challenge"
  | "story_memory"
  | "mental_maths"
  | "mental_rotation"
  | "decision_room"
  | "real_life_challenge"
  | "five_second_challenge";

export interface ChallengeOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface InteractiveChallenge {
  id: string;
  type: ChallengeType;
  category: "Memory" | "Focus" | "Speed" | "Logic" | "Decision" | "Flexibility";
  title: string;
  instruction: string;
  memorizeDurationSec?: number;
  memorizeItems?: string[];
  remainingItems?: string[]; // for whats_missing
  memorizeStory?: string;
  // Visual comparison or rotation
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
// 1. VISUAL MEMORY
// ─────────────────────────────────────────────────────────────────────────────
export const VISUAL_MEMORY_POOL: InteractiveChallenge[] = [
  {
    id: "vm-1",
    type: "visual_memory",
    category: "Memory",
    title: "1. Visual Memory Challenge",
    instruction: "Study these 6 items for 6 seconds. Remember what they are.",
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
    xpReward: 50,
    coinReward: 15,
    difficulty: "intermediate",
  },
  {
    id: "vm-2",
    type: "visual_memory",
    category: "Memory",
    title: "1. Visual Memory: Location Recall",
    instruction: "Remember the objects and their positions.",
    memorizeDurationSec: 6,
    memorizeItems: ["🦁 Lion", "🌊 Wave", "📱 Phone", "⚽ Football", "🔥 Fire", "🔑 Key"],
    question: "Which object was in the original grid?",
    options: [
      { id: "o1", label: "🔑 Key", isCorrect: true },
      { id: "o2", label: "🍎 Apple", isCorrect: false },
      { id: "o3", label: "🚗 Car", isCorrect: false },
      { id: "o4", label: "🎸 Guitar", isCorrect: false },
    ],
    educationalWhy: "Associating visual icons with their positions strengthens spatial synaptic retention in the parietal-temporal network.",
    xpReward: 50,
    coinReward: 15,
    difficulty: "beginner",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. WHAT'S MISSING?
// ─────────────────────────────────────────────────────────────────────────────
export const WHATS_MISSING_POOL: InteractiveChallenge[] = [
  {
    id: "wm-1",
    type: "whats_missing",
    category: "Memory",
    title: "2. What's Missing?",
    instruction: "Study these 7 symbols. One will disappear in the next step!",
    memorizeDurationSec: 6,
    memorizeItems: ["🏆 Trophy", "🪐 Planet", "⚡ Lightning", "🎧 Headphones", "🍕 Pizza", "🌺 Flower", "⚓ Anchor"],
    remainingItems: ["🏆 Trophy", "🪐 Planet", "⚡ Lightning", "❓ [EMPTY SLOT]", "🍕 Pizza", "🌺 Flower", "⚓ Anchor"],
    question: "One item disappeared from the grid! What is missing from the empty slot?",
    options: [
      { id: "o1", label: "🎧 Headphones", isCorrect: true },
      { id: "o2", label: "⚡ Lightning", isCorrect: false },
      { id: "o3", label: "🏆 Trophy", isCorrect: false },
      { id: "o4", label: "🍕 Pizza", isCorrect: false },
    ],
    educationalWhy: "Headphones vanished. 'Change detection' activates the dorsal visual stream to identify missing visual anchors.",
    xpReward: 50,
    coinReward: 15,
    difficulty: "intermediate",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. SPOT THE DIFFERENCE
// ─────────────────────────────────────────────────────────────────────────────
export const SPOT_DIFFERENCE_POOL: InteractiveChallenge[] = [
  {
    id: "sd-1",
    type: "spot_difference",
    category: "Focus",
    title: "3. Spot The Difference",
    instruction: "Compare Sequence A and Sequence B carefully.",
    visualPromptA: "Sequence A: 🔵 🟢 🟡 🔴 🟣 🟠",
    visualPromptB: "Sequence B: 🔵 🟢 🟡 🔴 🟤 🟠",
    question: "Which position contains the difference between Sequence A and Sequence B?",
    options: [
      { id: "o1", label: "5th Position (🟣 Purple in A vs 🟤 Brown in B)", isCorrect: true },
      { id: "o2", label: "3rd Position (🟡 Yellow)", isCorrect: false },
      { id: "o3", label: "2nd Position (🟢 Green)", isCorrect: false },
      { id: "o4", label: "6th Position (🟠 Orange)", isCorrect: false },
    ],
    educationalWhy: "The 5th item changed from Purple to Brown. Scanning side-by-side elements strengthens saccadic visual discrimination.",
    xpReward: 50,
    coinReward: 15,
    difficulty: "intermediate",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. PATTERN POWER
// ─────────────────────────────────────────────────────────────────────────────
export const PATTERN_POWER_POOL: InteractiveChallenge[] = [
  {
    id: "pp-1",
    type: "pattern_power",
    category: "Logic",
    title: "4. Pattern Power",
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
    difficulty: "beginner",
  },
  {
    id: "pp-2",
    type: "pattern_power",
    category: "Logic",
    title: "4. Pattern Power: Number Progression",
    instruction: "Determine the mathematical progression.",
    question: "What number comes next in the series: 3, 6, 12, 24, ?",
    options: [
      { id: "o1", label: "48", isCorrect: true },
      { id: "o2", label: "36", isCorrect: false },
      { id: "o3", label: "42", isCorrect: false },
      { id: "o4", label: "54", isCorrect: false },
    ],
    educationalWhy: "Each step doubles the previous number (3 × 2 = 6, 6 × 2 = 12, 12 × 2 = 24, 24 × 2 = 48).",
    xpReward: 55,
    coinReward: 18,
    difficulty: "intermediate",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. ODD ONE OUT
// ─────────────────────────────────────────────────────────────────────────────
export const ODD_ONE_OUT_POOL: InteractiveChallenge[] = [
  {
    id: "ooo-1",
    type: "odd_one_out",
    category: "Logic",
    title: "5. Odd One Out",
    instruction: "Select the item that does not share the common underlying rule.",
    question: "Which of these numbers does NOT belong with the others: 11, 13, 15, 17 ?",
    options: [
      { id: "o1", label: "15", isCorrect: true },
      { id: "o2", label: "11", isCorrect: false },
      { id: "o3", label: "13", isCorrect: false },
      { id: "o4", label: "17", isCorrect: false },
    ],
    educationalWhy: "15 is a composite number (3 × 5), whereas 11, 13, and 17 are all prime numbers.",
    xpReward: 45,
    coinReward: 12,
    difficulty: "intermediate",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 6. FOCUS FIRE
// ─────────────────────────────────────────────────────────────────────────────
export const FOCUS_FIRE_POOL: InteractiveChallenge[] = [
  {
    id: "ff-1",
    type: "focus_fire",
    category: "Focus",
    title: "6. Focus Fire: Conjunction Rule",
    instruction: "Read the target rule carefully before answering.",
    question: "RULE: Tap ONLY if the shape is BLUE and has 4 sides.",
    options: [
      { id: "o1", label: "🟦 Blue Square", isCorrect: true },
      { id: "o2", label: "🔵 Blue Circle", isCorrect: false },
      { id: "o3", label: "🟥 Red Square", isCorrect: false },
      { id: "o4", label: "🔺 Blue Triangle", isCorrect: false },
    ],
    educationalWhy: "Only the Blue Square meets BOTH conditions (Blue color + 4 sides). Conjunction filtering trains prefrontal cognitive control.",
    xpReward: 50,
    coinReward: 15,
    difficulty: "intermediate",
  },
  {
    id: "ff-2",
    type: "focus_fire",
    category: "Focus",
    title: "6. Focus Fire: Stroop Filter",
    instruction: "Focus on the COLOR of the word, NOT what the word spells!",
    question: "The word is written in GREEN font: \"RED\". What COLOR is the font?",
    options: [
      { id: "o1", label: "Green", isCorrect: true },
      { id: "o2", label: "Red", isCorrect: false },
      { id: "o3", label: "Blue", isCorrect: false },
      { id: "o4", label: "Black", isCorrect: false },
    ],
    educationalWhy: "The font color was Green. Suppressing the automatic reflex to read the word trains executive cognitive inhibition.",
    xpReward: 55,
    coinReward: 18,
    difficulty: "advanced",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 7. REACTION CHALLENGE
// ─────────────────────────────────────────────────────────────────────────────
export const REACTION_POOL: InteractiveChallenge[] = [
  {
    id: "rc-1",
    type: "reaction_challenge",
    category: "Speed",
    title: "7. Reaction Speed Challenge",
    instruction: "Identify the directional anomaly as fast as possible.",
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
];

// ─────────────────────────────────────────────────────────────────────────────
// 8. REMEMBER THE STORY
// ─────────────────────────────────────────────────────────────────────────────
export const STORY_MEMORY_POOL: InteractiveChallenge[] = [
  {
    id: "sm-1",
    type: "story_memory",
    category: "Memory",
    title: "8. Remember The Story",
    instruction: "Read and memorize the story details carefully in 10 seconds.",
    memorizeDurationSec: 10,
    memorizeStory: "David left his apartment in Lagos at 8:15 AM carrying a blue backpack. On his way to work, he stopped at a bakery, purchased 2 loaves of wheat bread and 1 bottle of juice, then boarded a red express bus at 8:35 AM.",
    question: "How many loaves of wheat bread did David purchase?",
    options: [
      { id: "o1", label: "2 Loaves", isCorrect: true },
      { id: "o2", label: "3 Loaves", isCorrect: false },
      { id: "o3", label: "1 Loaf", isCorrect: false },
      { id: "o4", label: "4 Loaves", isCorrect: false },
    ],
    educationalWhy: "David bought 2 loaves. Episodic memory binds narrative numbers, names, and objects into semantic long-term memory.",
    xpReward: 55,
    coinReward: 18,
    difficulty: "intermediate",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 9. MENTAL MATHS (REAL-WORLD ₦ NAIRA SCENARIOS)
// ─────────────────────────────────────────────────────────────────────────────
export const MENTAL_MATHS_POOL: InteractiveChallenge[] = [
  {
    id: "mm-1",
    type: "mental_maths",
    category: "Logic",
    title: "9. Mental Maths (₦ Naira)",
    instruction: "Calculate the remaining balance mentally without a calculator.",
    question: "You have ₦5,000. You buy lunch for ₦1,800, transport for ₦1,200, and a fruit drink for ₦700. How much change remains?",
    options: [
      { id: "o1", label: "₦1,300", isCorrect: true },
      { id: "o2", label: "₦1,500", isCorrect: false },
      { id: "o3", label: "₦1,100", isCorrect: false },
      { id: "o4", label: "₦900", isCorrect: false },
    ],
    educationalWhy: "₦1,800 + ₦1,200 + ₦700 = ₦3,700 spent. ₦5,000 - ₦3,700 = ₦1,300 remaining balance.",
    xpReward: 50,
    coinReward: 15,
    difficulty: "intermediate",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 10. MENTAL ROTATION & SPATIAL REASONING
// ─────────────────────────────────────────────────────────────────────────────
export const MENTAL_ROTATION_POOL: InteractiveChallenge[] = [
  {
    id: "mr-1",
    type: "mental_rotation",
    category: "Logic",
    title: "10. Mental Rotation",
    instruction: "Mentally rotate the reference arrow 90° Clockwise.",
    question: "If an arrow pointing UP (⬆️) is rotated 90° clockwise, which direction does it point?",
    options: [
      { id: "o1", label: "➡️ Points Right", isCorrect: true },
      { id: "o2", label: "⬇️ Points Down", isCorrect: false },
      { id: "o3", label: "⬅️ Points Left", isCorrect: false },
      { id: "o4", label: "↖️ Points Up-Left", isCorrect: false },
    ],
    educationalWhy: "90° clockwise rotation turns an upward vector directly to the right. Mental transformation exercises right-hemisphere spatial imagery.",
    xpReward: 45,
    coinReward: 12,
    difficulty: "beginner",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 11. DECISION ROOM
// ─────────────────────────────────────────────────────────────────────────────
export const DECISION_ROOM_POOL: InteractiveChallenge[] = [
  {
    id: "dr-1",
    type: "decision_room",
    category: "Decision",
    title: "11. Decision Room: Financial Risk",
    instruction: "Evaluate the scenario and pick the optimal decision based on risk management.",
    question: "You have ₦20,000 remaining for weekly essentials. A close acquaintance asks to borrow ₦15,000 until 'tomorrow morning'. What is the smartest decision?",
    options: [
      { id: "o1", label: "Politely decline or offer a small non-critical amount you can afford to lose (e.g. ₦2,000)", isCorrect: true },
      { id: "o2", label: "Lend the full ₦15,000 because they promised to return it tomorrow", isCorrect: false },
      { id: "o3", label: "Borrow money from someone else to lend them ₦15,000", isCorrect: false },
      { id: "o4", label: "Ignore their message completely without responding", isCorrect: false },
    ],
    educationalWhy: "Financial risk management: Never lend capital required for essential survival on unsecured promises.",
    xpReward: 60,
    coinReward: 20,
    difficulty: "intermediate",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 12. REAL-LIFE BRAIN CHALLENGE
// ─────────────────────────────────────────────────────────────────────────────
export const REAL_LIFE_POOL: InteractiveChallenge[] = [
  {
    id: "rl-1",
    type: "real_life_challenge",
    category: "Decision",
    title: "12. Real-Life Brain Challenge: Negotiation",
    instruction: "Choose the most professional strategic response.",
    question: "A client tells you: \"Your competitor is offering the exact same service for 20% cheaper.\" What is the best FIRST move?",
    options: [
      { id: "o1", label: "Ask what specific scope the competitor is delivering and highlight your unique quality & guarantees", isCorrect: true },
      { id: "o2", label: "Immediately drop your price by 25% to win the deal", isCorrect: false },
      { id: "o3", label: "Tell the client that the competitor does low-quality work", isCorrect: false },
      { id: "o4", label: "End the conversation and refuse to work with them", isCorrect: false },
    ],
    educationalWhy: "Value-based negotiation: Clarifying the scope prevents an unnecessary race to the bottom.",
    xpReward: 60,
    coinReward: 20,
    difficulty: "advanced",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 13. 5-SECOND RAPID CHALLENGE
// ─────────────────────────────────────────────────────────────────────────────
export const FIVE_SECOND_POOL: InteractiveChallenge[] = [
  {
    id: "fs-1",
    type: "five_second_challenge",
    category: "Speed",
    title: "13. 5-Second Rapid Challenge",
    instruction: "Quick! Select the highest value number immediately.",
    question: "Which of these numbers has the highest value: 37, 73, 27, 63 ?",
    options: [
      { id: "o1", label: "73", isCorrect: true },
      { id: "o2", label: "63", isCorrect: false },
      { id: "o3", label: "37", isCorrect: false },
      { id: "o4", label: "27", isCorrect: false },
    ],
    educationalWhy: "73 is the largest value. Rapid magnitude comparison exercises parietal number processing.",
    xpReward: 35,
    coinReward: 8,
    difficulty: "beginner",
  },
];

// All workouts database grouped by category for practice
export const ALL_SUGGESTED_WORKOUTS = [
  ...VISUAL_MEMORY_POOL,
  ...WHATS_MISSING_POOL,
  ...SPOT_DIFFERENCE_POOL,
  ...PATTERN_POWER_POOL,
  ...ODD_ONE_OUT_POOL,
  ...FOCUS_FIRE_POOL,
  ...REACTION_POOL,
  ...STORY_MEMORY_POOL,
  ...MENTAL_MATHS_POOL,
  ...MENTAL_ROTATION_POOL,
  ...DECISION_ROOM_POOL,
  ...REAL_LIFE_POOL,
  ...FIVE_SECOND_POOL,
];

export function generateFullSuggestedDailyWorkout(): InteractiveChallenge[] {
  // Returns a comprehensive workout covering the suggested challenge types
  return [
    VISUAL_MEMORY_POOL[0],
    WHATS_MISSING_POOL[0],
    SPOT_DIFFERENCE_POOL[0],
    FOCUS_FIRE_POOL[0],
    REACTION_POOL[0],
    STORY_MEMORY_POOL[0],
    MENTAL_MATHS_POOL[0],
    MENTAL_ROTATION_POOL[0],
    DECISION_ROOM_POOL[0],
    FIVE_SECOND_POOL[0],
  ];
}
