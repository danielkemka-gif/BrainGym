-- ============================================================================
-- 00012_security_hardening.sql
-- Critical security fixes for BrainGym RLS policies
-- ============================================================================

-- ============================================================================
-- FIX 1: Admin role — replace exploitable is_admin()
-- The old function read auth.users.raw_user_meta_data->>'role' which users
-- can self-set via the Supabase client, granting themselves admin access.
-- ============================================================================

-- Drop the exploitable function first (before any policy drops that reference it)
DROP FUNCTION IF EXISTS public.is_admin();

-- Create secure admins table
CREATE TABLE IF NOT EXISTS public.admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Only service_role can manage admins
CREATE POLICY "Service role manages admins" ON admins
  FOR ALL USING (auth.role() = 'service_role');

-- Users can check if they are admin (read-only)
CREATE POLICY "Users can check admin status" ON admins
  FOR SELECT USING (user_id = auth.uid());

-- New secure is_admin function — reads from the admins table, not user metadata
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;

-- ============================================================================
-- FIX 2: Drop ALL permissive RLS policies and replace with secure ones
-- Tables where USING(true) or WITH CHECK(true) allowed any authenticated user
-- to insert/modify rows belonging to other users.
-- ============================================================================

-- 2a) xp_ledger — anyone could insert XP for any user
DROP POLICY IF EXISTS "System can insert XP" ON xp_ledger;
CREATE POLICY "Users can insert own XP" ON xp_ledger
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Server can insert XP" ON xp_ledger
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- 2b) coins_ledger — anyone could insert coins for any user
DROP POLICY IF EXISTS "System can insert coins" ON coins_ledger;
CREATE POLICY "Users can insert own coins" ON coins_ledger
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Server can insert coins" ON coins_ledger
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- 2c) user_levels — USING(true) on ALL allowed full CRUD by any user
DROP POLICY IF EXISTS "System can manage levels" ON user_levels;
CREATE POLICY "Users can read own level" ON user_levels
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Server can manage levels" ON user_levels
  FOR ALL USING (auth.role() = 'service_role');

-- 2d) subscriptions — USING(true) on ALL allowed full CRUD by any user
DROP POLICY IF EXISTS "System can manage subscriptions" ON subscriptions;
CREATE POLICY "Users can read own subscription" ON subscriptions
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Server can manage subscriptions" ON subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- 2e) ai_feedback — WITH CHECK(true) allowed any user to insert feedback for others
DROP POLICY IF EXISTS "System can create feedback" ON ai_feedback;
CREATE POLICY "Users can insert own feedback" ON ai_feedback
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Server can manage feedback" ON ai_feedback
  FOR ALL USING (auth.role() = 'service_role');

-- 2f) notifications — WITH CHECK(true) allowed any user to create notifications for others
DROP POLICY IF EXISTS "System can create notifications" ON notifications;
CREATE POLICY "Users can insert own notifications" ON notifications
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Server can manage notifications" ON notifications
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- FIX 3: Tighten challenge RLS
-- challenge_participants SELECT used USING(true) — exposed private challenge members
-- challenge_daily_progress SELECT only checked participation existence, not ownership
-- ============================================================================

-- 3a) challenge_participants — restrict to public challenges or own record
DROP POLICY IF EXISTS "Users can view participants" ON challenge_participants;
CREATE POLICY "Users can view public challenge participants" ON challenge_participants
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM challenges WHERE id = challenge_id AND is_public = true)
    OR user_id = auth.uid()
  );

-- 3b) challenge_daily_progress — restrict to own progress or participants in public challenges
DROP POLICY IF EXISTS "Users can view challenge progress" ON challenge_daily_progress;
CREATE POLICY "Users can view own or public challenge progress" ON challenge_daily_progress
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM challenge_participants cp
      JOIN challenges c ON c.id = cp.challenge_id
      WHERE cp.id = participant_id AND c.is_public = true
    )
  );

-- ============================================================================
-- FIX 4: Input bounds on SECURITY DEFINER functions
-- Unbounded LIMIT / array parameters can cause DoS via excessive resource usage.
-- ============================================================================

-- get_chat_messages: p_limit has no upper bound
-- Manual review needed: apply LEAST(p_limit, 100) to the LIMIT clause
-- and add a comment inside the function.

-- get_chat_reactions: p_message_ids array has no size limit
-- Manual review needed: add array_length(p_message_ids, 1) <= 100 guard.

-- ============================================================================
-- FIX 5: Chat message length constraint
-- Prevent abuse via extremely long messages
-- ============================================================================

DO $$ BEGIN
  ALTER TABLE chat_messages ADD CONSTRAINT chat_content_length CHECK (length(content) <= 2000);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
