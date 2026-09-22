-- ANC Unity: repair organiser role actions and event publishing.
--
-- Run this ONCE in a *new, blank* Supabase SQL Editor query.
-- Paste the complete file, then click Run (not Run selected).
--
-- Safe repair: this does not remove member accounts, roles, RSVPs, or events.
-- It only replaces two dashboard RPC functions whose older versions can
-- incorrectly report an ambiguous `user_id` or "Dashboard access denied".

begin;

-- This repair expects the current multi-branch + event-hosting schema. Those
-- migrations are already required by the dashboard's branch-host controls.
do $$
begin
  if to_regclass('public.admin_roles') is null
    or to_regclass('public.community_events') is null
    or to_regclass('public.event_branch_targets') is null then
    raise exception 'Run chat_schema.sql, events_dashboard.sql, admin_role_management.sql, multi_branch_events.sql and event_hosting.sql before this repair.';
  end if;

  if not exists (
    select 1
    from pg_attribute attribute
    where attribute.attrelid = 'public.community_events'::regclass
      and attribute.attname = 'host_branch_name'
      and attribute.attnum > 0
      and not attribute.attisdropped
  ) then
    raise exception 'Run supabase/event_hosting.sql before this repair.';
  end if;
end;
$$;

-- Remove all previous publisher signatures so PostgREST can only resolve the
-- current host-aware RPC. The rows in community_events are not touched.
drop function if exists public.admin_create_event(
  text, timestamptz, text, timestamptz, text, text, text, text
);
drop function if exists public.admin_create_event(
  text, timestamptz, text, timestamptz, text[], text, text, text
);
drop function if exists public.admin_create_event(
  text, timestamptz, text, timestamptz, text[], text, text, text, text
);

