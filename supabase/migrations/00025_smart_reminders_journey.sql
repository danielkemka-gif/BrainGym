-- Migration 00025: Smart Reminders + Enhanced Streak Protection

-- Smart Reminders table
CREATE TABLE IF NOT EXISTS smart_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_smart_reminders_user ON smart_reminders(user_id, scheduled_for DESC);
CREATE INDEX IF NOT EXISTS idx_smart_reminders_unsent ON smart_reminders(user_id, sent_at) WHERE sent_at IS NULL;

-- Streak Freeze purchases
CREATE TABLE IF NOT EXISTS streak_freeze_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  freeze_count INTEGER NOT NULL DEFAULT 1,
  coins_spent INTEGER NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 365-Day Journey snapshots (cached yearly data)
CREATE TABLE IF NOT EXISTS journey_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  workouts_count INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  total_coins INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  brain_score_avg NUMERIC(5,2) DEFAULT 0,
  level_start INTEGER DEFAULT 1,
  level_end INTEGER DEFAULT 1,
  achievements_unlocked INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, year, month)
);

CREATE INDEX IF NOT EXISTS idx_journey_snapshots_user ON journey_snapshots(user_id, year, month);

-- RLS
ALTER TABLE smart_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_freeze_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own reminders" ON smart_reminders;
CREATE POLICY "Users can view own reminders" ON smart_reminders
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage reminders" ON smart_reminders;
CREATE POLICY "Service role can manage reminders" ON smart_reminders
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can view own freeze purchases" ON streak_freeze_purchases;
CREATE POLICY "Users can view own freeze purchases" ON streak_freeze_purchases
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own freeze purchases" ON streak_freeze_purchases;
CREATE POLICY "Users can insert own freeze purchases" ON streak_freeze_purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own journey" ON journey_snapshots;
CREATE POLICY "Users can view own journey" ON journey_snapshots
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage journey" ON journey_snapshots;
CREATE POLICY "Service role can manage journey" ON journey_snapshots
  FOR ALL USING (auth.role() = 'service_role');

-- Function to generate smart reminders based on user patterns
CREATE OR REPLACE FUNCTION generate_smart_reminders(p_user_id UUID)
RETURNS SETOF smart_reminders AS $$
DECLARE
  v_streak INTEGER;
  v_last_workout DATE;
  v_best_time TEXT;
  v_reminder smart_reminders%ROWTYPE;
