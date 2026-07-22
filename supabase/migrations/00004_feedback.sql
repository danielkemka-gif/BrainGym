-- User feedback & suggestions
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('suggestion', 'bug', 'improvement', 'other')),
  title text not null,
  description text not null,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'implemented', 'declined')),
  created_at timestamptz not null default now()
);

create index idx_feedback_user on public.feedback(user_id);
create index idx_feedback_status on public.feedback(status);

alter table public.feedback enable row level security;

create policy "Users can read own feedback"
  on public.feedback for select
  using (auth.uid() = user_id);

create policy "Users can insert own feedback"
  on public.feedback for insert
  with check (auth.uid() = user_id);
