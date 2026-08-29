-- ============================================================
-- 0001_create_profiles.sql
-- First table: user profiles (level, goals, progress, weak topics)

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id                    uuid primary key references auth.users (id) on delete cascade,
  email                 text,
  full_name             text,
  avatar_url            text,

  current_level         text check (current_level in ('B1','B1+','B2','B2+','C1')),
  target_level           text check (target_level in ('B1','B1+','B2','B2+','C1')),

  goal                  text check (goal in ('general','travel','business','custom')),
  custom_goal_topic      text,
  focus                 text[] default '{}',            -- e.g. {"grammar","vocabulary"}
  daily_goal_minutes     integer default 10 check (daily_goal_minutes in (5,10,15,20,30)),

  grammar_progress       numeric(5,2) not null default 0 check (grammar_progress between 0 and 100),
  vocabulary_progress    numeric(5,2) not null default 0 check (vocabulary_progress between 0 and 100),
  learned_words_count    integer not null default 0,
  weak_topics           jsonb not null default '[]',    -- [{ "topic": "Articles", "progress": 42 }]

  assessment_completed   boolean not null default false,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

comment on table public.profiles is 'One row per user: level, goals, progress, weak topics.';

-- Keep updated_at fresh on every update
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security — every user can only see/edit their own row
-- ============================================================
alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No insert/delete policy for regular users on purpose:
-- rows are created by the handle_new_user() trigger (security definer)
-- and removed automatically via the "on delete cascade" from auth.users.