BEGIN
  SELECT current_streak INTO v_streak
  FROM streaks WHERE user_id = p_user_id;

  SELECT MAX(date) INTO v_last_workout
  FROM workout_sessions WHERE user_id = p_user_id;

  SELECT preferred_workout_time INTO v_best_time
  FROM profiles WHERE user_id = p_user_id;

  -- Missed workout reminder (if no workout today and it's past 6pm)
  IF v_last_workout < CURRENT_DATE AND EXTRACT(HOUR FROM now()) >= 18 THEN
    INSERT INTO smart_reminders (user_id, reminder_type, title, message, scheduled_for, action_url, priority)
    VALUES (p_user_id, 'missed_workout', 'Don''t break your streak!',
      'You haven''t trained today. A quick 5-minute session keeps your momentum going!',
      now(), '/dashboard/workout', 2)
    RETURNING * INTO v_reminder;
    RETURN NEXT v_reminder;
  END IF;

  -- Streak at risk reminder (if streak >= 3 and no workout today)
  IF v_streak >= 3 AND v_last_workout < CURRENT_DATE THEN
    INSERT INTO smart_reminders (user_id, reminder_type, title, message, scheduled_for, action_url, priority)
    VALUES (p_user_id, 'streak_risk', 'Your streak is at risk!',
      format('You have a %s-day streak. Train today to keep it alive!', v_streak),
      now(), '/dashboard/workout', 3)
    RETURNING * INTO v_reminder;
    RETURN NEXT v_reminder;
  END IF;

  -- Streak milestone approaching
  IF v_streak IN (6, 13, 29, 59, 89) THEN
    INSERT INTO smart_reminders (user_id, reminder_type, title, message, scheduled_for, action_url, priority)
    VALUES (p_user_id, 'streak_milestone', 'Milestone approaching!',
      format('Just 1 more day to reach %s-day streak! You got this!', v_streak + 1),
      now(), '/dashboard/workout', 2)
    RETURNING * INTO v_reminder;
    RETURN NEXT v_reminder;
  END IF;

  -- Comeback reminder (if inactive for 3+ days)
  IF v_last_workout < CURRENT_DATE - interval '3 days' THEN
    INSERT INTO smart_reminders (user_id, reminder_type, title, message, scheduled_for, action_url, priority)
    VALUES (p_user_id, 'comeback', 'We miss you!',
      'It''s been a few days. Your brain thrives on consistency — even a short session helps!',
      now(), '/dashboard/workout', 1)
    RETURNING * INTO v_reminder;
    RETURN NEXT v_reminder;
  END IF;

  -- Weekly summary reminder (Sunday evening)
  IF EXTRACT(DOW FROM now()) = 0 AND EXTRACT(HOUR FROM now()) >= 19 THEN
    INSERT INTO smart_reminders (user_id, reminder_type, title, message, scheduled_for, action_url, priority)
    VALUES (p_user_id, 'weekly_summary', 'Check your weekly report!',
      'Your weekly brain training report is ready. See how you improved this week!',
      now(), '/dashboard/reports', 1)
    RETURNING * INTO v_reminder;
    RETURN NEXT v_reminder;
  END IF;

  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate journey snapshots (run monthly)
CREATE OR REPLACE FUNCTION generate_journey_snapshot(p_user_id UUID, p_year INTEGER, p_month INTEGER)
RETURNS journey_snapshots AS $$
DECLARE
  v_result journey_snapshots%ROWTYPE;
  v_start_date DATE;
  v_end_date DATE;
BEGIN
  v_start_date := make_date(p_year, p_month, 1);
  v_end_date := v_start_date + interval '1 month' - interval '1 day';

  SELECT
    p_user_id,
    v_start_date,
    p_year,
    p_month,
    COUNT(DISTINCT ws.date),
    COALESCE(SUM(xp.amount), 0),
    COALESCE(SUM(coins.amount), 0),
    0,
    COALESCE(AVG(bs.score), 0),
    1,
    1,
    (SELECT COUNT(*) FROM achievements WHERE user_id = p_user_id AND created_at >= v_start_date AND created_at <= v_end_date)
  INTO v_result
  FROM workout_sessions ws
  LEFT JOIN xp_ledger xp ON xp.user_id = p_user_id AND xp.created_at::date BETWEEN v_start_date AND v_end_date
  LEFT JOIN coins_ledger coins ON coins.user_id = p_user_id AND coins.created_at::date BETWEEN v_start_date AND v_end_date
  LEFT JOIN brain_scores bs ON bs.user_id = p_user_id AND bs.date BETWEEN v_start_date AND v_end_date
  WHERE ws.user_id = p_user_id AND ws.date BETWEEN v_start_date AND v_end_date;

  INSERT INTO journey_snapshots (user_id, snapshot_date, year, month, workouts_count, total_xp, total_coins, streak_days, brain_score_avg, level_start, level_end, achievements_unlocked)
  VALUES (v_result.user_id, v_result.snapshot_date, v_result.year, v_result.month, v_result.workouts_count, v_result.total_xp, v_result.total_coins, v_result.streak_days, v_result.brain_score_avg, v_result.level_start, v_result.level_end, v_result.achievements_unlocked)
  ON CONFLICT (user_id, year, month) DO UPDATE
  SET workouts_count = v_result.workouts_count,
      total_xp = v_result.total_xp,
      total_coins = v_result.total_coins,
      brain_score_avg = v_result.brain_score_avg,
      achievements_unlocked = v_result.achievements_unlocked
  RETURNING * INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
