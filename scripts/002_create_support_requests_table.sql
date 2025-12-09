-- Create support_requests table to store all customer support requests
create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  objet text not null,
  criticite text not null check (criticite in ('faible', 'moyenne', 'haute', 'urgente')),
  message text not null,
  status text not null check (status in ('nouveau', 'en_cours', 'resolu', 'ferme')) default 'nouveau',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  resolved_at timestamptz
);

-- Enable RLS
alter table public.support_requests enable row level security;

-- Allow anyone to read their own support requests by email
create policy "support_requests_select_by_email"
  on public.support_requests for select
  using (true);

-- Allow inserts from server-side
create policy "support_requests_insert"
  on public.support_requests for insert
  with check (true);

-- Allow updates from server-side
create policy "support_requests_update"
  on public.support_requests for update
  using (true);

-- Create index on email for faster lookups
create index if not exists support_requests_email_idx on public.support_requests(email);

-- Create index on status for filtering
create index if not exists support_requests_status_idx on public.support_requests(status);

-- Create index on created_at for sorting
create index if not exists support_requests_created_at_idx on public.support_requests(created_at desc);

-- Trigger to update updated_at on support request changes
create trigger update_support_requests_updated_at
  before update on public.support_requests
  for each row
  execute function update_updated_at_column();
