-- Migration 00024: Cognitive Identity System
-- Evolving user identities based on training patterns and achievements

CREATE TABLE IF NOT EXISTS cognitive_identities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_emoji TEXT NOT NULL,
  tier INTEGER NOT NULL DEFAULT 1,
  category TEXT NOT NULL,
  required_level INTEGER DEFAULT 1,
  required_workouts INTEGER DEFAULT 0,
  required_streak INTEGER DEFAULT 0,
  required_brain_score INTEGER DEFAULT 0,
  required_achievements INTEGER DEFAULT 0,
  required_categories INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cognitive_identities_category ON cognitive_identities(category, tier);

CREATE TABLE IF NOT EXISTS user_identities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  identity_id UUID NOT NULL REFERENCES cognitive_identities(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT false,
  UNIQUE(user_id, identity_id)
);

CREATE INDEX IF NOT EXISTS idx_user_identities_user ON user_identities(user_id);

-- RLS
ALTER TABLE cognitive_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_identities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all identities" ON cognitive_identities;
CREATE POLICY "Users can view all identities" ON cognitive_identities
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Service role can manage identities" ON cognitive_identities;
CREATE POLICY "Service role can manage identities" ON cognitive_identities
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can view own identities" ON user_identities;
CREATE POLICY "Users can view own identities" ON user_identities
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view all active identities" ON user_identities;
CREATE POLICY "Users can view all active identities" ON user_identities
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role can manage user identities" ON user_identities;
CREATE POLICY "Service role can manage user identities" ON user_identities
  FOR ALL USING (auth.role() = 'service_role');

-- Seed cognitive identities (18 identities across 6 categories, 3 tiers each)
INSERT INTO cognitive_identities (slug, name, description, icon_emoji, tier, category, required_level, required_workouts, required_streak, required_brain_score, required_achievements, required_categories) VALUES
  -- Explorer category (early game)
  ('brain_explorer', 'Brain Explorer', 'Just beginning the cognitive journey', '🧭', 1, 'explorer', 1, 0, 0, 0, 0, 0),
  ('mind_wanderer', 'Mind Wanderer', 'Exploring different cognitive territories', '🗺️', 2, 'explorer', 3, 10, 3, 30, 2, 3),
  ('cognitive_pioneer', 'Cognitive Pioneer', 'Charting new paths in brain training', '🚀', 3, 'explorer', 5, 30, 7, 50, 5, 5),

  -- Memory category
  ('memory_apprentice', 'Memory Apprentice', 'Learning the art of remembering', '📝', 1, 'memory', 2, 5, 0, 25, 1, 0),
  ('memory_keeper', 'Memory Keeper', 'A guardian of mental recall', '🏛️', 2, 'memory', 4, 25, 5, 45, 3, 0),
  ('memory_sage', 'Memory Sage', 'Master of photographic recall', '📸', 3, 'memory', 7, 60, 14, 70, 6, 0),

  -- Focus category
  ('focus_student', 'Focus Student', 'Learning to concentrate deeply', '🎯', 1, 'focus', 2, 5, 0, 25, 1, 0),
  ('focus_warrior', 'Focus Warrior', 'Defending attention against distractions', '⚔️', 2, 'focus', 4, 25, 5, 45, 3, 0),
  ('flow_master', 'Flow Master', 'Achieving effortless deep concentration', '🌊', 3, 'focus', 7, 60, 14, 70, 6, 0),

  -- Logic category
  ('pattern_seeker', 'Pattern Seeker', 'Finding hidden connections', '🔍', 1, 'logic', 2, 5, 0, 25, 1, 0),
  ('logic_architect', 'Logic Architect', 'Building frameworks of reasoning', '🏗️', 2, 'logic', 4, 25, 5, 45, 3, 0),
  ('reasoning_master', 'Reasoning Master', 'Unshakeable logical thinking', '🧩', 3, 'logic', 7, 60, 14, 70, 6, 0),

  -- Speed category
  ('quick_thinker', 'Quick Thinker', 'Processing information faster', '⚡', 1, 'speed', 2, 5, 0, 25, 1, 0),
  ('speed_specialist', 'Speed Specialist', 'Rapid cognitive processing', '🏃', 2, 'speed', 4, 25, 5, 45, 3, 0),
  ('lightning_mind', 'Lightning Mind', 'Instantaneous mental reflexes', '⚡', 3, 'speed', 7, 60, 14, 70, 6, 0),

  -- Elite category (endgame)
  ('brain_athlete', 'Brain Athlete', 'Peak cognitive performance', '🏅', 1, 'elite', 8, 100, 30, 75, 10, 5),
  ('cognitive_champion', 'Cognitive Champion', 'Champion of mental fitness', '🏆', 2, 'elite', 10, 200, 60, 85, 15, 7),
  ('brain_legend', 'Brain Legend', 'Legendary cognitive abilities', '👑', 3, 'elite', 12, 500, 90, 90, 20, 7);

-- Function to check and unlock identities
CREATE OR REPLACE FUNCTION check_and_unlock_identities(p_user_id UUID)
RETURNS SETOF cognitive_identities AS $$
DECLARE
  v_identity RECORD;
  v_profile RECORD;
  v_streak INTEGER;
  v_workouts INTEGER;
  v_brain_score NUMERIC;
  v_achievement_count INTEGER;
  v_categories_used INTEGER;
  v_level INTEGER;
BEGIN
  -- Get user stats
  SELECT
    COALESCE(ul.level, 1) INTO v_level
  FROM user_levels ul WHERE ul.user_id = p_user_id;

  SELECT COALESCE(s.current_streak, 0) INTO v_streak
  FROM streaks s WHERE s.user_id = p_user_id;

  SELECT COUNT(DISTINCT date) INTO v_workouts
  FROM workout_sessions WHERE user_id = p_user_id;

  SELECT COALESCE(AVG(score), 0) INTO v_brain_score
  FROM brain_scores WHERE user_id = p_user_id
    AND date >= CURRENT_DATE - interval '30 days';

  SELECT COUNT(*) INTO v_achievement_count
  FROM achievements WHERE user_id = p_user_id;

  SELECT COUNT(DISTINCT a.category_id) INTO v_categories_used
  FROM activity_logs al
  JOIN activities a ON a.id = al.activity_id
  WHERE al.user_id = p_user_id;

  -- Check each identity
  FOR v_identity IN
    SELECT ci.* FROM cognitive_identities ci
    WHERE ci.is_active = true
      AND ci.required_level <= v_level
      AND ci.required_workouts <= v_workouts
      AND ci.required_streak <= v_streak
      AND ci.required_brain_score <= v_brain_score
      AND ci.required_achievements <= v_achievement_count
      AND ci.required_categories <= v_categories_used
  LOOP
    -- Insert if not already unlocked
    INSERT INTO user_identities (user_id, identity_id)
    VALUES (p_user_id, v_identity.id)
    ON CONFLICT (user_id, identity_id) DO NOTHING;

    IF FOUND THEN
      RETURN NEXT v_identity;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's active identity
CREATE OR REPLACE FUNCTION get_active_identity(p_user_id UUID)
RETURNS cognitive_identities AS $$
DECLARE
  v_result cognitive_identities%ROWTYPE;
BEGIN
  SELECT ci.* INTO v_result
  FROM user_identities ui
  JOIN cognitive_identities ci ON ci.id = ui.identity_id
  WHERE ui.user_id = p_user_id AND ui.is_active = true
  LIMIT 1;

  IF v_result IS NULL THEN
    -- Default to brain_explorer
    SELECT * INTO v_result
    FROM cognitive_identities
    WHERE slug = 'brain_explorer';
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
