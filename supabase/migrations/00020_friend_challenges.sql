-- Friend Challenges: Private 1v1 challenges between partners

-- Add private challenge support to existing challenges table
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS challenge_type TEXT DEFAULT 'public' CHECK (challenge_type IN ('public', 'private', 'duel'));
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS invited_users UUID[] DEFAULT '{}';

-- Friend duel tracking
CREATE TABLE IF NOT EXISTS friend_duels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  challenger_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opponent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenger_progress INTEGER DEFAULT 0,
  opponent_progress INTEGER DEFAULT 0,
  challenger_completed_at TIMESTAMPTZ,
  opponent_completed_at TIMESTAMPTZ,
  winner_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired', 'declined')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_friend_duels_challenger ON friend_duels(challenger_id);
CREATE INDEX IF NOT EXISTS idx_friend_duels_opponent ON friend_duels(opponent_id);
CREATE INDEX IF NOT EXISTS idx_friend_duels_status ON friend_duels(status);

-- RLS
ALTER TABLE friend_duels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own duels" ON friend_duels;
CREATE POLICY "Users can view own duels" ON friend_duels
  FOR SELECT USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);

DROP POLICY IF EXISTS "Users can create duels" ON friend_duels;
CREATE POLICY "Users can create duels" ON friend_duels
  FOR INSERT WITH CHECK (auth.uid() = challenger_id);

DROP POLICY IF EXISTS "Users can update own duels" ON friend_duels;
CREATE POLICY "Users can update own duels" ON friend_duels
  FOR UPDATE USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);

-- Function to create a duel challenge
CREATE OR REPLACE FUNCTION create_duel(
  p_challenger_id UUID,
  p_opponent_id UUID,
  p_title TEXT,
  p_goal_type TEXT,
  p_goal_amount INTEGER,
  p_duration_days INTEGER DEFAULT 7
)
RETURNS friend_duels AS $$
DECLARE
  v_challenge challenges%ROWTYPE;
  v_duel friend_duels%ROWTYPE;
BEGIN
  -- Create the challenge
  INSERT INTO challenges (title, description, goal_type, goal_amount, duration_days, created_by, is_public, challenge_type, invited_users)
  VALUES (
    p_title,
    'Head-to-head duel challenge',
    p_goal_type,
    p_goal_amount,
    p_duration_days,
    p_challenger_id,
    false,
    'duel',
    ARRAY[p_challenger_id, p_opponent_id]
  )
  RETURNING * INTO v_challenge;

  -- Create the duel
  INSERT INTO friend_duels (challenge_id, challenger_id, opponent_id, status)
  VALUES (v_challenge.id, p_challenger_id, p_opponent_id, 'active')
  RETURNING * INTO v_duel;

  RETURN v_duel;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update duel progress
CREATE OR REPLACE FUNCTION update_duel_progress(
  p_duel_id UUID,
  p_user_id UUID,
  p_progress INTEGER
)
RETURNS friend_duels AS $$
DECLARE
  v_duel friend_duels%ROWTYPE;
  v_goal INTEGER;
BEGIN
  -- Get the challenge goal
  SELECT c.goal_amount INTO v_goal
  FROM friend_duels fd
  JOIN challenges c ON c.id = fd.challenge_id
  WHERE fd.id = p_duel_id;

  -- Update progress
  IF p_user_id = (SELECT challenger_id FROM friend_duels WHERE id = p_duel_id) THEN
    UPDATE friend_duels SET challenger_progress = p_progress, updated_at = now() WHERE id = p_duel_id RETURNING * INTO v_duel;
  ELSE
    UPDATE friend_duels SET opponent_progress = p_progress, updated_at = now() WHERE id = p_duel_id RETURNING * INTO v_duel;
  END IF;

  -- Check if someone won
  IF v_duel.challenger_progress >= v_goal AND v_duel.winner_id IS NULL THEN
    UPDATE friend_duels SET winner_id = v_duel.challenger_id, status = 'completed', challenger_completed_at = now() WHERE id = p_duel_id;
    v_duel.winner_id := v_duel.challenger_id;
    v_duel.status := 'completed';
  ELSIF v_duel.opponent_progress >= v_goal AND v_duel.winner_id IS NULL THEN
    UPDATE friend_duels SET winner_id = v_duel.opponent_id, status = 'completed', opponent_completed_at = now() WHERE id = p_duel_id;
    v_duel.winner_id := v_duel.opponent_id;
    v_duel.status := 'completed';
  END IF;

  RETURN v_duel;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
