-- Add new admin user with custom credentials
insert into public.admins (email, password_hash, full_name)
values ('espaceclient@cloudflex.art', crypt('@Meryem1988', gen_salt('bf')), 'Administrateur CloudFlex')
on conflict (email) do update
set password_hash = crypt('@Meryem1988', gen_salt('bf')),
    full_name = 'Administrateur CloudFlex';
