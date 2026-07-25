// ─── Game Types ──────────────────────────────────────────────────────────

export interface GameLevelConfig {
  level: number;
  difficulty: "easy" | "medium" | "hard" | "expert" | "master";
  targetScore: number;      // points needed for 1 star
  targetScore2: number;     // points needed for 2 stars
  targetScore3: number;     // points needed for 3 stars
  timeLimitMs: number;      // time limit in ms
  params: Record<string, number>; // game-specific params
}

export interface GameConfig {
  id: string;
  title: string;
  description: string;
  iconKey: string;
  gradient: string;
  category: string;
  levels: GameLevelConfig[];
}

export interface GameProgress {
  user_id: string;
  game_id: string;
  level_number: number;
  stars: number;
  score: number;
  best_time_ms: number | null;
  completed_at: string;
}

export interface LevelState {
  unlocked: boolean;
  completed: boolean;
  stars: number;
  bestScore: number;
  bestTime: number | null;
}

// ─── Stars thresholds ────────────────────────────────────────────────────

export function calculateStars(score: number, level: GameLevelConfig): number {
  if (score >= level.targetScore3) return 3;
  if (score >= level.targetScore2) return 2;
  if (score >= level.targetScore) return 1;
  return 0;
}

export function getXpForStars(stars: number, level: number): number {
  const base = 20 + level * 10;
  if (stars === 3) return base * 3;
  if (stars === 2) return base * 2;
  if (stars === 1) return base;
  return 0;
}

export function getCoinsForStars(stars: number, level: number): number {
  const base = 5 + level * 3;
  if (stars === 3) return base * 3;
  if (stars === 2) return base * 2;
  if (stars === 1) return base;
  return 0;
}

// ─── Memory Match Config ─────────────────────────────────────────────────
export const MEMORY_MATCH: GameConfig = {
  id: "memory_match",
  title: "Memory Match",
  description: "Flip cards and find matching pairs",
  iconKey: "memory_match",
  gradient: "from-pink-500 to-rose-600",
  category: "Memory",
  levels: [
    { level: 1, difficulty: "easy", targetScore: 100, targetScore2: 200, targetScore3: 300, timeLimitMs: 30000, params: { pairs: 3, gridCols: 3 } },
    { level: 2, difficulty: "easy", targetScore: 150, targetScore2: 250, targetScore3: 400, timeLimitMs: 30000, params: { pairs: 4, gridCols: 4 } },
    { level: 3, difficulty: "easy", targetScore: 200, targetScore2: 350, targetScore3: 500, timeLimitMs: 45000, params: { pairs: 6, gridCols: 4 } },
    { level: 4, difficulty: "medium", targetScore: 250, targetScore2: 400, targetScore3: 600, timeLimitMs: 45000, params: { pairs: 8, gridCols: 4 } },
    { level: 5, difficulty: "medium", targetScore: 300, targetScore2: 500, targetScore3: 750, timeLimitMs: 60000, params: { pairs: 10, gridCols: 4 } },
    { level: 6, difficulty: "medium", targetScore: 350, targetScore2: 600, targetScore3: 900, timeLimitMs: 60000, params: { pairs: 10, gridCols: 5 } },
    { level: 7, difficulty: "hard", targetScore: 400, targetScore2: 700, targetScore3: 1000, timeLimitMs: 60000, params: { pairs: 12, gridCols: 4 } },
    { level: 8, difficulty: "hard", targetScore: 500, targetScore2: 800, targetScore3: 1200, timeLimitMs: 60000, params: { pairs: 15, gridCols: 6 } },
    { level: 9, difficulty: "expert", targetScore: 600, targetScore2: 1000, targetScore3: 1500, timeLimitMs: 90000, params: { pairs: 18, gridCols: 6 } },
    { level: 10, difficulty: "master", targetScore: 800, targetScore2: 1200, targetScore3: 1800, timeLimitMs: 90000, params: { pairs: 20, gridCols: 5 } },
  ],
};

