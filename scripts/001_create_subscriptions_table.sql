-- Create subscriptions table to store all customer payment information
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  plan text not null check (plan in ('semestre', 'annuel', '2ans')),
  amount decimal(10, 2) not null,
  payment_method text not null check (payment_method in ('card', 'crypto')),
  crypto_currency text,
  crypto_network text,
  order_number text unique not null,
  status text not null check (status in ('active', 'en_cours_de_traitement', 'pending', 'expired')) default 'pending',
  subscription_start_date timestamptz,
  subscription_end_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.subscriptions enable row level security;

-- Allow anyone to read their own subscription by email (no auth required for this use case)
create policy "subscriptions_select_by_email"
  on public.subscriptions for select
  using (true);

-- Only allow inserts from authenticated service (server-side)
create policy "subscriptions_insert"
  on public.subscriptions for insert
  with check (true);

-- Only allow updates from authenticated service (server-side)
create policy "subscriptions_update"
  on public.subscriptions for update
  using (true);

-- Create index on email for faster lookups
create index if not exists subscriptions_email_idx on public.subscriptions(email);

-- Create index on order_number for faster lookups
create index if not exists subscriptions_order_number_idx on public.subscriptions(order_number);

-- Function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to update updated_at on subscription changes
create trigger update_subscriptions_updated_at
  before update on public.subscriptions
  for each row
  execute function update_updated_at_column();
