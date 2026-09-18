-- Optional but recommended: run once in the Supabase SQL editor.
-- The member app also checks for new events every 30 seconds, so publishing
-- still works if Realtime is not enabled. This makes dashboard publication
-- appear immediately in eligible members' My Community feeds.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'community_events'
  ) then
    alter publication supabase_realtime add table public.community_events;
  end if;
end;
$$;
