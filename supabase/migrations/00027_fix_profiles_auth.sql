-- Fix missing profile columns and add referral support

-- Add missing columns to profiles (if not already present)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age_group TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_difficulty TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT;

-- Ensure referral columns exist (added in 00016 but just in case)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;

-- Function to increment referral count (used by auth callback)
CREATE OR REPLACE FUNCTION increment_referral_count(referrer_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET referral_count = COALESCE(referral_count, 0) + 1
  WHERE user_id = referrer_id;
END;
$$;

-- Grant execute to authenticated users (needed for the callback)
GRANT EXECUTE ON FUNCTION increment_referral_count TO authenticated;
GRANT EXECUTE ON FUNCTION increment_referral_count TO service_role;
