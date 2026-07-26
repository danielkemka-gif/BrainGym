-- Migration 00023: Daily Brain Quests
-- Themed daily missions that give users a reason to return every day

DO $$ BEGIN
  CREATE TYPE quest_category AS ENUM ('memory', 'focus', 'logic', 'speed', 'fitness');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE quest_difficulty AS ENUM ('easy', 'medium', 'hard');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS daily_quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_date DATE NOT NULL,
  category quest_category NOT NULL,
  difficulty quest_difficulty NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  goal_type TEXT NOT NULL,
  goal_value INTEGER NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 50,
  coin_reward INTEGER NOT NULL DEFAULT 10,
  momentum_bonus INTEGER NOT NULL DEFAULT 5,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, quest_date, category)
);

CREATE INDEX IF NOT EXISTS idx_daily_quests_user_date ON daily_quests(user_id, quest_date DESC);

CREATE TABLE IF NOT EXISTS quest_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID NOT NULL REFERENCES daily_quests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_value INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT now(),
  UNIQUE(quest_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_quest_progress_quest ON quest_progress(quest_id);

-- RLS
ALTER TABLE daily_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own quests" ON daily_quests;
CREATE POLICY "Users can view own quests" ON daily_quests
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage quests" ON daily_quests;
CREATE POLICY "Service role can manage quests" ON daily_quests
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can view own quest progress" ON quest_progress;
CREATE POLICY "Users can view own quest progress" ON quest_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own quest progress" ON quest_progress;
CREATE POLICY "Users can update own quest progress" ON quest_progress
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quest progress" ON quest_progress;
CREATE POLICY "Users can insert own quest progress" ON quest_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Quest templates (seeded per difficulty/category)
CREATE TABLE IF NOT EXISTS quest_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category quest_category NOT NULL,
  difficulty quest_difficulty NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  goal_type TEXT NOT NULL,
  base_goal INTEGER NOT NULL,
  xp_reward INTEGER NOT NULL,
  coin_reward INTEGER NOT NULL,
  momentum_bonus INTEGER NOT NULL DEFAULT 5,
  is_active BOOLEAN DEFAULT true
);

-- Seed quest templates
INSERT INTO quest_templates (category, difficulty, title, description, goal_type, base_goal, xp_reward, coin_reward, momentum_bonus) VALUES
  ('memory', 'easy', 'Memory Warm-Up', 'Complete 2 memory activities', 'activity_count', 2, 40, 8, 3),
  ('memory', 'medium', 'Memory Builder', 'Complete 3 memory activities', 'activity_count', 3, 60, 12, 5),
  ('memory', 'hard', 'Memory Master', 'Complete 5 memory activities with 80%+ accuracy', 'activity_count', 5, 100, 20, 8),
  ('focus', 'easy', 'Focus Check', 'Complete 2 focus activities', 'activity_count', 2, 40, 8, 3),
  ('focus', 'medium', 'Deep Focus', 'Complete 3 focus activities', 'activity_count', 3, 60, 12, 5),
  ('focus', 'hard', 'Flow State', 'Complete a 15-minute focus session without breaks', 'focus_session', 15, 100, 20, 8),
  ('logic', 'easy', 'Logic Starter', 'Complete 2 thinking activities', 'activity_count', 2, 40, 8, 3),
  ('logic', 'medium', 'Logic Challenge', 'Complete 3 thinking activities', 'activity_count', 3, 60, 12, 5),
  ('logic', 'hard', 'Logic Puzzle Master', 'Complete 5 thinking activities', 'activity_count', 5, 100, 20, 8),
  ('speed', 'easy', 'Quick Fire', 'Complete a Quick-Fire challenge', 'quick_fire', 1, 40, 8, 3),
  ('speed', 'medium', 'Speed Demon', 'Complete a Quick-Fire with 80%+ accuracy', 'quick_fire', 1, 70, 14, 6),
  ('speed', 'hard', 'Lightning Round', 'Complete 2 Quick-Fire challenges', 'quick_fire', 2, 100, 20, 8),
  ('fitness', 'easy', 'Daily Check-In', 'Complete today workout', 'workout', 1, 30, 6, 2),
  ('fitness', 'medium', 'Workout Warrior', 'Complete today workout with all activities', 'workout', 1, 60, 12, 5),
  ('fitness', 'hard', 'Perfect Day', 'Complete workout + 2 extra activities', 'extra_activities', 2, 100, 20, 8);

-- Function to generate daily quests for a user
CREATE OR REPLACE FUNCTION generate_daily_quests(p_user_id UUID)
RETURNS SETOF daily_quests AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_existing INTEGER;
  v_template RECORD;
  v_categories quest_category[] := ARRAY['memory', 'focus', 'logic', 'speed', 'fitness'];
  v_difficulties quest_difficulty[] := ARRAY['easy', 'medium', 'hard'];
  v_cat quest_category;
  v_diff quest_difficulty;
  v_quest daily_quests%ROWTYPE;
BEGIN
  SELECT COUNT(*) INTO v_existing
  FROM daily_quests
  WHERE user_id = p_user_id AND quest_date = v_today;

  IF v_existing >= 3 THEN
    RETURN QUERY SELECT * FROM daily_quests WHERE user_id = p_user_id AND quest_date = v_today;
    RETURN;
  END IF;

  FOR i IN 1..3 LOOP
    v_cat := v_categories[1 + floor(random() * array_length(v_categories, 1))::int];
    v_diff := v_difficulties[i];

    SELECT * INTO v_template
    FROM quest_templates
    WHERE category = v_cat AND difficulty = v_diff AND is_active = true
    ORDER BY random()
    LIMIT 1;

    IF v_template IS NOT NULL THEN
      INSERT INTO daily_quests (user_id, quest_date, category, difficulty, title, description, goal_type, goal_value, xp_reward, coin_reward, momentum_bonus)
      VALUES (p_user_id, v_today, v_cat, v_diff, v_template.title, v_template.description, v_template.goal_type, v_template.base_goal, v_template.xp_reward, v_template.coin_reward, v_template.momentum_bonus)
      ON CONFLICT (user_id, quest_date, category) DO NOTHING
      RETURNING * INTO v_quest;

      IF v_quest.id IS NOT NULL THEN
        RETURN NEXT v_quest;
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update quest progress
CREATE OR REPLACE FUNCTION update_quest_progress(
  p_quest_id UUID,
  p_user_id UUID,
  p_increment INTEGER DEFAULT 1
)
RETURNS daily_quests AS $$
DECLARE
  v_quest daily_quests%ROWTYPE;
  v_progress quest_progress%ROWTYPE;
BEGIN
  SELECT * INTO v_quest FROM daily_quests WHERE id = p_quest_id AND user_id = p_user_id;

  IF v_quest IS NULL OR v_quest.completed THEN
    RETURN v_quest;
  END IF;

  INSERT INTO quest_progress (quest_id, user_id, current_value)
  VALUES (p_quest_id, p_user_id, p_increment)
  ON CONFLICT (quest_id, user_id) DO UPDATE
  SET current_value = quest_progress.current_value + p_increment,
      last_updated = now()
  RETURNING * INTO v_progress;

  IF v_progress.current_value >= v_quest.goal_value THEN
    UPDATE daily_quests SET completed = true, completed_at = now() WHERE id = p_quest_id;
    v_quest.completed := true;
    v_quest.completed_at := now();
  END IF;

  RETURN v_quest;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
