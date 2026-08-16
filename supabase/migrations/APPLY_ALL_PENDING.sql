-- Attribute a referral to a new user at profile creation time.
-- Idempotent, runs as the function owner (bypasses RLS), and can be called
-- by the authenticated user for their own account or by the service role.

CREATE OR REPLACE FUNCTION public.attribute_referral(p_user_id UUID, p_ref TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_id UUID;
BEGIN
  -- Only allow a user to attribute their own account; service_role (auth.uid() IS NULL) is allowed.
  IF auth.uid() IS NOT NULL AND auth.uid() <> p_user_id THEN
    RETURN;
  END IF;

  IF p_ref IS NULL OR btrim(p_ref) = '' THEN
    RETURN;
  END IF;

  -- Idempotent: never overwrite an existing attribution.
  IF EXISTS (SELECT 1 FROM profiles WHERE user_id = p_user_id AND referred_by IS NOT NULL) THEN
    RETURN;
  END IF;

  SELECT user_id INTO referrer_id
  FROM profiles
  WHERE referral_code = btrim(p_ref)
    AND onboarding_complete = true
  LIMIT 1;

  IF referrer_id IS NULL OR referrer_id = p_user_id THEN
    RETURN;
  END IF;

  UPDATE profiles
  SET referred_by = referrer_id
  WHERE user_id = p_user_id;

  UPDATE profiles
  SET referral_count = COALESCE(referral_count, 0) + 1
  WHERE user_id = referrer_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.attribute_referral(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.attribute_referral(UUID, TEXT) TO service_role;

-- Weekly leaderboard view: exposes per-user weekly XP plus display info to all
-- authenticated users. Runs as the view owner, so it bypasses RLS on
-- xp_ledger / profiles and returns every user's row for the leaderboard UI.
CREATE OR REPLACE VIEW public.leaderboard_weekly AS
SELECT
  l.user_id,
  COALESCE(NULLIF(p.name, ''), 'Anonymous') AS name,
  p.avatar_url,
  SUM(l.amount)::integer AS weekly_xp
FROM public.xp_ledger l
JOIN public.profiles p ON p.user_id = l.user_id
WHERE l.created_at >= (now() - interval '7 days')
GROUP BY l.user_id, p.name, p.avatar_url;

GRANT SELECT ON public.leaderboard_weekly TO authenticated;

-- Add locale column to user_settings (used by settings page + i18n provider).
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en';

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

-- ============================================================================
-- 00034_push_subscriptions.sql
-- Stores Web Push subscriptions per user for phone reminder notifications.
-- Each row is a full PushSubscription JSON payload used by the /api/push/send
-- server route (via web-push) to deliver notifications.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL UNIQUE,
  keys_json text NOT NULL,        -- { p256dh, auth } from the PushSubscription
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz
);

CREATE INDEX IF NOT EXISTS push_subscriptions_user_id_idx
  ON public.push_subscriptions (user_id);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own subscriptions.
CREATE POLICY "Users can view own push subscriptions"
  ON public.push_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own push subscriptions"
  ON public.push_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own push subscriptions"
  ON public.push_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 00035_fix_rls_and_referral_rewards.sql
-- ============================================================================
CREATE OR REPLACE FUNCTION public.grant_xp(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT,
  p_reference_type TEXT DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO xp_ledger (user_id, amount, reason, reference_type, reference_id)
  VALUES (p_user_id, p_amount, p_reason, p_reference_type, p_reference_id);

  UPDATE user_levels
  SET total_xp = total_xp + p_amount, updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.grant_xp(UUID, INTEGER, TEXT, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.grant_xp(UUID, INTEGER, TEXT, TEXT, UUID) TO service_role;

CREATE OR REPLACE FUNCTION public.grant_coins(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT,
  p_reference_type TEXT DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO coins_ledger (user_id, amount, reason, reference_type, reference_id)
  VALUES (p_user_id, p_amount, p_reason, p_reference_type, p_reference_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.grant_coins(UUID, INTEGER, TEXT, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.grant_coins(UUID, INTEGER, TEXT, TEXT, UUID) TO service_role;

-- ============================================================================
-- 00036_fix_signup_trigger_and_error_handling.sql
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (user_id, name, created_at, updated_at)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NULL),
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user profiles insert error: %', SQLERRM;
  END;

  BEGIN
    INSERT INTO public.user_settings (user_id, dark_mode, notifications_enabled, locale)
    VALUES (NEW.id, true, true, 'en')
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user settings insert error: %', SQLERRM;
  END;

  BEGIN
    INSERT INTO public.streaks (user_id, current_streak, longest_streak)
    VALUES (NEW.id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user streaks insert error: %', SQLERRM;
  END;

  BEGIN
    INSERT INTO public.user_levels (user_id, level, title, total_xp)
    VALUES (NEW.id, 1, 'Bronze', 0)
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user levels insert error: %', SQLERRM;
  END;

  BEGIN
    INSERT INTO public.subscriptions (user_id, status, plan_tier, current_period_start, current_period_end)
    VALUES (
      NEW.id,
      'trialing',
      'premium',
      NOW(),
      NOW() + INTERVAL '14 days'
    )
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user subscriptions insert error: %', SQLERRM;
  END;

  BEGIN
    INSERT INTO public.user_avatars (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user avatar insert error: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;


