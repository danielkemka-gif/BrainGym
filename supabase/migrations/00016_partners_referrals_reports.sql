-- 00016: Accountability partners + referral codes
-- Run after 00015

-- Accountability partners table
CREATE TABLE IF NOT EXISTS accountability_partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(from_user_id, to_user_id)
);

ALTER TABLE accountability_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own partner links"
  ON accountability_partners FOR SELECT
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can send partner requests"
  ON accountability_partners FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update their own partner links"
  ON accountability_partners FOR UPDATE
  USING (auth.uid() = to_user_id OR auth.uid() = from_user_id);

-- Referral codes on profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;

-- Weekly cognitive reports table
CREATE TABLE IF NOT EXISTS weekly_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  avg_score NUMERIC(5,1),
  score_change NUMERIC(5,1),
  activities_completed INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  top_category TEXT,
  weakest_category TEXT,
  improvement_pct NUMERIC(5,1),
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, week_start)
);

ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own weekly reports"
  ON weekly_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert weekly reports"
  ON weekly_reports FOR INSERT
  WITH CHECK (true);

-- Index for partner lookups
CREATE INDEX IF NOT EXISTS idx_partners_from ON accountability_partners(from_user_id);
CREATE INDEX IF NOT EXISTS idx_partners_to ON accountability_partners(to_user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_user ON weekly_reports(user_id, week_start DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_referral ON profiles(referral_code);
