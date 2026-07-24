export type Locale = "en" | "pcm" | "fr" | "pt";

export interface LocaleOption {
  id: Locale;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LOCALES: LocaleOption[] = [
  { id: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { id: "pcm", label: "Nigerian Pidgin", nativeLabel: "Naijá", flag: "🇳🇬" },
  { id: "fr", label: "French", nativeLabel: "Français", flag: "🇫🇷" },
  { id: "pt", label: "Portuguese", nativeLabel: "Português", flag: "🇧🇷" },
];

export type TranslationKeys = {
  // Navigation
  nav_dashboard: string;
  nav_activities: string;
  nav_quick_fire: string;
  nav_ai_coach: string;
  nav_progress: string;
  nav_reports: string;
  nav_history: string;
  nav_leaderboard: string;
  nav_missions: string;
  nav_challenges: string;
  nav_journal: string;
  nav_share_card: string;
  nav_decision_lab: string;
  nav_settings: string;
  nav_tagline: string;

  // Dashboard
  dashboard_greeting: string;
  dashboard_subtitle: string;
  dashboard_coins: string;
  dashboard_level: string;
  dashboard_start_training: string;
  dashboard_brain_training: string;
  dashboard_view_all: string;
  dashboard_complete_workout: string;
  dashboard_no_activities: string;

  // Categories
  cat_memory: string;
  cat_memory_desc: string;
  cat_focus: string;
  cat_focus_desc: string;
  cat_thinking: string;
  cat_thinking_desc: string;
  cat_learning: string;
  cat_learning_desc: string;
  cat_health: string;
  cat_health_desc: string;
  cat_creativity: string;
  cat_creativity_desc: string;
  cat_ei: string;
  cat_ei_desc: string;

  // Quick-Fire Challenge
  qf_title: string;
  qf_subtitle: string;
  qf_start: string;
  qf_next: string;
  qf_finish: string;
  qf_score: string;
  qf_streak: string;
  qf_time_up: string;
  qf_correct: string;
  qf_wrong: string;
  qf_grade_oga: string;
  qf_grade_sabi: string;
  qf_grade_good: string;
  qf_grade_oops: string;
  qf_reaction_correct: string[];
  qf_reaction_wrong: string[];

  // Auth
  auth_welcome_back: string;
  auth_sign_in: string;
  auth_create_account: string;
  auth_email: string;
  auth_password: string;
  auth_name: string;
  auth_forgot: string;
  auth_check_email: string;
  auth_confirmation_sent: string;

  // Settings
  settings_title: string;
  settings_subtitle: string;
  settings_profile: string;
  settings_notifications: string;
  settings_subscription: string;
  settings_account: string;
  settings_save: string;
  settings_saved: string;
  settings_language: string;

  // Premium
  premium_title: string;
  premium_upgrade: string;
  premium_trial_active: string;
  premium_trial_days: string;

  // General
  general_continue: string;
  general_back: string;
  general_loading: string;
  general_anonymous: string;
  general_xp: string;
  general_coins: string;
  general_streak: string;
  general_days: string;
  general_of: string;
};
