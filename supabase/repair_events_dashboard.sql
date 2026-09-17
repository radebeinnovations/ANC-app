-- Repairs the initial Events Dashboard SQL schema.
-- Run this once only if the dashboard shows: column reference "branch_name" is ambiguous.

create or replace function public.admin_list_members(search_text text default null)
returns table(id uuid, full_name text, membership_number text, branch_name text, created_at timestamptz)
language plpgsql security definer set search_path = public as $$
declare current_role text; current_branch text;
begin
  select ar.role, ar.branch_name into current_role, current_branch from public.admin_roles ar where ar.user_id = auth.uid();
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
  select ar.role, ar.branch_name into current_role, current_branch from public.admin_roles ar where ar.user_id = auth.uid();
  if current_role is null then raise exception 'Dashboard access denied'; end if;
  return query select e.id, e.title, e.description, e.starts_at, e.ends_at, e.venue, e.location, e.branch_name, e.audience, e.status, count(r.user_id)
    from public.community_events e left join public.event_rsvps r on r.event_id = e.id
    where current_role = 'super_admin' or (e.audience = 'branch' and e.branch_name = current_branch)
    group by e.id order by e.starts_at asc;
end;
$$;

grant execute on function public.admin_list_members(text), public.admin_list_events() to authenticated;
