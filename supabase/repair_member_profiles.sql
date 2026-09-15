-- Run once in Supabase SQL Editor after installing chat_schema.sql.
-- It safely creates profiles for accounts created before the profile trigger.

insert into public.profiles (id, full_name, membership_number, branch_name)
select
  u.id,
  coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), 'ANC Member'),
  nullif(trim(u.raw_user_meta_data ->> 'membership_number'), ''),
  nullif(trim(u.raw_user_meta_data ->> 'branch_name'), '')
from auth.users u
on conflict (id) do nothing;

-- Secure discovery endpoint for the mobile app. It repairs the caller's
-- profile from their Auth metadata, then returns other registered members.
create or replace function public.discover_members()
returns table (id uuid, full_name text, membership_number text, branch_name text)
language sql security definer set search_path = public, auth as $$
  with ensure_callers_profile as (
    insert into public.profiles (id, full_name, membership_number, branch_name)
    select
      u.id,
      coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), 'ANC Member'),
      nullif(trim(u.raw_user_meta_data ->> 'membership_number'), ''),
      nullif(trim(u.raw_user_meta_data ->> 'branch_name'), '')
    from auth.users u
    where u.id = auth.uid()
    on conflict (id) do nothing
  )
  select p.id, p.full_name, p.membership_number, p.branch_name
  from public.profiles as p
  where p.id <> auth.uid()
  order by p.created_at desc
  limit 50;
$$;

revoke all on function public.discover_members() from public;
grant execute on function public.discover_members() to authenticated;

-- Avoid RLS policy recursion while keeping chats private to their members.
create or replace function public.is_conversation_member(target_conversation_id uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.conversation_members cm
    where cm.conversation_id = target_conversation_id and cm.user_id = auth.uid()
  );
$$;

revoke all on function public.is_conversation_member(uuid) from public;
grant execute on function public.is_conversation_member(uuid) to authenticated;

drop policy if exists "Members can read their conversations" on public.chat_conversations;
create policy "Members can read their conversations"
on public.chat_conversations for select to authenticated
using (public.is_conversation_member(id));

drop policy if exists "Members can read conversation membership" on public.conversation_members;
create policy "Members can read conversation membership"
on public.conversation_members for select to authenticated
using (public.is_conversation_member(conversation_id));

drop policy if exists "Members can read their messages" on public.chat_messages;
create policy "Members can read their messages"
on public.chat_messages for select to authenticated
using (public.is_conversation_member(conversation_id));

drop policy if exists "Members can send their messages" on public.chat_messages;
create policy "Members can send their messages"
on public.chat_messages for insert to authenticated
with check (sender_id = auth.uid() and public.is_conversation_member(conversation_id));
