-- ANC Unity organiser-role management.
--
-- Run order:
--   1. supabase/chat_schema.sql
--   2. supabase/events_dashboard.sql
--   3. supabase/admin_role_management.sql (this file)
--
-- Initial bootstrap (run once, manually, in the Supabase SQL editor as a
-- project administrator):
--   1. Have the first intended Super Admin create and verify an ANC Unity
--      account so they have a public.profiles row.
--   2. Replace YOUR_ADMIN_EMAIL below and run the statement separately.
--   3. From then on, only an existing Super Admin can assign or remove
--      organiser roles through the RPCs in this file.
--
-- Do not grant direct INSERT, UPDATE, DELETE, or SELECT access to
-- public.admin_roles for client roles. These SECURITY DEFINER functions are
-- the only client-facing path for organiser-role management.
--
-- insert into public.admin_roles (user_id, role, branch_name)
-- select id, 'super_admin', null
-- from auth.users
-- where email = 'YOUR_ADMIN_EMAIL'
-- on conflict (user_id) do update
--   set role = excluded.role, branch_name = excluded.branch_name;

-- Lists every registered member so a Super Admin can find someone to assign.
-- Email addresses and phone numbers are deliberately excluded. The directory
-- only contains the member profile fields required for role management.
create or replace function public.admin_list_organiser_directory()
returns table(
  user_id uuid,
  full_name text,
  membership_number text,
  member_branch_name text,
  role text,
  organiser_branch_name text,
  role_assigned_at timestamptz,
  member_created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not exists (
    select 1
    from public.admin_roles ar
    where ar.user_id = auth.uid()
      and ar.role = 'super_admin'
  ) then
    raise exception 'Super Admin access is required to manage organiser roles';
  end if;

  return query
  select
    p.id,
    p.full_name,
    p.membership_number,
    p.branch_name,
    ar.role,
    ar.branch_name,
    ar.created_at,
    p.created_at
  from public.profiles p
  left join public.admin_roles ar on ar.user_id = p.id
  order by
    case when ar.role is null then 1 else 0 end,
    p.full_name asc,
    p.created_at asc;
end;
$$;

-- Assigns a role or updates an existing organiser role.
-- Branch organisers must be assigned to their registered member branch. This
-- avoids silently creating misspelled branch scopes while there is no separate
-- branches table in the current schema. Super Admin roles always have a NULL
-- branch scope.
create or replace function public.admin_assign_organiser_role(
  target_user_id uuid,
  target_role text,
  target_branch text default null
)
returns table(user_id uuid, role text, branch_name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text := lower(nullif(trim(target_role), ''));
  requested_branch text := nullif(trim(target_branch), '');
  member_branch text;
begin
  if auth.uid() is null or not exists (
    select 1
    from public.admin_roles ar
    where ar.user_id = auth.uid()
      and ar.role = 'super_admin'
  ) then
    raise exception 'Super Admin access is required to manage organiser roles';
  end if;

  if target_user_id is null then
    raise exception 'A member must be selected';
  end if;

  select p.branch_name
  into member_branch
  from public.profiles p
  where p.id = target_user_id;

  if not found then
    raise exception 'The selected member profile does not exist';
  end if;

  if requested_role is null
    or requested_role not in ('super_admin', 'branch_organiser') then
    raise exception 'Role must be super_admin or branch_organiser';
  end if;

  -- A caller must not be able to accidentally demote their own Super Admin
  -- account and lock themselves out of the role-management screen.
  if target_user_id = auth.uid() and requested_role <> 'super_admin' then
    raise exception 'You cannot demote your own Super Admin role';
  end if;

  if requested_role = 'super_admin' then
    if requested_branch is not null then
      raise exception 'A Super Admin role cannot be limited to a branch';
    end if;
    requested_branch := null;
  else
    if requested_branch is null then
      raise exception 'A branch is required for a Branch Organiser role';
    end if;

    if member_branch is null or trim(member_branch) = '' then
      raise exception 'The selected member does not have a registered branch';
    end if;

    if lower(trim(member_branch)) <> lower(requested_branch) then
      raise exception 'A Branch Organiser must be assigned to the member''s registered branch';
    end if;

    -- Keep the canonical profile spelling, while matching case-insensitively.
    requested_branch := trim(member_branch);
  end if;

  insert into public.admin_roles (user_id, role, branch_name)
  values (target_user_id, requested_role, requested_branch)
  on conflict (user_id) do update
    set role = excluded.role,
        branch_name = excluded.branch_name;

  return query
  select ar.user_id, ar.role, ar.branch_name
  from public.admin_roles ar
  where ar.user_id = target_user_id;
end;
$$;

-- Removes an organiser role. A Super Admin cannot remove their own role, so
-- every successful call always leaves at least the acting Super Admin able to
-- continue managing access.
create or replace function public.admin_remove_organiser_role(target_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not exists (
    select 1
    from public.admin_roles ar
    where ar.user_id = auth.uid()
      and ar.role = 'super_admin'
  ) then
    raise exception 'Super Admin access is required to manage organiser roles';
  end if;

  if target_user_id is null then
    raise exception 'A member must be selected';
  end if;

  if target_user_id = auth.uid() then
    raise exception 'You cannot remove your own Super Admin role';
  end if;

  delete from public.admin_roles ar
  where ar.user_id = target_user_id;

  if not found then
    raise exception 'The selected member does not have an organiser role';
  end if;

  return true;
end;
$$;

-- Make the RPCs callable by signed-in users only. Each function repeats the
-- Super Admin check internally; authentication alone never grants access.
revoke all on function public.admin_list_organiser_directory() from public, anon, authenticated;
revoke all on function public.admin_assign_organiser_role(uuid, text, text) from public, anon, authenticated;
revoke all on function public.admin_remove_organiser_role(uuid) from public, anon, authenticated;

grant execute on function public.admin_list_organiser_directory() to authenticated;
grant execute on function public.admin_assign_organiser_role(uuid, text, text) to authenticated;
grant execute on function public.admin_remove_organiser_role(uuid) to authenticated;
