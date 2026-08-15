-- ============================================================================
-- 00033_streak_milestones.sql
-- Streak milestones + rewards. Stores claimed milestones so the reward for a
-- streak length (7/14/30/60/100 days) is granted exactly once per user.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.streak_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone integer NOT NULL CHECK (milestone > 0),
  claimed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, milestone)
);

ALTER TABLE public.streak_milestones ENABLE ROW LEVEL SECURITY;

-- Users can only see and claim their own milestones.
CREATE POLICY "Users can view own streak milestones"
  ON public.streak_milestones
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can claim their own streak milestones"
  ON public.streak_milestones
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