create function public.admin_create_event(
  event_title text,
  starts_at timestamptz,
  event_description text default null,
  ends_at timestamptz default null,
  event_branches text[] default null,
  event_audience text default 'branch',
  event_venue text default null,
  event_location text default null,
  event_host_branch text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_role text;
  current_branch text;
  requested_audience text := lower(coalesce(nullif(btrim(event_audience), ''), 'branch'));
  requested_host_branch text := nullif(btrim(event_host_branch), '');
  normalized_branches text[] := array[]::text[];
  normalized_host_branch text;
  new_event uuid;
begin
  if auth.uid() is null then
    raise exception 'Dashboard access denied';
  end if;

  select ar.role, ar.branch_name
    into current_role, current_branch
  from public.admin_roles ar
  where ar.user_id = auth.uid();

  if current_role not in ('super_admin', 'branch_organiser') then
    raise exception 'Dashboard access denied';
  end if;

  if nullif(btrim(event_title), '') is null then
    raise exception 'An event title is required';
  end if;
  if starts_at is null then
    raise exception 'An event start date and time is required';
  end if;
  if ends_at is not null and ends_at < starts_at then
    raise exception 'The event end time cannot be before the start time';
  end if;
  if requested_audience not in ('branch', 'national') then
    raise exception 'Invalid event audience';
  end if;

  -- Clean values and remove duplicate branch names, without changing their
  -- readable profile spelling.
  select coalesce(
    array_agg(clean.branch_name order by clean.branch_key, clean.branch_name),
    array[]::text[]
  )
    into normalized_branches
  from (
    select lower(btrim(input.branch_name)) as branch_key,
           min(btrim(input.branch_name)) as branch_name
    from unnest(coalesce(event_branches, array[]::text[])) as input(branch_name)
    where nullif(btrim(input.branch_name), '') is not null
    group by lower(btrim(input.branch_name))
  ) clean;

  if current_role = 'branch_organiser' then
    if requested_audience <> 'branch' then
      raise exception 'Branch Organisers can publish only to their assigned branch';
    end if;
    if nullif(btrim(current_branch), '') is null then
      raise exception 'Your Branch Organiser role does not have a branch assignment';
    end if;
    if cardinality(normalized_branches) = 0 then
      normalized_branches := array[btrim(current_branch)];
    elsif cardinality(normalized_branches) <> 1
      or lower(normalized_branches[1]) <> lower(btrim(current_branch)) then
      raise exception 'Branch Organisers can publish only to their assigned branch';
    else
      normalized_branches := array[btrim(current_branch)];
    end if;
    if requested_host_branch is not null
      and lower(requested_host_branch) <> lower(btrim(current_branch)) then
      raise exception 'Branch Organisers must host events through their assigned branch';
    end if;
    normalized_host_branch := btrim(current_branch);
  elsif requested_audience = 'national' then
    if cardinality(normalized_branches) <> 0 then
      raise exception 'National events cannot have branch targets';
    end if;
    if requested_host_branch is not null then
      raise exception 'National events cannot have a hosting branch';
    end if;
    normalized_host_branch := null;
  else
    if cardinality(normalized_branches) = 0 then
      raise exception 'Choose at least one branch for a branch event';
    end if;
    if requested_host_branch is null then
      normalized_host_branch := normalized_branches[1];
    else
      select target.branch_name
        into normalized_host_branch
      from unnest(normalized_branches) as target(branch_name)
      where lower(target.branch_name) = lower(requested_host_branch)
      limit 1;
      if normalized_host_branch is null then
        raise exception 'The hosting branch must be one of the event target branches';
      end if;
    end if;
  end if;

  insert into public.community_events (
    title, description, starts_at, ends_at, venue, location,
    branch_name, host_branch_name, audience, status, created_by
  ) values (
    btrim(event_title),
    nullif(btrim(event_description), ''),
    starts_at,
    ends_at,
    nullif(btrim(event_venue), ''),
    nullif(btrim(event_location), ''),
    normalized_host_branch,
    normalized_host_branch,
    requested_audience,
    'published',
    auth.uid()
  ) returning id into new_event;

  if requested_audience = 'branch' then
    insert into public.event_branch_targets (event_id, branch_name)
    select new_event, target.branch_name
    from unnest(normalized_branches) as target(branch_name);
  end if;

  return new_event;
end;
$$;

-- This replacement keeps the existing role-management behaviour but avoids
-- the `on conflict (user_id)` ambiguity caused by its returned user_id field.
create or replace function public.admin_assign_organiser_role(
  target_user_id uuid,
  target_role text,
  target_branch text default null
)
returns table(user_id uuid, role text, branch_name text)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  requested_role text := lower(nullif(trim(target_role), ''));
  requested_branch text := nullif(trim(target_branch), '');
  member_branch text;
begin
  if auth.uid() is null or not exists (
    select 1 from public.admin_roles ar
    where ar.user_id = auth.uid() and ar.role = 'super_admin'
  ) then
    raise exception 'Super Admin access is required to manage organiser roles';
  end if;

  if target_user_id is null then
    raise exception 'A member must be selected';
  end if;

  select p.branch_name into member_branch
  from public.profiles p
  where p.id = target_user_id;
  if not found then
    raise exception 'The selected member profile does not exist';
  end if;

  if requested_role not in ('super_admin', 'branch_organiser') then
    raise exception 'Role must be super_admin or branch_organiser';
  end if;
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
    requested_branch := trim(member_branch);
  end if;

  insert into public.admin_roles (user_id, role, branch_name)
  values (target_user_id, requested_role, requested_branch)
  on conflict on constraint admin_roles_pkey do update
    set role = excluded.role,
        branch_name = excluded.branch_name;

  return query
  select ar.user_id, ar.role, ar.branch_name
  from public.admin_roles ar
  where ar.user_id = target_user_id;
end;
$$;

revoke all on function public.admin_create_event(
  text, timestamptz, text, timestamptz, text[], text, text, text, text
) from public, anon, authenticated;
revoke all on function public.admin_assign_organiser_role(uuid, text, text)
  from public, anon, authenticated;
grant execute on function public.admin_create_event(
  text, timestamptz, text, timestamptz, text[], text, text, text, text
) to authenticated;
grant execute on function public.admin_assign_organiser_role(uuid, text, text)
  to authenticated;

-- Makes the newly replaced RPC signatures available to the deployed app now.
notify pgrst, 'reload schema';

commit;
