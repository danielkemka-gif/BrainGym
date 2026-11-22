-- ============================================================================
-- Migration 00041: Akuche Core Intelligence Platform Tables
-- Non-destructive, idempotent schema for:
--   1. akuche_goals (real-life goals across domains)
--   2. akuche_assignments (full coaching assignment lifecycle)
--   3. akuche_reminders & akuche_reminder_logs (timezone, quiet hours, retry, dedupe)
--   4. akuche_reflections (weekly, monthly, and assignment reflections)
--   5. akuche_activity_logs & akuche_activity_preferences (Mental Fitness Gym)
--   6. akuche_shared_stories (privacy-reviewed user experience stories)
--   7. user_settings preference extensions (timezone, quiet hours, coaching style)
-- ============================================================================

-- 0. Extend user_settings safely with coaching & reminder preferences
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_settings') THEN
    ALTER TABLE public.user_settings
      ADD COLUMN IF NOT EXISTS timezone TEXT NOT NULL DEFAULT 'Africa/Lagos',
      ADD COLUMN IF NOT EXISTS quiet_hours_start TIME DEFAULT '22:00'::time,
      ADD COLUMN IF NOT EXISTS quiet_hours_end TIME DEFAULT '07:00'::time,
      ADD COLUMN IF NOT EXISTS reminder_frequency TEXT NOT NULL DEFAULT 'daily'
        CHECK (reminder_frequency IN ('daily', 'weekdays', 'three_per_week', 'weekly', 'off')),
      ADD COLUMN IF NOT EXISTS reminder_channels JSONB NOT NULL DEFAULT '{"in_app": true, "web_push": true}'::jsonb,
      ADD COLUMN IF NOT EXISTS reminder_categories JSONB NOT NULL DEFAULT '{"assignments": true, "goals": true, "mental_fitness": true, "reflections": true, "check_ins": true}'::jsonb,
      ADD COLUMN IF NOT EXISTS coaching_style TEXT NOT NULL DEFAULT 'balanced'
        CHECK (coaching_style IN ('direct', 'balanced', 'gentle', 'deep_analytical')),
      ADD COLUMN IF NOT EXISTS time_budget_mins SMALLINT NOT NULL DEFAULT 15
        CHECK (time_budget_mins >= 5 AND time_budget_mins <= 180);
  END IF;
END $$;

-- 1. Akuche Goals
CREATE TABLE IF NOT EXISTS public.akuche_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  domain TEXT NOT NULL DEFAULT 'personal' CHECK (
    domain IN ('business', 'career', 'relationships', 'personal', 'finance', 'family', 'learning', 'general')
  ),
  status TEXT NOT NULL DEFAULT 'active' CHECK (
    status IN ('active', 'paused', 'completed', 'archived')
  ),
  target_date DATE,
  success_criteria TEXT,
  progress_percent SMALLINT NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  source_conversation_id UUID REFERENCES public.akuche_conversations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_akuche_goals_user_status ON public.akuche_goals(user_id, status, updated_at DESC);

ALTER TABLE public.akuche_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own akuche_goals" ON public.akuche_goals;
CREATE POLICY "Users manage own akuche_goals"
  ON public.akuche_goals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. Akuche Assignments (Coaching Action System)
