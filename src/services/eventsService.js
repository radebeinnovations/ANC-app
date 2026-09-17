import { isSupabaseConfigured, supabase } from './supabase';

export async function getMyPublishedEvents() {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase.rpc('get_my_published_events');
  if (error) throw error;
  return data || [];
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
  const { data, error } = await supabase.rpc('admin_create_event', {
    event_title: event.title,
    event_description: event.description || null,
    starts_at: event.startsAt,
    ends_at: event.endsAt || null,
    event_branch: event.branch || null,
    event_audience: event.audience,
    event_venue: event.venue || null,
    event_location: event.location || null,
  });
  if (error) throw error;
  return data;
}
