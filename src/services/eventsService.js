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

  // National events use a dedicated RPC instead of the historical generic
  // publisher. Older versions of that RPC had several overloads in Supabase,
  // which could cause a Super Admin to be routed to an obsolete permission
  // check after a schema refresh. The dedicated endpoint has one purpose and
  // independently verifies the current Super Admin role on the database.
  if (event.audience === 'national') {
    const nationalPayload = {
      event_title: event.title,
      starts_at: event.startsAt,
      event_description: event.description || null,
      ends_at: event.endsAt || null,
      event_venue: event.venue || null,
      event_location: event.location || null,
    };
    let { data, error } = await supabase.rpc('admin_publish_national_event', nationalPayload);
    if (error && /Could not find the function|PGRST202/i.test(error.message || '')) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      ({ data, error } = await supabase.rpc('admin_publish_national_event', nationalPayload));
    }
    if (error && /Could not find the function|PGRST202/i.test(error.message || '')) {
      throw new Error('The dashboard database is still refreshing its National event publisher. Wait 30 seconds, refresh this page, and publish again.');
    }
    if (error) throw error;
    return data;
  }

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
  // There is only one supported publisher: the current host-aware, nine-field
  // RPC. Falling back to a historical RPC can reintroduce its old permission
  // rules immediately after a Supabase schema reload.
  let { data, error } = await supabase.rpc('admin_create_event', payload);

  // PostgREST reloads its API schema asynchronously after a migration. Give it
  // a brief chance to see the current publisher before showing a useful error.
  if (error && /Could not find the function|PGRST202/i.test(error.message || '')) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    ({ data, error } = await supabase.rpc('admin_create_event', payload));
  }
  if (error && /Could not find the function|PGRST202/i.test(error.message || '')) {
    throw new Error('The dashboard database is still refreshing its event publisher. Wait 30 seconds, refresh this page, and publish again.');
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
