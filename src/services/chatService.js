import { isSupabaseConfigured, supabase } from './supabase';

const demoPeople = [
  { id: 'thandi-mokoena', full_name: 'Thandi Mokoena', membership_number: 'ANC-1002841', branch_name: 'Orlando East Branch', initials: 'TM' },
  { id: 'sipho-dlamini', full_name: 'Sipho Dlamini', membership_number: 'ANC-1009283', branch_name: 'Soweto Region', initials: 'SD' },
  { id: 'nomsa-khumalo', full_name: 'Nomsa Khumalo', membership_number: 'ANC-1014602', branch_name: 'Ward 14 Branch', initials: 'NK' },
];

const demoConversations = [
  { id: 'anc-community', type: 'group', name: 'ANC Community', member_count: 128, last_message: 'Welcome to the ANC Community group.', last_message_at: new Date().toISOString(), initials: 'AC' },
  { id: 'thandi-mokoena', type: 'direct', name: 'Thandi Mokoena', member_count: 2, last_message: 'See you at the branch meeting.', last_message_at: new Date(Date.now() - 1000 * 60 * 24).toISOString(), initials: 'TM' },
];

const demoMessages = {
  'anc-community': [
    { id: 'welcome', sender_id: 'thandi-mokoena', sender_name: 'Thandi Mokoena', content: 'Welcome to the ANC Community group.', created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: 'meeting', sender_id: 'sipho-dlamini', sender_name: 'Sipho Dlamini', content: 'Reminder: our community meeting starts at 10:00 on Saturday.', created_at: new Date(Date.now() - 1000 * 60 * 8).toISOString() },
  ],
  'thandi-mokoena': [
    { id: 'thandi-1', sender_id: 'thandi-mokoena', sender_name: 'Thandi Mokoena', content: 'See you at the branch meeting.', created_at: new Date(Date.now() - 1000 * 60 * 24).toISOString() },
  ],
};

const usesLiveChat = () => isSupabaseConfigured();

export async function getPeopleYouMayKnow(currentUserId) {
  if (!usesLiveChat()) return demoPeople;
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, membership_number, branch_name')
    .neq('id', currentUserId)
    .limit(12);
  if (error) throw error;
  return data.map(person => ({ ...person, initials: initials(person.full_name) }));
}

export async function getConversations(currentUserId) {
  if (!usesLiveChat()) return demoConversations;
  const { data, error } = await supabase
    .from('conversation_members')
    .select('conversation_id, chat_conversations(id, type, name, updated_at, chat_messages(content, created_at))')
    .eq('user_id', currentUserId);
  if (error) throw error;
  return data.map(row => {
    const conversation = row.chat_conversations;
    const last = [...(conversation.chat_messages || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    return { id: conversation.id, type: conversation.type, name: conversation.name || 'Direct message', member_count: 0, last_message: last?.content || 'No messages yet', last_message_at: last?.created_at || conversation.updated_at, initials: initials(conversation.name || 'DM') };
  });
}

export async function getMessages(conversationId) {
  if (!usesLiveChat()) return demoMessages[conversationId] || [];
  const { data, error } = await supabase
    .from('chat_messages')
    .select('id, sender_id, content, created_at, profiles!chat_messages_sender_id_fkey(full_name)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data.map(message => ({ ...message, sender_name: message.profiles?.full_name || 'Member' }));
}

export async function createDirectConversation(currentUserId, person) {
  if (!usesLiveChat()) return { id: person.id, type: 'direct', name: person.full_name, initials: person.initials, member_count: 2 };
  const { data, error } = await supabase.rpc('create_direct_conversation', { other_member_id: person.id });
  if (error) throw error;
  return { id: data, type: 'direct', name: person.full_name, initials: initials(person.full_name), member_count: 2 };
}

export async function createGroupConversation(name, memberIds) {
  if (!usesLiveChat()) return { id: `group-${Date.now()}`, type: 'group', name, initials: initials(name), member_count: memberIds.length + 1, last_message: 'Group created', last_message_at: new Date().toISOString() };
  const { data, error } = await supabase.rpc('create_group_conversation', { group_name: name, member_ids: memberIds });
  if (error) throw error;
  return { id: data, type: 'group', name, initials: initials(name), member_count: memberIds.length + 1 };
}

export async function sendMessage(conversationId, content) {
  if (!usesLiveChat()) return { id: `demo-${Date.now()}`, sender_id: 'demo-member', sender_name: 'Lerumo Thabo', content, created_at: new Date().toISOString() };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Please sign in to send a message.');
  const { data, error } = await supabase.from('chat_messages').insert({ conversation_id: conversationId, sender_id: user.id, content }).select().single();
  if (error) throw error;
  return { ...data, sender_name: 'You' };
}

export function subscribeToMessages(conversationId, onMessage) {
  if (!usesLiveChat()) return () => {};
  const channel = supabase.channel(`messages:${conversationId}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${conversationId}` }, payload => onMessage(payload.new)).subscribe();
  return () => supabase.removeChannel(channel);
}

export function createTypingChannel(conversationId, onTyping) {
  if (!usesLiveChat()) return { sendTyping: () => {}, close: () => {} };
  const channel = supabase.channel(`typing:${conversationId}`, { config: { presence: { key: 'member' } } });
  channel.on('presence', { event: 'sync' }, () => onTyping(Object.values(channel.presenceState()).flat())).subscribe();
  return { sendTyping: (name, typing) => channel.track({ name, typing, at: Date.now() }), close: () => supabase.removeChannel(channel) };
}

function initials(name = '') { return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'AN'; }
