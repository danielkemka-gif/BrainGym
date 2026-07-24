-- =============================================
-- 00009_chat_reactions.sql
-- Emoji reactions on chat messages
-- =============================================

CREATE TABLE IF NOT EXISTS chat_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

CREATE INDEX IF NOT EXISTS idx_chat_reactions_message ON chat_reactions(message_id);

ALTER TABLE chat_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chat_reactions_select"
  ON chat_reactions FOR SELECT TO authenticated USING (true);

CREATE POLICY "chat_reactions_insert"
  ON chat_reactions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "chat_reactions_delete"
  ON chat_reactions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE chat_reactions;

-- Function to get reactions grouped by message
CREATE OR REPLACE FUNCTION get_chat_reactions(p_message_ids UUID[])
RETURNS TABLE (
  message_id UUID,
  emoji TEXT,
  count BIGINT,
  user_reacted BOOLEAN
) AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT auth.uid() INTO v_user_id;
  RETURN QUERY
  SELECT
    r.message_id,
    r.emoji,
    COUNT(*)::BIGINT AS count,
    BOOL_OR(r.user_id = v_user_id) AS user_reacted
  FROM chat_reactions r
  WHERE r.message_id = ANY(p_message_ids)
  GROUP BY r.message_id, r.emoji;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
