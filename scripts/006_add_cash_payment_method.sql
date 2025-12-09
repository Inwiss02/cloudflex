-- Add 'cash' to the payment_method check constraint
alter table public.subscriptions
drop constraint if exists subscriptions_payment_method_check;

alter table public.subscriptions
add constraint subscriptions_payment_method_check
check (payment_method in ('card', 'crypto', 'cash'));
