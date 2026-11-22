-- ============================================================================
-- Migration 00040: Security, RLS & Database Integrity Hardening
-- Safe, non-destructive, idempotent remediation of audited RLS, view, RPC,
-- constraint, and foreign-key issues. Preserves all existing user data.
-- ============================================================================

-- 1. Fix workout_sessions view so it enforces caller RLS (security_invoker = true)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'workout_sessions'
  ) THEN
    EXECUTE 'ALTER VIEW public.workout_sessions SET (security_invoker = true)';
  END IF;
END $$;

-- 2. Enable RLS on quest_templates (read-only for authenticated users, admin-managed)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'quest_templates'
  ) THEN
    ALTER TABLE public.quest_templates ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Anyone can read quest_templates" ON public.quest_templates;
    CREATE POLICY "Anyone can read quest_templates"
      ON public.quest_templates FOR SELECT
      USING (true);
    DROP POLICY IF EXISTS "Service role manages quest_templates" ON public.quest_templates;
    CREATE POLICY "Service role manages quest_templates"
      ON public.quest_templates FOR ALL
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;

-- 3. Tighten weekly_reports INSERT policy (remove insecure WITH CHECK (true))
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'weekly_reports'
  ) THEN
    DROP POLICY IF EXISTS "Users can insert own weekly reports" ON public.weekly_reports;
    DROP POLICY IF EXISTS "System can insert weekly reports" ON public.weekly_reports;
    CREATE POLICY "Users can insert own weekly reports"
      ON public.weekly_reports FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 4. Tighten achievements policies (remove self-grant FOR ALL; read own + service role writes)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'achievements'
  ) THEN
    DROP POLICY IF EXISTS "Achievements: users may access their own achievements" ON public.achievements;
    DROP POLICY IF EXISTS "Users can earn achievements" ON public.achievements;
    DROP POLICY IF EXISTS "Users can view own achievements" ON public.achievements;
    CREATE POLICY "Users can view own achievements"
      ON public.achievements FOR SELECT
      USING (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Service role manages achievements" ON public.achievements;
    CREATE POLICY "Service role manages achievements"
      ON public.achievements FOR ALL
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;

-- 5. Fix infinite RLS recursion (42P17) on challenge_participants using SECURITY DEFINER helper
CREATE OR REPLACE FUNCTION public.is_challenge_participant(p_challenge_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.challenge_participants
    WHERE challenge_id = p_challenge_id
      AND user_id = p_user_id
  );
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'challenge_participants'
  ) THEN
    DROP POLICY IF EXISTS "Users can view challenge participants" ON public.challenge_participants;
    CREATE POLICY "Users can view challenge participants"
      ON public.challenge_participants FOR SELECT
      USING (
        user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.challenges c
          WHERE c.id = challenge_participants.challenge_id AND c.is_public = true
        )
        OR public.is_challenge_participant(challenge_participants.challenge_id, auth.uid())
      );
  END IF;
END $$;

-- 6. Add missing UPDATE RLS policies blocking legitimate user operations
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'push_subscriptions') THEN
    DROP POLICY IF EXISTS "Users can update own push subscriptions" ON public.push_subscriptions;
    CREATE POLICY "Users can update own push subscriptions"
      ON public.push_subscriptions FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'smart_reminders') THEN
    DROP POLICY IF EXISTS "Users can update own smart reminders" ON public.smart_reminders;
    CREATE POLICY "Users can update own smart reminders"
      ON public.smart_reminders FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'daily_quests') THEN
    DROP POLICY IF EXISTS "Users can update own daily quests" ON public.daily_quests;
    CREATE POLICY "Users can update own daily quests"
      ON public.daily_quests FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_identities') THEN
    DROP POLICY IF EXISTS "Users can update own identities" ON public.user_identities;
    CREATE POLICY "Users can update own identities"
      ON public.user_identities FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 7. Expand akuche_conversations.mode CHECK constraint to support all coaching & domain modes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'akuche_conversations') THEN
    ALTER TABLE public.akuche_conversations
      DROP CONSTRAINT IF EXISTS akuche_conversations_mode_check;
    ALTER TABLE public.akuche_conversations
      ADD CONSTRAINT akuche_conversations_mode_check CHECK (
        mode IN (
          'coaching_chat',
          'devils_advocate',
          'decision_lab',
          'thinking_mirror',
          'real_life_gym',
          'brain_coach',
          'business_intelligence',
          'career_intelligence',
          'youth_intelligence',
          'everyday_intelligence',
          'clarity',
          'problem_solving',
          'decision',
          'strategy',
          'action',
          'accountability',
          'reflection',
          'mental_fitness'
        )
      );
  END IF;
END $$;

