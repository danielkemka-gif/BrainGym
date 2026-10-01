-- Migration: 00038_real_world_thinking_engine.sql
-- Supports 3,000+ Real-World Thinking Challenges, Multilingual Translations, and 8-Step Framework

CREATE TABLE IF NOT EXISTS challenge_definitions (
  id text PRIMARY KEY,
  cognitive_skill text NOT NULL,
  category text NOT NULL,
  difficulty smallint NOT NULL DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 5),
  age_suitability text NOT NULL DEFAULT 'all',
  estimated_minutes smallint NOT NULL DEFAULT 5,
  xp_reward smallint NOT NULL DEFAULT 50,
  coin_reward smallint NOT NULL DEFAULT 20,
  tags text[] DEFAULT '{}',
  cultural_context text DEFAULT 'global',
  cognitive_drill_type text DEFAULT 'deduction',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_challenge_defs_skill_diff
  ON challenge_definitions(cognitive_skill, difficulty, is_active);

CREATE TABLE IF NOT EXISTS challenge_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id text NOT NULL REFERENCES challenge_definitions(id) ON DELETE CASCADE,
  language text NOT NULL CHECK (language IN ('en', 'fr', 'ar', 'zh', 'pcm', 'pt')),
  title text NOT NULL,
  scenario_narrative text NOT NULL,
  context_pill text,
  think_prompt text NOT NULL,
  key_facts jsonb DEFAULT '[]'::jsonb,
  hidden_assumptions jsonb DEFAULT '[]'::jsonb,
  analyse_prompt text,
  perspectives jsonb DEFAULT '[]'::jsonb,
  decide_question text NOT NULL,
  decision_options jsonb NOT NULL DEFAULT '[]'::jsonb,
  cognitive_drill jsonb DEFAULT '{}'::jsonb,
  real_life_action jsonb DEFAULT '{}'::jsonb,
  reflection_questions text[] DEFAULT '{}',
  suggested_takeaway text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(challenge_id, language)
);

CREATE INDEX IF NOT EXISTS idx_challenge_trans_lang
  ON challenge_translations(language, challenge_id);

CREATE TABLE IF NOT EXISTS user_challenge_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id text NOT NULL,
  assignment_date date NOT NULL,
  language text NOT NULL DEFAULT 'en',
  status text NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed')),
  selected_decision_id text,
  is_recommended_choice boolean DEFAULT false,
  cognitive_drill_score integer DEFAULT 0,
  action_committed boolean DEFAULT false,
  user_reflection text,
  xp_earned integer DEFAULT 0,
  coins_earned integer DEFAULT 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, assignment_date)
);

CREATE INDEX IF NOT EXISTS idx_user_challenge_attempts_user_date
  ON user_challenge_attempts(user_id, assignment_date);

CREATE TABLE IF NOT EXISTS thinking_journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id text,
  title text NOT NULL,
  scenario_summary text,
  user_decision text,
  decision_reasoning text,
  real_world_action text,
  reflection_text text NOT NULL,
  cognitive_skill text NOT NULL,
  language text DEFAULT 'en',
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_thinking_journal_user_created
  ON thinking_journal_entries(user_id, created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE challenge_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE thinking_journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active challenge definitions"
  ON challenge_definitions FOR SELECT USING (is_active = true);

CREATE POLICY "Public read challenge translations"
  ON challenge_translations FOR SELECT USING (true);

CREATE POLICY "Users can manage own challenge attempts"
  ON user_challenge_attempts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own thinking journal"
  ON thinking_journal_entries FOR ALL USING (auth.uid() = user_id);
