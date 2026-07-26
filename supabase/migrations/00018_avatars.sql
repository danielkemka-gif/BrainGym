-- Brain Avatar Evolution system
-- Customizable avatar with evolution stages tied to user level

-- Avatar evolution stages
DO $$ BEGIN
  CREATE TYPE avatar_stage AS ENUM ('egg', 'hatchling', 'sapling', 'guardian', 'brain_lord');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- User avatar customization
CREATE TABLE IF NOT EXISTS user_avatars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body_type TEXT NOT NULL DEFAULT 'round',
  skin_tone TEXT NOT NULL DEFAULT 'warm',
  hair_style TEXT NOT NULL DEFAULT 'short',
  hair_color TEXT NOT NULL DEFAULT '#4a3728',
  outfit_id TEXT NOT NULL DEFAULT 'basic',
  background_id TEXT NOT NULL DEFAULT 'default',
  frame_id TEXT NOT NULL DEFAULT 'none',
  accessory_id TEXT NOT NULL DEFAULT 'none',
  expression TEXT NOT NULL DEFAULT 'happy',
  evolution_stage avatar_stage NOT NULL DEFAULT 'egg',
  evolved_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_avatars_user ON user_avatars(user_id);

-- Avatar parts catalog (unlocked via achievements, levels, or shop)
CREATE TABLE IF NOT EXISTS avatar_parts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('body', 'skin', 'hair', 'outfit', 'background', 'frame', 'accessory', 'expression')),
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  unlock_type TEXT NOT NULL CHECK (unlock_type IN ('level', 'achievement', 'coins', 'premium', 'streak')),
  unlock_value INTEGER NOT NULL DEFAULT 0,
  preview_emoji TEXT,
  preview_colors JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_avatar_parts_category ON avatar_parts(category, is_active);

-- Track which parts a user has unlocked
CREATE TABLE IF NOT EXISTS user_avatar_parts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  part_id UUID NOT NULL REFERENCES avatar_parts(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, part_id)
);

CREATE INDEX IF NOT EXISTS idx_user_avatar_parts_user ON user_avatar_parts(user_id);

-- RLS policies
ALTER TABLE user_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatar_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_avatar_parts ENABLE ROW LEVEL SECURITY;

-- User avatars: users can read all (for showing avatars in leaderboard etc)
DROP POLICY IF EXISTS "Users can view all avatars" ON user_avatars;
CREATE POLICY "Users can view all avatars" ON user_avatars
  FOR SELECT USING (true);

-- User avatars: users can update their own
DROP POLICY IF EXISTS "Users can update own avatar" ON user_avatars;
CREATE POLICY "Users can update own avatar" ON user_avatars
  FOR UPDATE USING (auth.uid() = user_id);

-- User avatars: users can insert their own
DROP POLICY IF EXISTS "Users can insert own avatar" ON user_avatars;
CREATE POLICY "Users can insert own avatar" ON user_avatars
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Avatar parts: everyone can read active parts
DROP POLICY IF EXISTS "Users can view avatar parts" ON avatar_parts;
CREATE POLICY "Users can view avatar parts" ON avatar_parts
  FOR SELECT USING (is_active = true);

-- Avatar parts: service role can manage
DROP POLICY IF EXISTS "Service role can manage avatar parts" ON avatar_parts;
CREATE POLICY "Service role can manage avatar parts" ON avatar_parts
  FOR ALL USING (auth.role() = 'service_role');

-- User parts: users can read all their own parts
DROP POLICY IF EXISTS "Users can view own avatar parts" ON user_avatar_parts;
CREATE POLICY "Users can view own avatar parts" ON user_avatar_parts
  FOR SELECT USING (auth.uid() = user_id);

-- User parts: users can insert their own
DROP POLICY IF EXISTS "Users can unlock own avatar parts" ON user_avatar_parts;
CREATE POLICY "Users can unlock own avatar parts" ON user_avatar_parts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to get evolution stage from level
CREATE OR REPLACE FUNCTION get_evolution_stage(user_level INTEGER)
RETURNS avatar_stage AS $$
BEGIN
  IF user_level >= 10 THEN RETURN 'brain_lord';
  ELSIF user_level >= 7 THEN RETURN 'guardian';
  ELSIF user_level >= 5 THEN RETURN 'sapling';
  ELSIF user_level >= 3 THEN RETURN 'hatchling';
  ELSE RETURN 'egg';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to auto-create avatar on profile creation
CREATE OR REPLACE FUNCTION handle_new_user_avatar()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_avatars (user_id)
  VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create avatar when profile is created
DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_avatar();

