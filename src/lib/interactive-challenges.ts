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
  | "five_second_challenge"
  | "rule_switch";

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
  memorizeStory?: string;
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
export const VISUAL_MEMORY_CHALLENGES: InteractiveChallenge[] = [
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
// 2. WHAT'S MISSING?
// ─────────────────────────────────────────────────────────────────────────────
export const WHATS_MISSING_CHALLENGES: InteractiveChallenge[] = [
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
  {
    id: "wm-2",
    type: "whats_missing",
    category: "Memory",
    title: "Night Sky Vanish",
    instruction: "Study these 8 celestial symbols closely.",
    memorizeDurationSec: 6,
    memorizeItems: ["⭐ Star", "🌙 Moon", "☀️ Sun", "🛸 UFO", "☄️ Comet", "🔭 Telescope", "🛰️ Satellite", "🌌 Galaxy"],
    question: "Which celestial symbol vanished from the night sky?",
    options: [
      { id: "o1", label: "🛸 UFO", isCorrect: true },
      { id: "o2", label: "🌙 Moon", isCorrect: false },
      { id: "o3", label: "⭐ Star", isCorrect: false },
      { id: "o4", label: "☀️ Sun", isCorrect: false },
    ],
    educationalWhy: "UFO was removed. Visual scanning speed and working memory capacity directly enhance rapid recognition.",
    xpReward: 55,
    coinReward: 18,
    difficulty: "advanced",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. PATTERN POWER
// ─────────────────────────────────────────────────────────────────────────────
export const PATTERN_POWER_CHALLENGES: InteractiveChallenge[] = [
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
// 4. ODD ONE OUT
// ─────────────────────────────────────────────────────────────────────────────
export const ODD_ONE_OUT_CHALLENGES: InteractiveChallenge[] = [
  {
    id: "ooo-1",
    type: "odd_one_out",
    category: "Logic",
    title: "Prime vs Composite Anomaly",
    instruction: "Select the item that does not share the common mathematical rule.",
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
  {
    id: "ooo-2",
    type: "odd_one_out",
    category: "Logic",
    title: "Geometric Symmetry Anomaly",
    instruction: "Which geometric shape does not belong?",
    question: "Which shape has a different number of sides from the others: Square, Rectangle, Rhombus, Pentagon?",
    options: [
      { id: "o1", label: "Pentagon (5 sides)", isCorrect: true },
      { id: "o2", label: "Square (4 sides)", isCorrect: false },
      { id: "o3", label: "Rectangle (4 sides)", isCorrect: false },
      { id: "o4", label: "Rhombus (4 sides)", isCorrect: false },
    ],
    educationalWhy: "Square, Rectangle, and Rhombus are all 4-sided quadrilaterals, while a Pentagon has 5 sides.",
    xpReward: 40,
    coinReward: 10,
    difficulty: "beginner",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. FOCUS FIRE & CONCENTRATION
// ─────────────────────────────────────────────────────────────────────────────
export const FOCUS_FIRE_CHALLENGES: InteractiveChallenge[] = [
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
  {
    id: "ff-3",
    type: "focus_fire",
    category: "Focus",
    title: "Number Exclusion Rule",
    instruction: "Apply the exclusion filter rapidly.",
    question: "RULE: Select every number except multiples of 7. Which number is valid?",
    options: [
      { id: "o1", label: "36", isCorrect: true },
      { id: "o2", label: "28 (4 × 7)", isCorrect: false },
      { id: "o3", label: "42 (6 × 7)", isCorrect: false },
      { id: "o4", label: "49 (7 × 7)", isCorrect: false },
    ],
    educationalWhy: "36 is not divisible by 7, while 28, 42, and 49 are all multiples of 7.",
    xpReward: 50,
    coinReward: 15,
    difficulty: "intermediate",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 6. REACTION CHALLENGE
// ─────────────────────────────────────────────────────────────────────────────
export const REACTION_CHALLENGES: InteractiveChallenge[] = [
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
  {
    id: "rc-2",
    type: "reaction_challenge",
    category: "Speed",
    title: "Color Speed Match",
    instruction: "React to the matching color pair immediately.",
    question: "Which pair has matching colors: 🔴🔵, 🟡🟡, 🟢🟣, 🟤⚪ ?",
    options: [
      { id: "o1", label: "🟡🟡 Yellow Pair", isCorrect: true },
      { id: "o2", label: "🔴🔵 Red & Blue", isCorrect: false },
      { id: "o3", label: "🟢🟣 Green & Purple", isCorrect: false },
      { id: "o4", label: "🟤⚪ Brown & White", isCorrect: false },
    ],
    educationalWhy: "🟡🟡 is the only identical pair. Fast visual matching exercises sensory visual pathways.",
    xpReward: 40,
    coinReward: 10,
    difficulty: "beginner",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 7. REMEMBER THE STORY
// ─────────────────────────────────────────────────────────────────────────────
export const STORY_MEMORY_CHALLENGES: InteractiveChallenge[] = [
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
  {
    id: "sm-2",
    type: "story_memory",
    category: "Memory",
    title: "Story Recall: Tech Conference",
    instruction: "Memorize the schedule details in 10 seconds.",
    memorizeDurationSec: 10,
    memorizeStory: "Amaka arrived at the Abuja Tech Summit on Thursday wearing a yellow blazer. Her presentation on AI Neural Networks was scheduled for Hall B at 2:30 PM, right after the keynote address by Dr. Ojo.",
    question: "In which Hall was Amaka scheduled to present?",
    options: [
      { id: "o1", label: "Hall B", isCorrect: true },
      { id: "o2", label: "Hall A", isCorrect: false },
      { id: "o3", label: "Hall C", isCorrect: false },
      { id: "o4", label: "Main Auditorium", isCorrect: false },
    ],
    educationalWhy: "Amaka was scheduled in Hall B. Verbal comprehension and spatial narrative indexing test temporal lobe recall.",
    xpReward: 55,
    coinReward: 18,
    difficulty: "intermediate",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 8. MENTAL MATHS (REAL-WORLD ₦ NAIRA SCENARIOS)
// ─────────────────────────────────────────────────────────────────────────────
export const MENTAL_MATHS_CHALLENGES: InteractiveChallenge[] = [
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
// 9. DECISION ROOM & STRATEGY
// ─────────────────────────────────────────────────────────────────────────────
export const DECISION_ROOM_CHALLENGES: InteractiveChallenge[] = [
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
export const FIVE_SECOND_CHALLENGES: InteractiveChallenge[] = [
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

// All workouts database grouped by category for targeted practice
export const WORKOUT_CATEGORIES = [
  { id: "daily", label: "Daily Balanced Workout", icon: "⭐", desc: "6 rounds across Memory, Focus, Speed, Logic & Decision", count: 6 },
  { id: "memory", label: "Visual Memory & Recall", icon: "🧠", desc: "Grid memorization, vanish tests, and story recall", challenges: [...VISUAL_MEMORY_CHALLENGES, ...WHATS_MISSING_CHALLENGES, ...STORY_MEMORY_CHALLENGES] },
  { id: "focus", label: "Focus Fire & Concentration", icon: "🎯", desc: "Go/No-Go rule filtering and Stroop interference", challenges: FOCUS_FIRE_CHALLENGES },
  { id: "speed", label: "Reaction Speed & Reflex", icon: "⚡", desc: "Millisecond reflex response and directional speed", challenges: [...REACTION_CHALLENGES, ...FIVE_SECOND_CHALLENGES] },
  { id: "logic", label: "Pattern Power & Mental Maths", icon: "🧩", desc: "Sequence solvers and practical ₦ Naira calculations", challenges: [...PATTERN_POWER_CHALLENGES, ...ODD_ONE_OUT_CHALLENGES, ...MENTAL_MATHS_CHALLENGES] },
  { id: "decision", label: "Decision Room & Strategy", icon: "🏛️", desc: "High-stakes real-world risk management and negotiation", challenges: DECISION_ROOM_CHALLENGES },
];

export function generateDailyInteractiveWorkout(daySeed?: number): InteractiveChallenge[] {
  const day = daySeed ?? new Date().getDate();

  const memoryRound = day % 2 === 0
    ? VISUAL_MEMORY_CHALLENGES[day % VISUAL_MEMORY_CHALLENGES.length]
    : WHATS_MISSING_CHALLENGES[day % WHATS_MISSING_CHALLENGES.length];

  const focusRound = FOCUS_FIRE_CHALLENGES[day % FOCUS_FIRE_CHALLENGES.length];
  const speedRound = REACTION_CHALLENGES[day % REACTION_CHALLENGES.length];
  const logicRound = PATTERN_POWER_CHALLENGES[day % PATTERN_POWER_CHALLENGES.length];
  const decisionRound = DECISION_ROOM_CHALLENGES[day % DECISION_ROOM_CHALLENGES.length];
  const rapidRound = FIVE_SECOND_CHALLENGES[day % FIVE_SECOND_CHALLENGES.length];

  return [memoryRound, focusRound, speedRound, logicRound, decisionRound, rapidRound].filter(Boolean);
}
