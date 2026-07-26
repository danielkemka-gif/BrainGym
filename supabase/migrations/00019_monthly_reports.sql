-- Monthly Reports table
CREATE TABLE IF NOT EXISTS monthly_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  avg_score NUMERIC(5,1) DEFAULT 0,
  score_change NUMERIC(5,1) DEFAULT 0,
  activities_completed INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  total_coins INTEGER DEFAULT 0,
  workouts_completed INTEGER DEFAULT 0,
  top_category TEXT,
  weakest_category TEXT,
  improvement_pct NUMERIC(5,1) DEFAULT 0,
  narrative TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, month)
);

CREATE INDEX IF NOT EXISTS idx_monthly_reports_user ON monthly_reports(user_id, month DESC);

-- RLS
ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own monthly reports" ON monthly_reports;
CREATE POLICY "Users can view own monthly reports" ON monthly_reports
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage monthly reports" ON monthly_reports;
CREATE POLICY "Service role can manage monthly reports" ON monthly_reports
  FOR ALL USING (auth.role() = 'service_role');

-- Function to generate monthly report
CREATE OR REPLACE FUNCTION generate_monthly_report(
  p_user_id UUID,
  p_month DATE
)
RETURNS monthly_reports AS $$
DECLARE
  v_start DATE := date_trunc('month', p_month)::date;
  v_end DATE := (date_trunc('month', p_month) + interval '1 month - 1 day')::date;
  v_prev_start DATE := (date_trunc('month', p_month) - interval '1 month')::date;
  v_prev_end DATE := (date_trunc('month', p_month) - interval '1 day')::date;
  v_report monthly_reports%ROWTYPE;
  v_avg_score NUMERIC(5,1);
  v_prev_avg NUMERIC(5,1);
  v_activities INTEGER;
  v_streak INTEGER;
  v_xp INTEGER;
  v_coins INTEGER;
  v_workouts INTEGER;
  v_top_cat TEXT;
  v_weak_cat TEXT;
BEGIN
  -- Current month stats
  SELECT COALESCE(AVG(score), 0) INTO v_avg_score
  FROM brain_scores
  WHERE user_id = p_user_id AND date BETWEEN v_start AND v_end;

  SELECT COUNT(*) INTO v_activities
  FROM activity_logs
  WHERE user_id = p_user_id AND date BETWEEN v_start AND v_end;

  SELECT COALESCE(SUM(amount), 0) INTO v_xp
  FROM xp_ledger
  WHERE user_id = p_user_id AND created_at::date BETWEEN v_start AND v_end;

  SELECT COALESCE(SUM(amount), 0) INTO v_coins
  FROM coins_ledger
  WHERE user_id = p_user_id AND created_at::date BETWEEN v_start AND v_end;

  SELECT COUNT(*) INTO v_workouts
  FROM workout_sessions
  WHERE user_id = p_user_id AND completed_at::date BETWEEN v_start AND v_end;

  -- Streak days in month
  SELECT COUNT(DISTINCT date) INTO v_streak
  FROM workout_sessions
  WHERE user_id = p_user_id AND completed_at::date BETWEEN v_start AND v_end;

  -- Top and weakest category
  SELECT c.slug INTO v_top_cat
  FROM brain_scores bs
  JOIN categories c ON c.id = bs.category_id
  WHERE bs.user_id = p_user_id AND bs.date BETWEEN v_start AND v_end
  GROUP BY c.slug
  ORDER BY AVG(bs.score) DESC
  LIMIT 1;

  SELECT c.slug INTO v_weak_cat
  FROM brain_scores bs
  JOIN categories c ON c.id = bs.category_id
  WHERE bs.user_id = p_user_id AND bs.date BETWEEN v_start AND v_end
  GROUP BY c.slug
  ORDER BY AVG(bs.score) ASC
  LIMIT 1;

  -- Previous month avg for comparison
  SELECT COALESCE(AVG(score), 0) INTO v_prev_avg
  FROM brain_scores
  WHERE user_id = p_user_id AND date BETWEEN v_prev_start AND v_prev_end;

  -- Upsert report
  INSERT INTO monthly_reports (user_id, month, avg_score, score_change, activities_completed, streak_days, total_xp, total_coins, workouts_completed, top_category, weakest_category, improvement_pct, narrative)
  VALUES (
    p_user_id,
    v_start,
    v_avg_score,
    v_avg_score - v_prev_avg,
    v_activities,
    v_streak,
    v_xp,
    v_coins,
    v_workouts,
    COALESCE(v_top_cat, 'memory'),
    COALESCE(v_weak_cat, 'memory'),
    CASE WHEN v_prev_avg > 0 THEN ROUND(((v_avg_score - v_prev_avg) / v_prev_avg * 100)::numeric, 1) ELSE 0 END,
    'Monthly report generated on ' || CURRENT_DATE::text
  )
  ON CONFLICT (user_id, month) DO UPDATE SET
    avg_score = EXCLUDED.avg_score,
    score_change = EXCLUDED.score_change,
    activities_completed = EXCLUDED.activities_completed,
    streak_days = EXCLUDED.streak_days,
    total_xp = EXCLUDED.total_xp,
    total_coins = EXCLUDED.total_coins,
    workouts_completed = EXCLUDED.workouts_completed,
    top_category = EXCLUDED.top_category,
    weakest_category = EXCLUDED.weakest_category,
    improvement_pct = EXCLUDED.improvement_pct,
    narrative = EXCLUDED.narrative
  RETURNING * INTO v_report;

  RETURN v_report;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
