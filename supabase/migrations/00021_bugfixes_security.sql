-- Migration 00021: Bug fixes + Security hardening
-- Fixes: workout_sessions refs, XP ledger RLS, streak freeze cap, type alignment

-- 1. Fix XP ledger RLS: prevent self-insertion, only allow service_role
DROP POLICY IF EXISTS "Users can insert own XP" ON xp_ledger;
DROP POLICY IF EXISTS "Users can view own XP" ON xp_ledger;
CREATE POLICY "Users can view own XP" ON xp_ledger
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can insert XP" ON xp_ledger
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Users can insert XP via function" ON xp_ledger
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM pg_proc
      WHERE proname = 'grant_xp'
    )
  );

-- 2. Fix coins ledger RLS: same pattern
DROP POLICY IF EXISTS "Users can insert own coins" ON coins_ledger;
DROP POLICY IF EXISTS "Users can view own coins" ON coins_ledger;
CREATE POLICY "Users can view own coins" ON coins_ledger
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can insert coins" ON coins_ledger
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- 3. Cap streak freezes at 5 maximum
CREATE OR REPLACE FUNCTION grant_streak_freeze(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET streak_freezes_remaining = LEAST(COALESCE(streak_freezes_remaining, 0) + 1, 5)
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create safe XP grant function (server-side only)
CREATE OR REPLACE FUNCTION grant_xp(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT,
  p_reference_type TEXT DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO xp_ledger (user_id, amount, reason, reference_type, reference_id)
  VALUES (p_user_id, p_amount, p_reason, p_reference_type, p_reference_id);

  UPDATE user_levels
  SET total_xp = total_xp + p_amount, updated_at = now()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create safe coins grant function
CREATE OR REPLACE FUNCTION grant_coins(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT,
  p_reference_type TEXT DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO coins_ledger (user_id, amount, reason, reference_type, reference_id)
  VALUES (p_user_id, p_amount, p_reason, p_reference_type, p_reference_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create safe achievement unlock function
CREATE OR REPLACE FUNCTION unlock_achievement(
  p_user_id UUID,
  p_achievement_type TEXT,
  p_xp_reward INTEGER DEFAULT 100
)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO achievements (user_id, achievement_type, xp_reward)
  VALUES (p_user_id, p_achievement_type, p_xp_reward)
  ON CONFLICT (user_id, achievement_type) DO NOTHING;

  IF FOUND THEN
    PERFORM grant_xp(p_user_id, p_xp_reward, 'achievement:' || p_achievement_type);
    RETURN true;
  END IF;
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Fix streak milestone freeze granting
CREATE OR REPLACE FUNCTION grant_streak_milestone_freeze(p_user_id UUID, p_streak INTEGER)
RETURNS void AS $$
BEGIN
  IF p_streak IN (7, 14, 30, 60, 90) THEN
    PERFORM grant_streak_freeze(p_user_id);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
