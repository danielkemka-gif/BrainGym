export type Locale = "en" | "fr" | "ar" | "zh" | "pcm" | "pt";

export interface LocaleOption {
  id: Locale;
  label: string;
  nativeLabel: string;
  flag: string;
  dir?: "ltr" | "rtl";
}

export const LOCALES: LocaleOption[] = [
  { id: "en", label: "English", nativeLabel: "English", flag: "🇬🇧", dir: "ltr" },
  { id: "fr", label: "French", nativeLabel: "Français", flag: "🇫🇷", dir: "ltr" },
  { id: "ar", label: "Arabic", nativeLabel: "العربية", flag: "🇸🇦", dir: "rtl" },
  { id: "zh", label: "Simplified Chinese", nativeLabel: "简体中文", flag: "🇨🇳", dir: "ltr" },
  { id: "pcm", label: "Nigerian Pidgin", nativeLabel: "Naijá", flag: "🇳🇬", dir: "ltr" },
  { id: "pt", label: "Portuguese", nativeLabel: "Português", flag: "🇧🇷", dir: "ltr" },
];

export type TranslationKeys = {
  // Navigation
  nav_dashboard: string;
  nav_discover: string;
  nav_activities: string;
  nav_quick_fire: string;
  nav_ai_coach: string;
  nav_progress: string;
  nav_transformation: string;
  nav_reports: string;
  nav_history: string;
  nav_leaderboard: string;
  nav_missions: string;
  nav_challenges: string;
  nav_journal: string;
  nav_share_card: string;
  nav_decision_lab: string;
  nav_settings: string;
  nav_chat: string;
  nav_games: string;
  nav_workout: string;
  nav_shop: string;
  nav_daily_challenge: string;
  nav_avatar: string;
  nav_guide: string;
  nav_premium: string;
  nav_training: string;
  nav_physical: string;
  nav_reminders: string;
  nav_tagline: string;

  // Framework & Branding
  brand_tagline: string;
  framework_tagline: string;
  non_medical_disclaimer: string;

  // Dashboard Core
  dashboard_greeting: string;
  dashboard_subtitle: string;
  dashboard_coins: string;
  dashboard_level: string;
  dashboard_start_training: string;
  dashboard_brain_training: string;
  dashboard_view_all: string;
  dashboard_complete_workout: string;
  dashboard_no_activities: string;

  // 8-Step Daily Challenge Architecture
  challenge_todays_title: string;
  challenge_start_cta: string;
  challenge_completed_cta: string;
  challenge_streak_protected: string;
  challenge_tomorrow_preview_title: string;
  challenge_tomorrow_preview_desc: string;
  step_1_scenario: string;
  step_2_think: string;
  step_3_analyse: string;
  step_4_decide: string;
  step_5_brain_challenge: string;
  step_6_act: string;
  step_7_reflect: string;
  step_8_record: string;
  step_think_instruction: string;
  step_analyse_instruction: string;
  step_decide_instruction: string;
  step_act_instruction: string;
  step_reflect_instruction: string;
  step_reflect_placeholder: string;
  step_submit_reflection: string;
  step_next: string;
  step_back: string;

  // 8 Cognitive Skills
  skill_memory: string;
  skill_focus: string;
  skill_reasoning: string;
  skill_problem_solving: string;
  skill_decision_making: string;
  skill_cognitive_flexibility: string;
  skill_processing_speed: string;
  skill_creativity: string;

  // Skill Development & Progress
  skill_development_title: string;
  skill_development_subtitle: string;
  skill_improvement_prefix: string;

  // Next Challenge Recommendation
  next_challenge_title: string;
  next_challenge_subtitle: string;
  next_challenge_start: string;

  // 7 Latest Workouts
  latest_workouts_title: string;
  latest_workouts_subtitle: string;
  latest_workouts_empty: string;
  review_workout_modal_title: string;
  review_scenario_label: string;
  review_decision_label: string;
  review_action_label: string;
  review_reflection_label: string;
  review_close: string;

  // Thinking Journal
  journal_title: string;
  journal_subtitle: string;
  journal_new_entry: string;
  journal_empty_title: string;
  journal_empty_desc: string;
  journal_search_placeholder: string;
  journal_share_card_cta: string;

  // Categories (Legacy Compatibility)
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
  settings_language_desc: string;

  // Premium
  premium_title: string;
  premium_upgrade: string;
  premium_trial_active: string;
  premium_trial_days: string;

  // Chat
  chat_title: string;
  chat_subtitle: string;
  chat_placeholder: string;
  chat_send: string;
  chat_empty: string;
  chat_online: string;
  chat_typing: string;
  chat_delete: string;
  chat_reply: string;
  chat_premium_note: string;
  chat_members: string;
  chat_just_now: string;
  chat_minutes_ago: string;
  chat_hours_ago: string;

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

  // Brain Momentum
  momentum_title: string;
  momentum_subtitle: string;
  momentum_streak: string;
  momentum_consistency: string;
  momentum_growth: string;
  momentum_engagement: string;
  momentum_unstoppable: string;
  momentum_soaring: string;
  momentum_building: string;
  momentum_warming_up: string;
  momentum_recovering: string;
  momentum_getting_started: string;

  // Daily Quests
  quests_title: string;
  quests_subtitle: string;
  quests_generate: string;
  quests_completed: string;
  quests_claim: string;
  quests_celebration: string;

  // Cognitive Identity
  identity_title: string;
  identity_subtitle: string;
  identity_view_all: string;
  identity_discover: string;

  // Consistency Forecast
  forecast_title: string;
  forecast_subtitle: string;
  forecast_frequency: string;
  forecast_of_days: string;
  forecast_rarely: string;
  forecast_most_days: string;
  forecast_every_day: string;
  forecast_warning: string;

  // Missed Day Simulator
  missed_title: string;
  missed_subtitle: string;
  missed_today: string;
  missed_in_7_days: string;
  missed_drop: string;
  missed_motivation_low: string;
  missed_motivation_mid: string;
  missed_motivation_high: string;

  // Brain Health
  health_title: string;
  health_subtitle: string;
  health_excellent: string;
  health_good: string;
  health_fair: string;
  health_needs_attention: string;
  health_strongest: string;
  health_focus_area: string;
  health_vs_last_week: string;

  // Adaptive Habits
  habits_title: string;
  habits_subtitle: string;
  habits_building: string;
  habits_strong: string;
  habits_needs_care: string;
  habits_optimal: string;
  habits_current: string;
  habits_consistency: string;
  habits_best_day: string;
  habits_best_time: string;

  // Smart Reminders
  reminders_title: string;
  reminders_subtitle: string;
  reminders_missed_workout: string;
  reminders_streak_risk: string;
  reminders_streak_milestone: string;
  reminders_comeback: string;
  reminders_weekly_summary: string;

  // Streak Protection
  protection_title: string;
  protection_subtitle: string;
  protection_freezes_left: string;
  protection_buy: string;
  protection_max_reached: string;
  protection_not_enough: string;
  protection_each_freeze: string;

  // 365-Day Journey
  journey_title: string;
  journey_subtitle: string;
  journey_milestones: string;
  journey_achieved: string;
  journey_day1: string;
  journey_7streak: string;
  journey_30streak: string;
  journey_100workouts: string;
  journey_score80: string;
  journey_1000xp: string;
};
