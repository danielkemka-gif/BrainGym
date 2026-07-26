-- Leagues & Rankings system
-- Weekly competitive tiers based on XP earned in the current week

-- League tier enum
DO $$ BEGIN
  CREATE TYPE league_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond', 'mastermind');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- User league assignments (one active row per user per week)
CREATE TABLE IF NOT EXISTS user_leagues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  league league_tier NOT NULL DEFAULT 'bronze',
  week_start DATE NOT NULL,
  weekly_xp INTEGER NOT NULL DEFAULT 0,
  promoted BOOLEAN NOT NULL DEFAULT false,
  relegated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, week_start)
);

CREATE INDEX IF NOT EXISTS idx_user_leagues_week ON user_leagues(week_start DESC, league, weekly_xp DESC);
CREATE INDEX IF NOT EXISTS idx_user_leagues_user ON user_leagues(user_id, week_start DESC);

-- Weekly league snapshots (end-of-week record)
CREATE TABLE IF NOT EXISTS league_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_start DATE NOT NULL,
  league league_tier NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weekly_xp INTEGER NOT NULL DEFAULT 0,
  final_rank INTEGER NOT NULL,
  promoted BOOLEAN NOT NULL DEFAULT false,
  relegated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(week_start, league, user_id)
);

CREATE INDEX IF NOT EXISTS idx_league_snapshots_week ON league_snapshots(week_start DESC, league, final_rank);

-- RLS policies
ALTER TABLE user_leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_snapshots ENABLE ROW LEVEL SECURITY;

-- Users can read their own league data
DROP POLICY IF EXISTS "Users can view own league" ON user_leagues;
CREATE POLICY "Users can view own league" ON user_leagues
  FOR SELECT USING (auth.uid() = user_id);

-- Users can read all league data for leaderboard display
DROP POLICY IF EXISTS "Users can view all leagues for leaderboard" ON user_leagues;
CREATE POLICY "Users can view all leagues for leaderboard" ON user_leagues
  FOR SELECT USING (true);

-- Service role can manage leagues
DROP POLICY IF EXISTS "Service role can manage leagues" ON user_leagues;
CREATE POLICY "Service role can manage leagues" ON user_leagues
  FOR ALL USING (auth.role() = 'service_role');

-- Snapshots: users can read all
DROP POLICY IF EXISTS "Users can view league snapshots" ON league_snapshots;
CREATE POLICY "Users can view league snapshots" ON league_snapshots
  FOR SELECT USING (true);

-- Snapshots: service role can manage
DROP POLICY IF EXISTS "Service role can manage snapshots" ON league_snapshots;
CREATE POLICY "Service role can manage snapshots" ON league_snapshots
  FOR ALL USING (auth.role() = 'service_role');

-- Function to get current week start (Monday)
CREATE OR REPLACE FUNCTION get_current_week_start()
RETURNS DATE AS $$
  SELECT (date_trunc('week', CURRENT_DATE))::date;
$$ LANGUAGE sql IMMUTABLE;

-- Function to calculate league for a given weekly XP
CREATE OR REPLACE FUNCTION calculate_league(weekly_xp INTEGER)
RETURNS league_tier AS $$
BEGIN
  IF weekly_xp >= 2000 THEN RETURN 'mastermind';
  ELSIF weekly_xp >= 1500 THEN RETURN 'diamond';
  ELSIF weekly_xp >= 1000 THEN RETURN 'platinum';
  ELSIF weekly_xp >= 600 THEN RETURN 'gold';
  ELSIF weekly_xp >= 300 THEN RETURN 'silver';
  ELSE RETURN 'bronze';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to promote/relegate users based on weekly performance
-- Top 20% promote, bottom 20% demote, middle 60% stay
CREATE OR REPLACE FUNCTION process_weekly_league_rotation(p_week_start DATE)
RETURNS void AS $$
DECLARE
  v_tier RECORD;
  v_boundary RECORD;
  v_count INTEGER;
  v_promote_cutoff INTEGER;
  v_relegate_cutoff INTEGER;
