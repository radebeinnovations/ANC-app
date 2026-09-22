import { isSupabaseConfigured, supabase } from './supabase';

export async function getMyPublishedEvents() {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase.rpc('get_my_published_events');
  if (error) throw error;
  return data || [];
}

// Realtime is used when the table has been enabled for Supabase Realtime.
// Callers retain a polling fallback so a newly published event never depends
// solely on a browser refresh or a Realtime setting.
export function subscribeToPublishedEventChanges(onChange) {
  if (!isSupabaseConfigured()) return () => {};
  const channel = supabase
    .channel('anc-community-events')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'community_events' }, onChange)
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

export async function rsvpToEvent(eventId, status = 'going') {
  const { data, error } = await supabase.rpc('rsvp_to_event', { event_id: eventId, response: status });
  if (error) throw error;
  return data;
}

export async function getAdminScope() {
  const { data, error } = await supabase.rpc('get_admin_scope');
  if (error) throw error;
  return data?.[0] || null;
}

export async function getAdminDashboard() {
  const [stats, events, members] = await Promise.all([
    supabase.rpc('admin_dashboard_stats'),
    supabase.rpc('admin_list_events'),
    supabase.rpc('admin_list_members', { search_text: null }),
  ]);
  if (stats.error) throw stats.error;
  if (events.error) throw events.error;
  if (members.error) throw members.error;
  return { stats: stats.data?.[0] || {}, events: events.data || [], members: members.data || [] };
}

export async function createAdminEvent(event) {
  const targetBranches = Array.isArray(event.branches) ? event.branches : [];
  const hostBranch = event.hostBranch?.trim() || null;
  const payload = {
    event_title: event.title,
    event_description: event.description || null,
    starts_at: event.startsAt,
    ends_at: event.endsAt || null,
    event_branches: targetBranches,
    event_audience: event.audience,
    event_venue: event.venue || null,
    event_location: event.location || null,
    event_host_branch: hostBranch,
  };
  let { data, error } = await supabase.rpc('admin_create_event', payload);

  // A host branch is important public event metadata. Do not publish a
  // partially-specified event when the hosting migration has not been applied.
  if (error && /Could not find the function|PGRST202/i.test(error.message || '')) {
    if (hostBranch) {
      throw new Error('Event hosting needs the Supabase event_hosting.sql migration. Run it once, refresh the dashboard, then publish this event again.');
    }

    // The previous multi-branch function has no event_host_branch argument.
    ({ data, error } = await supabase.rpc('admin_create_event', {
      event_title: event.title,
      event_description: event.description || null,
      starts_at: event.startsAt,
      ends_at: event.endsAt || null,
      event_branches: targetBranches,
      event_audience: event.audience,
      event_venue: event.venue || null,
      event_location: event.location || null,
    }));
  }

  // Existing deployments continue to publish a one-branch or National event
  // until the multi-branch SQL migration has been applied. Never silently
  // reduce a multi-branch event to its first branch on an older database.
  if (error && /Could not find the function|PGRST202/i.test(error.message || '')) {
    if (targetBranches.length > 1) {
      throw new Error('Multi-branch publishing needs the Supabase multi_branch_events.sql migration. Run it once, then publish this event again.');
    }
    ({ data, error } = await supabase.rpc('admin_create_event', {
      event_title: event.title,
      event_description: event.description || null,
      starts_at: event.startsAt,
      ends_at: event.endsAt || null,
      event_branch: targetBranches[0] || null,
      event_audience: event.audience,
      event_venue: event.venue || null,
      event_location: event.location || null,
    }));
  }
  if (error) throw error;
  return data;
}

export async function getOrganiserDirectory() {
  const { data, error } = await supabase.rpc('admin_list_organiser_directory');
  if (error) throw error;
  return data || [];
}

export async function assignOrganiserRole({ userId, role, branchName = null }) {
  const { data, error } = await supabase.rpc('admin_assign_organiser_role', {
    target_user_id: userId,
    target_role: role,
    target_branch: branchName,
  });
  if (error) throw error;
  return data;
}

export async function removeOrganiserRole(userId) {
  const { data, error } = await supabase.rpc('admin_remove_organiser_role', {
    target_user_id: userId,
  });
  if (error) throw error;
  return data;
}
