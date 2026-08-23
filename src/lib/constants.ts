export const APP_NAME = "BrainGym";
export const APP_TAGLINE = "Train Your Brain. Every Day.";

export const WORKOUT_ACTIVITIES_PER_DAY = 5;
export const WORKOUT_TARGET_MINUTES = 15;

export const CATEGORIES = [
  { id: "a0000000-0000-0000-0000-000000000001", slug: "memory", label: "Memory", icon: "brain", color: "#6366f1" },
  { id: "a0000000-0000-0000-0000-000000000002", slug: "focus", label: "Focus", icon: "target", color: "#f59e0b" },
  { id: "a0000000-0000-0000-0000-000000000003", slug: "thinking", label: "Thinking", icon: "lightbulb", color: "#10b981" },
  { id: "a0000000-0000-0000-0000-000000000004", slug: "learning", label: "Learning", icon: "book", color: "#3b82f6" },
  { id: "a0000000-0000-0000-0000-000000000005", slug: "health", label: "Health", icon: "heart", color: "#ef4444" },
  { id: "a0000000-0000-0000-0000-000000000006", slug: "creativity", label: "Creativity", icon: "palette", color: "#ec4899" },
  {
    id: "a0000000-0000-0000-0000-000000000007",
    slug: "emotional-intelligence",
    label: "Emotional Intelligence",
    icon: "users",
    color: "#8b5cf6",
  },
] as const;

export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;

export const AGE_GROUPS = [
  { value: "teen", label: "Teen (14-20)", iconKey: "teen", description: "Student life — exams, focus, and building habits" },
  { value: "young_adult", label: "Young Adult (21-30)", iconKey: "young_adult", description: "Career building — productivity, creativity, and growth" },
  { value: "adult", label: "Adult (31-50)", iconKey: "adult", description: "Peak performance — leadership, memory, and balance" },
  { value: "senior", label: "Senior (50+)", iconKey: "senior", description: "Mental vitality — sharpness, clarity, and lifelong learning" },
] as const;

export type AgeGroup = typeof AGE_GROUPS[number]["value"];

export const LEVELS = [
  { level: 1, title: "Bronze", xpRequired: 0, premium: false },
  { level: 2, title: "Silver", xpRequired: 500, premium: false },
  { level: 3, title: "Gold", xpRequired: 1500, premium: false },
  { level: 4, title: "Diamond", xpRequired: 4000, premium: false },
  { level: 5, title: "Mastermind", xpRequired: 10000, premium: false },
  { level: 6, title: "Grandmaster", xpRequired: 20000, premium: true },
  { level: 7, title: "Champion", xpRequired: 35000, premium: true },
  { level: 8, title: "Legend", xpRequired: 55000, premium: true },
  { level: 9, title: "Mythic", xpRequired: 80000, premium: true },
  { level: 10, title: "Transcendent", xpRequired: 120000, premium: true },
  { level: 11, title: "Ascendant", xpRequired: 170000, premium: true },
  { level: 12, title: "Cosmic", xpRequired: 230000, premium: true },
  { level: 13, title: "Infinite", xpRequired: 300000, premium: true },
  { level: 14, title: "Omniscient", xpRequired: 400000, premium: true },
  { level: 15, title: "Brain God", xpRequired: 500000, premium: true },
] as const;

export const XP = {
  WORKOUT_COMPLETE: 50,
  ACTIVITY_COMPLETE: 10,
  STREAK_BONUS: 20,
  STREAK_MULTIPLIER: 5,
  ACHIEVEMENT: 100,
  PERFECT_WEEK: 200,
  MISSION_COMPLETE: 500,
} as const;

export const COINS = {
  ACTIVITY_COMPLETE: 5,
  WORKOUT_COMPLETE: 20,
  STREAK_BONUS: 10,
  ACHIEVEMENT: 50,
} as const;

export const STREAK = {
  FREEZE_DAYS: 3,
  WARNING_AT_HOUR: 20,
} as const;

