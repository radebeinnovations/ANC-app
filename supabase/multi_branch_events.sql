-- ANC Unity multi-branch event targeting.
--
-- Run this ONCE in the Supabase SQL Editor, after:
--   1. supabase/chat_schema.sql
--   2. supabase/events_dashboard.sql
--   3. supabase/admin_role_management.sql (if organiser management is enabled)
--
-- This is a forward-only migration. It keeps public.community_events.branch_name
-- as a legacy/display value, backfills every existing branch event into the new
-- normalized target table, and then makes the target table the source of truth
-- for new and multi-branch events. Do not edit or rerun the older migrations.
--
-- Event rules after this migration:
--   * Super Admins can publish to one branch, several branches, or nationally.
--   * Branch Organisers can publish to exactly their assigned branch.
--   * National events have no branch targets and are visible to all members.
--   * Branch events are visible only to members whose branch is in the target
--     list. Existing one-branch events remain visible as before.

begin;

-- A normalized many-to-many target list. The primary key prevents duplicate
-- exact values; the expression index below also prevents case-only duplicates.
create table if not exists public.event_branch_targets (
  event_id uuid not null references public.community_events(id) on delete cascade,
  branch_name text not null check (
    char_length(btrim(branch_name)) > 0
    and branch_name = btrim(branch_name)
  ),
  created_at timestamptz not null default now(),
  primary key (event_id, branch_name)
);

create index if not exists event_branch_targets_branch_event_idx
  on public.event_branch_targets (lower(branch_name), event_id);

create unique index if not exists event_branch_targets_event_branch_ci_key
  on public.event_branch_targets (event_id, lower(branch_name));

alter table public.event_branch_targets enable row level security;

-- Backfill all existing branch-scoped events. The legacy branch_name column is
-- deliberately retained so older event rows and older clients still have a
-- useful display value while the application is upgraded.
insert into public.event_branch_targets (event_id, branch_name)
select e.id, btrim(e.branch_name)
from public.community_events e
where e.audience = 'branch'
  and nullif(btrim(e.branch_name), '') is not null
on conflict do nothing;

-- RLS policies should not rely on a caller being able to see every target row
-- when deciding whether a legacy event has been backfilled. This narrow helper
-- is SECURITY DEFINER solely so the policy can distinguish an empty target list
-- from a list targeting a different branch; it returns false for anonymous
-- callers and exposes no branch names or event details.
create or replace function public.event_has_branch_targets(target_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.event_branch_targets target
      where target.event_id = target_event_id
    );
$$;

-- A member may read only published events intended for their own branch, plus
-- national events. This replaces the older policy which exposed every
-- published branch event to every signed-in member through direct table reads.
drop policy if exists "Members can read published community events" on public.community_events;
drop policy if exists "Members can read published events in their scope" on public.community_events;
create policy "Members can read published events in their scope"
on public.community_events
for select
to authenticated
using (
  status = 'published'
  and (
    audience = 'national'
    or exists (
      select 1
      from public.profiles me
      where me.id = auth.uid()
        and (
          exists (
            select 1
            from public.event_branch_targets target
            where target.event_id = community_events.id
              and lower(target.branch_name) = lower(me.branch_name)
          )
          -- Fallback for any legacy row imported between the old migration and
          -- this backfill. New events always have explicit target rows.
          or (
            not public.event_has_branch_targets(community_events.id)
            and lower(community_events.branch_name) = lower(me.branch_name)
          )
        )
    )
  )
);

-- The target table is read-only to client roles. Its RLS rule only permits a
-- member to inspect target rows for their own branch. It intentionally does
-- not reference community_events: the community_events policy above queries
-- this table, and cross-referencing both policies would create an RLS cycle.
-- Event feeds use the controlled RPC below, which returns only published,
-- in-scope events and their complete target list.
drop policy if exists "Members can read event branch targets in their scope" on public.event_branch_targets;
create policy "Members can read event branch targets in their scope"
on public.event_branch_targets
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles me
    where me.id = auth.uid()
      and lower(event_branch_targets.branch_name) = lower(me.branch_name)
  )
);

revoke all on table public.event_branch_targets from public, anon;
grant select on table public.event_branch_targets to authenticated;

-- The controlled SECURITY DEFINER RPCs are the only client write path for
-- events. Explicitly keep direct writes closed even if table defaults change.
revoke insert, update, delete on table public.community_events from anon, authenticated;
revoke insert, update, delete on table public.event_branch_targets from authenticated;
grant select on table public.community_events to authenticated;

-- admin_list_events() and get_my_published_events() gain target_branches.
-- PostgreSQL cannot change a function's OUT columns in place, so the old
-- functions are intentionally dropped without CASCADE and recreated below.
-- Dropping rsvp_to_event first avoids a dependency on the previous feed shape.
drop function if exists public.rsvp_to_event(uuid, text);
drop function if exists public.get_my_published_events();
drop function if exists public.admin_list_events();

