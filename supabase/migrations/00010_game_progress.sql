-- =============================================
-- 00010_game_progress.sql
-- Level-based brain games with star ratings
-- =============================================

CREATE TABLE IF NOT EXISTS game_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  level_number INT NOT NULL,
  stars INT NOT NULL DEFAULT 0 CHECK (stars >= 0 AND stars <= 3),
  score INT NOT NULL DEFAULT 0,
  best_time_ms INT,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, game_id, level_number)
);

CREATE INDEX IF NOT EXISTS idx_game_progress_user ON game_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_game_progress_game ON game_progress(user_id, game_id);

ALTER TABLE game_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "game_progress_select"
  ON game_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "game_progress_insert"
  ON game_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "game_progress_update"
  ON game_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
