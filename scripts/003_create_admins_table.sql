-- Create admins table for admin authentication
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  full_name text,
  created_at timestamptz default now(),
  last_login timestamptz
);

-- Enable RLS
alter table public.admins enable row level security;

-- Allow admins to read their own data
create policy "admins_select_own"
  on public.admins for select
  using (true);

-- Create index on email for faster lookups
create index if not exists admins_email_idx on public.admins(email);

-- Insert a default admin (password is 'admin123' - CHANGE THIS IN PRODUCTION!)
insert into public.admins (email, password_hash, full_name)
values ('admin@cloudflex.com', crypt('admin123', gen_salt('bf')), 'Administrateur CloudFlex')
on conflict (email) do nothing;

-- Enable pgcrypto extension for password hashing if not already enabled
create extension if not exists pgcrypto;
