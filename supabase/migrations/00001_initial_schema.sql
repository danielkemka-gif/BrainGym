-- BrainGym — Initial Schema
-- All tables, indexes, RLS policies

-- 0. Extensions
create extension if not exists "pgcrypto";

-- 1. Profiles
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  name text,
  avatar_url text,
  age smallint check (age >= 13 and age <= 120),
  occupation text,
  goals jsonb default '[]'::jsonb,
  challenges jsonb default '[]'::jsonb,
  preferred_workout_time time,
  onboarding_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_profiles_user_id on profiles(user_id);

-- 2. Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  icon text,
  color text,
  sort_order smallint default 0
);

-- 3. Activities
create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  title text not null,
  description text,
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  estimated_time smallint not null check (estimated_time > 0),
  xp smallint not null default 10,
  coins smallint not null default 5,
  benefits jsonb default '[]'::jsonb,
  instructions text,
  tips text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create index idx_activities_category on activities(category_id);
create index idx_activities_active on activities(is_active) where is_active = true;

-- 4. Daily Workouts
create table if not exists daily_workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed')),
  total_xp smallint default 0,
  total_coins smallint default 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);

create unique index idx_daily_workouts_user_date on daily_workouts(user_id, date);
create index idx_daily_workouts_status on daily_workouts(status) where status = 'pending';

-- 5. Workout Items
create table if not exists workout_items (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references daily_workouts(id) on delete cascade,
  activity_id uuid not null references activities(id) on delete cascade,
  sort_order smallint not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'skipped')),
  completed_at timestamptz,
  duration_minutes smallint,
  notes text,
  created_at timestamptz default now()
);

create index idx_workout_items_workout on workout_items(workout_id);

-- 6. Missions
create table if not exists missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  duration_days smallint not null check (duration_days in (7, 14, 21, 30)),
  started_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'completed', 'failed')),
  completed_at timestamptz,
  created_at timestamptz default now()
);

create index idx_missions_user on missions(user_id);
create index idx_missions_status on missions(status) where status = 'active';

-- 7. Mission Progress
create table if not exists mission_progress (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references missions(id) on delete cascade,
  day smallint not null check (day > 0 and day <= 30),
  activity_id uuid references activities(id) on delete set null,
  completed boolean default false,
  completed_at timestamptz
);

create unique index idx_mission_progress_day on mission_progress(mission_id, day);
create index idx_mission_progress_mission on mission_progress(mission_id);

-- 8. Brain Scores
create table if not exists brain_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  category_id uuid not null references categories(id) on delete cascade,
  score smallint not null check (score >= 0 and score <= 100),
  delta smallint,
  created_at timestamptz default now()
);

create index idx_brain_scores_user_date on brain_scores(user_id, date);
create index idx_brain_scores_user_category on brain_scores(user_id, category_id);

-- 9. Activity Logs (immutable ledger)
create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_id uuid not null references activities(id) on delete cascade,
  date date not null,
  xp_earned smallint not null,
  coins_earned smallint not null,
  duration_minutes smallint,
  created_at timestamptz default now()
);

create index idx_activity_logs_user_date on activity_logs(user_id, date);

-- 10. Streaks
create table if not exists streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_workout_date date,
  updated_at timestamptz default now()
);

create index idx_streaks_user on streaks(user_id);

-- 11. Achievements
create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_type text not null,
  unlocked_at timestamptz not null default now(),
  xp_reward smallint not null default 100
);

create index idx_achievements_user on achievements(user_id);
create unique index idx_achievements_user_type on achievements(user_id, achievement_type);

-- 12. XP Ledger (immutable)
create table if not exists xp_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  reason text not null,
  reference_type text,
  reference_id uuid,
  created_at timestamptz default now()
);

create index idx_xp_ledger_user on xp_ledger(user_id);
create index idx_xp_ledger_created on xp_ledger(created_at desc);

