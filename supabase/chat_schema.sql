-- Run this in the Supabase SQL editor before enabling live chat.
-- Do not use a service-role key in the mobile application.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone_number text,
  membership_number text unique,
  branch_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('direct', 'group')),
  name text,
  created_by uuid not null references public.profiles(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  content text not null check (char_length(trim(content)) between 1 and 4000),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.chat_messages enable row level security;

create policy "Members can discover profiles" on public.profiles for select to authenticated using (true);
create policy "Members can read their conversations" on public.chat_conversations for select to authenticated using (exists (select 1 from public.conversation_members cm where cm.conversation_id = id and cm.user_id = auth.uid()));
create policy "Members can read conversation membership" on public.conversation_members for select to authenticated using (exists (select 1 from public.conversation_members mine where mine.conversation_id = conversation_id and mine.user_id = auth.uid()));
create policy "Members can read their messages" on public.chat_messages for select to authenticated using (exists (select 1 from public.conversation_members cm where cm.conversation_id = chat_messages.conversation_id and cm.user_id = auth.uid()));
create policy "Members can send their messages" on public.chat_messages for insert to authenticated with check (sender_id = auth.uid() and exists (select 1 from public.conversation_members cm where cm.conversation_id = chat_messages.conversation_id and cm.user_id = auth.uid()));

alter publication supabase_realtime add table public.chat_messages;

-- Create a profile whenever a member is created in Supabase Auth. Pass full_name,
-- membership_number, and branch_name in auth user metadata during sign-up.
create or replace function public.handle_new_member()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone_number, membership_number, branch_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'ANC Member'), new.raw_user_meta_data->>'phone_number', new.raw_user_meta_data->>'membership_number', new.raw_user_meta_data->>'branch_name')
  on conflict (id) do nothing;
  return new;
end;
$$;
create or replace trigger on_auth_member_created after insert on auth.users for each row execute procedure public.handle_new_member();

create or replace function public.create_direct_conversation(other_member_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare conversation uuid;
begin
  if auth.uid() is null or auth.uid() = other_member_id then raise exception 'Invalid member'; end if;
  select cm1.conversation_id into conversation from public.conversation_members cm1
  join public.conversation_members cm2 on cm2.conversation_id = cm1.conversation_id
  join public.chat_conversations c on c.id = cm1.conversation_id
  where c.type = 'direct' and cm1.user_id = auth.uid() and cm2.user_id = other_member_id limit 1;
  if conversation is null then
    insert into public.chat_conversations(type, created_by) values ('direct', auth.uid()) returning id into conversation;
    insert into public.conversation_members(conversation_id, user_id) values (conversation, auth.uid()), (conversation, other_member_id);
  end if;
  return conversation;
end;
$$;

create or replace function public.create_group_conversation(group_name text, member_ids uuid[])
returns uuid language plpgsql security definer set search_path = public as $$
declare conversation uuid;
begin
  if auth.uid() is null or char_length(trim(group_name)) < 2 then raise exception 'Invalid group'; end if;
  insert into public.chat_conversations(type, name, created_by) values ('group', trim(group_name), auth.uid()) returning id into conversation;
  insert into public.conversation_members(conversation_id, user_id) values (conversation, auth.uid());
  insert into public.conversation_members(conversation_id, user_id) select conversation, unnest(member_ids) on conflict do nothing;
  return conversation;
end;
$$;

revoke all on function public.create_direct_conversation(uuid) from public;
revoke all on function public.create_group_conversation(text, uuid[]) from public;
grant execute on function public.create_direct_conversation(uuid) to authenticated;
grant execute on function public.create_group_conversation(text, uuid[]) to authenticated;
