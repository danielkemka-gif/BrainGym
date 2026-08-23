export type ChallengeType =
  | "visual_memory"
  | "whats_missing"
  | "odd_one_out"
  | "pattern_power"
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
  // For memory-based challenges with an inspection phase:
  memorizeDurationSec?: number;
  memorizeItems?: string[];
  memorizeStory?: string;
  // The actual question to answer:
  question: string;
  options: ChallengeOption[];
  educationalWhy: string;
  xpReward: number;
  coinReward: number;
  difficulty: "beginner" | "intermediate" | "advanced";
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. VISUAL MEMORY POOL
// ─────────────────────────────────────────────────────────────────────────────
const VISUAL_MEMORY_POOL: InteractiveChallenge[] = [
  {
    id: "vm-1",
    type: "visual_memory",
    category: "Memory",
    title: "Visual Memory Grid",
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
    xpReward: 50,
    coinReward: 15,
    difficulty: "intermediate",
  },
  {
    id: "vm-2",
    type: "visual_memory",
    category: "Memory",
    title: "Spatial Location Recall",
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
    educationalWhy: "Great job! Associating visual icons with their positions strengthens spatial synaptic retention.",
    xpReward: 50,
    coinReward: 15,
    difficulty: "beginner",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. WHAT'S MISSING POOL
// ─────────────────────────────────────────────────────────────────────────────
const WHATS_MISSING_POOL: InteractiveChallenge[] = [
  {
    id: "wm-1",
    type: "whats_missing",
    category: "Memory",
    title: "What's Missing?",
    instruction: "Study these 7 symbols. One of them will vanish in the next step!",
    memorizeDurationSec: 6,
    memorizeItems: ["🏆 Trophy", "🪐 Planet", "⚡ Lightning", "🎧 Headphones", "🍕 Pizza", "🌺 Flower", "⚓ Anchor"],
    question: "One item disappeared from the grid! Which object is missing?",
    options: [
      { id: "o1", label: "🎧 Headphones", isCorrect: true },
      { id: "o2", label: "⚡ Lightning", isCorrect: false },
      { id: "o3", label: "🏆 Trophy", isCorrect: false },
      { id: "o4", label: "🍕 Pizza", isCorrect: false },
    ],
    educationalWhy: "Headphones was removed. 'Change detection' exercises activate parietal lobes that scan for missing visual anchors.",
    xpReward: 50,
    coinReward: 15,
    difficulty: "intermediate",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. PATTERN POWER & LOGIC SEQUENCES
// ─────────────────────────────────────────────────────────────────────────────
const PATTERN_POWER_POOL: InteractiveChallenge[] = [
  {
    id: "pp-1",
    type: "pattern_power",
    category: "Logic",
    title: "Visual Pattern Sequence",
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
    title: "Numerical Growth Pattern",
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
  {
    id: "pp-3",
    type: "pattern_power",
    category: "Logic",
    title: "Matrix Logic Deduction",
    instruction: "Find the symbol that logically satisfies the grid.",
    question: "Row 1: 🔴 🔵 🟢 | Row 2: 🔵 🟢 🔴 | Row 3: 🟢 🔴 ?",
    options: [
      { id: "o1", label: "🔵 Blue", isCorrect: true },
      { id: "o2", label: "🔴 Red", isCorrect: false },
      { id: "o3", label: "🟢 Green", isCorrect: false },
      { id: "o4", label: "🟡 Yellow", isCorrect: false },
    ],
    educationalWhy: "Every row and column must contain one Red, one Blue, and one Green element (Latin Square rule).",
    xpReward: 60,
    coinReward: 20,
    difficulty: "advanced",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. ODD ONE OUT & ANOMALY DETECTION
// ─────────────────────────────────────────────────────────────────────────────
const ODD_ONE_OUT_POOL: InteractiveChallenge[] = [
  {
    id: "ooo-1",
    type: "odd_one_out",
    category: "Logic",
    title: "Odd One Out",
    instruction: "Select the item that does not share the common underlying rule.",
    question: "Which of these numbers does NOT belong with the others?",
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
// 5. FOCUS FIRE (GO / NO-GO CONCENTRATION)
// ─────────────────────────────────────────────────────────────────────────────
const FOCUS_FIRE_POOL: InteractiveChallenge[] = [
  {
    id: "ff-1",
    type: "focus_fire",
    category: "Focus",
    title: "Focus Fire: Rule Filter",
    instruction: "Read the target rule carefully before answering.",
    question: "RULE: Tap ONLY if the shape is BLUE and has 4 sides.",
    options: [
      { id: "o1", label: "🟦 Blue Square", isCorrect: true },
      { id: "o2", label: "🔵 Blue Circle", isCorrect: false },
      { id: "o3", label: "🟥 Red Square", isCorrect: false },
      { id: "o4", label: "🔺 Blue Triangle", isCorrect: false },
    ],
    educationalWhy: "Only the Blue Square meets BOTH conditions (Blue color + 4 sides). Conjunction search trains prefrontal focus filtering.",
    xpReward: 50,
    coinReward: 15,
    difficulty: "intermediate",
  },
  {
    id: "ff-2",
    type: "focus_fire",
    category: "Focus",
    title: "Stroop Interference Filter",
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
// 6. REACTION CHALLENGE
// ─────────────────────────────────────────────────────────────────────────────
const REACTION_POOL: InteractiveChallenge[] = [
  {
    id: "rc-1",
    type: "reaction_challenge",
    category: "Speed",
    title: "Rapid Visual Reflex",
    instruction: "Identify the fastest target match as quickly as possible.",
    question: "Which arrow is pointing in the OPPOSITE direction to the others: ➡️ ➡️ ⬅️ ➡️ ?",
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
// 7. REMEMBER THE STORY
// ─────────────────────────────────────────────────────────────────────────────
const STORY_MEMORY_POOL: InteractiveChallenge[] = [
  {
    id: "sm-1",
    type: "story_memory",
    category: "Memory",
    title: "Story Recall: The Morning Errand",
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
// 8. MENTAL MATHS (REAL-WORLD ₦ NAIRA SCENARIOS)
// ─────────────────────────────────────────────────────────────────────────────
const MENTAL_MATHS_POOL: InteractiveChallenge[] = [
  {
    id: "mm-1",
    type: "mental_maths",
    category: "Logic",
    title: "Market Budget Calculation",
    instruction: "Calculate the remaining balance mentally without using a calculator.",
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
  {
    id: "mm-2",
    type: "mental_maths",
    category: "Logic",
    title: "Percentage Discount Speed",
    instruction: "Compute the final discounted price mentally.",
    question: "A training course costs ₦20,000. There is a 25% discount today. What is the final price?",
    options: [
      { id: "o1", label: "₦15,000", isCorrect: true },
      { id: "o2", label: "₦16,000", isCorrect: false },
      { id: "o3", label: "₦14,500", isCorrect: false },
      { id: "o4", label: "₦17,500", isCorrect: false },
    ],
    educationalWhy: "25% of ₦20,000 is ₦5,000 (20,000 ÷ 4). ₦20,000 - ₦5,000 = ₦15,000.",
    xpReward: 55,
    coinReward: 18,
    difficulty: "intermediate",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 9. DECISION ROOM & REAL-LIFE PROBLEM SOLVING
// ─────────────────────────────────────────────────────────────────────────────
const DECISION_ROOM_POOL: InteractiveChallenge[] = [
  {
    id: "dr-1",
    type: "decision_room",
    category: "Decision",
    title: "Strategic Decision: Cash vs Emergency",
    instruction: "Evaluate the scenario and pick the optimal decision based on risk management.",
    question: "You have ₦20,000 remaining for weekly essentials. A close acquaintance asks to borrow ₦15,000 until 'tomorrow morning'. What is the smartest decision?",
    options: [
      { id: "o1", label: "Politely decline or offer a small non-critical amount you can afford to lose (e.g. ₦2,000)", isCorrect: true },
      { id: "o2", label: "Lend the full ₦15,000 because they promised to return it tomorrow", isCorrect: false },
      { id: "o3", label: "Borrow money from someone else to lend them ₦15,000", isCorrect: false },
      { id: "o4", label: "Ignore their message completely without responding", isCorrect: false },
    ],
    educationalWhy: "Financial risk management principle: Never lend capital required for immediate survival on unsecured promises, as loan defaults immediately jeopardize your own essential cash flow.",
    xpReward: 60,
    coinReward: 20,
    difficulty: "intermediate",
  },
  {
    id: "dr-2",
    type: "real_life_challenge",
    category: "Decision",
    title: "Workplace Negotiation",
    instruction: "Choose the most professional strategic response.",
    question: "A client tells you: \"Your competitor is offering the exact same service for 20% cheaper.\" What is the best FIRST move?",
    options: [
      { id: "o1", label: "Ask what specific scope the competitor is delivering and highlight your unique quality & guarantees", isCorrect: true },
      { id: "o2", label: "Immediately drop your price by 25% to win the deal", isCorrect: false },
      { id: "o3", label: "Tell the client that the competitor does low-quality work", isCorrect: false },
      { id: "o4", label: "End the conversation and refuse to work with them", isCorrect: false },
    ],
    educationalWhy: "Value-based negotiation: Clarifying the scope prevents a race to the bottom while positioning your service on reliability, warranty, and return on investment rather than price alone.",
    xpReward: 60,
    coinReward: 20,
    difficulty: "advanced",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 10. 5-SECOND RAPID REFLEX
// ─────────────────────────────────────────────────────────────────────────────
const FIVE_SECOND_POOL: InteractiveChallenge[] = [
  {
    id: "fs-1",
    type: "five_second_challenge",
    category: "Speed",
    title: "5-Second Rapid Magnitude",
    instruction: "Quick! Select the largest number immediately.",
    question: "Which of these numbers has the highest value: 37, 73, 27, 63 ?",
    options: [
      { id: "o1", label: "73", isCorrect: true },
      { id: "o2", label: "63", isCorrect: false },
      { id: "o3", label: "37", isCorrect: false },
      { id: "o4", label: "27", isCorrect: false },
    ],
    educationalWhy: "73 is the largest value. Rapid visual magnitude comparison strengthens parietal number processing.",
    xpReward: 35,
    coinReward: 8,
    difficulty: "beginner",
  },
  {
    id: "fs-2",
    type: "five_second_challenge",
    category: "Flexibility",
    title: "5-Second Anagram Match",
    instruction: "Find the exact anagram of the word LISTEN.",
    question: "Which word contains the exact same letters as 'LISTEN'?",
    options: [
      { id: "o1", label: "SILENT", isCorrect: true },
      { id: "o2", label: "TINSEL", isCorrect: false },
      { id: "o3", label: "ENLIST", isCorrect: false },
      { id: "o4", label: "INLETS", isCorrect: false },
    ],
    educationalWhy: "SILENT uses all 6 letters (L-I-S-T-E-N). Rapid mental anagramming exercises lexical working memory.",
    xpReward: 45,
    coinReward: 12,
    difficulty: "intermediate",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DAILY WORKOUT GENERATOR (Balanced 5-7 Rounds)
// ─────────────────────────────────────────────────────────────────────────────
export function generateDailyInteractiveWorkout(daySeed?: number): InteractiveChallenge[] {
  const day = daySeed ?? new Date().getDate();

  // Pick 1 from each core cognitive pillar to ensure 100% balance
  const memoryRound = day % 2 === 0
    ? VISUAL_MEMORY_POOL[day % VISUAL_MEMORY_POOL.length]
    : WHATS_MISSING_POOL[day % WHATS_MISSING_POOL.length];

  const focusRound = FOCUS_FIRE_POOL[day % FOCUS_FIRE_POOL.length];
  const speedRound = REACTION_POOL[day % REACTION_POOL.length];
  const logicRound = PATTERN_POWER_POOL[day % PATTERN_POWER_POOL.length];
  const decisionRound = DECISION_ROOM_POOL[day % DECISION_ROOM_POOL.length];
  const rapidRound = FIVE_SECOND_POOL[day % FIVE_SECOND_POOL.length];

  return [memoryRound, focusRound, speedRound, logicRound, decisionRound, rapidRound].filter(Boolean);
}