-- 13. Coins Ledger (immutable)
create table if not exists coins_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  reason text not null,
  reference_type text,
  reference_id uuid,
  created_at timestamptz default now()
);

create index idx_coins_ledger_user on coins_ledger(user_id);
create index idx_coins_ledger_created on coins_ledger(created_at desc);

-- 14. User Levels
create table if not exists user_levels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  level smallint not null default 1,
  title text not null default 'Bronze',
  total_xp integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_user_levels on user_levels(user_id);

-- 15. Decision Lab Entries
create table if not exists decision_lab_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scenario text not null,
  response text,
  ai_evaluation jsonb,
  week_start date not null,
  created_at timestamptz default now()
);

create index idx_decision_lab_user_week on decision_lab_entries(user_id, week_start);

-- 16. AI Feedback
create table if not exists ai_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feedback_type text not null,
  message text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

create index idx_ai_feedback_user on ai_feedback(user_id);

-- 17. Notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  read boolean default false,
  scheduled_for timestamptz,
  created_at timestamptz default now()
);

create index idx_notifications_user_unread on notifications(user_id, read) where read = false;

-- 18. Subscriptions
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  stripe_id text,
  status text not null default 'active',
  period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_subscriptions_user on subscriptions(user_id);

-- 19. User Settings
create table if not exists user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  dark_mode boolean default true,
  notifications_enabled boolean default true,
  workout_reminder_time time default '08:00'::time,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_user_settings_user on user_settings(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Helper: check if user is admin (based on user_metadata or a dedicated admins table)
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (select raw_user_meta_data->>'role' from auth.users where id = auth.uid()) = 'admin',
    false
  );
$$;

-- Profiles
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (user_id = auth.uid());
create policy "Users can insert own profile" on profiles for insert with check (user_id = auth.uid());
create policy "Users can update own profile" on profiles for update using (user_id = auth.uid());
create policy "Admins can view all profiles" on profiles for select using (is_admin());

-- Categories (public read)
alter table categories enable row level security;
create policy "Anyone can read categories" on categories for select using (true);
create policy "Admins can manage categories" on categories for all using (is_admin());

-- Activities (public read)
alter table activities enable row level security;
create policy "Anyone can read activities" on activities for select using (true);
create policy "Admins can manage activities" on activities for all using (is_admin());

-- Daily Workouts
alter table daily_workouts enable row level security;
create policy "Users can view own workouts" on daily_workouts for select using (user_id = auth.uid());
create policy "Users can create own workouts" on daily_workouts for insert with check (user_id = auth.uid());
create policy "Users can update own workouts" on daily_workouts for update using (user_id = auth.uid());

-- Workout Items
alter table workout_items enable row level security;
create policy "Users can view own workout items" on workout_items for select using (
  exists (select 1 from daily_workouts where id = workout_id and user_id = auth.uid())
);
create policy "Users can insert own workout items" on workout_items for insert with check (
  exists (select 1 from daily_workouts where id = workout_id and user_id = auth.uid())
);
create policy "Users can update own workout items" on workout_items for update using (
  exists (select 1 from daily_workouts where id = workout_id and user_id = auth.uid())
);

-- Missions
alter table missions enable row level security;
create policy "Users can view own missions" on missions for select using (user_id = auth.uid());
create policy "Users can create own missions" on missions for insert with check (user_id = auth.uid());
create policy "Users can update own missions" on missions for update using (user_id = auth.uid());

-- Mission Progress
alter table mission_progress enable row level security;
create policy "Users can view own mission progress" on mission_progress for select using (
  exists (select 1 from missions where id = mission_id and user_id = auth.uid())
);
create policy "Users can update own mission progress" on mission_progress for insert with check (
  exists (select 1 from missions where id = mission_id and user_id = auth.uid())
);
create policy "Users can update own mission progress" on mission_progress for update using (
  exists (select 1 from missions where id = mission_id and user_id = auth.uid())
);