CREATE TABLE IF NOT EXISTS public.akuche_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES public.akuche_goals(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES public.akuche_conversations(id) ON DELETE SET NULL,
  parent_assignment_id UUID REFERENCES public.akuche_assignments(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  why_it_matters TEXT NOT NULL,
  what_to_do TEXT NOT NULL,
  instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
  expected_outcome TEXT,
  estimated_duration_mins SMALLINT NOT NULL DEFAULT 15 CHECK (estimated_duration_mins > 0 AND estimated_duration_mins <= 480),
  deadline TIMESTAMPTZ,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  domain TEXT NOT NULL DEFAULT 'personal',
  status TEXT NOT NULL DEFAULT 'proposed' CHECK (
    status IN ('proposed', 'accepted', 'in_progress', 'completed', 'postponed', 'blocked', 'abandoned')
  ),
  supporting_resources JSONB NOT NULL DEFAULT '[]'::jsonb,
  blocker_reason TEXT,
  abandon_reason TEXT,
  postponed_until TIMESTAMPTZ,
  completion_feedback TEXT,
  outcome_rating SMALLINT CHECK (outcome_rating IS NULL OR (outcome_rating >= 1 AND outcome_rating <= 5)),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_akuche_assignments_user_status ON public.akuche_assignments(user_id, status, deadline);
CREATE INDEX IF NOT EXISTS idx_akuche_assignments_goal ON public.akuche_assignments(goal_id);

ALTER TABLE public.akuche_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own akuche_assignments" ON public.akuche_assignments;
CREATE POLICY "Users manage own akuche_assignments"
  ON public.akuche_assignments FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Akuche Proactive Follow-Up & Reminders
CREATE TABLE IF NOT EXISTS public.akuche_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (
    category IN ('assignment', 'goal', 'commitment', 'mental_fitness', 'reflection', 'follow_up', 'check_in')
  ),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT NOT NULL DEFAULT '/dashboard',
  context_id UUID,
  scheduled_for TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Africa/Lagos',
  channel TEXT NOT NULL DEFAULT 'both' CHECK (channel IN ('in_app', 'web_push', 'both')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (
    status IN ('scheduled', 'delivered', 'snoozed', 'read', 'dismissed', 'failed', 'cancelled')
  ),
  snoozed_until TIMESTAMPTZ,
  retry_count SMALLINT NOT NULL DEFAULT 0,
  last_error TEXT,
  dedupe_key TEXT,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_akuche_reminders_user_dedupe UNIQUE (user_id, dedupe_key)
);

CREATE INDEX IF NOT EXISTS idx_akuche_reminders_due ON public.akuche_reminders(status, scheduled_for)
  WHERE status IN ('scheduled', 'snoozed');
CREATE INDEX IF NOT EXISTS idx_akuche_reminders_user ON public.akuche_reminders(user_id, scheduled_for DESC);

ALTER TABLE public.akuche_reminders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own akuche_reminders" ON public.akuche_reminders;
CREATE POLICY "Users manage own akuche_reminders"
  ON public.akuche_reminders FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3b. Delivery Audit Logs (for verifying actual reminder delivery reliability)
CREATE TABLE IF NOT EXISTS public.akuche_reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_id UUID REFERENCES public.akuche_reminders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('in_app', 'web_push')),
  delivery_status TEXT NOT NULL CHECK (delivery_status IN ('sent', 'skipped_quiet_hours', 'skipped_unsubscribed', 'failed', 'expired_subscription')),
  http_status INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_akuche_reminder_logs_user ON public.akuche_reminder_logs(user_id, created_at DESC);

ALTER TABLE public.akuche_reminder_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own akuche_reminder_logs" ON public.akuche_reminder_logs;
CREATE POLICY "Users view own akuche_reminder_logs"
  ON public.akuche_reminder_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role manages akuche_reminder_logs" ON public.akuche_reminder_logs;
CREATE POLICY "Service role manages akuche_reminder_logs"
  ON public.akuche_reminder_logs FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 4. Akuche Periodic & Outcome Reflections
CREATE TABLE IF NOT EXISTS public.akuche_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reflection_type TEXT NOT NULL CHECK (reflection_type IN ('weekly', 'monthly', 'assignment', 'decision', 'general')),
  period_start DATE,
  period_end DATE,
  worked_on TEXT,
  accomplishments TEXT,
  challenges TEXT,
  lessons_learned TEXT,
  unresolved TEXT,
  next_focus TEXT,
  clarity_rating SMALLINT CHECK (clarity_rating IS NULL OR (clarity_rating >= 1 AND clarity_rating <= 5)),
  confidence_rating SMALLINT CHECK (confidence_rating IS NULL OR (confidence_rating >= 1 AND confidence_rating <= 5)),
  saved_to_memory BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_akuche_reflections_user ON public.akuche_reflections(user_id, reflection_type, created_at DESC);

ALTER TABLE public.akuche_reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own akuche_reflections" ON public.akuche_reflections;
CREATE POLICY "Users manage own akuche_reflections"
  ON public.akuche_reflections FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Akuche Mental Fitness Activity Logs & Adaptive Personalization
CREATE TABLE IF NOT EXISTS public.akuche_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL,
  category TEXT NOT NULL,
  skill_focus TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_mins SMALLINT NOT NULL DEFAULT 5,
  score INTEGER,
  enjoyment_rating SMALLINT CHECK (enjoyment_rating IS NULL OR (enjoyment_rating >= 1 AND enjoyment_rating <= 5)),
  difficulty_feedback TEXT CHECK (difficulty_feedback IS NULL OR difficulty_feedback IN ('too_easy', 'just_right', 'too_hard')),
  reflection_note TEXT,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_akuche_activity_logs_user ON public.akuche_activity_logs(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_akuche_activity_logs_activity ON public.akuche_activity_logs(user_id, activity_id);

ALTER TABLE public.akuche_activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own akuche_activity_logs" ON public.akuche_activity_logs;
CREATE POLICY "Users manage own akuche_activity_logs"
  ON public.akuche_activity_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.akuche_activity_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  current_difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (current_difficulty IN ('beginner', 'intermediate', 'advanced')),
  enjoyment_score NUMERIC(3,2) NOT NULL DEFAULT 3.50,
  completions_count INTEGER NOT NULL DEFAULT 0,
  last_completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_akuche_activity_prefs_user_cat UNIQUE (user_id, category)
);

ALTER TABLE public.akuche_activity_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own akuche_activity_preferences" ON public.akuche_activity_preferences;
CREATE POLICY "Users manage own akuche_activity_preferences"
  ON public.akuche_activity_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Akuche Experience Sharing Stories (User-Approved Drafts)
CREATE TABLE IF NOT EXISTS public.akuche_shared_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL CHECK (
    milestone_type IN ('problem_solved', 'difficult_decision', 'business_breakthrough', 'personal_milestone', 'habit_developed', 'lesson_learned', 'challenge_overcome')
  ),
  format TEXT NOT NULL CHECK (
    format IN ('short_social', 'linkedin_reflection', 'whatsapp_status', 'personal_testimonial', 'before_after', 'anonymous_story')
  ),
  source_summary TEXT NOT NULL,
  generated_draft TEXT NOT NULL,
  edited_content TEXT NOT NULL,
  include_akuche_mention BOOLEAN NOT NULL DEFAULT false,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  user_approved BOOLEAN NOT NULL DEFAULT false,
  shared_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_akuche_shared_stories_user ON public.akuche_shared_stories(user_id, created_at DESC);

ALTER TABLE public.akuche_shared_stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own akuche_shared_stories" ON public.akuche_shared_stories;
CREATE POLICY "Users manage own akuche_shared_stories"
  ON public.akuche_shared_stories FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