-- 8. Harden SECURITY DEFINER RPCs with strict auth.uid() authorization + bounded amounts + search_path
CREATE OR REPLACE FUNCTION public.grant_xp(
  p_user_id uuid,
  p_amount integer,
  p_reason text DEFAULT 'activity',
  p_reference_type text DEFAULT NULL,
  p_reference_id uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_role text := auth.role();
  v_clamped integer;
  v_new_total integer;
  v_new_level smallint;
  v_new_title text;
BEGIN
  IF v_role <> 'service_role' AND (v_caller IS NULL OR v_caller <> p_user_id) THEN
    RAISE EXCEPTION 'Forbidden: cannot grant XP to another user';
  END IF;

  IF p_amount IS NULL OR p_amount <= 0 THEN
    RETURN;
  END IF;

  -- Cap single non-service-role grants to prevent client economy tampering
  v_clamped := CASE WHEN v_role = 'service_role' THEN p_amount ELSE LEAST(p_amount, 250) END;

  INSERT INTO public.xp_ledger (user_id, amount, reason, reference_type, reference_id)
  VALUES (p_user_id, v_clamped, COALESCE(p_reason, 'activity'), p_reference_type, p_reference_id);

  SELECT COALESCE(SUM(amount), 0) INTO v_new_total
  FROM public.xp_ledger
  WHERE user_id = p_user_id;

  v_new_level := GREATEST(1, FLOOR(SQRT(v_new_total::numeric / 100.0))::smallint + 1);
  v_new_title := CASE
    WHEN v_new_level >= 25 THEN 'Mastermind'
    WHEN v_new_level >= 15 THEN 'Diamond'
    WHEN v_new_level >= 10 THEN 'Gold'
    WHEN v_new_level >= 5 THEN 'Silver'
    ELSE 'Bronze'
  END;

  INSERT INTO public.user_levels (user_id, level, title, total_xp, updated_at)
  VALUES (p_user_id, v_new_level, v_new_title, v_new_total, now())
  ON CONFLICT (user_id) DO UPDATE
  SET level = EXCLUDED.level,
      title = EXCLUDED.title,
      total_xp = EXCLUDED.total_xp,
      updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.grant_coins(
  p_user_id uuid,
  p_amount integer,
  p_reason text DEFAULT 'activity',
  p_reference_type text DEFAULT NULL,
  p_reference_id uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_role text := auth.role();
  v_clamped integer;
BEGIN
  IF v_role <> 'service_role' AND (v_caller IS NULL OR v_caller <> p_user_id) THEN
    RAISE EXCEPTION 'Forbidden: cannot grant coins to another user';
  END IF;

  IF p_amount IS NULL OR p_amount = 0 THEN
    RETURN;
  END IF;

  v_clamped := CASE
    WHEN v_role = 'service_role' THEN p_amount
    WHEN p_amount > 0 THEN LEAST(p_amount, 100)
    ELSE GREATEST(p_amount, -500)
  END;

  INSERT INTO public.coins_ledger (user_id, amount, reason, reference_type, reference_id)
  VALUES (p_user_id, v_clamped, COALESCE(p_reason, 'activity'), p_reference_type, p_reference_id);
END;
$$;

-- Restrict increment_referral_count to service_role only (prevents self-inflation)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'increment_referral_count'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.increment_referral_count(uuid) FROM authenticated, anon, public;
    GRANT EXECUTE ON FUNCTION public.increment_referral_count(uuid) TO service_role;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- 9. Fix get_current_week_start volatility (was IMMUTABLE despite CURRENT_DATE)
CREATE OR REPLACE FUNCTION public.get_current_week_start()
RETURNS date
LANGUAGE sql
STABLE
AS $$
  SELECT date_trunc('week', CURRENT_DATE)::date;
$$;

-- 10. Fix account deletion FK traps (referred_by & winner_id ON DELETE SET NULL)
DO $$
DECLARE
  v_constraint text;
BEGIN
  SELECT tc.constraint_name INTO v_constraint
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
  WHERE tc.table_schema = 'public'
    AND tc.table_name = 'profiles'
    AND kcu.column_name = 'referred_by'
    AND tc.constraint_type = 'FOREIGN KEY'
  LIMIT 1;

  IF v_constraint IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.profiles DROP CONSTRAINT %I', v_constraint);
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_referred_by_fkey
      FOREIGN KEY (referred_by) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  v_constraint := NULL;
  SELECT tc.constraint_name INTO v_constraint
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
  WHERE tc.table_schema = 'public'
    AND tc.table_name = 'friend_duels'
    AND kcu.column_name = 'winner_id'
    AND tc.constraint_type = 'FOREIGN KEY'
  LIMIT 1;

  IF v_constraint IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.friend_duels DROP CONSTRAINT %I', v_constraint);
    ALTER TABLE public.friend_duels
      ADD CONSTRAINT friend_duels_winner_id_fkey
      FOREIGN KEY (winner_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;