export const MISSION_DURATIONS = [7, 14, 21, 30] as const;

export const GOALS = [
  { value: "improve_memory", label: "Improve memory", iconKey: "improve_memory" },
  { value: "boost_focus", label: "Boost focus & concentration", iconKey: "boost_focus" },
  { value: "think_faster", label: "Think faster", iconKey: "think_faster" },
  { value: "learn_better", label: "Learn new skills faster", iconKey: "learn_better" },
  { value: "reduce_stress", label: "Reduce stress", iconKey: "reduce_stress" },
  { value: "stay_sharp", label: "Stay mentally sharp", iconKey: "stay_sharp" },
  { value: "creative_thinking", label: "Think more creatively", iconKey: "creative_thinking" },
  { value: "emotional_control", label: "Improve emotional control", iconKey: "emotional_control" },
  { value: "exam_prep", label: "Ace my exams", iconKey: "exam_prep" },
  { value: "career_growth", label: "Accelerate career growth", iconKey: "career_growth" },
  { value: "better_decisions", label: "Make better decisions", iconKey: "better_decisions" },
  { value: "social_skills", label: "Improve social skills", iconKey: "social_skills" },
  { value: "mental_health", label: "Support mental wellness", iconKey: "mental_health" },
  { value: "confidence", label: "Build confidence", iconKey: "confidence" },
] as const;

export const CHALLENGES = [
  { value: "forgetfulness", label: "Forgetfulness", iconKey: "forgetfulness" },
  { value: "distraction", label: "Easily distracted", iconKey: "distraction" },
  { value: "brain_fog", label: "Brain fog / mental fatigue", iconKey: "brain_fog" },
  { value: "slow_processing", label: "Slow information processing", iconKey: "slow_processing" },
  { value: "procrastination", label: "Procrastination", iconKey: "procrastination" },
  { value: "anxiety", label: "Anxiety / overthinking", iconKey: "anxiety" },
  { value: "poor_sleep", label: "Poor sleep affecting cognition", iconKey: "poor_sleep" },
  { value: "language_struggle", label: "Word-finding / language difficulty", iconKey: "language_struggle" },
  { value: "exam_pressure", label: "Exam pressure / test anxiety", iconKey: "exam_pressure" },
  { value: "screen_fatigue", label: "Screen fatigue / digital overload", iconKey: "screen_fatigue" },
  { value: "motivation_dip", label: "Low motivation / burnout", iconKey: "motivation_dip" },
  { value: "decision_paralysis", label: "Decision paralysis", iconKey: "decision_paralysis" },
] as const;

export const WORKOUT_TIMES = [
  { value: "06:00", label: "6:00 AM — Early bird" },
  { value: "07:00", label: "7:00 AM — Morning" },
  { value: "08:00", label: "8:00 AM — Breakfast time" },
  { value: "12:00", label: "12:00 PM — Lunch break" },
  { value: "15:00", label: "3:00 PM — Afternoon" },
  { value: "17:00", label: "5:00 PM — Pre-dinner" },
  { value: "19:00", label: "7:00 PM — Evening" },
  { value: "21:00", label: "9:00 PM — Night owl" },
] as const;

