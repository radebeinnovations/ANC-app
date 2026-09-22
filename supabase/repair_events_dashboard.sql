-- Repairs the initial Events Dashboard SQL schema.
-- Run this once only if the dashboard shows: column reference "branch_name" is ambiguous.
--
-- Important: after installing multi_branch_events.sql, do not restore the
-- original single-branch admin_list_events() function here. The multi-branch
-- migration owns that function and adds event_branch_targets support.

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

grant execute on function public.admin_list_members(text) to authenticated;
