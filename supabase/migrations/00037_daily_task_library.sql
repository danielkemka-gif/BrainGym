-- Migration: 00037_daily_task_library.sql
-- Supports 3,000+ Mental Fitness Task Library, Idempotent Daily Assignment & Anti-Repetition

CREATE TABLE IF NOT EXISTS daily_fitness_tasks (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  difficulty smallint NOT NULL DEFAULT 2,
  estimated_duration_min smallint NOT NULL DEFAULT 5,
  age_suitability text NOT NULL DEFAULT 'all',
  instructions text NOT NULL,
  interaction_type text NOT NULL,
  task_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  xp_reward smallint NOT NULL DEFAULT 50,
  coin_reward smallint NOT NULL DEFAULT 20,
  tags text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_fitness_tasks_cat_diff
  ON daily_fitness_tasks(category, difficulty, is_active);

CREATE TABLE IF NOT EXISTS user_daily_task_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id text NOT NULL,
  assignment_date date NOT NULL,
  status text NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed')),
  score integer DEFAULT 0,
  xp_earned integer DEFAULT 0,
  coins_earned integer DEFAULT 0,
  user_response jsonb DEFAULT '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, assignment_date)
);

CREATE INDEX IF NOT EXISTS idx_user_task_assignments_user_date
  ON user_daily_task_assignments(user_id, assignment_date);

CREATE INDEX IF NOT EXISTS idx_user_task_assignments_user_completed
  ON user_daily_task_assignments(user_id, task_id, status);

-- RLS Policies
ALTER TABLE daily_fitness_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_task_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active daily fitness tasks"
  ON daily_fitness_tasks FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can view own task assignments"
  ON user_daily_task_assignments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own task assignments"
  ON user_daily_task_assignments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own task assignments"
  ON user_daily_task_assignments FOR UPDATE
  USING (auth.uid() = user_id);
