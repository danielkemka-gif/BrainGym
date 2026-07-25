-- =============================================
-- 00011_user_missions.sql
-- Weekly missions with progress tracking & rewards
-- =============================================

CREATE TABLE IF NOT EXISTS user_missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  target_value INT NOT NULL,
  current_value INT NOT NULL DEFAULT 0,
  xp_reward INT NOT NULL DEFAULT 0,
  coin_reward INT NOT NULL DEFAULT 0,
  week_start DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  claimed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_missions_user_week ON user_missions(user_id, week_start);
CREATE INDEX IF NOT EXISTS idx_user_missions_user_completed ON user_missions(user_id, completed);

ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_missions_select"
  ON user_missions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_missions_insert"
  ON user_missions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_missions_update"
  ON user_missions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
