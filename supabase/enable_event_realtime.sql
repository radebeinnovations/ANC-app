-- Run this one line once in the Supabase SQL editor.
-- It makes dashboard publications appear immediately in eligible members'
-- My Community feeds. The app's 30-second refresh fallback still works even
-- if this command has not been run.
alter publication supabase_realtime add table public.community_events;
