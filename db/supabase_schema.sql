-- Create a table for clients
create table "clients-real-estate" (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  password text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Optional but recommended)
alter table "clients-real-estate" enable row level security;

-- Allow read access to authenticated users (or service role) only
create policy "Allow read access to service role"
on "clients-real-estate"
for select
to service_role
using (true);

-- Add role and generation_count columns (Run this if table already exists)
alter table "clients-real-estate" 
add column role text default 'general',
add column generation_count int default 0;

-- Add unlimited column for users with no generation limits
-- Run this migration: ALTER TABLE "clients-real-estate" ADD COLUMN unlimited boolean DEFAULT false;
-- Then set unlimited = true for specific users:
-- UPDATE "clients-real-estate" SET unlimited = true WHERE email = 'primacasa@rinovaai.com';
-- UPDATE "clients-real-estate" SET unlimited = true WHERE email = 'onur5celik8@gmail.com';
-- Documentation for Role Limits:
-- paid: Unlimited
-- admin: Unlimited
-- trial: 100 generations
-- general: 3 generations
COMMENT ON COLUMN "clients-real-estate".role IS 'Role of the user. Limits: paid=Unlimited, admin=Unlimited, trial=100, general=3';