-- Seed common avatar parts
INSERT INTO avatar_parts (slug, name, category, rarity, unlock_type, unlock_value, preview_emoji, preview_colors) VALUES
  -- Body types
  ('body_round', 'Round', 'body', 'common', 'level', 1, '🟡', '{"primary": "#fbbf24", "secondary": "#f59e0b"}'),
  ('body_square', 'Square', 'body', 'uncommon', 'level', 3, '🟧', '{"primary": "#fb923c", "secondary": "#ea580c"}'),
  ('body_tall', 'Tall', 'body', 'rare', 'level', 6, '🟢', '{"primary": "#4ade80", "secondary": "#16a34a"}'),

  -- Skin tones
  ('skin_light', 'Light', 'skin', 'common', 'level', 1, '👶', '{"primary": "#fde68a", "secondary": "#fbbf24"}'),
  ('skin_warm', 'Warm', 'skin', 'common', 'level', 1, '😊', '{"primary": "#f5d0a9", "secondary": "#d4a574"}'),
  ('skin_medium', 'Medium', 'skin', 'common', 'level', 1, '🙂', '{"primary": "#c4956a", "secondary": "#8b6541"}'),
  ('skin_tan', 'Tan', 'skin', 'uncommon', 'level', 2, '😎', '{"primary": "#a0784c", "secondary": "#6b4c2f"}'),
  ('skin_deep', 'Deep', 'skin', 'uncommon', 'level', 2, '💪', '{"primary": "#7c5332", "secondary": "#4a3020"}'),
  ('skin_dark', 'Dark', 'skin', 'uncommon', 'level', 2, '✨', '{"primary": "#5a3a22", "secondary": "#3a2415"}'),

  -- Hair styles
  ('hair_short', 'Short', 'hair', 'common', 'level', 1, '✂️', '{"color": "#4a3728"}'),
  ('hair_long', 'Long', 'hair', 'common', 'level', 1, '💇', '{"color": "#4a3728"}'),
  ('hair_curly', 'Curly', 'hair', 'uncommon', 'level', 3, '🌀', '{"color": "#4a3728"}'),
  ('hair_mohawk', 'Mohawk', 'hair', 'rare', 'achievement', 5, '🦅', '{"color": "#ef4444"}'),
  ('hair_afro', 'Afro', 'hair', 'rare', 'level', 5, '☁️', '{"color": "#4a3728"}'),
  ('hair_spiky', 'Spiky', 'hair', 'epic', 'achievement', 10, '⚡', '{"color": "#f59e0b"}'),
  ('hair_crown', 'Brain Crown', 'hair', 'legendary', 'level', 12, '👑', '{"color": "#fbbf24"}'),

  -- Outfits
  ('outfit_basic', 'Basic Tee', 'outfit', 'common', 'level', 1, '👕', '{"primary": "#3b82f6", "secondary": "#1d4ed8"}'),
  ('outfit_hoodie', 'Brain Hoodie', 'outfit', 'uncommon', 'level', 3, '🧥', '{"primary": "#8b5cf6", "secondary": "#6d28d9"}'),
  ('outfit_labcoat', 'Lab Coat', 'outfit', 'rare', 'level', 6, '🥼', '{"primary": "#f8fafc", "secondary": "#e2e8f0"}'),
  ('outfit_robe', 'Wisdom Robe', 'outfit', 'epic', 'level', 10, '👘', '{"primary": "#fbbf24", "secondary": "#d97706"}'),
  ('outfit_cosmic', 'Cosmic Armor', 'outfit', 'legendary', 'level', 13, '🌌', '{"primary": "#6366f1", "secondary": "#4338ca"}'),

  -- Backgrounds
  ('bg_default', 'Default', 'background', 'common', 'level', 1, '🏠', '{"primary": "#f8fafc", "secondary": "#e2e8f0"}'),
  ('bg_gym', 'Brain Gym', 'background', 'uncommon', 'level', 3, '🏋️', '{"primary": "#dbeafe", "secondary": "#bfdbfe"}'),
  ('bg_space', 'Deep Space', 'background', 'rare', 'level', 7, '🚀', '{"primary": "#1e1b4b", "secondary": "#312e81"}'),
  ('bg_nature', 'Zen Garden', 'background', 'epic', 'level', 10, '🌸', '{"primary": "#ecfdf5", "secondary": "#d1fae5"}'),

  -- Frames
  ('frame_none', 'No Frame', 'frame', 'common', 'level', 1, '⭕', '{}'),
  ('frame_gold', 'Gold Frame', 'frame', 'rare', 'coins', 300, '🥇', '{"primary": "#fbbf24", "secondary": "#d97706"}'),
  ('frame_neon', 'Neon Frame', 'frame', 'epic', 'coins', 400, '💡', '{"primary": "#22d3ee", "secondary": "#06b6d4"}'),
  ('frame_brain', 'Brain Frame', 'frame', 'legendary', 'achievement', 15, '🧠', '{"primary": "#a855f7", "secondary": "#7c3aed"}'),

  -- Accessories
  ('acc_none', 'None', 'accessory', 'common', 'level', 1, '❌', '{}'),
  ('acc_glasses', 'Smart Glasses', 'accessory', 'uncommon', 'level', 4, '🤓', '{"primary": "#1e293b", "secondary": "#334155"}'),
  ('acc_headphones', 'Focus Headphones', 'accessory', 'rare', 'level', 7, '🎧', '{"primary": "#ef4444", "secondary": "#dc2626"}'),
  ('acc_crown', 'Brain Crown', 'accessory', 'legendary', 'level', 12, '👑', '{"primary": "#fbbf24", "secondary": "#f59e0b"}'),

  -- Expressions
  ('expr_happy', 'Happy', 'expression', 'common', 'level', 1, '😊', '{}'),
  ('expr_focus', 'Focused', 'expression', 'common', 'level', 1, '🤔', '{}'),
  ('expr_fire', 'On Fire', 'expression', 'uncommon', 'level', 5, '🔥', '{}'),
  ('expr_star', 'Star Power', 'expression', 'rare', 'level', 8, '⭐', '{}'),
  ('expr_cosmic', 'Cosmic', 'expression', 'legendary', 'level', 13, '🌌', '{}')
ON CONFLICT (slug) DO NOTHING;