-- Brain Scores
alter table brain_scores enable row level security;
create policy "Users can view own scores" on brain_scores for select using (user_id = auth.uid());
create policy "Users can insert own scores" on brain_scores for insert with check (user_id = auth.uid());

-- Activity Logs
alter table activity_logs enable row level security;
create policy "Users can view own logs" on activity_logs for select using (user_id = auth.uid());
create policy "Users can insert own logs" on activity_logs for insert with check (user_id = auth.uid());

-- Streaks
alter table streaks enable row level security;
create policy "Users can view own streak" on streaks for select using (user_id = auth.uid());
create policy "Users can update own streak" on streaks for insert with check (user_id = auth.uid());
create policy "Users can update own streak" on streaks for update using (user_id = auth.uid());

-- Achievements
alter table achievements enable row level security;
create policy "Users can view own achievements" on achievements for select using (user_id = auth.uid());
create policy "Users can earn achievements" on achievements for insert with check (user_id = auth.uid());

-- XP Ledger
alter table xp_ledger enable row level security;
create policy "Users can view own XP" on xp_ledger for select using (user_id = auth.uid());
create policy "System can insert XP" on xp_ledger for insert with check (true);

-- Coins Ledger
alter table coins_ledger enable row level security;
create policy "Users can view own coins" on coins_ledger for select using (user_id = auth.uid());
create policy "System can insert coins" on coins_ledger for insert with check (true);

-- User Levels
alter table user_levels enable row level security;
create policy "Users can view own level" on user_levels for select using (user_id = auth.uid());
create policy "System can manage levels" on user_levels for all using (true);

-- Decision Lab
alter table decision_lab_entries enable row level security;
create policy "Users can view own entries" on decision_lab_entries for select using (user_id = auth.uid());
create policy "Users can create own entries" on decision_lab_entries for insert with check (user_id = auth.uid());

-- AI Feedback
alter table ai_feedback enable row level security;
create policy "Users can view own feedback" on ai_feedback for select using (user_id = auth.uid());
create policy "System can create feedback" on ai_feedback for insert with check (true);

-- Notifications
alter table notifications enable row level security;
create policy "Users can view own notifications" on notifications for select using (user_id = auth.uid());
create policy "System can create notifications" on notifications for insert with check (true);
create policy "Users can update own notifications" on notifications for update using (user_id = auth.uid());

-- Subscriptions
alter table subscriptions enable row level security;
create policy "Users can view own subscription" on subscriptions for select using (user_id = auth.uid());
create policy "System can manage subscriptions" on subscriptions for all using (true);

-- User Settings
alter table user_settings enable row level security;
create policy "Users can view own settings" on user_settings for select using (user_id = auth.uid());
create policy "Users can manage own settings" on user_settings for insert with check (user_id = auth.uid());
create policy "Users can update own settings" on user_settings for update using (user_id = auth.uid());

-- ============================================================================
-- TRIGGER: auto-create profile + settings on user signup
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (user_id)
  values (new.id);

  insert into public.user_settings (user_id)
  values (new.id);

  insert into public.streaks (user_id)
  values (new.id);

  insert into public.user_levels (user_id)
  values (new.id);

  insert into public.subscriptions (user_id, status)
  values (new.id, 'trialing');

  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- TRIGGER: updated_at helpers
-- ============================================================================
create or replace function public.update_updated_at()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_profiles_updated_at
  before update on profiles
  for each row execute function public.update_updated_at();

create trigger update_streaks_updated_at
  before update on streaks
  for each row execute function public.update_updated_at();

create trigger update_user_levels_updated_at
  before update on user_levels
  for each row execute function public.update_updated_at();

create trigger update_subscriptions_updated_at
  before update on subscriptions
  for each row execute function public.update_updated_at();

create trigger update_user_settings_updated_at
  before update on user_settings
  for each row execute function public.update_updated_at();