-- Replace the older single-text branch RPC signature. It is dropped explicitly
-- rather than left as an overload so older clients cannot bypass the new
-- multi-branch permission checks. The application must call event_branches.
drop function if exists public.admin_create_event(
  text, timestamptz, text, timestamptz, text, text, text, text
);

create or replace function public.admin_dashboard_stats()
returns table(member_count bigint, published_event_count bigint, rsvp_count bigint)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_role text;
  current_branch text;
begin
  select ar.role, ar.branch_name
  into current_role, current_branch
  from public.admin_roles ar
  where ar.user_id = auth.uid();

  if current_role is null then
    raise exception 'Dashboard access denied';
  end if;

  return query
  select
    (
      select count(*)
      from public.profiles p
      where current_role = 'super_admin'
        or lower(p.branch_name) = lower(current_branch)
    ),
    (
      select count(*)
      from public.community_events e
      where e.status = 'published'
        and (
          current_role = 'super_admin'
          or (
            e.audience = 'branch'
            and (
              exists (
                select 1
                from public.event_branch_targets target
                where target.event_id = e.id
                  and lower(target.branch_name) = lower(current_branch)
              )
              or (
              not exists (
                  select 1
                  from public.event_branch_targets target
                  where target.event_id = e.id
                )
                and lower(e.branch_name) = lower(current_branch)
              )
            )
          )
        )
    ),
    (
      select count(*)
      from public.event_rsvps r
      join public.community_events e on e.id = r.event_id
      where current_role = 'super_admin'
        or (
          e.audience = 'branch'
          and (
            exists (
              select 1
              from public.event_branch_targets target
              where target.event_id = e.id
                and lower(target.branch_name) = lower(current_branch)
            )
            or (
              not exists (
                select 1
                from public.event_branch_targets target
                where target.event_id = e.id
              )
              and lower(e.branch_name) = lower(current_branch)
            )
          )
        )
    );
end;
$$;

