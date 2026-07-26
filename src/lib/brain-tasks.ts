// Real-life brain challenges that serve as "bait" for full games.
// Each task trains a specific cognitive skill and links to a full game.

export interface BrainTask {
  id: string;
  type: "countdown" | "recall" | "attention" | "creativity" | "math" | "fluency" | "mindfulness" | "observation";
  category: string; // maps to CATEGORIES slug
  title: string;
  description: string;
  instruction: string;
  timeLimitSeconds: number;
  xpReward: number;
  coinReward: number;
  linkedGame: string | null; // gameId to suggest after completing
  linkedGameTitle: string | null;
  linkedGamePath: string | null;
  pointsCalculation: (params: { userValue?: string; timeTakenMs: number; targetValue?: number }) => number;
}

export const BRAIN_TASKS: BrainTask[] = [
  // ─── MEMORY ─────────────────────────────────────────────────────────
  {
    id: "recall_meal",
    type: "recall",
    category: "memory",
    title: "Meal Recall Challenge",
    description: "How well do you remember your recent meals?",
    instruction: "Think about the last 3 meals you ate. In order, type what you had for each meal (e.g. 'rice bread sandwich').",
    timeLimitSeconds: 30,
    xpReward: 30,
    coinReward: 10,
    linkedGame: "memory_match",
    linkedGameTitle: "Memory Match Game",
    linkedGamePath: "/dashboard/games/memory_match",
    pointsCalculation: ({ userValue, timeTakenMs }) => {
      const words = (userValue || "").toLowerCase().split(/\s+/).filter(Boolean);
      const uniqueWords = new Set(words).size;
      const timeBonus = Math.max(0, 30 - Math.floor(timeTakenMs / 1000)) * 2;
      return Math.min(500, uniqueWords * 40 + timeBonus);
    },
  },
  {
    id: "countdown_backwards",
    type: "countdown",
    category: "memory",
    title: "Count Backwards Challenge",
    description: "Test your working memory by counting backwards!",
    instruction: "Count backwards from 87 by 7s. Type the first 5 numbers (e.g. '80 73 66 59 52').",
    timeLimitSeconds: 20,
    xpReward: 35,
    coinReward: 12,
    linkedGame: "number_sequence",
    linkedGameTitle: "Number Sequence Game",
    linkedGamePath: "/dashboard/games/number_sequence",
    pointsCalculation: ({ userValue }) => {
      const nums = (userValue || "").match(/-?\d+/g)?.map(Number) || [];
      const expected = [80, 73, 66, 59, 52];
      const correct = nums.filter((n, i) => i < expected.length && n === expected[i]).length;
      return Math.min(500, correct * 100);
    },
  },
  // ─── FOCUS ──────────────────────────────────────────────────────────
  {
    id: "visual_scan",
    type: "observation",
    category: "focus",
    title: "Environment Scan",
    description: "How observant are you of your surroundings?",
    instruction: "Look around you RIGHT NOW. Name 5 blue objects you can see. Type them separated by commas.",
    timeLimitSeconds: 25,
    xpReward: 25,
    coinReward: 10,
    linkedGame: "reaction_speed",
    linkedGameTitle: "Reaction Speed Game",
    linkedGamePath: "/dashboard/games/reaction_speed",
    pointsCalculation: ({ userValue }) => {
      const items = (userValue || "").split(",").map(s => s.trim()).filter(Boolean);
      return Math.min(500, items.length * 100);
    },
  },
  {
    id: "word_chain",
    type: "attention",
    category: "focus",
    title: "Word Chain Challenge",
    description: "Can you keep a chain going without breaking focus?",
    instruction: "Type 6 words where each word starts with the LAST letter of the previous word (e.g. 'cat → table → elephant → ...').",
    timeLimitSeconds: 25,
    xpReward: 30,
    coinReward: 12,
    linkedGame: "word_scramble",
    linkedGameTitle: "Word Scramble Game",
    linkedGamePath: "/dashboard/games/word_scramble",
    pointsCalculation: ({ userValue }) => {
      const words = (userValue || "").toLowerCase().split(/\s+/).filter(Boolean);
      let validChain = 1;
      for (let i = 1; i < words.length; i++) {
        const prevLast = words[i - 1][words[i - 1].length - 1];
        if (words[i][0] === prevLast) validChain++;
        else break;
      }
      return Math.min(500, validChain * 80 + words.length * 20);
    },
  },
  // ─── THINKING ───────────────────────────────────────────────────────
  {
    id: "quick_math",
    type: "math",
    category: "thinking",
    title: "Mental Math Sprint",
    description: "How fast can your brain do math?",
    instruction: "Solve: 24 × 3 + 17 - 8 ÷ 2 = ? Type just the number.",
    timeLimitSeconds: 20,
    xpReward: 35,
    coinReward: 12,
    linkedGame: "number_sequence",
    linkedGameTitle: "Number Sequence Game",
    linkedGamePath: "/dashboard/games/number_sequence",
    pointsCalculation: ({ userValue, timeTakenMs }) => {
      const answer = parseInt(userValue || "");
      const correct = answer === 79;
      const timeBonus = correct ? Math.max(0, 20 - Math.floor(timeTakenMs / 1000)) * 10 : 0;
      return correct ? Math.min(500, 300 + timeBonus) : 0;
    },
  },
  {
    id: "decision_dilemma",
    type: "creativity",
    category: "thinking",
    title: "Quick Decision Challenge",
    description: "Trust your gut — fast decisions sharpen your mind!",
    instruction: "If you had to choose ONE: explore the deep ocean or travel to Mars? Type your choice and one reason why (max 10 words).",
    timeLimitSeconds: 20,
    xpReward: 25,
    coinReward: 10,
    linkedGame: null,
    linkedGameTitle: null,
    linkedGamePath: null,
    pointsCalculation: ({ userValue, timeTakenMs }) => {
      const words = (userValue || "").split(/\s+/).filter(Boolean).length;
      const timeBonus = Math.max(0, 20 - Math.floor(timeTakenMs / 1000)) * 3;
      return Math.min(500, words * 30 + timeBonus + 50);
    },
  },
  // ─── CREATIVITY ─────────────────────────────────────────────────────
  {
    id: "alternate_uses",
    type: "creativity",
    category: "creativity",
    title: "Alternate Uses Challenge",
    description: "How creative can you be with everyday objects?",
    instruction: "Name as many creative uses for a BRICK as you can (besides building). Type them separated by commas.",
    timeLimitSeconds: 30,
    xpReward: 30,
    coinReward: 12,
    linkedGame: null,
    linkedGameTitle: null,
    linkedGamePath: null,
    pointsCalculation: ({ userValue }) => {
      const uses = (userValue || "").split(",").map(s => s.trim()).filter(Boolean);
      return Math.min(500, uses.length * 80 + 50);
    },
  },
  {
    id: "rhyme_chain",
    type: "fluency",
    category: "creativity",
    title: "Rhyme Time Challenge",
    description: "How many words can you rhyme?",
    instruction: "Type as many words that rhyme with 'brain' as you can, separated by commas.",
    timeLimitSeconds: 20,
    xpReward: 25,
    coinReward: 10,
    linkedGame: "word_scramble",
    linkedGameTitle: "Word Scramble Game",
    linkedGamePath: "/dashboard/games/word_scramble",
    pointsCalculation: ({ userValue }) => {
      const words = (userValue || "").toLowerCase().split(/[,\s]+/).filter(Boolean);
      const rhymes = words.filter(w => {
        const ending = w.slice(-3);
        return ending === "ain" || ending === "ane" || ending === "ein" || w === "insane" || w === "cocaine" || w === "champagne" || w === "domain" || w === "refrain" || w === "contain" || w === "explain" || w === "complain" || w === "maintain" || w === "obtain" || w === "sustain" || w === "campaign" || w === "certain" || w === "curtain";
      });
      return Math.min(500, rhymes.length * 70 + 30);
    },
  },
  // ─── HEALTH / MINDFULNESS ───────────────────────────────────────────
  {
    id: "deep_breathe",
    type: "mindfulness",
    category: "health",
    title: "Mindful Breathing",
    description: "Take a moment to center yourself.",
    instruction: "Close your eyes and take 5 slow, deep breaths. Tap 'Done' when finished. Focus only on your breathing.",
    timeLimitSeconds: 30,
    xpReward: 20,
    coinReward: 8,
    linkedGame: null,
    linkedGameTitle: null,
    linkedGamePath: null,
    pointsCalculation: ({ timeTakenMs }) => {
      const tookAtLeast = timeTakenMs >= 10000;
      return tookAtLeast ? 400 : Math.round((timeTakenMs / 10000) * 400);
    },
  },
  {
    id: "mood_check",
    type: "recall",
    category: "emotional-intelligence",
    title: "Emotional Check-In",
    description: "Understanding your emotions strengthens emotional intelligence.",
    instruction: "Describe your current mood in exactly 3 words (e.g. 'calm but curious').",
    timeLimitSeconds: 15,
    xpReward: 20,
    coinReward: 8,
    linkedGame: null,
    linkedGameTitle: null,
    linkedGamePath: null,
    pointsCalculation: ({ userValue }) => {
      const words = (userValue || "").trim().split(/\s+/).filter(Boolean);
      const exactThree = words.length === 3;
      return exactThree ? 400 : Math.max(50, words.length * 100);
    },
  },
  // ─── LEARNING ───────────────────────────────────────────────────────
  {
    id: "speed_read",
    type: "attention",
    category: "learning",
    title: "Speed Recall Challenge",
    description: "How quickly can you absorb and recall information?",
    instruction: "Memorize this: 'The Eiffel Tower is 330m tall, built in 1889, and was initially criticized by artists.' Now type its height in meters.",
    timeLimitSeconds: 15,
    xpReward: 30,
    coinReward: 10,
    linkedGame: null,
    linkedGameTitle: null,
    linkedGamePath: null,
    pointsCalculation: ({ userValue, timeTakenMs }) => {
      const answer = (userValue || "").match(/\d+/)?.[0];
      const correct = answer === "330";
      const timeBonus = correct ? Math.max(0, 15 - Math.floor(timeTakenMs / 1000)) * 5 : 0;
      return correct ? Math.min(500, 300 + timeBonus) : 0;
    },
  },
  {
    id: "stroop_self",
    type: "attention",
    category: "focus",
    title: "Color Naming Speed",
    description: "Can you name colors without getting confused?",
    instruction: "Look at these words: RED, BLUE, GREEN, YELLOW. Now type the COLOR each word is PRINTED IN (not the word itself). They're all printed in black — so type 'black' 4 times.",
    timeLimitSeconds: 15,
    xpReward: 25,
    coinReward: 10,
    linkedGame: "color_match",
    linkedGameTitle: "Color Match Game",
    linkedGamePath: "/dashboard/games/color_match",
    pointsCalculation: ({ userValue, timeTakenMs }) => {
      const words = (userValue || "").toLowerCase().split(/\s+/).filter(Boolean);
      const correct = words.filter(w => w === "black").length;
      const timeBonus = Math.max(0, 15 - Math.floor(timeTakenMs / 1000)) * 5;
      return Math.min(500, correct * 100 + timeBonus);
    },
  },
];

// Pick brain tasks for a session (2-3 tasks mixed with trivia)
export function pickBrainTasks(count: number, seed: number): BrainTask[] {
  const shuffled = [...BRAIN_TASKS];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // Pick diverse types
  const selected: BrainTask[] = [];
  const usedTypes = new Set<string>();
  for (const task of shuffled) {
    if (selected.length >= count) break;
    if (!usedTypes.has(task.type)) {
      selected.push(task);
      usedTypes.add(task.type);
    }
  }
  // Fill remaining if needed
  for (const task of shuffled) {
    if (selected.length >= count) break;
    if (!selected.find(t => t.id === task.id)) {
      selected.push(task);
    }
  }
  return selected;
}
