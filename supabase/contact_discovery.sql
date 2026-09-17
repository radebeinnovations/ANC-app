-- Run once in Supabase SQL Editor after chat_schema.sql and
-- repair_member_profiles.sql. This finds registered ANC members whose phone
-- number is in the caller's device contacts, but never returns phone numbers.
-- Contact numbers are supplied for matching only and are not stored.

create or replace function public.discover_members_in_contacts(contact_phone_numbers text[])
returns table (id uuid, full_name text, membership_number text, branch_name text)
language sql security definer set search_path = public, auth as $$
  with supplied_numbers as (
    select distinct case
      when regexp_replace(value, '\\D', '', 'g') ~ '^0[0-9]{9}$'
        then '27' || substr(regexp_replace(value, '\\D', '', 'g'), 2)
      else regexp_replace(value, '\\D', '', 'g')
    end as normalized_phone
    from unnest(coalesce(contact_phone_numbers, array[]::text[])) as value
    where length(regexp_replace(value, '\\D', '', 'g')) between 7 and 15
    limit 1000
  ), member_numbers as (
    select p.id, p.full_name, p.membership_number, p.branch_name,
      case
        when regexp_replace(coalesce(p.phone_number, ''), '\\D', '', 'g') ~ '^0[0-9]{9}$'
          then '27' || substr(regexp_replace(p.phone_number, '\\D', '', 'g'), 2)
        else regexp_replace(coalesce(p.phone_number, ''), '\\D', '', 'g')
      end as normalized_phone
    from public.profiles p
    where p.id <> auth.uid()
  )
  select m.id, m.full_name, m.membership_number, m.branch_name
  from member_numbers m
  join supplied_numbers s on s.normalized_phone = m.normalized_phone
  order by m.full_name;
$$;

revoke all on function public.discover_members_in_contacts(text[]) from public;
grant execute on function public.discover_members_in_contacts(text[]) to authenticated;
