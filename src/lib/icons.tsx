import type { LucideIcon } from "lucide-react";
import {
  Brain,
  BrainCircuit,
  ScanEye,
  Orbit,
  GraduationCap,
  HeartPulse,
  WandSparkles,
  Handshake,
  Target,
  Lightbulb,
  BookOpen,
  Heart,
  Palette,
  Users,
  LayoutDashboard,
  Dumbbell,
  Grid3X3,
  Zap,
  Gamepad2,
  Bot,
  BarChart3,
  FileText,
  Clock,
  Trophy,
  Star,
  Award,
  MessageCircle,
  PenLine,
  Share2,
  Scale,
  Settings,
  Leaf,
  Flame,
  Diamond,
  Sparkles,
  HeartHandshake,
  Moon,
  Sun,
  Layers,
  Medal,
  Crown,
  Hash,
  Type,
  Timer,
  Smartphone,
  Cloud,
  CloudRain,
  ClipboardList,
  Monitor,
  BatteryLow,
  HelpCircle,
  VolumeX,
  Music,
  TreePine,
  Waves,
  Compass,
  TrendingUp,
  Shield,
  Rocket,
  Briefcase,
  AlertTriangle,
  Snowflake,
  ShoppingCart,
  Globe,
} from "lucide-react";

/* ── Sidebar Nav ──────────────────────────────────────────────── */
export const SIDEBAR_ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  workout: Dumbbell,
  library: Grid3X3,
  challenge: Zap,
  games: Gamepad2,
  coach: Bot,
  progress: BarChart3,
  reports: FileText,
  history: Clock,
  leaderboard: Trophy,
  missions: Star,
  challenges: Award,
  chat: MessageCircle,
  journal: PenLine,
  share: Share2,
  "decision-lab": Scale,
  settings: Settings,
  shop: ShoppingCart,
};

/* ── Category Icons ───────────────────────────────────────────── */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  memory: BrainCircuit,
  focus: ScanEye,
  thinking: Orbit,
  learning: GraduationCap,
  health: HeartPulse,
  creativity: WandSparkles,
  "emotional-intelligence": Handshake,
};

/* ── Achievement Icons ────────────────────────────────────────── */
export const ACHIEVEMENT_ICONS: Record<string, LucideIcon> = {
  first_workout: Leaf,
  week_streak: Flame,
  month_streak: Diamond,
  memory_whiz: Brain,
  focus_fiend: Target,
  creative_spark: Sparkles,
  thinker: Lightbulb,
  scholar: GraduationCap,
  healthy_mind: Heart,
  empath: HeartHandshake,
  perfect_week: Star,
  night_owl: Moon,
  early_bird: Sun,
  speed_demon: Zap,
  all_categories: Layers,
  ten_workouts: Medal,
  fifty_workouts: Trophy,
  hundred_workouts: Crown,
};

/* ── Goal Icons ───────────────────────────────────────────────── */
export const GOAL_ICONS: Record<string, LucideIcon> = {
  improve_memory: Brain,
  boost_focus: Target,
  think_faster: Zap,
  learn_better: BookOpen,
  reduce_stress: Leaf,
  stay_sharp: Diamond,
  creative_thinking: Palette,
  emotional_control: Shield,
  exam_prep: FileText,
  career_growth: TrendingUp,
  better_decisions: Compass,
  social_skills: Users,
  mental_health: Heart,
  confidence: Award,
};

/* ── Challenge Icons ──────────────────────────────────────────── */
export const CHALLENGE_ICONS: Record<string, LucideIcon> = {
  forgetfulness: Brain,
  distraction: Smartphone,
  brain_fog: Cloud,
  slow_processing: Timer,
  procrastination: Clock,
  anxiety: AlertTriangle,
  poor_sleep: Moon,
  language_struggle: MessageCircle,
  exam_pressure: ClipboardList,
  screen_fatigue: Monitor,
  motivation_dip: BatteryLow,
  decision_paralysis: HelpCircle,
};

/* ── Age Group Icons ──────────────────────────────────────────── */
export const AGE_GROUP_ICONS: Record<string, LucideIcon> = {
  teen: GraduationCap,
  young_adult: Rocket,
  adult: Briefcase,
  senior: Star,
};

/* ── Ambient Sound Icons ──────────────────────────────────────── */
export const AMBIENT_ICONS: Record<string, LucideIcon> = {
  none: VolumeX,
  lofi: Music,
  rain: CloudRain,
  forest: TreePine,
  white_noise: Waves,
};

/* ── Game Icons ───────────────────────────────────────────────── */
export const GAME_ICONS: Record<string, LucideIcon> = {
  memory_match: Layers,
  number_sequence: Hash,
  word_scramble: Type,
  reaction_speed: Zap,
  color_match: Palette,
};

/* ── Habit Nudge Icons ────────────────────────────────────────── */
export const NUDGE_ICONS: Record<string, LucideIcon> = {
  time: Dumbbell,
  missed: Users,
  consistency: Flame,
  progress: TrendingUp,
  social: Globe,
};

/* ── Milestone Icons ──────────────────────────────────────────── */
export const MILESTONE_ICONS: Record<string, LucideIcon> = {
  first_workout: Leaf,
  "7day_streak": Flame,
  level_5: Zap,
  all_categories: Layers,
  "100_activities": Trophy,
  brain_80: Brain,
  level_10: Crown,
  brain_god: Diamond,
};

/* ── Skill Tier Icons ─────────────────────────────────────────── */
export const TIER_ICONS: Record<string, LucideIcon> = {
  Novice: Leaf,
  Apprentice: BookOpen,
  Practitioner: Settings,
  Expert: Diamond,
  Master: Crown,
};

/* ── Gamification Icons ───────────────────────────────────────── */
export const STREAK_FREEZE_ICON = Snowflake;
export const STREAK_WARNING_ICON = AlertTriangle;

/* ── Mission Icons ───────────────────────────────────────────── */
export const MISSION_ICONS: Record<string, LucideIcon> = {
  target: Target,
  flame: Flame,
  timer: Timer,
  star: Star,
  diamond: Diamond,
  crown: Crown,
  zap: Zap,
  award: Award,
  dumbbell: Dumbbell,
  palette: Palette,
  layers: Layers,
  sparkles: Sparkles,
};
