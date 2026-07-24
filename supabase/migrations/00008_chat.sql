-- =============================================
-- 00008_chat.sql
-- WhatsApp-style real-time community chat
-- =============================================

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  reply_to UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  edited_at TIMESTAMPTZ
);

-- Index for fast chronological queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);

-- RLS: anyone can read, only authenticated users can insert/update/delete own messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Read: all authenticated users can read
CREATE POLICY "chat_messages_select"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (true);

-- Insert: only authenticated users can insert their own messages
CREATE POLICY "chat_messages_insert"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Update: only own messages
CREATE POLICY "chat_messages_update"
  ON chat_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Delete: own messages or admin
CREATE POLICY "chat_messages_delete"
  ON chat_messages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable Realtime on the table
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- Function to get chat messages with profiles (used by API)
CREATE OR REPLACE FUNCTION get_chat_messages(p_limit INT DEFAULT 50, p_before TIMESTAMPTZ DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  content TEXT,
  created_at TIMESTAMPTZ,
  edited_at TIMESTAMPTZ,
  reply_to UUID,
  user_id UUID,
  user_name TEXT,
  user_avatar TEXT,
  user_username TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.content,
    m.created_at,
    m.edited_at,
    m.reply_to,
    m.user_id,
    COALESCE(p.name, 'Anonymous') AS user_name,
    p.avatar_url AS user_avatar,
    p.username AS user_username
  FROM chat_messages m
  LEFT JOIN profiles p ON p.user_id = m.user_id
  WHERE (p_before IS NULL OR m.created_at < p_before)
  ORDER BY m.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete a chat message (own only)
CREATE OR REPLACE FUNCTION delete_chat_message(p_message_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT auth.uid() INTO v_user_id;
  DELETE FROM chat_messages WHERE id = p_message_id AND user_id = v_user_id;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
