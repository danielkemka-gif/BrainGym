-- ============================================================================
-- Migration 00039: Akuche Intelligence, Context Profile, Conversations & Clarity Snapshot
-- Aligned 1:1 with TypeScript models in src/lib/akuche/memory-engine.ts
-- Includes UNIQUE constraints for idempotent client-server sync and strict RLS
-- ============================================================================

-- 1. Akuche Context Profile Memories (with Confirmed vs AI-Interpreted status)
CREATE TABLE IF NOT EXISTS public.akuche_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN (
      'profile',
      'goal',
      'decision',
      'commitment',
      'pattern',
      'project'
    )
  ),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_context TEXT,
  verification_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (
    verification_status IN ('confirmed', 'ai_interpreted')
  ),
  confidence NUMERIC(4,2) NOT NULL DEFAULT 1.00 CHECK (confidence >= 0.00 AND confidence <= 1.00),
  tags TEXT[] NOT NULL DEFAULT '{}',
  superseded_by_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_akuche_memories_user_client UNIQUE (user_id, client_id)
);

CREATE INDEX IF NOT EXISTS idx_akuche_memories_user_id ON public.akuche_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_akuche_memories_category ON public.akuche_memories(user_id, category);

ALTER TABLE public.akuche_memories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own akuche_memories" ON public.akuche_memories;
CREATE POLICY "Users can view own akuche_memories"
  ON public.akuche_memories FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own akuche_memories" ON public.akuche_memories;
CREATE POLICY "Users can insert own akuche_memories"
  ON public.akuche_memories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own akuche_memories" ON public.akuche_memories;
CREATE POLICY "Users can update own akuche_memories"
  ON public.akuche_memories FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own akuche_memories" ON public.akuche_memories;
CREATE POLICY "Users can delete own akuche_memories"
  ON public.akuche_memories FOR DELETE
  USING (auth.uid() = user_id);


-- 2. Akuche Conversations & Multi-Turn Message History
CREATE TABLE IF NOT EXISTS public.akuche_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Akuche Coaching Session',
  subject TEXT NOT NULL DEFAULT 'Coaching Session',
  summary TEXT,
  mode TEXT NOT NULL DEFAULT 'coaching_chat' CHECK (
    mode IN ('coaching_chat', 'devils_advocate', 'decision_lab', 'thinking_mirror', 'real_life_gym', 'brain_coach')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_akuche_conversations_user_client UNIQUE (user_id, client_id)
);

CREATE INDEX IF NOT EXISTS idx_akuche_conversations_user_id ON public.akuche_conversations(user_id, updated_at DESC);

ALTER TABLE public.akuche_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own akuche_conversations" ON public.akuche_conversations;
CREATE POLICY "Users can view own akuche_conversations"
  ON public.akuche_conversations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own akuche_conversations" ON public.akuche_conversations;
CREATE POLICY "Users can insert own akuche_conversations"
  ON public.akuche_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own akuche_conversations" ON public.akuche_conversations;
CREATE POLICY "Users can update own akuche_conversations"
  ON public.akuche_conversations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own akuche_conversations" ON public.akuche_conversations;
CREATE POLICY "Users can delete own akuche_conversations"
  ON public.akuche_conversations FOR DELETE
  USING (auth.uid() = user_id);


CREATE TABLE IF NOT EXISTS public.akuche_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.akuche_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  mode TEXT,
  structured_cards JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_akuche_messages_user_client UNIQUE (user_id, client_id)
);

CREATE INDEX IF NOT EXISTS idx_akuche_messages_conversation_id ON public.akuche_messages(conversation_id, created_at ASC);

ALTER TABLE public.akuche_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own akuche_messages" ON public.akuche_messages;
CREATE POLICY "Users can view own akuche_messages"
  ON public.akuche_messages FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own akuche_messages" ON public.akuche_messages;
CREATE POLICY "Users can insert own akuche_messages"
  ON public.akuche_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own akuche_messages" ON public.akuche_messages;
CREATE POLICY "Users can update own akuche_messages"
  ON public.akuche_messages FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own akuche_messages" ON public.akuche_messages;
CREATE POLICY "Users can delete own akuche_messages"
  ON public.akuche_messages FOR DELETE
  USING (auth.uid() = user_id);


-- 3. Akuche Live Clarity Snapshots
CREATE TABLE IF NOT EXISTS public.akuche_clarity_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  currently_dealing_with JSONB NOT NULL DEFAULT '[]'::jsonb,
  major_challenges JSONB NOT NULL DEFAULT '[]'::jsonb,
  areas_requiring_attention JSONB NOT NULL DEFAULT '[]'::jsonb,
  possible_opportunities JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_next_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_akuche_clarity_snapshots_user_client UNIQUE (user_id, client_id)
);

CREATE INDEX IF NOT EXISTS idx_akuche_clarity_snapshots_user_id ON public.akuche_clarity_snapshots(user_id, updated_at DESC);

ALTER TABLE public.akuche_clarity_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own akuche_clarity_snapshots" ON public.akuche_clarity_snapshots;
CREATE POLICY "Users can view own akuche_clarity_snapshots"
  ON public.akuche_clarity_snapshots FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own akuche_clarity_snapshots" ON public.akuche_clarity_snapshots;
CREATE POLICY "Users can insert own akuche_clarity_snapshots"
  ON public.akuche_clarity_snapshots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own akuche_clarity_snapshots" ON public.akuche_clarity_snapshots;
CREATE POLICY "Users can update own akuche_clarity_snapshots"
  ON public.akuche_clarity_snapshots FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own akuche_clarity_snapshots" ON public.akuche_clarity_snapshots;
CREATE POLICY "Users can delete own akuche_clarity_snapshots"
  ON public.akuche_clarity_snapshots FOR DELETE
  USING (auth.uid() = user_id);


-- 4. Akuche Thinking Mirror Patterns (Signature System #2)
CREATE TABLE IF NOT EXISTS public.akuche_thinking_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('strength', 'blind_spot', 'habit')),
  observation TEXT NOT NULL,
  evidence_count INTEGER NOT NULL DEFAULT 1,
  self_awareness_prompt TEXT NOT NULL,
  last_observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_akuche_thinking_patterns_user_name UNIQUE (user_id, pattern_name)
);

CREATE INDEX IF NOT EXISTS idx_akuche_thinking_patterns_user_id ON public.akuche_thinking_patterns(user_id, last_observed_at DESC);

ALTER TABLE public.akuche_thinking_patterns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own akuche_thinking_patterns" ON public.akuche_thinking_patterns;
CREATE POLICY "Users can view own akuche_thinking_patterns"
  ON public.akuche_thinking_patterns FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own akuche_thinking_patterns" ON public.akuche_thinking_patterns;
CREATE POLICY "Users can insert own akuche_thinking_patterns"
  ON public.akuche_thinking_patterns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own akuche_thinking_patterns" ON public.akuche_thinking_patterns;
CREATE POLICY "Users can update own akuche_thinking_patterns"
  ON public.akuche_thinking_patterns FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own akuche_thinking_patterns" ON public.akuche_thinking_patterns;
CREATE POLICY "Users can delete own akuche_thinking_patterns"
  ON public.akuche_thinking_patterns FOR DELETE
  USING (auth.uid() = user_id);
