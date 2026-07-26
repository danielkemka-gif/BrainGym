-- Migration 00022: Brain Momentum Score
-- A composite 0-100 score measuring training consistency and cognitive growth velocity

CREATE TABLE IF NOT EXISTS brain_momentum (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  previous_score INTEGER DEFAULT 0,
  streak_factor NUMERIC(5,2) DEFAULT 0,
  consistency_factor NUMERIC(5,2) DEFAULT 0,
  growth_factor NUMERIC(5,2) DEFAULT 0,
  engagement_factor NUMERIC(5,2) DEFAULT 0,
  score_date DATE NOT NULL DEFAULT CURRENT_DATE,
  calculated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, score_date)
);

CREATE INDEX IF NOT EXISTS idx_brain_momentum_user ON brain_momentum(user_id, calculated_at DESC);

-- RLS
ALTER TABLE brain_momentum ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own momentum" ON brain_momentum;
CREATE POLICY "Users can view own momentum" ON brain_momentum
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view all momentum for leaderboard" ON brain_momentum;
CREATE POLICY "Users can view all momentum for leaderboard" ON brain_momentum
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role can manage momentum" ON brain_momentum;
CREATE POLICY "Service role can manage momentum" ON brain_momentum
  FOR ALL USING (auth.role() = 'service_role');

-- Function to calculate Brain Momentum Score (0-100)
CREATE OR REPLACE FUNCTION calculate_momentum(p_user_id UUID)
RETURNS brain_momentum AS $$
DECLARE
  v_streak INTEGER := 0;
  v_consistency NUMERIC := 0;
  v_growth NUMERIC := 0;
  v_engagement NUMERIC := 0;
  v_total NUMERIC := 0;
  v_prev_score INTEGER := 0;
  v_result brain_momentum%ROWTYPE;
BEGIN
  -- Get current streak
  SELECT COALESCE(current_streak, 0) INTO v_streak
  FROM streaks WHERE user_id = p_user_id;

  -- Streak Factor (0-30): capped at 30-day streak for max score
  v_consistency := LEAST(COALESCE(v_streak, 0), 30) / 30.0 * 30;

  -- Consistency Factor (0-25): workouts in last 30 days
  SELECT COUNT(DISTINCT date) INTO v_consistency
  FROM workout_sessions
  WHERE user_id = p_user_id
    AND date >= CURRENT_DATE - interval '30 days';

  v_consistency := LEAST(v_consistency, 30) / 30.0 * 25;

  -- Growth Factor (0-25): compare avg brain score this week vs last week
  WITH this_week AS (
    SELECT COALESCE(AVG(score), 50) as avg_score
    FROM brain_scores
    WHERE user_id = p_user_id
      AND date >= CURRENT_DATE - interval '7 days'
  ),
  last_week AS (
    SELECT COALESCE(AVG(score), 50) as avg_score
    FROM brain_scores
    WHERE user_id = p_user_id
      AND date >= CURRENT_DATE - interval '14 days'
      AND date < CURRENT_DATE - interval '7 days'
  )
  SELECT
    GREATEST(0, LEAST(25, (tw.avg_score - lw.avg_score + 10) / 20.0 * 25))
  INTO v_growth
  FROM this_week tw, last_week lw;

  -- Engagement Factor (0-20): variety of activities in last 7 days
  SELECT COUNT(DISTINCT category_id) INTO v_engagement
  FROM activity_logs al
  JOIN activities a ON a.id = al.activity_id
  WHERE al.user_id = p_user_id
    AND al.date >= CURRENT_DATE - interval '7 days';

  v_engagement := LEAST(v_engagement, 7) / 7.0 * 20;

  -- Total momentum score
  v_total := GREATEST(0, LEAST(100, ROUND(v_consistency + v_growth + v_engagement)));

  -- Get previous score for trend
  SELECT score INTO v_prev_score
  FROM brain_momentum
  WHERE user_id = p_user_id
  ORDER BY calculated_at DESC
  LIMIT 1;

  -- Upsert momentum
  INSERT INTO brain_momentum (user_id, score, previous_score, streak_factor, consistency_factor, growth_factor, engagement_factor, score_date)
  VALUES (p_user_id, v_total, COALESCE(v_prev_score, 0), v_consistency, v_consistency, v_growth, v_engagement, CURRENT_DATE)
  ON CONFLICT (user_id, score_date) DO UPDATE
  SET score = v_total,
      previous_score = COALESCE(v_prev_score, 0),
      streak_factor = v_consistency,
      consistency_factor = v_consistency,
      growth_factor = v_growth,
      engagement_factor = v_engagement,
      calculated_at = now()
  RETURNING * INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get momentum trend (last 30 days)
CREATE OR REPLACE FUNCTION get_momentum_trend(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE(score INTEGER, calculated_at TIMESTAMPTZ) AS $$
BEGIN
  RETURN QUERY
  SELECT bm.score, bm.calculated_at
  FROM brain_momentum bm
  WHERE bm.user_id = p_user_id
    AND bm.calculated_at >= now() - (p_days || ' days')::interval
  ORDER BY bm.calculated_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to simulate momentum projections
CREATE OR REPLACE FUNCTION simulate_momentum(
  p_user_id UUID,
  p_days INTEGER,
  p_workout_frequency NUMERIC DEFAULT 0.7,
  p_intensity NUMERIC DEFAULT 1.0
)
RETURNS TABLE(day INTEGER, projected_score INTEGER, scenario TEXT) AS $$
DECLARE
  v_current_score INTEGER;
  v_day INTEGER;
  v_score NUMERIC;
  v_delta NUMERIC;
BEGIN
  SELECT COALESCE(score, 50) INTO v_current_score
  FROM brain_momentum
  WHERE user_id = p_user_id
  ORDER BY calculated_at DESC LIMIT 1;

  v_score := COALESCE(v_current_score, 50);

  FOR v_day IN 1..p_days LOOP
    IF random() < p_workout_frequency THEN
      v_delta := (0.5 + random() * 1.5) * p_intensity;
      v_score := LEAST(100, v_score + v_delta);
    ELSE
      v_delta := -0.3 - random() * 0.7;
      v_score := GREATEST(0, v_score + v_delta);
    END IF;

    projected_score := ROUND(v_score)::INTEGER;
    day := v_day;

    IF v_delta > 0 THEN
      scenario := 'training';
    ELSIF v_delta > -0.5 THEN
      scenario := 'resting';
    ELSE
      scenario := 'recovering';
    END IF;

    RETURN NEXT;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
