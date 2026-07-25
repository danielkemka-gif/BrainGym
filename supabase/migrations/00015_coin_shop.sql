-- Migration: Coin Shop system
-- Allows users to spend earned coins on power-ups, cosmetics, and streak freezes

CREATE TABLE IF NOT EXISTS shop_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('powerup', 'cosmetic', 'protection', 'premium')),
  cost_coins integer NOT NULL,
  icon_emoji text,
  effect_type text NOT NULL,
  effect_value jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  max_purchases_per_user smallint DEFAULT 0, -- 0 = unlimited
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_purchases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES shop_items(id),
  coins_spent integer NOT NULL,
  purchased_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- RLS
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shop items"
  ON shop_items FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can view own purchases"
  ON user_purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases"
  ON user_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Seed shop items
INSERT INTO shop_items (slug, name, description, category, cost_coins, icon_emoji, effect_type, effect_value) VALUES
  ('streak_freeze', 'Streak Freeze', 'Protect your streak from one missed day', 'protection', 100, '❄️', 'streak_freeze', '{"count": 1}'),
  ('double_xp', 'Double XP Boost', 'Double all XP earned in your next workout', 'powerup', 150, '⚡', 'double_xp', '{"multiplier": 2, "uses": 1}'),
  ('extra_activity', 'Bonus Activity', 'Add an extra activity to your next workout', 'powerup', 75, '🎯', 'extra_activity', '{"extra_count": 1}'),
  ('brain_boost', 'Brain Boost', '+10 to all brain scores after next workout', 'powerup', 200, '🧠', 'brain_boost', '{"bonus": 10}'),
  ('avatar_frame_gold', 'Gold Avatar Frame', 'Show off with a golden profile frame', 'cosmetic', 300, '👑', 'avatar_frame', '{"frame": "gold"}'),
  ('avatar_frame_neon', 'Neon Avatar Frame', 'A glowing neon frame around your avatar', 'cosmetic', 400, '💫', 'avatar_frame', '{"frame": "neon"}'),
  ('streak_freeze_3x', 'Streak Freeze x3', 'Three streak freezes at a discount', 'protection', 250, '🧊', 'streak_freeze', '{"count": 3}')
ON CONFLICT (slug) DO NOTHING;