create function public.admin_list_events()
returns table(
  id uuid,
  title text,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  venue text,
  location text,
  branch_name text,
  target_branches text[],
  audience text,
  status text,
  rsvp_count bigint
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_role text;
  current_branch text;
begin
  select ar.role, ar.branch_name
  into current_role, current_branch
  from public.admin_roles ar
  where ar.user_id = auth.uid();

  if current_role is null then
    raise exception 'Dashboard access denied';
  end if;

  return query
  with target_lists as (
    select
      target.event_id,
      array_agg(target.branch_name order by lower(target.branch_name), target.branch_name) as target_branches
    from public.event_branch_targets target
    group by target.event_id
  ),
  rsvp_totals as (
    select r.event_id, count(*)::bigint as rsvp_count
    from public.event_rsvps r
    group by r.event_id
  )
  select
    e.id,
    e.title,
    e.description,
    e.starts_at,
    e.ends_at,
    e.venue,
    e.location,
    -- This remains a text display field for existing clients. New clients
    -- should use target_branches for a structured, complete target list.
    coalesce(nullif(array_to_string(targets.target_branches, ', '), ''), e.branch_name) as branch_name,
    coalesce(
      targets.target_branches,
      case
        when e.audience = 'branch' and e.branch_name is not null then array[e.branch_name]
        else array[]::text[]
      end
    ) as target_branches,
    e.audience,
    e.status,
    coalesce(rsvps.rsvp_count, 0)::bigint as rsvp_count
  from public.community_events e
  left join target_lists targets on targets.event_id = e.id
  left join rsvp_totals rsvps on rsvps.event_id = e.id
  where current_role = 'super_admin'
    or (
      e.audience = 'branch'
      and (
        exists (
          select 1
          from public.event_branch_targets target
          where target.event_id = e.id
            and lower(target.branch_name) = lower(current_branch)
        )
        or (
          not exists (
            select 1
            from public.event_branch_targets target
            where target.event_id = e.id
          )
          and lower(e.branch_name) = lower(current_branch)
        )
      )
    )
  order by e.starts_at asc;
end;
$$;

create function public.admin_create_event(
  event_title text,
  starts_at timestamptz,
  event_description text default null,
  ends_at timestamptz default null,
  event_branches text[] default null,
  event_audience text default 'branch',
  event_venue text default null,
  event_location text default null
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
  normalized_branches text[] := array[]::text[];
  new_event uuid;
begin
  if auth.uid() is null then
    raise exception 'Dashboard access denied';
  end if;

  select ar.role, ar.branch_name
  into current_role, current_branch
  from public.admin_roles ar
  where ar.user_id = auth.uid();

  if current_role is null then
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

  -- Trim values, discard blanks, and collapse case-insensitive duplicates.
  select coalesce(
    array_agg(clean.branch_name order by clean.branch_key, clean.branch_name),
    array[]::text[]
  )
  into normalized_branches
  from (
    select
      lower(btrim(input.branch_name)) as branch_key,
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

    -- An omitted list safely defaults to the organiser's own branch. Any
    -- supplied list must contain exactly that one branch, case-insensitively.
    if cardinality(normalized_branches) = 0 then
      normalized_branches := array[btrim(current_branch)];
    elsif cardinality(normalized_branches) <> 1
      or lower(normalized_branches[1]) <> lower(btrim(current_branch)) then
      raise exception 'Branch Organisers can publish only to their assigned branch';
    else
      normalized_branches := array[btrim(current_branch)];
    end if;
  elsif current_role = 'super_admin' then
    if requested_audience = 'national' then
      if cardinality(normalized_branches) <> 0 then
        raise exception 'National events cannot have branch targets';
      end if;
    elsif cardinality(normalized_branches) = 0 then
      raise exception 'Choose at least one branch for a branch event';
    end if;
  else
    raise exception 'Dashboard access denied';
  end if;

  insert into public.community_events (
    title,
    description,
    starts_at,
    ends_at,
    venue,
    location,
    -- Keep a useful legacy value: the first selected target for branch events.
    branch_name,
    audience,
    status,
    created_by
  )
  values (
    btrim(event_title),
    nullif(btrim(event_description), ''),
    starts_at,
    ends_at,
    nullif(btrim(event_venue), ''),
    nullif(btrim(event_location), ''),
    case when requested_audience = 'branch' then normalized_branches[1] else null end,
    requested_audience,
    'published',
    auth.uid()
  )
  returning id into new_event;

  if requested_audience = 'branch' then
    insert into public.event_branch_targets (event_id, branch_name)
    select new_event, target.branch_name
    from unnest(normalized_branches) as target(branch_name);
  end if;

  return new_event;
end;
$$;

create function public.get_my_published_events()
returns table(
  id uuid,
  title text,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  venue text,
  location text,
  branch_name text,
  target_branches text[],
  audience text,
  rsvp_response text
)
language sql
security definer
set search_path = public, pg_temp
as $$
  with target_lists as (
    select
      target.event_id,
      array_agg(target.branch_name order by lower(target.branch_name), target.branch_name) as target_branches
    from public.event_branch_targets target
    group by target.event_id
  )
  select
    e.id,
    e.title,
    e.description,
    e.starts_at,
    e.ends_at,
    e.venue,
    e.location,
    coalesce(nullif(array_to_string(targets.target_branches, ', '), ''), e.branch_name) as branch_name,
    coalesce(
      targets.target_branches,
      case
        when e.audience = 'branch' and e.branch_name is not null then array[e.branch_name]
        else array[]::text[]
      end
    ) as target_branches,
    e.audience,
    r.response as rsvp_response
  from public.community_events e
  join public.profiles me on me.id = auth.uid()
  left join target_lists targets on targets.event_id = e.id
  left join public.event_rsvps r
    on r.event_id = e.id
   and r.user_id = auth.uid()
  where e.status = 'published'
    and e.starts_at >= now()
    and (
      e.audience = 'national'
      or exists (
        select 1
        from public.event_branch_targets target
        where target.event_id = e.id
          and lower(target.branch_name) = lower(me.branch_name)
      )
      or (
        not exists (
          select 1
          from public.event_branch_targets target
          where target.event_id = e.id
        )
        and lower(e.branch_name) = lower(me.branch_name)
      )
    )
  order by e.starts_at asc
  limit 30;
$$;

create function public.rsvp_to_event(event_id uuid, response text)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if response not in ('going', 'interested', 'not_going') then
    raise exception 'Invalid RSVP response';
  end if;

  if not exists (
    select 1
    from public.get_my_published_events() event
    where event.id = event_id
  ) then
    raise exception 'This event is not available to you';
  end if;

  insert into public.event_rsvps (event_id, user_id, response)
  values (event_id, auth.uid(), response)
  on conflict (event_id, user_id) do update
    set response = excluded.response,
        updated_at = now();

  return response;
end;
$$;

-- Functions are never executable by anonymous users or PUBLIC. Regrant the
-- exact authenticated API surface after the function replacements above.
revoke all on function public.event_has_branch_targets(uuid) from public, anon, authenticated;
revoke all on function public.admin_dashboard_stats() from public, anon, authenticated;
revoke all on function public.admin_list_events() from public, anon, authenticated;
revoke all on function public.admin_create_event(
  text, timestamptz, text, timestamptz, text[], text, text, text
) from public, anon, authenticated;
revoke all on function public.get_my_published_events() from public, anon, authenticated;
revoke all on function public.rsvp_to_event(uuid, text) from public, anon, authenticated;

grant execute on function public.admin_dashboard_stats() to authenticated;
grant execute on function public.event_has_branch_targets(uuid) to authenticated;
grant execute on function public.admin_list_events() to authenticated;
grant execute on function public.admin_create_event(
  text, timestamptz, text, timestamptz, text[], text, text, text
) to authenticated;
grant execute on function public.get_my_published_events() to authenticated;
grant execute on function public.rsvp_to_event(uuid, text) to authenticated;

-- Ask PostgREST to refresh its RPC schema immediately after the signatures
-- above change. This is harmless on projects without a PostgREST listener.
notify pgrst, 'reload schema';

commit;
