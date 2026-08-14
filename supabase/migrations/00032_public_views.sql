-- ============================================================================
-- 00032_public_views.sql
-- RLS-safe read access to OTHER users' display info for social features.
-- Views run as their owner (postgres), so they bypass row-level security on
-- profiles / streaks while exposing only display-safe columns.
-- ============================================================================

-- 1) Display-safe profile info for all users (chat, duels, partners, challenges)
CREATE OR REPLACE VIEW public.profiles_public AS
SELECT
  p.user_id,
  p.name,
  p.username,
  p.avatar_url
FROM public.profiles p;

GRANT SELECT ON public.profiles_public TO authenticated;

-- 2) Current streak for all users (partner / duel cards)
CREATE OR REPLACE VIEW public.streaks_public AS
SELECT
  s.user_id,
  s.current_streak
FROM public.streaks s;

GRANT SELECT ON public.streaks_public TO authenticated;

-- ============================================================================
-- 3) Fix challenge RLS policies.
-- 00012's challenge_daily_progress policy referenced a `user_id` column that
-- does not exist on that table (it only has participant_id), so the migration
-- would have failed. Replace it with a correct policy, and allow participants
-- to view their own challenge's participant list (needed for private duels).
-- ============================================================================

DROP POLICY IF EXISTS "Users can view challenge progress" ON challenge_daily_progress;
DROP POLICY IF EXISTS "Users can view own or public challenge progress" ON challenge_daily_progress;
CREATE POLICY "Users can view own or public challenge progress" ON challenge_daily_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM challenge_participants cp
      WHERE cp.id = participant_id
        AND (cp.user_id = auth.uid()
          OR EXISTS (SELECT 1 FROM challenges c WHERE c.id = cp.challenge_id AND c.is_public = true))
    )
  );

DROP POLICY IF EXISTS "Users can view participants" ON challenge_participants;
DROP POLICY IF EXISTS "Users can view public challenge participants" ON challenge_participants;
CREATE POLICY "Users can view challenge participants" ON challenge_participants
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM challenges c WHERE c.id = challenge_id AND c.is_public = true)
    OR EXISTS (SELECT 1 FROM challenge_participants cp WHERE cp.challenge_id = challenge_id AND cp.user_id = auth.uid())
  );
