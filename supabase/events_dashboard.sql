-- ANC Events Dashboard and member-facing event feed.
-- Run once in the Supabase SQL editor after chat_schema.sql.
-- Bootstrap a single real organiser by replacing YOUR_ADMIN_EMAIL below;
-- never grant dashboard access to every registered member.

create table if not exists public.admin_roles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role text not null check (role in ('super_admin', 'branch_organiser')),
  branch_name text,
  created_at timestamptz not null default now(),
  check ((role = 'super_admin') or (branch_name is not null and char_length(trim(branch_name)) > 0))
);

create table if not exists public.community_events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 2 and 160),
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue text,
  location text,
  branch_name text,
  audience text not null default 'branch' check (audience in ('branch', 'national')),
  status text not null default 'published' check (status in ('draft', 'published', 'cancelled')),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((audience = 'national') or (branch_name is not null and char_length(trim(branch_name)) > 0))
);

create table if not exists public.event_rsvps (
  event_id uuid not null references public.community_events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  response text not null check (response in ('going', 'interested', 'not_going')),
  updated_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create index if not exists community_events_published_starts_idx on public.community_events(status, starts_at);
create index if not exists event_rsvps_event_idx on public.event_rsvps(event_id);

alter table public.admin_roles enable row level security;
alter table public.community_events enable row level security;
alter table public.event_rsvps enable row level security;

-- Base policies deliberately expose no admin directory. The controlled RPCs
-- below provide only the fields each role needs.
drop policy if exists "Members can read published community events" on public.community_events;
create policy "Members can read published community events" on public.community_events
for select to authenticated using (status = 'published');
drop policy if exists "Members can read own event rsvps" on public.event_rsvps;
create policy "Members can read own event rsvps" on public.event_rsvps
for select to authenticated using (user_id = auth.uid());

create or replace function public.get_admin_scope()
returns table(role text, branch_name text)
language sql security definer set search_path = public as $$
  select ar.role, ar.branch_name from public.admin_roles ar where ar.user_id = auth.uid();
$$;

create or replace function public.admin_is_allowed(target_branch text default null, allow_national boolean default false)
returns boolean language plpgsql security definer set search_path = public as $$
declare current_role text; current_branch text;
begin
  select role, branch_name into current_role, current_branch from public.admin_roles where user_id = auth.uid();
  if current_role = 'super_admin' then return true; end if;
  if current_role = 'branch_organiser' and not allow_national and current_branch = target_branch then return true; end if;
  return false;
end;
$$;

create or replace function public.admin_dashboard_stats()
returns table(member_count bigint, published_event_count bigint, rsvp_count bigint)
language plpgsql security definer set search_path = public as $$
declare current_role text; current_branch text;
begin
  select role, branch_name into current_role, current_branch from public.admin_roles where user_id = auth.uid();
  if current_role is null then raise exception 'Dashboard access denied'; end if;
  return query select
    (select count(*) from public.profiles p where current_role = 'super_admin' or p.branch_name = current_branch),
    (select count(*) from public.community_events e where e.status = 'published' and (current_role = 'super_admin' or (e.audience = 'branch' and e.branch_name = current_branch))),
    (select count(*) from public.event_rsvps r join public.community_events e on e.id = r.event_id where current_role = 'super_admin' or (e.audience = 'branch' and e.branch_name = current_branch));
end;
$$;

create or replace function public.admin_list_members(search_text text default null)
returns table(id uuid, full_name text, membership_number text, branch_name text, created_at timestamptz)
language plpgsql security definer set search_path = public as $$
declare current_role text; current_branch text;
begin
  select role, branch_name into current_role, current_branch from public.admin_roles where user_id = auth.uid();
  if current_role is null then raise exception 'Dashboard access denied'; end if;
  return query select p.id, p.full_name, p.membership_number, p.branch_name, p.created_at
    from public.profiles p
    where (current_role = 'super_admin' or p.branch_name = current_branch)
      and (search_text is null or p.full_name ilike '%' || search_text || '%' or p.membership_number ilike '%' || search_text || '%')
    order by p.created_at desc limit 100;
end;
$$;

create or replace function public.admin_list_events()
returns table(id uuid, title text, description text, starts_at timestamptz, ends_at timestamptz, venue text, location text, branch_name text, audience text, status text, rsvp_count bigint)
language plpgsql security definer set search_path = public as $$
declare current_role text; current_branch text;
begin
  select role, branch_name into current_role, current_branch from public.admin_roles where user_id = auth.uid();
  if current_role is null then raise exception 'Dashboard access denied'; end if;
  return query select e.id, e.title, e.description, e.starts_at, e.ends_at, e.venue, e.location, e.branch_name, e.audience, e.status, count(r.user_id)
    from public.community_events e left join public.event_rsvps r on r.event_id = e.id
    where current_role = 'super_admin' or (e.audience = 'branch' and e.branch_name = current_branch)
    group by e.id order by e.starts_at asc;
end;
$$;

create or replace function public.admin_create_event(event_title text, starts_at timestamptz, event_description text default null, ends_at timestamptz default null, event_branch text default null, event_audience text default 'branch', event_venue text default null, event_location text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare current_role text; current_branch text; new_event uuid; target_branch text;
begin
  select role, branch_name into current_role, current_branch from public.admin_roles where user_id = auth.uid();
  if current_role is null then raise exception 'Dashboard access denied'; end if;
  if event_audience not in ('branch', 'national') then raise exception 'Invalid event audience'; end if;
  if current_role <> 'super_admin' and event_audience = 'national' then raise exception 'Only a Super Admin can publish national events'; end if;
  target_branch := case when event_audience = 'national' then null else coalesce(nullif(trim(event_branch), ''), current_branch) end;
  if event_audience = 'branch' and target_branch is null then raise exception 'A branch is required'; end if;
  if current_role = 'branch_organiser' and target_branch <> current_branch then raise exception 'You can only publish events for your assigned branch'; end if;
  insert into public.community_events(title, description, starts_at, ends_at, venue, location, branch_name, audience, status, created_by)
  values (trim(event_title), nullif(trim(event_description), ''), starts_at, ends_at, nullif(trim(event_venue), ''), nullif(trim(event_location), ''), target_branch, event_audience, 'published', auth.uid()) returning id into new_event;
  return new_event;
end;
$$;

create or replace function public.get_my_published_events()
returns table(id uuid, title text, description text, starts_at timestamptz, ends_at timestamptz, venue text, location text, branch_name text, audience text, rsvp_response text)
language sql security definer set search_path = public as $$
  select e.id, e.title, e.description, e.starts_at, e.ends_at, e.venue, e.location, e.branch_name, e.audience, r.response
  from public.community_events e
  join public.profiles me on me.id = auth.uid()
  left join public.event_rsvps r on r.event_id = e.id and r.user_id = auth.uid()
  where e.status = 'published' and e.starts_at >= now()
    and (e.audience = 'national' or e.branch_name = me.branch_name)
  order by e.starts_at asc limit 30;
$$;

create or replace function public.rsvp_to_event(event_id uuid, response text)
returns text language plpgsql security definer set search_path = public as $$
begin
  if response not in ('going', 'interested', 'not_going') then raise exception 'Invalid RSVP response'; end if;
  if not exists (select 1 from public.get_my_published_events() e where e.id = event_id) then raise exception 'This event is not available to you'; end if;
  insert into public.event_rsvps(event_id, user_id, response) values (event_id, auth.uid(), response)
  on conflict (event_id, user_id) do update set response = excluded.response, updated_at = now();
  return response;
end;
$$;

revoke all on function public.get_admin_scope() from public;
revoke all on function public.admin_dashboard_stats() from public;
revoke all on function public.admin_list_members(text) from public;
revoke all on function public.admin_list_events() from public;
revoke all on function public.admin_create_event(text, timestamptz, text, timestamptz, text, text, text, text) from public;
revoke all on function public.get_my_published_events() from public;
revoke all on function public.rsvp_to_event(uuid, text) from public;
grant execute on function public.get_admin_scope(), public.admin_dashboard_stats(), public.admin_list_members(text), public.admin_list_events(), public.admin_create_event(text, timestamptz, text, timestamptz, text, text, text, text), public.get_my_published_events(), public.rsvp_to_event(uuid, text) to authenticated;

-- AFTER the person has created and verified an ANC Unity account, run this
-- separately with their real email address. Repeat for other organisers.
-- insert into public.admin_roles (user_id, role, branch_name)
-- select id, 'super_admin', null from auth.users where email = 'YOUR_ADMIN_EMAIL'
-- on conflict (user_id) do update set role = excluded.role, branch_name = excluded.branch_name;
