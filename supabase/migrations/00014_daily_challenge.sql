-- Migration: Daily Challenge system
-- Tracks daily brain age scores for a global leaderboard

CREATE TABLE IF NOT EXISTS daily_challenge_scores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_date date NOT NULL,
  game_1_id text NOT NULL,
  game_1_score integer DEFAULT 0,
  game_1_stars integer DEFAULT 0,
  game_2_id text NOT NULL,
  game_2_score integer DEFAULT 0,
  game_2_stars integer DEFAULT 0,
  game_3_id text NOT NULL,
  game_3_score integer DEFAULT 0,
  game_3_stars integer DEFAULT 0,
  total_score integer DEFAULT 0,
  brain_age integer DEFAULT 50,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, challenge_date)
);

-- RLS
ALTER TABLE daily_challenge_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all daily challenge scores"
  ON daily_challenge_scores FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own daily challenge scores"
  ON daily_challenge_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily challenge scores"
  ON daily_challenge_scores FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_daily_challenge_date_score
  ON daily_challenge_scores(challenge_date, total_score DESC);

CREATE INDEX IF NOT EXISTS idx_daily_challenge_user_date
  ON daily_challenge_scores(user_id, challenge_date);
