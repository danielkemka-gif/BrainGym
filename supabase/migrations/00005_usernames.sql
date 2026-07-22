-- BrainGym — Add username to profiles

-- Add username column
alter table profiles add column if not exists username text unique;

-- Create index for fast lookups
create index if not exists idx_profiles_username on profiles(username);

-- Auto-generate username from name on profile creation/update
create or replace function generate_profile_username()
returns trigger as $$
declare
  clean_name text;
  adj text;
  noun text;
  num int;
  new_username text;
  adjectives text[] := ARRAY['brave','calm','eager','fair','glad','happy','keen','kind',
    'merry','nice','proud','quick','sharp','smart','swift','warm',
    'bold','cool','deep','fast','good','light','new','pure',
    'rare','safe','true','vast','wise','young'];
  nouns text[] := ARRAY['fox','owl','bear','wolf','hawk','lion','deer','lynx',
    'star','moon','sun','wave','tree','leaf','rain','wind',
    'fire','bolt','crest','drift','glow','peak','ridge','vale',
    'hawk','tern','swift','crow','dove','wren'];
begin
  -- Only generate if username is null and name exists
  if new.username is null and new.name is not null and new.name != '' then
    clean_name := lower(regexp_replace(new.name, '[^a-z]', '', 'g'));
    clean_name := left(clean_name, 8);

    -- Try up to 20 times to find a unique username
    for i in 1..20 loop
      adj := adjectives[floor(random() * array_length(adjectives, 1) + 1)::int];
      noun := nouns[floor(random() * array_length(nouns, 1) + 1)::int];
      num := floor(random() * 900 + 100)::int;
      new_username := clean_name || adj || num;

      -- Check uniqueness
      if not exists (select 1 from profiles where username = new_username) then
        new.username := new_username;
        return new;
      end if;
    end loop;

    -- Fallback: append uuid suffix
    new.username := clean_name || left(gen_random_uuid()::text, 6);
  end if;

  return new;
end;
$$ language plpgsql;

create trigger auto_generate_username
  before insert or update on profiles
  for each row
  execute function generate_profile_username();
