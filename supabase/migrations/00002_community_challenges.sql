-- Community Challenges

-- 1. Challenges
create table if not exists challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text, -- optional filter: which activity category to focus on
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  duration_days smallint not null check (duration_days > 0 and duration_days <= 90),
  goal_type text not null check (goal_type in ('xp', 'workouts', 'streak')),
  goal_amount integer not null check (goal_amount > 0),
  start_date date not null default CURRENT_DATE,
  end_date date not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  is_public boolean default true,
  max_participants smallint default 50,
  created_at timestamptz default now()
);

create index idx_challenges_start on challenges(start_date);
create index idx_challenges_public on challenges(is_public) where is_public = true;

-- 2. Challenge Participants
create table if not exists challenge_participants (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references challenges(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz default now(),
  total_progress integer not null default 0,
  unique(challenge_id, user_id)
);

create index idx_challenge_participants_challenge on challenge_participants(challenge_id);
create index idx_challenge_participants_user on challenge_participants(user_id);

-- 3. Challenge Daily Progress
create table if not exists challenge_daily_progress (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references challenge_participants(id) on delete cascade,
  date date not null default CURRENT_DATE,
  xp_earned integer not null default 0,
  workouts_completed smallint not null default 0,
  unique(participant_id, date)
);

create index idx_challenge_daily_participant on challenge_daily_progress(participant_id);
create index idx_challenge_daily_date on challenge_daily_progress(date);

-- RLS
alter table challenges enable row level security;
create policy "Anyone can view public challenges" on challenges for select using (is_public or created_by = auth.uid());
create policy "Users can create challenges" on challenges for insert with check (created_by = auth.uid());
create policy "Users can update own challenges" on challenges for update using (created_by = auth.uid());

alter table challenge_participants enable row level security;
create policy "Users can view participants" on challenge_participants for select using (true);
create policy "Users can join challenges" on challenge_participants for insert with check (user_id = auth.uid());
create policy "Users can update own progress" on challenge_participants for update using (user_id = auth.uid());

alter table challenge_daily_progress enable row level security;
create policy "Users can view challenge progress" on challenge_daily_progress for select using (
  exists (select 1 from challenge_participants where id = participant_id)
);
create policy "Users can insert own progress" on challenge_daily_progress for insert with check (
  exists (select 1 from challenge_participants where id = participant_id and user_id = auth.uid())
);
create policy "Users can update own progress" on challenge_daily_progress for update using (
  exists (select 1 from challenge_participants where id = participant_id and user_id = auth.uid())
);
