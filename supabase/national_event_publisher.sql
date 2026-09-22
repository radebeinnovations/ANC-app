-- ANC Unity: dedicated National-event publisher.
--
-- Run this once in the Supabase SQL Editor. It is safe to re-run.
-- It does not delete or change existing events, roles, members, or RSVPs.
--
-- This is deliberately a separate endpoint from admin_create_event so a
-- Super Admin cannot be sent to an old overloaded function after a database
-- schema refresh.

begin;

do $$
begin
  if to_regclass('public.community_events') is null
    or to_regclass('public.admin_roles') is null then
    raise exception 'Run the ANC events dashboard schema before this repair.';
  end if;
end;
$$;

create or replace function public.admin_publish_national_event(
  event_title text,
  starts_at timestamptz,
  event_description text default null,
  ends_at timestamptz default null,
  event_venue text default null,
  event_location text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  new_event_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Sign in is required to publish an event';
  end if;

  -- Read exactly the same role source the dashboard displays.
  if not exists (
    select 1
    from public.get_admin_scope() as scope
    where scope.role = 'super_admin'
  ) then
    raise exception 'Only a Super Admin can publish National events';
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

  insert into public.community_events (
    title,
    description,
    starts_at,
    ends_at,
    venue,
    location,
    branch_name,
    host_branch_name,
    audience,
    status,
    created_by
  ) values (
    btrim(event_title),
    nullif(btrim(event_description), ''),
    starts_at,
    ends_at,
    nullif(btrim(event_venue), ''),
    nullif(btrim(event_location), ''),
    null,
    null,
    'national',
    'published',
    auth.uid()
  )
  returning id into new_event_id;

  return new_event_id;
end;
$$;

revoke all on function public.admin_publish_national_event(
  text, timestamptz, text, timestamptz, text, text
) from public, anon, authenticated;
grant execute on function public.admin_publish_national_event(
  text, timestamptz, text, timestamptz, text, text
) to authenticated;

notify pgrst, 'reload schema';

commit;
