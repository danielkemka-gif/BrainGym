-- Brain Journal table
create table if not exists brain_journal (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  mood text check (mood in ('great', 'good', 'okay', 'tired', 'stressed')),
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_brain_journal_user on brain_journal(user_id);
create index idx_brain_journal_created on brain_journal(user_id, created_at desc);

-- RLS
alter table brain_journal enable row level security;
create policy "Users can read own journal" on brain_journal for select using (user_id = auth.uid());
create policy "Users can create own journal" on brain_journal for insert with check (user_id = auth.uid());
create policy "Users can update own journal" on brain_journal for update using (user_id = auth.uid());
create policy "Users can delete own journal" on brain_journal for delete using (user_id = auth.uid());

-- Updated_at trigger
create or replace function update_brain_journal_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger brain_journal_updated_at
  before update on brain_journal
  for each row
  execute function update_brain_journal_timestamp();
