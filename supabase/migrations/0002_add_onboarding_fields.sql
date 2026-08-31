-- remove assessment/progress data from the profile table
-- since these will belong to the assessment/progress domain

alter table public.profiles
drop column if exists grammar_progress,
  drop column if exists vocabulary_progress,
  drop column if exists weak_topics;