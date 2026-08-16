-- ============================================================================
-- 00035_fix_rls_and_referral_rewards.sql
-- Fixes RLS security regression from 00028 and awards actual coins on referral
-- ============================================================================

-- 1. Subscriptions RLS: Users can SELECT their own subscription only.
-- All mutations (INSERT, UPDATE, DELETE) must be done via service_role / server endpoints.
DROP POLICY IF EXISTS "Subscriptions: users may access their own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can read own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Server can manage subscriptions" ON subscriptions;

CREATE POLICY "Users can view own subscription"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages subscriptions"
  ON subscriptions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 2. XP Ledger RLS: Users can SELECT their own XP history only.
-- Inserts must occur via SECURITY DEFINER functions (grant_xp) or service_role.
DROP POLICY IF EXISTS "XP ledger: users may access their own transactions" ON xp_ledger;
DROP POLICY IF EXISTS "Users can insert own XP" ON xp_ledger;
DROP POLICY IF EXISTS "Users can insert XP via function" ON xp_ledger;
DROP POLICY IF EXISTS "Users can view own XP" ON xp_ledger;
DROP POLICY IF EXISTS "Service role can insert XP" ON xp_ledger;

CREATE POLICY "Users can view own XP transactions"
  ON xp_ledger
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages XP ledger"
  ON xp_ledger
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 3. Coins Ledger RLS: Users can SELECT their own Coins history only.
-- Inserts must occur via SECURITY DEFINER functions (grant_coins) or service_role.
DROP POLICY IF EXISTS "Coins ledger: users may access their own transactions" ON coins_ledger;
DROP POLICY IF EXISTS "Users can insert own coins" ON coins_ledger;
DROP POLICY IF EXISTS "Users can view own coins" ON coins_ledger;
DROP POLICY IF EXISTS "Service role can insert coins" ON coins_ledger;

CREATE POLICY "Users can view own Coins transactions"
  ON coins_ledger
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages coins ledger"
  ON coins_ledger
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 4. User Levels RLS: Users can SELECT their own level only.
DROP POLICY IF EXISTS "System can manage levels" ON user_levels;
DROP POLICY IF EXISTS "Users can read own level" ON user_levels;
DROP POLICY IF EXISTS "Server can manage levels" ON user_levels;

CREATE POLICY "Users can view own level"
  ON user_levels
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages levels"
  ON user_levels
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 5. Safe grant_xp function (bypasses RLS via SECURITY DEFINER)
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

-- 6. Safe grant_coins function (bypasses RLS via SECURITY DEFINER)
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

-- 7. Update attribute_referral to credit 100 coins to referrer's coins_ledger
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
  WHERE UPPER(btrim(referral_code)) = UPPER(btrim(p_ref))
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

  -- Credit 100 coins to referrer
  PERFORM grant_coins(referrer_id, 100, 'referral_bonus', 'profiles', p_user_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.attribute_referral(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.attribute_referral(UUID, TEXT) TO service_role;
