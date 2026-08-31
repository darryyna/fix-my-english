create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users (id)
    on delete cascade,

  suggested_level text not null
    check (suggested_level in ('B1', 'B1+', 'B2', 'B2+', 'C1')),

  grammar_score numeric(5,2) not null
    check (grammar_score between 0 and 100),

  vocabulary_score numeric(5,2) not null
    check (vocabulary_score between 0 and 100),

  completed_at timestamptz not null default now(),

  created_at timestamptz not null default now()
);

comment on table public.assessments is
  'Completed English assessments and their overall results.';


create table if not exists public.assessment_weak_topics (
  id uuid primary key default gen_random_uuid(),

  assessment_id uuid not null
    references public.assessments (id)
    on delete cascade,

  category text not null
    check (category in ('grammar', 'vocabulary')),

  topic text not null,

  score numeric(5,2) not null
    check (score between 0 and 100),

  created_at timestamptz not null default now()
);

comment on table public.assessment_weak_topics is
  'Topics identified as weak during an assessment.';


-- ============================================================
-- Indexes
-- ============================================================

create index if not exists assessments_user_id_idx
  on public.assessments (user_id);

create index if not exists assessment_weak_topics_assessment_id_idx
  on public.assessment_weak_topics (assessment_id);


-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.assessments enable row level security;
alter table public.assessment_weak_topics enable row level security;


-- Users can read their own assessments.

create policy "Assessments are viewable by owner"
on public.assessments
for select
using (auth.uid() = user_id);


-- Users can create assessments for themselves.

create policy "Assessments are insertable by owner"
on public.assessments
for insert
with check (auth.uid() = user_id);


-- Assessment results should not be edited after completion.

-- No UPDATE policy intentionally.


-- Users can read weak topics belonging to their own assessments.

create policy "Assessment weak topics are viewable by owner"
on public.assessment_weak_topics
for select
using (
  exists (
    select 1
    from public.assessments
    where assessments.id = assessment_weak_topics.assessment_id
      and assessments.user_id = auth.uid()
  )
);


-- Users can create weak topics only for their own assessments.

create policy "Assessment weak topics are insertable by owner"
on public.assessment_weak_topics
for insert
with check (
  exists (
    select 1
    from public.assessments
    where assessments.id = assessment_weak_topics.assessment_id
      and assessments.user_id = auth.uid()
  )
);


-- No UPDATE/DELETE policies intentionally.
```
