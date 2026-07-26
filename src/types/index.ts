export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
};

export type Activity = {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimated_time: number;
  xp: number;
  coins: number;
  benefits: string[] | null;
  is_active: boolean;
  created_at: string;
};

export type DailyWorkout = {
  id: string;
  user_id: string;
  date: string;
  status: "pending" | "in_progress" | "completed";
  total_xp: number;
  total_coins: number;
  started_at: string | null;
  completed_at: string | null;
};

export type WorkoutItem = {
  id: string;
  workout_id: string;
  activity_id: string;
  order: number;
  status: "pending" | "completed" | "skipped";
  completed_at: string | null;
  notes: string | null;
};

export type Mission = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  duration_days: number;
  started_at: string;
  status: "active" | "completed" | "failed";
};

export type MissionProgress = {
  id: string;
  mission_id: string;
  day: number;
  activity_id: string | null;
  completed: boolean;
};

export type BrainScore = {
  id: string;
  user_id: string;
  date: string;
  category_id: string;
  score: number;
  delta: number | null;
};

export type ActivityLog = {
  id: string;
  user_id: string;
  activity_id: string;
  date: string;
  xp_earned: number;
  coins_earned: number;
  created_at: string;
};

export type Streak = {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_workout_date: string | null;
};

export type Achievement = {
  id: string;
  user_id: string;
  achievement_type: string;
  unlocked_at: string;
  xp_reward: number;
};

export type XpLedger = {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  reference_type: string | null;
  reference_id: string | null;
  created_at: string;
};

export type CoinsLedger = {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  reference_type: string | null;
  reference_id: string | null;
  created_at: string;
};

export type UserLevel = {
  id: string;
  user_id: string;
  level: number;
  title: string;
  xp_from: number;
  xp_to: number;
};

export type DecisionLabEntry = {
  id: string;
  user_id: string;
  scenario: string;
  response: string;
  ai_evaluation: Record<string, unknown> | null;
  week_start: string;
  created_at: string;
};

export type AiFeedback = {
  id: string;
  user_id: string;
  feedback_type: string;
  message: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  read: boolean;
  scheduled_for: string | null;
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan: "free" | "premium";
  stripe_id: string | null;
  status: string;
  period_end: string | null;
};

export type UserSettings = {
  id: string;
  user_id: string;
  dark_mode: boolean;
  notifications_enabled: boolean;
  workout_reminder_time: string | null;
  locale: string;
  age_group: string;
};

export type Profile = {
  id: string;
  user_id: string;
  name: string | null;
  avatar_url: string | null;
  age: number | null;
  age_group: string | null;
  occupation: string | null;
  goals: string[] | null;
  challenges: string[] | null;
  preferred_workout_time: string | null;
  onboarding_complete: boolean;
  created_at: string;
};

export type LeagueTier = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "mastermind";

export type UserLeague = {
  id: string;
  user_id: string;
  league: LeagueTier;
  week_start: string;
  weekly_xp: number;
  promoted: boolean;
  relegated: boolean;
  created_at: string;
  updated_at: string;
};

export type LeagueSnapshot = {
  id: string;
  week_start: string;
  league: LeagueTier;
  user_id: string;
  weekly_xp: number;
  final_rank: number;
  promoted: boolean;
  relegated: boolean;
  created_at: string;
};

export type AvatarStage = "egg" | "hatchling" | "sapling" | "guardian" | "brain_lord";

export type UserAvatar = {
  id: string;
  user_id: string;
  body_type: string;
  skin_tone: string;
  hair_style: string;
  hair_color: string;
  outfit_id: string;
  background_id: string;
  frame_id: string;
  accessory_id: string;
  expression: string;
  evolution_stage: AvatarStage;
  evolved_at: string;
  created_at: string;
  updated_at: string;
};

export type AvatarPart = {
  id: string;
  slug: string;
  name: string;
  category: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  unlock_type: string;
  unlock_value: number;
  preview_emoji: string | null;
  preview_colors: Record<string, string>;
  is_active: boolean;
  created_at: string;
};

export type UserAvatarPart = {
  id: string;
  user_id: string;
  part_id: string;
  unlocked_at: string;
};

export type MonthlyReport = {
  id: string;
  user_id: string;
  month: string;
  avg_score: number;
  score_change: number;
  activities_completed: number;
  streak_days: number;
  top_category: string;
  weakest_category: string;
  improvement_pct: number;
  narrative: string;
  created_at: string;
};
