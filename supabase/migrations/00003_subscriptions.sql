-- Subscriptions table for premium features (Paystack)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  paystack_customer_code text,
  paystack_subscription_code text unique,
  plan_tier text not null default 'premium' check (plan_tier in ('premium')),
  status text not null default 'incomplete' check (status in ('active', 'canceled', 'incomplete', 'past_due', 'trialing')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Unique constraint for one subscription per user
create unique index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);

-- Enable RLS
alter table public.subscriptions enable row level security;

-- RLS: users can read their own subscription
create policy "Users can read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- RLS: service role manages subscriptions (insert/update)
create policy "Service role manages subscriptions"
  on public.subscriptions for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Auto-create trial subscription record on user signup (14-day free trial)
create or replace function public.handle_new_user_subscription()
returns trigger as $$
begin
  insert into public.subscriptions (user_id, status, plan_tier, current_period_start, current_period_end)
  values (
    new.id,
    'trialing',
    'premium',
    now(),
    now() + interval '14 days'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_subscription on auth.users;
create trigger on_auth_user_created_subscription
  after insert on auth.users
  for each row execute function public.handle_new_user_subscription();

-- Updated_at trigger
create or replace function public.update_subscriptions_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.update_subscriptions_updated_at();

-- Index for lookups
create index if not exists idx_subscriptions_paystack_customer on public.subscriptions(paystack_customer_code);
create index if not exists idx_subscriptions_status on public.subscriptions(status);
