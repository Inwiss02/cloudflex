-- Create function to verify admin password
create or replace function verify_admin_password(admin_email text, admin_password text)
returns boolean as $$
declare
  stored_hash text;
begin
  -- Get the stored password hash
  select password_hash into stored_hash
  from public.admins
  where email = admin_email;
  
  -- Return null if admin not found
  if stored_hash is null then
    return false;
  end if;
  
  -- Verify password
  return stored_hash = crypt(admin_password, stored_hash);
end;
$$ language plpgsql security definer;
