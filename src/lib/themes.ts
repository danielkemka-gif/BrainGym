export interface WeeklyTheme {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  focusHint: string;
  bonus: number; // bonus XP multiplier for the week
}

const THEMES: WeeklyTheme[] = [
  {
    slug: "memory",
    name: "Memory Week",
    emoji: "🧠",
    description: "Sharpen your recall and retention with memory-focused games.",
    focusHint: "Try the memory games in the library",
    bonus: 1.5,
  },
  {
    slug: "speed",
    name: "Speed Week",
    emoji: "⚡",
    description: "Beat the clock and improve your reaction speed.",
    focusHint: "Timed challenges earn extra today",
    bonus: 1.5,
  },
  {
    slug: "logic",
    name: "Logic Week",
    emoji: "🧩",
    description: "Untangle patterns and strengthen your reasoning.",
    focusHint: "Pattern games get a boost",
    bonus: 1.5,
  },
  {
    slug: "attention",
    name: "Focus Week",
    emoji: "🎯",
    description: "Tune out distractions and dial in your attention.",
    focusHint: "Attention drills are highlighted",
    bonus: 1.5,
  },
  {
    slug: "language",
    name: "Word Week",
    emoji: "📚",
    description: "Play with words and build your verbal fluency.",
    focusHint: "Word games earn bonus XP",
    bonus: 1.5,
  },
  {
    slug: "problem",
    name: "Problem-Solving Week",
    emoji: "🛠️",
    description: "Tackle everyday problems with sharper thinking.",
    focusHint: "Challenge games are starred",
    bonus: 1.5,
  },
];

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function getIsoWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isoWeekNumber(date: Date): number {
  const start = getIsoWeekStart(date);
  const thursday = new Date(start);
  thursday.setDate(thursday.getDate() + 3);
  const yearStart = new Date(thursday.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((thursday.getTime() - yearStart.getTime()) / WEEK_MS + 1) / 1
  );
  return week;
}

export function getWeeklyTheme(date = new Date()): WeeklyTheme {
  const weekNumber = isoWeekNumber(date);
  const year = date.getFullYear();
  return THEMES[(year + weekNumber) % THEMES.length];
}

export function getWeekRange(date = new Date()): { start: string; end: string } {
  const start = getIsoWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return {
    start: start.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    end: end.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
}
