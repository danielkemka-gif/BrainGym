-- Migration 00026: Fix workout_sessions reference + cleanup
-- workout_sessions is referenced by many components but the actual table is daily_workouts
-- Create a view so both names work

CREATE OR REPLACE VIEW workout_sessions AS
SELECT
  id,
  user_id,
  date,
  status,
  total_xp,
  total_coins,
  started_at,
  completed_at,
  created_at
FROM daily_workouts;

-- Also clean up: the streak_freezes table from migration 00013 needs proper RLS
-- (already has RLS from 00013, but let's ensure grant function works)
-- Update streak_freezes_remaining to use the capped version
CREATE OR REPLACE FUNCTION grant_streak_freeze(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET streak_freezes_remaining = LEAST(COALESCE(streak_freezes_remaining, 0) + 1, 5)
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure xp_ledger has the correct columns (amount, not xp_amount)
-- Verify the column name and fix if needed
DO $$ BEGIN
  ALTER TABLE xp_ledger RENAME COLUMN xp_amount TO amount;
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE coins_ledger RENAME COLUMN coin_amount TO amount;
EXCEPTION WHEN undefined_column THEN NULL;
END $$;
