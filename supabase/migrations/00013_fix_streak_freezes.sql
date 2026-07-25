-- Migration: Fix streak freeze system
-- Creates the missing streak_freezes table and adds streak_freezes_remaining to profiles

-- 1. Add streak_freezes_remaining column to profiles (default 0)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak_freezes_remaining smallint DEFAULT 0;

-- 2. Create streak_freezes table
CREATE TABLE IF NOT EXISTS streak_freezes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  freeze_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, freeze_date)
);

-- 3. RLS policies
ALTER TABLE streak_freezes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streak freezes"
  ON streak_freezes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streak freezes"
  ON streak_freezes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_streak_freezes_user_date ON streak_freezes(user_id, freeze_date);