// ─── Number Sequence Config ──────────────────────────────────────────────
export const NUMBER_SEQUENCE: GameConfig = {
  id: "number_sequence",
  title: "Number Memory",
  description: "Remember and repeat number sequences",
  iconKey: "number_sequence",
  gradient: "from-blue-500 to-cyan-600",
  category: "Memory",
  levels: [
    { level: 1, difficulty: "easy", targetScore: 100, targetScore2: 200, targetScore3: 300, timeLimitMs: 60000, params: { startLen: 3, maxLen: 4 } },
    { level: 2, difficulty: "easy", targetScore: 150, targetScore2: 250, targetScore3: 400, timeLimitMs: 60000, params: { startLen: 3, maxLen: 5 } },
    { level: 3, difficulty: "easy", targetScore: 200, targetScore2: 350, targetScore3: 500, timeLimitMs: 60000, params: { startLen: 4, maxLen: 6 } },
    { level: 4, difficulty: "medium", targetScore: 250, targetScore2: 400, targetScore3: 600, timeLimitMs: 90000, params: { startLen: 4, maxLen: 7 } },
    { level: 5, difficulty: "medium", targetScore: 300, targetScore2: 500, targetScore3: 750, timeLimitMs: 90000, params: { startLen: 5, maxLen: 8 } },
    { level: 6, difficulty: "medium", targetScore: 350, targetScore2: 600, targetScore3: 900, timeLimitMs: 90000, params: { startLen: 5, maxLen: 9 } },
    { level: 7, difficulty: "hard", targetScore: 400, targetScore2: 700, targetScore3: 1000, timeLimitMs: 120000, params: { startLen: 6, maxLen: 10 } },
    { level: 8, difficulty: "hard", targetScore: 500, targetScore2: 800, targetScore3: 1200, timeLimitMs: 120000, params: { startLen: 6, maxLen: 12 } },
    { level: 9, difficulty: "expert", targetScore: 600, targetScore2: 1000, targetScore3: 1500, timeLimitMs: 150000, params: { startLen: 7, maxLen: 14 } },
    { level: 10, difficulty: "master", targetScore: 800, targetScore2: 1200, targetScore3: 1800, timeLimitMs: 180000, params: { startLen: 8, maxLen: 16 } },
  ],
};

// ─── Word Scramble Config ────────────────────────────────────────────────
const WORD_POOLS: Record<string, string[]> = {
  easy: ["brain", "smart", "focus", "think", "learn", "study", "memory", "puzzle", "swift", "brain", "logic", "sharp", "quick", "speed", "train"],
  medium: ["cognitive", "exercise", "workout", "neuron", "synapse", "analysis", "strategy", "creative", "intuition", "reaction", "sequence", "pattern"],
  hard: ["concentration", "intelligence", "neuroscience", "algorithm", "perception", "reasoning", "comprehension", "metacognition", "mindfulness"],
  expert: ["neuroplasticity", "psychology", "metamemory", "executive", "dyslexia", "aphasia", "prosopagnosia"],
  master: ["electroencephalography", "neuropsychology", "psychophysiology", "neurotransmitter", "bioinformatics"],
};

export const WORD_SCRAMBLE: GameConfig = {
  id: "word_scramble",
  title: "Word Scramble",
  description: "Unscramble letters as fast as you can",
  iconKey: "word_scramble",
  gradient: "from-amber-500 to-orange-600",
  category: "Thinking",
  levels: [
    { level: 1, difficulty: "easy", targetScore: 100, targetScore2: 200, targetScore3: 300, timeLimitMs: 30000, params: { words: 3, timePerWord: 10 } },
    { level: 2, difficulty: "easy", targetScore: 150, targetScore2: 250, targetScore3: 400, timeLimitMs: 30000, params: { words: 4, timePerWord: 10 } },
    { level: 3, difficulty: "easy", targetScore: 200, targetScore2: 350, targetScore3: 500, timeLimitMs: 45000, params: { words: 5, timePerWord: 10 } },
    { level: 4, difficulty: "medium", targetScore: 250, targetScore2: 400, targetScore3: 600, timeLimitMs: 45000, params: { words: 5, timePerWord: 8 } },
    { level: 5, difficulty: "medium", targetScore: 300, targetScore2: 500, targetScore3: 750, timeLimitMs: 45000, params: { words: 6, timePerWord: 8 } },
    { level: 6, difficulty: "medium", targetScore: 350, targetScore2: 600, targetScore3: 900, timeLimitMs: 60000, params: { words: 7, timePerWord: 7 } },
    { level: 7, difficulty: "hard", targetScore: 400, targetScore2: 700, targetScore3: 1000, timeLimitMs: 60000, params: { words: 7, timePerWord: 6 } },
    { level: 8, difficulty: "hard", targetScore: 500, targetScore2: 800, targetScore3: 1200, timeLimitMs: 60000, params: { words: 8, timePerWord: 5 } },
    { level: 9, difficulty: "expert", targetScore: 600, targetScore2: 1000, targetScore3: 1500, timeLimitMs: 75000, params: { words: 8, timePerWord: 4 } },
    { level: 10, difficulty: "master", targetScore: 800, targetScore2: 1200, targetScore3: 1800, timeLimitMs: 90000, params: { words: 10, timePerWord: 4 } },
  ],
};

