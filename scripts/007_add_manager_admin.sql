-- Add manager admin user
insert into public.admins (email, password_hash, full_name)
values ('manager@cloudflex.art', crypt('2025@2025', gen_salt('bf')), 'Manager CloudFlex')
on conflict (email) do update
set password_hash = crypt('2025@2025', gen_salt('bf')),
    full_name = 'Manager CloudFlex';
