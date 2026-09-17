import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from '../components/Icons';
import { Colors } from '../theme/colors';
import { createAdminEvent, getAdminDashboard, getAdminScope } from '../services/eventsService';
import { isSupabaseConfigured, supabase } from '../services/supabase';

const initialEvent = { title: '', description: '', startsAt: '', endsAt: '', venue: '', location: '', branch: '', audience: 'branch' };

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const pad = value => String(value).padStart(2, '0');
const startOfMonth = value => new Date(value.getFullYear(), value.getMonth(), 1);
const dateKey = value => `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
const isSameDay = (left, right) => left && right && dateKey(left) === dateKey(right);
const friendlyDate = value => value ? value.toLocaleDateString([], { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : 'Choose a date';
const toEventTimestamp = (date, time) => date ? `${dateKey(date)}T${/^\d{2}:\d{2}$/.test(time) ? time : '10:00'}:00+02:00` : '';

function EventCalendar({ value, time, onChangeDate, onChangeTime }) {
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(value || new Date()));
  const firstWeekday = visibleMonth.getDay();
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const emptyDays = Array.from({ length: firstWeekday }, (_, index) => `empty-${index}`);
  const dates = Array.from({ length: daysInMonth }, (_, index) => new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), index + 1));
  return <View style={s.calendarBox}>
    <View style={s.calendarHeader}>
      <TouchableOpacity accessibilityLabel="Previous month" style={s.monthButton} onPress={() => setVisibleMonth(current => new Date(current.getFullYear(), current.getMonth() - 1, 1))}><Text style={s.monthButtonText}>‹</Text></TouchableOpacity>
      <Text style={s.calendarMonth}>{monthLabels[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}</Text>
      <TouchableOpacity accessibilityLabel="Next month" style={s.monthButton} onPress={() => setVisibleMonth(current => new Date(current.getFullYear(), current.getMonth() + 1, 1))}><Text style={s.monthButtonText}>›</Text></TouchableOpacity>
    </View>
    <View style={s.calendarGrid}>{weekdayLabels.map(day => <Text key={day} style={s.weekday}>{day}</Text>)}{emptyDays.map(day => <View key={day} style={s.dayCell}/>) }{dates.map(day => <TouchableOpacity key={dateKey(day)} accessibilityLabel={`Select ${friendlyDate(day)}`} onPress={() => onChangeDate(day)} style={s.dayCell}><View style={[s.day, isSameDay(day, value) && s.daySelected]}><Text style={[s.dayText, isSameDay(day, value) && s.dayTextSelected]}>{day.getDate()}</Text></View></TouchableOpacity>)}</View>
    <View style={s.selectedDateRow}><View><Text style={s.selectedDateLabel}>Selected start</Text><Text style={s.selectedDate}>{friendlyDate(value)}</Text></View><View style={s.timeBox}><Text style={s.selectedDateLabel}>Time (SAST)</Text><TextInput value={time} onChangeText={onChangeTime} placeholder="10:00" keyboardType="numbers-and-punctuation" maxLength={5} style={s.timeInput}/></View></View>
  </View>;
}

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [scope, setScope] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [form, setForm] = useState(initialEvent);
  const [saving, setSaving] = useState(false);
  const [eventDate, setEventDate] = useState(null);
  const [eventTime, setEventTime] = useState('10:00');

  async function load() {
    if (!isSupabaseConfigured()) { setError('Supabase is not configured for this deployment.'); setLoading(false); return; }
    setLoading(true); setError('');
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    if (!session?.user) { setLoading(false); return; }
    try {
      const [nextScope, nextDashboard] = await Promise.all([getAdminScope(), getAdminDashboard()]);
      if (!nextScope) throw new Error('This account has not been assigned an ANC dashboard role.');
      setScope(nextScope); setDashboard(nextDashboard);
    } catch (nextError) { setError(nextError?.message || 'Dashboard access could not be confirmed.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function signIn() {
    setLoading(true); setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    await load();
  }
  async function publishEvent() {
    if (!form.title.trim() || !eventDate) { setError('Add an event title and choose a start date on the calendar.'); return; }
    setSaving(true); setError('');
    try {
      await createAdminEvent({ ...form, startsAt: toEventTimestamp(eventDate, eventTime) });
      setForm(initialEvent);
      setEventDate(null);
      setEventTime('10:00');
      await load();
    } catch (nextError) { setError(nextError?.message || 'The event could not be published.'); }
    finally { setSaving(false); }
  }
  async function signOut() { await supabase.auth.signOut(); setUser(null); setScope(null); setDashboard(null); }

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color={Colors.primary}/><Text style={s.loadingText}>Opening ANC Events Dashboard…</Text></View>;
  if (!user) return <View style={s.authPage}><View style={s.authCard}><Text style={s.brand}>ANC UNITY</Text><Text style={s.authTitle}>Events Dashboard</Text><Text style={s.authCopy}>Secure access for authorised ANC organisers and administrators.</Text>{error ? <Text style={s.error}>{error}</Text> : null}<TextInput value={email} onChangeText={setEmail} placeholder="Authorised email address" autoCapitalize="none" keyboardType="email-address" style={s.input}/><TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={s.input}/><TouchableOpacity style={s.primaryButton} onPress={signIn}><Text style={s.primaryButtonText}>Sign in to dashboard</Text></TouchableOpacity><Text style={s.help}>Need access? Ask a Super Admin to assign your ANC dashboard role.</Text></View></View>;
  if (!scope || error) return <View style={s.authPage}><View style={s.authCard}><Text style={s.brand}>ANC UNITY</Text><Text style={s.authTitle}>Dashboard access required</Text><Text style={s.authCopy}>{error || 'This account does not have a dashboard role.'}</Text><TouchableOpacity style={s.primaryButton} onPress={load}><Text style={s.primaryButtonText}>Try again</Text></TouchableOpacity><TouchableOpacity onPress={signOut}><Text style={s.signOut}>Sign out</Text></TouchableOpacity></View></View>;

  return <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}><View style={s.topbar}><View><Text style={s.brand}>ANC UNITY</Text><Text style={s.topTitle}>Events Dashboard</Text></View><View style={s.userBox}><Text style={s.userName}>{user.user_metadata?.full_name || user.email}</Text><Text style={s.role}>{scope.role.replace('_', ' ')}</Text><TouchableOpacity onPress={signOut}><Text style={s.signOut}>Sign out</Text></TouchableOpacity></View></View><View style={s.scope}><Icon name="verified-user" size={18} color={Colors.primary}/><Text style={s.scopeText}>{scope.role === 'super_admin' ? 'Super Admin · all ANC event and member data' : `Branch Organiser · ${scope.branch_name || 'assigned branch'}`}</Text></View>{error ? <Text style={s.error}>{error}</Text> : null}<View style={s.stats}>{[{label:'Members in scope',value:dashboard?.stats?.member_count || 0},{label:'Published events',value:dashboard?.stats?.published_event_count || 0},{label:'RSVPs received',value:dashboard?.stats?.rsvp_count || 0}].map(item => <View key={item.label} style={s.stat}><Text style={s.statNumber}>{item.value}</Text><Text style={s.statLabel}>{item.label}</Text></View>)}</View><View style={s.grid}><View style={[s.panel,s.gridPanel]}><Text style={s.panelTitle}>Publish an event</Text><Text style={s.panelCopy}>Published events appear in the ANC member app for the correct branch or national audience.</Text><TextInput value={form.title} onChangeText={value => setForm(current => ({...current,title:value}))} placeholder="Event title" style={s.input}/><Text style={s.fieldLabel}>Choose start date</Text><EventCalendar value={eventDate} time={eventTime} onChangeDate={setEventDate} onChangeTime={setEventTime}/><TextInput value={form.venue} onChangeText={value => setForm(current => ({...current,venue:value}))} placeholder="Venue" style={s.input}/><TextInput value={form.location} onChangeText={value => setForm(current => ({...current,location:value}))} placeholder="Location / city" style={s.input}/>{scope.role === 'super_admin' ? <TextInput value={form.branch} onChangeText={value => setForm(current => ({...current,branch:value}))} placeholder="Branch (leave blank for national)" style={s.input}/> : null}<View style={s.audienceRow}><TouchableOpacity onPress={() => setForm(current => ({...current,audience:'branch'}))} style={[s.audience, form.audience === 'branch' && s.audienceActive]}><Text style={[s.audienceText, form.audience === 'branch' && s.audienceTextActive]}>Branch</Text></TouchableOpacity>{scope.role === 'super_admin' ? <TouchableOpacity onPress={() => setForm(current => ({...current,audience:'national'}))} style={[s.audience, form.audience === 'national' && s.audienceActive]}><Text style={[s.audienceText, form.audience === 'national' && s.audienceTextActive]}>National</Text></TouchableOpacity> : null}</View><TextInput value={form.description} onChangeText={value => setForm(current => ({...current,description:value}))} placeholder="Description for members" multiline style={[s.input,s.description]}/><TouchableOpacity disabled={saving} style={[s.primaryButton,saving && s.disabled]} onPress={publishEvent}><Text style={s.primaryButtonText}>{saving ? 'Publishing…' : 'Publish event'}</Text></TouchableOpacity></View><View style={[s.panel,s.gridPanel]}><Text style={s.panelTitle}>Published events</Text>{(dashboard?.events || []).length ? dashboard.events.map(event => <View key={event.id} style={s.event}><Text style={s.eventTitle}>{event.title}</Text><Text style={s.eventMeta}>{new Date(event.starts_at).toLocaleString()} · {event.audience === 'national' ? 'National' : event.branch_name}</Text><Text style={s.eventMeta}>{event.venue || event.location || 'Venue to be confirmed'} · {event.rsvp_count || 0} RSVPs</Text></View>) : <Text style={s.empty}>No events have been published in your scope yet.</Text>}</View></View><View style={s.panel}><Text style={s.panelTitle}>Members in your scope</Text><Text style={s.panelCopy}>A limited operational directory for authorised organisers. Phone numbers and passwords are never shown.</Text>{(dashboard?.members || []).slice(0,50).map(member => <View key={member.id} style={s.member}><View style={s.memberAvatar}><Text style={s.memberAvatarText}>{member.full_name.split(' ').map(part => part[0]).join('').slice(0,2)}</Text></View><View><Text style={s.memberName}>{member.full_name}</Text><Text style={s.memberMeta}>{member.membership_number || 'Membership pending'} · {member.branch_name || 'Branch pending'}</Text></View></View>)}</View></ScrollView>;
}

const s = StyleSheet.create({ center:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#F5F8F5'},loadingText:{marginTop:12,color:Colors.muted,fontWeight:'700'},authPage:{flex:1,backgroundColor:'#F2F6F3',alignItems:'center',justifyContent:'center',padding:24},authCard:{width:'100%',maxWidth:440,backgroundColor:Colors.white,borderRadius:18,padding:30,borderWidth:1,borderColor:'#DCE8DF'},brand:{fontSize:14,fontWeight:'900',letterSpacing:1.8,color:Colors.primary},authTitle:{fontSize:30,fontWeight:'900',color:Colors.ink,marginTop:10},authCopy:{fontSize:14,lineHeight:21,color:Colors.muted,marginTop:8,marginBottom:20},input:{minHeight:46,borderWidth:1,borderColor:'#DCE5DF',borderRadius:9,backgroundColor:'#FFF',paddingHorizontal:13,fontSize:14,color:Colors.ink,marginBottom:11},primaryButton:{minHeight:46,backgroundColor:Colors.primary,borderRadius:9,alignItems:'center',justifyContent:'center',paddingHorizontal:16},primaryButtonText:{color:Colors.white,fontWeight:'800',fontSize:14},help:{fontSize:12,lineHeight:18,color:Colors.muted,textAlign:'center',marginTop:18},error:{backgroundColor:'#FFF0E8',color:'#9A3F00',padding:12,borderRadius:9,fontSize:13,lineHeight:18,marginBottom:14},signOut:{color:'#B42318',fontWeight:'800',fontSize:12,marginTop:10,textAlign:'right'},page:{backgroundColor:'#F5F8F5',padding:30,gap:18,minHeight:'100%'},topbar:{maxWidth:1200,width:'100%',alignSelf:'center',flexDirection:'row',justifyContent:'space-between',alignItems:'center'},topTitle:{fontSize:28,fontWeight:'900',color:Colors.ink,marginTop:4},userBox:{alignItems:'flex-end'},userName:{fontSize:13,fontWeight:'800',color:Colors.ink},role:{fontSize:11,color:Colors.primary,fontWeight:'800',textTransform:'uppercase',marginTop:3},scope:{maxWidth:1200,width:'100%',alignSelf:'center',backgroundColor:'#E7F5EA',borderRadius:10,padding:13,flexDirection:'row',alignItems:'center',gap:8},scopeText:{color:Colors.primary,fontWeight:'700',fontSize:13},stats:{maxWidth:1200,width:'100%',alignSelf:'center',flexDirection:'row',gap:14},stat:{flex:1,backgroundColor:Colors.white,borderRadius:12,padding:18,borderWidth:1,borderColor:'#E0E9E1'},statNumber:{fontSize:28,fontWeight:'900',color:Colors.ink},statLabel:{fontSize:12,color:Colors.muted,marginTop:4,fontWeight:'700'},grid:{maxWidth:1200,width:'100%',alignSelf:'center',flexDirection:'row',gap:18,alignItems:'flex-start'},panel:{maxWidth:1200,width:'100%',alignSelf:'center',backgroundColor:Colors.white,borderRadius:12,padding:20,borderWidth:1,borderColor:'#E0E9E1'},gridPanel:{flex:1,alignSelf:'auto'},panelTitle:{fontSize:19,fontWeight:'900',color:Colors.ink,marginBottom:5},panelCopy:{fontSize:13,lineHeight:19,color:Colors.muted,marginBottom:16},fieldLabel:{fontSize:12,fontWeight:'800',color:Colors.ink,marginBottom:7},calendarBox:{borderWidth:1,borderColor:'#DCE5DF',borderRadius:10,backgroundColor:'#FBFDFB',padding:10,marginBottom:11},calendarHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:8},calendarMonth:{fontSize:14,fontWeight:'900',color:Colors.ink},monthButton:{width:30,height:30,borderRadius:15,alignItems:'center',justifyContent:'center',backgroundColor:'#E7F5EA'},monthButtonText:{fontSize:24,lineHeight:26,color:Colors.primary,fontWeight:'700'},calendarGrid:{flexDirection:'row',flexWrap:'wrap'},weekday:{width:'14.2857%',fontSize:10,fontWeight:'800',color:Colors.muted,textAlign:'center',paddingBottom:6},dayCell:{width:'14.2857%',height:32,alignItems:'center',justifyContent:'center'},day:{width:28,height:28,borderRadius:14,alignItems:'center',justifyContent:'center'},daySelected:{backgroundColor:Colors.primary},dayText:{fontSize:12,color:Colors.ink,fontWeight:'700'},dayTextSelected:{color:Colors.white},selectedDateRow:{borderTopWidth:1,borderTopColor:'#E6EEE7',paddingTop:10,marginTop:4,flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end',gap:8},selectedDateLabel:{fontSize:10,fontWeight:'800',textTransform:'uppercase',letterSpacing:.5,color:Colors.muted},selectedDate:{fontSize:12,color:Colors.ink,fontWeight:'800',marginTop:3},timeBox:{width:74},timeInput:{fontSize:13,color:Colors.ink,fontWeight:'800',paddingVertical:3,borderBottomWidth:1,borderBottomColor:Colors.primary,textAlign:'center'},audienceRow:{flexDirection:'row',gap:8,marginBottom:12},audience:{paddingVertical:10,paddingHorizontal:13,borderRadius:8,backgroundColor:'#F2F4F2'},audienceActive:{backgroundColor:Colors.primary},audienceText:{color:Colors.muted,fontWeight:'800',fontSize:12},audienceTextActive:{color:Colors.white},description:{height:84,paddingTop:12,textAlignVertical:'top'},disabled:{opacity:.65},event:{paddingVertical:13,borderBottomWidth:1,borderBottomColor:'#EDF1ED'},eventTitle:{fontSize:15,fontWeight:'900',color:Colors.ink},eventMeta:{fontSize:12,color:Colors.muted,marginTop:5},empty:{fontSize:13,color:Colors.muted,paddingVertical:20},member:{flexDirection:'row',alignItems:'center',paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#EDF1ED'},memberAvatar:{width:38,height:38,borderRadius:19,backgroundColor:Colors.gold,alignItems:'center',justifyContent:'center',marginRight:12},memberAvatarText:{color:Colors.primary,fontWeight:'900'},memberName:{fontSize:14,fontWeight:'800',color:Colors.ink},memberMeta:{fontSize:12,color:Colors.muted,marginTop:3} });
