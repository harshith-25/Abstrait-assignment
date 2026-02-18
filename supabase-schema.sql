-- =============================================================
-- Markly — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- =============================================================

-- 1. Create the bookmarks table
create table if not exists public.bookmarks (
  id         uuid        default gen_random_uuid() primary key,
  user_id    uuid        references auth.users(id) on delete cascade not null,
  title      text        not null,
  url        text        not null,
  created_at timestamptz default now() not null
);

-- 2. Enable Row Level Security
alter table public.bookmarks enable row level security;

-- 3. RLS Policies — each user can only see/add/delete their own bookmarks
create policy "Users can view their own bookmarks"
  on public.bookmarks
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks"
  on public.bookmarks
  for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
  on public.bookmarks
  for delete
  using (auth.uid() = user_id);

-- 4. Index for faster queries per user
create index if not exists idx_bookmarks_user_id on public.bookmarks(user_id);

-- 5. Enable Realtime on the bookmarks table
-- Go to Supabase Dashboard → Database → Replication and add "bookmarks" to the
-- publication, OR run:
alter publication supabase_realtime add table public.bookmarks;