export const ACHIEVEMENTS = [
  { id: "first_workout", title: "First Steps", description: "Complete your first workout", iconKey: "first_workout", xp: 50 },
  { id: "week_streak", title: "Week Warrior", description: "7-day streak", iconKey: "week_streak", xp: 100 },
  { id: "month_streak", title: "Monthly Master", description: "30-day streak", iconKey: "month_streak", xp: 500 },
  { id: "memory_whiz", title: "Memory Whiz", description: "Complete 10 memory activities", iconKey: "memory_whiz", xp: 150 },
  { id: "focus_fiend", title: "Focus Fiend", description: "Complete 10 focus activities", iconKey: "focus_fiend", xp: 150 },
  { id: "creative_spark", title: "Creative Spark", description: "Complete 10 creativity activities", iconKey: "creative_spark", xp: 150 },
  { id: "thinker", title: "Deep Thinker", description: "Complete 10 thinking activities", iconKey: "thinker", xp: 150 },
  { id: "scholar", title: "Scholar", description: "Complete 10 learning activities", iconKey: "scholar", xp: 150 },
  { id: "healthy_mind", title: "Healthy Mind", description: "Complete 10 health activities", iconKey: "healthy_mind", xp: 150 },
  { id: "empath", title: "Empath", description: "Complete 10 emotional intelligence activities", iconKey: "empath", xp: 150 },
  { id: "perfect_week", title: "Perfect Week", description: "Complete every daily workout for a week", iconKey: "perfect_week", xp: 300 },
  { id: "night_owl", title: "Night Owl", description: "Complete a workout after 9 PM", iconKey: "night_owl", xp: 75 },
  { id: "early_bird", title: "Early Bird", description: "Complete a workout before 7 AM", iconKey: "early_bird", xp: 75 },
  { id: "speed_demon", title: "Lightning Reflexes", description: "Complete a Quick-Fire challenge", iconKey: "speed_demon", xp: 100 },
  { id: "all_categories", title: "Renaissance Mind", description: "Complete at least one activity in every category", iconKey: "all_categories", xp: 250 },
  { id: "ten_workouts", title: "Dedicated", description: "Complete 10 workouts", iconKey: "ten_workouts", xp: 200 },
  { id: "fifty_workouts", title: "Committed", description: "Complete 50 workouts", iconKey: "fifty_workouts", xp: 1000 },
  { id: "hundred_workouts", title: "Brain Champion", description: "Complete 100 workouts", iconKey: "hundred_workouts", xp: 2500 },
] as const;

export const AMBIENT_SOUNDS = [
  { id: "none", label: "None", iconKey: "none" },
  { id: "lofi", label: "Lo-Fi Beats", iconKey: "lofi" },
  { id: "rain", label: "Rain", iconKey: "rain" },
  { id: "forest", label: "Forest", iconKey: "forest" },
  { id: "white_noise", label: "White Noise", iconKey: "white_noise" },
] as const;

export const QUICK_FIRE_DURATIONS = [30, 60, 90] as const;

export const LEAGUES = [
  { id: "bronze", label: "Bronze", minXP: 0, color: "#cd7f32", emoji: "🥉", gradient: "from-amber-700 to-yellow-600" },
  { id: "silver", label: "Silver", minXP: 300, color: "#c0c0c0", emoji: "🥈", gradient: "from-slate-300 to-slate-400" },
  { id: "gold", label: "Gold", minXP: 600, color: "#ffd700", emoji: "🥇", gradient: "from-yellow-400 to-amber-500" },
  { id: "platinum", label: "Platinum", minXP: 1000, color: "#e5e4e2", emoji: "💎", gradient: "from-cyan-300 to-sky-500" },
  { id: "diamond", label: "Diamond", minXP: 1500, color: "#b9f2ff", emoji: "💠", gradient: "from-blue-400 to-indigo-500" },
  { id: "mastermind", label: "Mastermind", minXP: 2000, color: "#a855f7", emoji: "🧠", gradient: "from-purple-400 to-violet-600" },
] as const;

export type LeagueId = typeof LEAGUES[number]["id"];

export const AVATAR_EVOLUTION_STAGES = [
  { id: "egg", label: "Egg", minLevel: 1, emoji: "🥚", description: "Your brain avatar is hatching..." },
  { id: "hatchling", label: "Hatchling", minLevel: 3, emoji: "🐣", description: "A curious little mind emerges" },
  { id: "sapling", label: "Sapling", minLevel: 5, emoji: "🌱", description: "Growing stronger every day" },
  { id: "guardian", label: "Guardian", minLevel: 7, emoji: "🛡️", description: "A protector of cognitive health" },
  { id: "brain_lord", label: "Brain Lord", minLevel: 10, emoji: "🧠", description: "Master of mental prowess" },
] as const;

export type AvatarStage = typeof AVATAR_EVOLUTION_STAGES[number]["id"];