// ─── Reaction Speed Config ───────────────────────────────────────────────
export const REACTION_SPEED: GameConfig = {
  id: "reaction_speed",
  title: "Reaction Speed",
  description: "Tap the targets as fast as you can",
  iconKey: "reaction_speed",
  gradient: "from-green-500 to-emerald-600",
  category: "Focus",
  levels: [
    { level: 1, difficulty: "easy", targetScore: 100, targetScore2: 200, targetScore3: 300, timeLimitMs: 15000, params: { targets: 5, size: 60 } },
    { level: 2, difficulty: "easy", targetScore: 150, targetScore2: 250, targetScore3: 400, timeLimitMs: 15000, params: { targets: 8, size: 55 } },
    { level: 3, difficulty: "easy", targetScore: 200, targetScore2: 350, targetScore3: 500, timeLimitMs: 20000, params: { targets: 10, size: 50 } },
    { level: 4, difficulty: "medium", targetScore: 250, targetScore2: 400, targetScore3: 600, timeLimitMs: 20000, params: { targets: 12, size: 45 } },
    { level: 5, difficulty: "medium", targetScore: 300, targetScore2: 500, targetScore3: 750, timeLimitMs: 20000, params: { targets: 15, size: 40 } },
    { level: 6, difficulty: "medium", targetScore: 350, targetScore2: 600, targetScore3: 900, timeLimitMs: 25000, params: { targets: 18, size: 38 } },
    { level: 7, difficulty: "hard", targetScore: 400, targetScore2: 700, targetScore3: 1000, timeLimitMs: 25000, params: { targets: 20, size: 35 } },
    { level: 8, difficulty: "hard", targetScore: 500, targetScore2: 800, targetScore3: 1200, timeLimitMs: 25000, params: { targets: 22, size: 32 } },
    { level: 9, difficulty: "expert", targetScore: 600, targetScore2: 1000, targetScore3: 1500, timeLimitMs: 30000, params: { targets: 25, size: 30 } },
    { level: 10, difficulty: "master", targetScore: 800, targetScore2: 1200, targetScore3: 1800, timeLimitMs: 30000, params: { targets: 30, size: 28 } },
  ],
};

// ─── Color Match (Stroop) Config ─────────────────────────────────────────
export const COLOR_MATCH: GameConfig = {
  id: "color_match",
  title: "Color Match",
  description: "Pick the real color, not the word",
  iconKey: "color_match",
  gradient: "from-purple-500 to-violet-600",
  category: "Focus",
  levels: [
    { level: 1, difficulty: "easy", targetScore: 100, targetScore2: 200, targetScore3: 300, timeLimitMs: 20000, params: { rounds: 8, colors: 3 } },
    { level: 2, difficulty: "easy", targetScore: 150, targetScore2: 250, targetScore3: 400, timeLimitMs: 20000, params: { rounds: 10, colors: 3 } },
    { level: 3, difficulty: "easy", targetScore: 200, targetScore2: 350, targetScore3: 500, timeLimitMs: 25000, params: { rounds: 12, colors: 4 } },
    { level: 4, difficulty: "medium", targetScore: 250, targetScore2: 400, targetScore3: 600, timeLimitMs: 25000, params: { rounds: 14, colors: 4 } },
    { level: 5, difficulty: "medium", targetScore: 300, targetScore2: 500, targetScore3: 750, timeLimitMs: 30000, params: { rounds: 16, colors: 5 } },
    { level: 6, difficulty: "medium", targetScore: 350, targetScore2: 600, targetScore3: 900, timeLimitMs: 30000, params: { rounds: 18, colors: 5 } },
    { level: 7, difficulty: "hard", targetScore: 400, targetScore2: 700, targetScore3: 1000, timeLimitMs: 35000, params: { rounds: 20, colors: 6 } },
    { level: 8, difficulty: "hard", targetScore: 500, targetScore2: 800, targetScore3: 1200, timeLimitMs: 35000, params: { rounds: 22, colors: 6 } },
    { level: 9, difficulty: "expert", targetScore: 600, targetScore2: 1000, targetScore3: 1500, timeLimitMs: 40000, params: { rounds: 25, colors: 7 } },
    { level: 10, difficulty: "master", targetScore: 800, targetScore2: 1200, targetScore3: 1800, timeLimitMs: 45000, params: { rounds: 30, colors: 8 } },
  ],
};

// ─── All Games ───────────────────────────────────────────────────────────
export const ALL_GAMES: GameConfig[] = [
  MEMORY_MATCH,
  NUMBER_SEQUENCE,
  WORD_SCRAMBLE,
  REACTION_SPEED,
  COLOR_MATCH,
];

export function getGameById(id: string): GameConfig | undefined {
  return ALL_GAMES.find((g) => g.id === id);
}
