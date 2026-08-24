export type PhysicalCategory =
  | "Focus & Concentration"
  | "Memory"
  | "Learning & Language"
  | "Creativity"
  | "Emotional Intelligence"
  | "Executive Decisions"
  | "Movement & Physical Health"
  | "Brain + Hand Coordination"
  | "Sensory Awareness"
  | "Music & Rhythm"
  | "Sleep & Recovery"
  | "Nutrition & Hydration"
  | "Novelty & Route Change"
  | "Social Brain & Leadership";

export type ActivityDuration = "5m" | "10m" | "15m" | "20m" | "25m" | "30m" | "40m" | "45m";
export type ActivityDifficulty = "easy" | "moderate" | "challenging";

export interface PhysicalActivity {
  id: string;
  title: string;
  category: PhysicalCategory;
  duration: ActivityDuration;
  durationMinutes: number;
  difficulty: ActivityDifficulty;
  icon: string; // Emoji icon
  illustrationType:
    | "meditation"
    | "walking"
    | "reading"
    | "drawing"
    | "listening"
    | "speaking"
    | "handwriting"
    | "eating"
    | "sleeping"
    | "nature"
    | "planning"
    | "music"
    | "hydration"
    | "coordination";
  tagline: string;
  whatToDo: string[];
  whyItMatters: string;
  whatItSupports: string[];
  culturalContext?: string; // Nigerian/African and global relatable tips
  xpReward: number;
  coinReward: number;
}

export interface HabitStack {
  id: string;
  title: string;
  description: string;
  timeOfDay: "morning" | "afternoon" | "evening";
  activities: string[]; // Activity IDs
  totalMinutes: number;
  bonusXp: number;
  bonusCoins: number;
}

export interface WeeklyMission {
  id: string;
  title: string;
  category: PhysicalCategory;
  description: string;
  targetDays: number;
  xpReward: number;
  coinReward: number;
  badgeName: string;
}

export interface PhysicalBrainScore {
  totalScore: number; // 0 - 100
  focusScore: number;
  movementScore: number;
  learningScore: number;
  recoveryScore: number;
  emotionalScore: number;
  completedCount: number;
  currentStreak: number;
}

export interface ReminderSchedule {
  enabled: boolean;
  frequency: "everyday" | "weekdays" | "weekends" | "custom";
  days: number[]; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  time: string; // "06:30", "07:00", etc.
  message: string;
  alarmEnabled: boolean;
}