BEGIN
  -- Create snapshot for each league tier
  FOR v_tier IN SELECT DISTINCT league FROM user_leagues WHERE week_start = p_week_start
  LOOP
    -- Get count and boundaries for this tier
    SELECT count(*) INTO v_count
    FROM user_leagues
    WHERE week_start = p_week_start AND league = v_tier.league;

    -- Need at least 5 users in a tier for promotion/relegation
    IF v_count >= 5 THEN
      v_promote_cutoff := GREATEST(1, CEIL(v_count * 0.2));
      v_relegate_cutoff := GREATEST(1, FLOOR(v_count * 0.2));

      -- Get promotion threshold (XP of the last person who promotes)
      SELECT weekly_xp INTO v_boundary
      FROM (
        SELECT weekly_xp, ROW_NUMBER() OVER (ORDER BY weekly_xp DESC) as rn
        FROM user_leagues
        WHERE week_start = p_week_start AND league = v_tier.league
      ) sub
      WHERE rn = v_promote_cutoff;

      -- Snapshot + mark promoted
      INSERT INTO league_snapshots (week_start, league, user_id, weekly_xp, final_rank, promoted, relegated)
      SELECT p_week_start, league, user_id, weekly_xp,
        ROW_NUMBER() OVER (ORDER BY weekly_xp DESC),
        weekly_xp >= v_boundary,
        false
      FROM user_leagues
      WHERE week_start = p_week_start AND league = v_tier.league
      ON CONFLICT (week_start, league, user_id) DO NOTHING;

      -- Get relegation threshold (XP of the first person who gets relegated)
      SELECT weekly_xp INTO v_boundary
      FROM (
        SELECT weekly_xp, ROW_NUMBER() OVER (ORDER BY weekly_xp ASC) as rn
        FROM user_leagues
        WHERE week_start = p_week_start AND league = v_tier.league
      ) sub
      WHERE rn = v_relegate_cutoff;

      -- Update relegated in snapshot
      UPDATE league_snapshots
      SET relegated = true
      WHERE week_start = p_week_start AND league = v_tier.league
        AND weekly_xp <= v_boundary
        AND promoted = false;
    ELSE
      -- Not enough users, just snapshot without promotion/relegation
      INSERT INTO league_snapshots (week_start, league, user_id, weekly_xp, final_rank, promoted, relegated)
      SELECT p_week_start, league, user_id, weekly_xp,
        ROW_NUMBER() OVER (ORDER BY weekly_xp DESC),
        false,
        false
      FROM user_leagues
      WHERE week_start = p_week_start AND league = v_tier.league
      ON CONFLICT (week_start, league, user_id) DO NOTHING;
    END IF;
  END LOOP;

  -- Create next week's assignments based on promotion/relegation
  INSERT INTO user_leagues (user_id, league, week_start, weekly_xp, promoted, relegated)
  SELECT
    ls.user_id,
    CASE
      WHEN ls.promoted THEN
        CASE ls.league
          WHEN 'bronze' THEN 'silver'::league_tier
          WHEN 'silver' THEN 'gold'::league_tier
          WHEN 'gold' THEN 'platinum'::league_tier
          WHEN 'platinum' THEN 'diamond'::league_tier
          WHEN 'diamond' THEN 'mastermind'::league_tier
          WHEN 'mastermind' THEN 'mastermind'::league_tier
        END
      WHEN ls.relegated THEN
        CASE ls.league
          WHEN 'mastermind' THEN 'diamond'::league_tier
          WHEN 'diamond' THEN 'platinum'::league_tier
          WHEN 'platinum' THEN 'gold'::league_tier
          WHEN 'gold' THEN 'silver'::league_tier
          WHEN 'silver' THEN 'bronze'::league_tier
          WHEN 'bronze' THEN 'bronze'::league_tier
        END
      ELSE ls.league
    END,
    p_week_start + 7,
    0,
    ls.promoted,
    ls.relegated
  FROM league_snapshots ls
  WHERE ls.week_start = p_week_start
  ON CONFLICT (user_id, week_start) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to upsert user's weekly league entry
CREATE OR REPLACE FUNCTION upsert_user_league(
  p_user_id UUID,
  p_weekly_xp INTEGER
)
RETURNS league_tier AS $$
DECLARE
  v_week_start DATE;
  v_league league_tier;
BEGIN
  v_week_start := get_current_week_start();
  v_league := calculate_league(p_weekly_xp);

  INSERT INTO user_leagues (user_id, league, week_start, weekly_xp)
  VALUES (p_user_id, v_league, v_week_start, p_weekly_xp)
  ON CONFLICT (user_id, week_start) DO UPDATE
  SET weekly_xp = p_weekly_xp,
      league = v_league,
      updated_at = now();

  RETURN v_league;
END;
$$ LANGUAGE plpgsql;