export const AVATAR_PARTS = {
  body: [
    { id: "round", label: "Round", rarity: "common" as const },
    { id: "square", label: "Square", rarity: "uncommon" as const },
    { id: "tall", label: "Tall", rarity: "rare" as const },
  ],
  skin: [
    { id: "light", label: "Light", rarity: "common" as const },
    { id: "warm", label: "Warm", rarity: "common" as const },
    { id: "medium", label: "Medium", rarity: "common" as const },
    { id: "tan", label: "Tan", rarity: "uncommon" as const },
    { id: "deep", label: "Deep", rarity: "uncommon" as const },
    { id: "dark", label: "Dark", rarity: "uncommon" as const },
  ],
  hair: [
    { id: "short", label: "Short", rarity: "common" as const },
    { id: "long", label: "Long", rarity: "common" as const },
    { id: "curly", label: "Curly", rarity: "uncommon" as const },
    { id: "mohawk", label: "Mohawk", rarity: "rare" as const },
    { id: "afro", label: "Afro", rarity: "rare" as const },
    { id: "spiky", label: "Spiky", rarity: "epic" as const },
    { id: "crown", label: "Brain Crown", rarity: "legendary" as const },
  ],
  outfit: [
    { id: "basic", label: "Basic Tee", rarity: "common" as const },
    { id: "hoodie", label: "Brain Hoodie", rarity: "uncommon" as const },
    { id: "labcoat", label: "Lab Coat", rarity: "rare" as const },
    { id: "robe", label: "Wisdom Robe", rarity: "epic" as const },
    { id: "cosmic", label: "Cosmic Armor", rarity: "legendary" as const },
  ],
  background: [
    { id: "default", label: "Default", rarity: "common" as const },
    { id: "gym", label: "Brain Gym", rarity: "uncommon" as const },
    { id: "space", label: "Deep Space", rarity: "rare" as const },
    { id: "nature", label: "Zen Garden", rarity: "epic" as const },
  ],
  frame: [
    { id: "none", label: "No Frame", rarity: "common" as const },
    { id: "gold", label: "Gold Frame", rarity: "rare" as const },
    { id: "neon", label: "Neon Frame", rarity: "epic" as const },
    { id: "brain", label: "Brain Frame", rarity: "legendary" as const },
  ],
  accessory: [
    { id: "none", label: "None", rarity: "common" as const },
    { id: "glasses", label: "Smart Glasses", rarity: "uncommon" as const },
    { id: "headphones", label: "Focus Headphones", rarity: "rare" as const },
    { id: "crown", label: "Brain Crown", rarity: "legendary" as const },
  ],
  expression: [
    { id: "happy", label: "Happy", rarity: "common" as const },
    { id: "focus", label: "Focused", rarity: "common" as const },
    { id: "fire", label: "On Fire", rarity: "uncommon" as const },
    { id: "star", label: "Star Power", rarity: "rare" as const },
    { id: "cosmic", label: "Cosmic", rarity: "legendary" as const },
  ],
} as const;

export const AVATAR_COLORS: { skin: Record<string, string>; hair: Record<string, string>; outfit: Record<string, string>; bg: Record<string, string> } = {
  skin: {
    light: "#fde68a",
    warm: "#f5d0a9",
    medium: "#c4956a",
    tan: "#a0784c",
    deep: "#7c5332",
    dark: "#5a3a22",
  },
  hair: {
    short: "#4a3728",
    long: "#4a3728",
    curly: "#4a3728",
    mohawk: "#ef4444",
    afro: "#4a3728",
    spiky: "#f59e0b",
    crown: "#fbbf24",
  },
  outfit: {
    basic: "#3b82f6",
    hoodie: "#8b5cf6",
    labcoat: "#f8fafc",
    robe: "#fbbf24",
    cosmic: "#6366f1",
  },
  bg: {
    default: "#f8fafc",
    gym: "#dbeafe",
    space: "#1e1b4b",
    nature: "#ecfdf5",
  },
};
