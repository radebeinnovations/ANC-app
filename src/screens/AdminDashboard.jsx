import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Icon } from '../components/Icons';
import { Colors } from '../theme/colors';
import { assignOrganiserRole, createAdminEvent, getAdminDashboard, getAdminScope, getOrganiserDirectory, removeOrganiserRole } from '../services/eventsService';
import { isSupabaseConfigured, supabase } from '../services/supabase';

const initialEvent = { title: '', description: '', startsAt: '', endsAt: '', venue: '', location: '', branches: '', hostBranch: '', audience: 'branch' };

const ux = StyleSheet.create({
  accessIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E7F5EA', marginTop: 18 },
  signedInBox: { backgroundColor: '#F3F8F4', borderWidth: 1, borderColor: '#DCE8DF', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginTop: 16 },
  signedInLabel: { fontSize: 10, lineHeight: 14, letterSpacing: .6, textTransform: 'uppercase', color: Colors.muted, fontWeight: '800' },
  signedInEmail: { fontSize: 13, lineHeight: 19, color: Colors.ink, fontWeight: '800', marginTop: 2 },
  nextSteps: { backgroundColor: '#FFF9E6', borderWidth: 1, borderColor: '#F5D56A', borderRadius: 10, padding: 12, marginBottom: 16 },
  nextStepsTitle: { fontSize: 13, lineHeight: 18, color: Colors.ink, fontWeight: '900', marginBottom: 5 },
  nextStep: { fontSize: 12, lineHeight: 18, color: Colors.muted },
  accessCheckNotice: { backgroundColor: '#E7F5EA', borderRadius: 9, color: Colors.primary, fontSize: 12, fontWeight: '700', lineHeight: 18, marginBottom: 14, padding: 11 },
  secondaryButton: { minHeight: 46, borderRadius: 9, borderWidth: 1, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, marginTop: 10 },
  secondaryButtonText: { color: Colors.primary, fontWeight: '800', fontSize: 14 },
  formSection: { borderTopWidth: 1, borderTopColor: '#E6EEE7', paddingTop: 17, marginTop: 5 },
  formSectionFirst: { borderTopWidth: 0, paddingTop: 0, marginTop: 0 },
  formSectionHeading: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginBottom: 13 },
  stepBadge: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E7F5EA', marginTop: 1 },
  stepBadgeText: { fontSize: 12, color: Colors.primary, fontWeight: '900' },
  formSectionText: { flex: 1 },
  formSectionTitle: { fontSize: 14, lineHeight: 19, color: Colors.ink, fontWeight: '900' },
  formSectionCopy: { fontSize: 12, lineHeight: 17, color: Colors.muted, marginTop: 2 },
  fieldHeader: { marginBottom: 7 },
  requiredLabel: { color: '#B42318', fontWeight: '900' },
  fieldHint: { fontSize: 11, lineHeight: 16, color: Colors.muted, marginTop: 2 },
  lockedAudience: { flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 42, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#E7F5EA', borderWidth: 1, borderColor: '#C6EAD0', marginBottom: 12 },
  lockedAudienceText: { flex: 1, fontSize: 12, lineHeight: 17, color: Colors.primary, fontWeight: '800' },
  branchPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  branchChoice: { minHeight: 36, paddingHorizontal: 11, borderWidth: 1, borderColor: '#D7E3D9', borderRadius: 18, backgroundColor: '#F7FAF7', alignItems: 'center', justifyContent: 'center' },
  branchChoiceSelected: { borderColor: Colors.primary, backgroundColor: '#E7F5EA' },
  branchChoiceText: { color: Colors.muted, fontSize: 12, fontWeight: '800' },
  branchChoiceTextSelected: { color: Colors.primary },
  hostingBranchNotice: { flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 42, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#F7FAF7', borderWidth: 1, borderColor: '#D7E3D9', marginTop: 2 },
  hostingBranchNote: { color: Colors.primary, fontSize: 11, fontWeight: '700', lineHeight: 16, marginTop: -3, marginBottom: 2 },
  hostingBranchPrompt: { color: Colors.muted, fontSize: 11, lineHeight: 16, marginTop: -2 },
  timeControls: { borderTopWidth: 1, borderTopColor: '#E6EEE7', marginTop: 11, paddingTop: 11 },
  timeControlsHeader: { color: Colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: .6, textTransform: 'uppercase' },
  timeStepper: { alignItems: 'center', flexDirection: 'row', gap: 8, marginTop: 8 },
  timeStep: { alignItems: 'center', backgroundColor: '#E7F5EA', borderRadius: 8, justifyContent: 'center', minHeight: 38, minWidth: 58, paddingHorizontal: 9 },
  timeStepText: { color: Colors.primary, fontSize: 12, fontWeight: '900' },
  selectedTime: { alignItems: 'center', backgroundColor: Colors.primary, borderRadius: 8, flex: 1, justifyContent: 'center', minHeight: 38, paddingHorizontal: 12 },
  selectedTimeText: { color: Colors.white, fontSize: 16, fontWeight: '900' },
  quickTimesLabel: { color: Colors.muted, fontSize: 11, fontWeight: '800', marginTop: 12 },
  quickTimes: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 7 },
  quickTime: { alignItems: 'center', backgroundColor: '#F2F4F2', borderRadius: 15, justifyContent: 'center', minHeight: 30, minWidth: 54, paddingHorizontal: 9 },
  quickTimeSelected: { backgroundColor: '#E7F5EA', borderWidth: 1, borderColor: Colors.primary },
  quickTimeText: { color: Colors.muted, fontSize: 11, fontWeight: '800' },
  quickTimeTextSelected: { color: Colors.primary },
  publishButton: { minHeight: 50, marginTop: 20 },
  organiserPanel: { marginTop: 0 },
  organiserNotice: { backgroundColor: '#E7F5EA', borderRadius: 9, color: Colors.primary, fontSize: 12, fontWeight: '700', lineHeight: 18, marginBottom: 14, padding: 11 },
  directoryLoading: { minHeight: 72, alignItems: 'center', justifyContent: 'center' },
  directoryLoadingText: { color: Colors.muted, fontSize: 12, fontWeight: '700', marginTop: 9 },
  directoryError: { backgroundColor: '#FFF9E6', borderWidth: 1, borderColor: '#F5D56A', borderRadius: 10, padding: 13 },
  directoryErrorTitle: { color: Colors.ink, fontSize: 13, fontWeight: '900' },
  directoryErrorCopy: { color: Colors.muted, fontSize: 12, lineHeight: 18, marginTop: 5 },
  directoryErrorFile: { color: Colors.ink, fontWeight: '800' },
  directoryRetry: { alignSelf: 'flex-start', borderWidth: 1, borderColor: Colors.primary, borderRadius: 8, marginTop: 12, minHeight: 36, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  directoryRetryText: { color: Colors.primary, fontSize: 12, fontWeight: '800' },
  organiserRow: { borderTopWidth: 1, borderTopColor: '#EDF1ED', paddingVertical: 14 },
  organiserIdentity: { flexShrink: 1 },
  organiserName: { color: Colors.ink, fontSize: 14, fontWeight: '900' },
  organiserMeta: { color: Colors.muted, fontSize: 12, lineHeight: 18, marginTop: 3 },
  rolePill: { alignSelf: 'flex-start', backgroundColor: '#F1F3F2', borderRadius: 20, color: Colors.muted, fontSize: 11, fontWeight: '800', marginTop: 7, overflow: 'hidden', paddingHorizontal: 9, paddingVertical: 4 },
  rolePillAdmin: { backgroundColor: '#E7F5EA', color: Colors.primary },
  rolePillOrganiser: { backgroundColor: '#FFF5C8', color: '#735B00' },
  organiserActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 11, alignItems: 'center' },
  roleButton: { backgroundColor: Colors.primary, borderRadius: 8, minHeight: 36, paddingHorizontal: 11, alignItems: 'center', justifyContent: 'center' },
  branchRoleButton: { backgroundColor: '#E7F5EA', borderWidth: 1, borderColor: '#C6EAD0' },
  roleButtonText: { color: Colors.white, fontSize: 11, fontWeight: '800' },
  branchRoleButtonText: { color: Colors.primary, fontSize: 11, fontWeight: '800' },
  roleButtonDisabled: { opacity: .5 },
  removeRoleText: { color: '#B42318', fontSize: 11, fontWeight: '800', paddingHorizontal: 2, paddingVertical: 8 },
  currentAdminText: { color: Colors.primary, fontSize: 11, fontWeight: '800', paddingVertical: 8 },
});

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const pad = value => String(value).padStart(2, '0');
const startOfMonth = value => new Date(value.getFullYear(), value.getMonth(), 1);
const dateKey = value => `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
const isSameDay = (left, right) => left && right && dateKey(left) === dateKey(right);
const friendlyDate = value => value ? value.toLocaleDateString([], { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : 'Choose a date';
const normaliseTime = value => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(value || ''));
  const hour = Number(match?.[1]);
  const minute = Number(match?.[2]);
  return Number.isInteger(hour) && hour >= 0 && hour < 24 && Number.isInteger(minute) && minute >= 0 && minute < 60
    ? `${pad(hour)}:${pad(minute)}`
    : '10:00';
};
const shiftTime = (value, minutes) => {
  const [hour, minute] = normaliseTime(value).split(':').map(Number);
  const total = (hour * 60 + minute + minutes + 24 * 60) % (24 * 60);
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
};
const quickEventTimes = ['08:00', '09:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
const toEventTimestamp = (date, time) => date ? `${dateKey(date)}T${normaliseTime(time)}:00+02:00` : '';
const normaliseBranchNames = value => {
  const seen = new Set();
  return String(value || '')
    .split(',')
    .map(branch => branch.trim())
    .filter(branch => {
      const key = branch.toLocaleLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};
const selectedHostBranch = (hostBranch, branches) => {
  const selectedBranches = normaliseBranchNames(branches);
  const requestedHost = String(hostBranch || '').trim().toLocaleLowerCase();
  return selectedBranches.find(branch => branch.toLocaleLowerCase() === requestedHost) || selectedBranches[0] || '';
};
const eventHostName = event => {
  const explicitHost = event?.host_branch_name || event?.host_branch || event?.hosting_branch || event?.hostBranch || event?.hostingBranch;
  if (explicitHost) return explicitHost;
  if (event?.audience === 'national') return 'ANC National';
  const targets = event?.target_branches?.filter(Boolean) || [];
  return targets.length <= 1 ? event?.branch_name || targets[0] || '' : '';
};

function EventCalendar({ value, time, onChangeDate, onChangeTime }) {
  const selectedTime = normaliseTime(time);
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
    <View style={s.selectedDateRow}><View><Text style={s.selectedDateLabel}>Selected start</Text><Text style={s.selectedDate}>{friendlyDate(value)}</Text></View><Text style={s.selectedDateLabel}>SAST</Text></View>
    <View style={ux.timeControls}>
      <Text style={ux.timeControlsHeader}>Choose start time</Text>
      <View style={ux.timeStepper}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Move event time fifteen minutes earlier" onPress={() => onChangeTime(shiftTime(selectedTime, -15))} style={ux.timeStep}><Text style={ux.timeStepText}>−15 min</Text></TouchableOpacity>
        <View accessibilityLabel={`Selected event time ${selectedTime} South Africa Standard Time`} style={ux.selectedTime}><Text style={ux.selectedTimeText}>{selectedTime}</Text></View>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Move event time fifteen minutes later" onPress={() => onChangeTime(shiftTime(selectedTime, 15))} style={ux.timeStep}><Text style={ux.timeStepText}>+15 min</Text></TouchableOpacity>
      </View>
      <Text style={ux.quickTimesLabel}>Quick times</Text>
      <View style={ux.quickTimes}>{quickEventTimes.map(option => <TouchableOpacity key={option} accessibilityRole="button" accessibilityState={{ selected: selectedTime === option }} accessibilityLabel={`Set event time to ${option}`} onPress={() => onChangeTime(option)} style={[ux.quickTime, selectedTime === option && ux.quickTimeSelected]}><Text style={[ux.quickTimeText, selectedTime === option && ux.quickTimeTextSelected]}>{option}</Text></TouchableOpacity>)}</View>
    </View>
  </View>;
}

function FormSection({ number, title, copy, first = false, children }) {
  return <View style={[ux.formSection, first && ux.formSectionFirst]}>
    <View style={ux.formSectionHeading}>
      <View style={ux.stepBadge}><Text style={ux.stepBadgeText}>{number}</Text></View>
      <View style={ux.formSectionText}><Text style={ux.formSectionTitle}>{title}</Text>{copy ? <Text style={ux.formSectionCopy}>{copy}</Text> : null}</View>
    </View>
    {children}
  </View>;
}

function FieldLabel({ children, hint, required = false }) {
  return <View style={ux.fieldHeader}>
    <Text style={s.fieldLabel}>{children}{required ? <Text style={ux.requiredLabel}> · Required</Text> : null}</Text>
    {hint ? <Text style={ux.fieldHint}>{hint}</Text> : null}
  </View>;
}

export default function AdminDashboard() {
  const { width } = useWindowDimensions();
  const isMobile = width < 700;
  const [user, setUser] = useState(null);
  const [scope, setScope] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accessError, setAccessError] = useState('');
  const [accessCheckNotice, setAccessCheckNotice] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [form, setForm] = useState(initialEvent);
  const [saving, setSaving] = useState(false);
  const [eventDate, setEventDate] = useState(null);
  const [eventTime, setEventTime] = useState('10:00');
  const [organiserDirectory, setOrganiserDirectory] = useState([]);
  const [organiserDirectoryLoading, setOrganiserDirectoryLoading] = useState(false);
  const [organiserDirectoryError, setOrganiserDirectoryError] = useState('');
  const [organiserNotice, setOrganiserNotice] = useState('');
  const [organiserActionError, setOrganiserActionError] = useState('');
  const [organiserActionId, setOrganiserActionId] = useState('');

  async function load() {
    if (!isSupabaseConfigured()) {
      const message = 'Supabase is not configured for this deployment.';
      setAccessError(message);
      setLoading(false);
      return { error: message };
    }
    setLoading(true); setAccessError(''); setError('');
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    if (!session?.user) { setLoading(false); return { user: null }; }
    try {
      const [nextScope, nextDashboard] = await Promise.all([getAdminScope(), getAdminDashboard()]);
      if (!nextScope) throw new Error('This account has not been assigned an ANC dashboard role.');
      setScope(nextScope); setDashboard(nextDashboard);
      if (nextScope.role === 'super_admin') loadOrganiserDirectory();
      else setOrganiserDirectory([]);
      return { scope: nextScope };
    } catch (nextError) {
      const message = nextError?.message || 'Dashboard access could not be confirmed.';
      setAccessError(message);
      setScope(null);
      setDashboard(null);
      return { error: message };
    }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function loadOrganiserDirectory() {
    setOrganiserDirectoryLoading(true);
    setOrganiserDirectoryError('');
    try {
      setOrganiserDirectory(await getOrganiserDirectory());
    } catch (nextError) {
      setOrganiserDirectoryError(nextError?.message || 'Organiser access could not be loaded.');
    } finally {
      setOrganiserDirectoryLoading(false);
    }
  }

  async function signIn() {
    setLoading(true); setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    await load();
  }
  async function publishEvent() {
    if (!form.title.trim() || !eventDate) { setError('Add an event title and choose a start date on the calendar.'); return; }
    const selectedBranches = form.audience === 'branch'
      ? scope?.role === 'super_admin'
        ? normaliseBranchNames(form.branches)
        : [scope?.branch_name].filter(Boolean)
      : [];
    if (form.audience === 'branch' && !selectedBranches.length) {
      setError('Add at least one branch for this event, or choose National.');
      return;
    }
    const hostBranch = form.audience === 'branch'
      ? scope?.role === 'super_admin'
        ? selectedHostBranch(form.hostBranch, selectedBranches.join(', '))
        : scope?.branch_name || ''
      : '';
    if (form.audience === 'branch' && !hostBranch) {
      setError('Choose the branch hosting this event.');
      return;
    }
    setSaving(true); setError('');
    try {
      await createAdminEvent({ ...form, branches: selectedBranches, hostBranch, startsAt: toEventTimestamp(eventDate, eventTime) });
      setForm(initialEvent);
      setEventDate(null);
      setEventTime('10:00');
      await load();
    } catch (nextError) { setError(nextError?.message || 'The event could not be published.'); }
    finally { setSaving(false); }
  }
  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setScope(null);
    setDashboard(null);
    setOrganiserDirectory([]);
    setOrganiserNotice('');
  }
  async function checkDashboardAccess() {
    setAccessCheckNotice('');
    const result = await load();
    if (!result?.scope) setAccessCheckNotice('No new organiser role has been added to this account yet. A Super Admin must assign it before dashboard access can change.');
  }
  function openMemberApp() { if (typeof window !== 'undefined') window.location.assign('/'); }
  async function setOrganiserRole(member, role) {
    if (role === 'branch_organiser' && !member.member_branch_name) {
      setOrganiserNotice('This member needs a branch on their profile before they can become a Branch Organiser.');
      return;
    }
    setOrganiserActionId(member.user_id);
    setOrganiserNotice(''); setOrganiserActionError('');
    try {
      await assignOrganiserRole({ userId: member.user_id, role, branchName: role === 'branch_organiser' ? member.member_branch_name : null });
      setOrganiserNotice(`${member.full_name} can now ${role === 'super_admin' ? 'manage organisers and publish national events.' : `publish events for ${member.member_branch_name}.`}`);
      await loadOrganiserDirectory();
    } catch (nextError) {
      setOrganiserActionError(nextError?.message || 'The organiser role could not be updated.');
    } finally {
      setOrganiserActionId('');
    }
  }
  async function revokeOrganiserRole(member) {
    setOrganiserActionId(member.user_id);
    setOrganiserNotice(''); setOrganiserActionError('');
    try {
      await removeOrganiserRole(member.user_id);
      setOrganiserNotice(`${member.full_name} no longer has organiser dashboard access.`);
      await loadOrganiserDirectory();
    } catch (nextError) {
      setOrganiserActionError(nextError?.message || 'The organiser role could not be removed.');
    } finally {
      setOrganiserActionId('');
    }
  }

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color={Colors.primary}/><Text style={s.loadingText}>Opening ANC Events Dashboard…</Text></View>;
  if (!user) return <View style={[s.authPage, isMobile && { padding: 16 }]}><View style={[s.authCard, isMobile && { padding: 22 }]}><Text style={s.brand}>ANC UNITY</Text><Text style={s.authTitle}>Events Dashboard</Text><Text style={s.authCopy}>Sign in with your ANC Unity account. Authorised organisers can publish events immediately.</Text>{error ? <Text style={s.error}>{error}</Text> : null}<TextInput value={email} onChangeText={setEmail} placeholder="Authorised email address" autoCapitalize="none" keyboardType="email-address" autoComplete="email" returnKeyType="next" style={s.input}/><TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry autoComplete="password" returnKeyType="go" onSubmitEditing={signIn} style={s.input}/><TouchableOpacity disabled={loading} style={[s.primaryButton, loading && s.disabled]} onPress={signIn}><Text style={s.primaryButtonText}>Sign in to dashboard</Text></TouchableOpacity><Text style={s.help}>Sign-up happens in ANC Unity first. A Super Admin then assigns an organiser role.</Text></View></View>;
  if (!scope || accessError) {
    const roleIsMissing = /not been assigned.*dashboard role|dashboard access denied/i.test(accessError);
    return <View style={[s.authPage, isMobile && { padding: 16 }]}><View style={[s.authCard, isMobile && { padding: 22 }]}>
      <Text style={s.brand}>ANC UNITY</Text>
      <View style={ux.accessIcon}><Icon name={roleIsMissing ? 'lock-outline' : 'error-outline'} size={22} color={roleIsMissing ? Colors.primary : Colors.error}/></View>
      <Text style={s.authTitle}>{roleIsMissing ? 'Organiser access is not assigned' : 'Dashboard is unavailable'}</Text>
      <View style={ux.signedInBox}><Text style={ux.signedInLabel}>Signed in as</Text><Text selectable style={ux.signedInEmail}>{user.email || 'your ANC Unity account'}</Text></View>
      <Text style={s.authCopy}>{roleIsMissing ? 'This is a member account. It can use ANC Unity, but publishing and managing events is limited to authorised organisers.' : 'We could not confirm dashboard access right now. You can try again or return to the member app.'}</Text>
      {roleIsMissing ? <View style={ux.nextSteps}><Text style={ux.nextStepsTitle}>To access this dashboard</Text><Text style={ux.nextStep}>1. Ask an ANC Super Admin to assign this account a Branch Organiser or Super Admin role.</Text><Text style={ux.nextStep}>2. Once assigned, use “Check access again” below.</Text></View> : null}
      {accessCheckNotice ? <Text style={ux.accessCheckNotice}>{accessCheckNotice}</Text> : null}
      <TouchableOpacity style={s.primaryButton} onPress={openMemberApp}><Text style={s.primaryButtonText}>Open member app</Text></TouchableOpacity>
      <TouchableOpacity style={ux.secondaryButton} onPress={checkDashboardAccess}><Text style={ux.secondaryButtonText}>Check dashboard access again</Text></TouchableOpacity>
      <TouchableOpacity onPress={signOut}><Text style={s.signOut}>Sign in with a different account</Text></TouchableOpacity>
    </View></View>;
  }

  const canPublishNational = scope.role === 'super_admin';
  const availableBranches = Array.from(new Set((dashboard?.members || [])
    .map(member => member.branch_name?.trim())
    .filter(Boolean)))
    .sort((left, right) => left.localeCompare(right));
  const selectedBranchNames = normaliseBranchNames(form.branches);
  const isBranchSelected = branch => selectedBranchNames.some(selected => selected.toLocaleLowerCase() === branch.toLocaleLowerCase());
  const hostingBranch = selectedHostBranch(form.hostBranch, form.branches);
  function updateVisibleBranches(value) {
    setForm(current => ({ ...current, branches: value, hostBranch: selectedHostBranch(current.hostBranch, value) }));
  }
  function toggleBranchSelection(branch) {
    setForm(current => {
      const selections = normaliseBranchNames(current.branches);
      const alreadySelected = selections.some(selected => selected.toLocaleLowerCase() === branch.toLocaleLowerCase());
      const nextSelections = alreadySelected
        ? selections.filter(selected => selected.toLocaleLowerCase() !== branch.toLocaleLowerCase())
        : [...selections, branch];
      const nextBranches = nextSelections.join(', ');
      return { ...current, branches: nextBranches, hostBranch: selectedHostBranch(current.hostBranch, nextBranches) };
    });
  }
  const summary = [
    { label: 'Members in scope', value: dashboard?.stats?.member_count || 0 },
    { label: 'Published events', value: dashboard?.stats?.published_event_count || 0 },
    { label: 'RSVPs received', value: dashboard?.stats?.rsvp_count || 0 },
  ];
  return <ScrollView contentContainerStyle={[s.page, isMobile && { padding: 16, gap: 14 }]} showsVerticalScrollIndicator={false}>
    <View style={[s.topbar, isMobile && { flexDirection: 'column', alignItems: 'flex-start', gap: 10 }]}>
      <View><Text style={s.brand}>ANC UNITY</Text><Text style={s.topTitle}>Events Dashboard</Text></View>
      <View style={[s.userBox, isMobile && { alignItems: 'flex-start' }]}><Text style={s.userName}>{user.user_metadata?.full_name || user.email}</Text><Text style={s.role}>{scope.role.replace('_', ' ')}</Text><TouchableOpacity onPress={signOut}><Text style={s.signOut}>Sign out</Text></TouchableOpacity></View>
    </View>
    <View style={s.scope}><Icon name="verified-user" size={18} color={Colors.primary}/><Text style={s.scopeText}>{canPublishNational ? 'Super Admin · create National or specific multi-branch events' : `Branch Organiser · events for ${scope.branch_name || 'your assigned branch'} only`}</Text></View>
    {error ? <Text style={s.error}>{error}</Text> : null}
    <View style={[s.stats, isMobile && s.statsMobile]}>{summary.map(item => <View key={item.label} style={[s.stat, isMobile && s.statMobile]}><Text style={s.statNumber}>{item.value}</Text><Text style={s.statLabel}>{item.label}</Text></View>)}</View>
    <View style={[s.grid, isMobile && s.gridMobile]}>
      <View style={[s.panel, s.gridPanel, isMobile && s.gridPanelMobile]}>
        <Text style={s.panelTitle}>Publish an event</Text><Text style={s.panelCopy}>{canPublishNational ? 'Choose National or target one or more specific branches.' : `Events are published only to ${scope.branch_name}.`}</Text>
        <FormSection number="1" title="Event details" copy="Use a short, recognisable title for members." first>
          <FieldLabel required>Event title</FieldLabel>
          <TextInput value={form.title} onChangeText={value => setForm(current => ({ ...current, title: value }))} placeholder="e.g. Ward 91 weekly strategy meeting" placeholderTextColor="#718078" autoCapitalize="sentences" accessibilityLabel="Event title" style={s.input}/>
        </FormSection>
        <FormSection number="2" title="Date and time" copy="Choose when the event begins. All times use South Africa Standard Time.">
          <FieldLabel required>Start date and time</FieldLabel>
          <EventCalendar value={eventDate} time={eventTime} onChangeDate={setEventDate} onChangeTime={setEventTime}/>
        </FormSection>
        <FormSection number="3" title="Location" copy="Tell members where to meet.">
          <FieldLabel>Venue</FieldLabel>
          <TextInput value={form.venue} onChangeText={value => setForm(current => ({ ...current, venue: value }))} placeholder="e.g. Moses Mabhida Stadium" placeholderTextColor="#718078" autoCapitalize="words" accessibilityLabel="Event venue" style={s.input}/>
          <FieldLabel>Area or city</FieldLabel>
          <TextInput value={form.location} onChangeText={value => setForm(current => ({ ...current, location: value }))} placeholder="e.g. Stamford Hill, Durban" placeholderTextColor="#718078" autoCapitalize="words" accessibilityLabel="Event area or city" style={s.input}/>
        </FormSection>
        <FormSection number="4" title="Audience" copy={canPublishNational ? 'Choose who should be able to find this event.' : 'Your organiser role is limited to the branch shown below.'}>
          <FieldLabel required>Who can see this event</FieldLabel>
          {canPublishNational ? <View style={s.audienceRow}><TouchableOpacity accessibilityRole="button" accessibilityState={{ selected: form.audience === 'branch' }} onPress={() => setForm(current => ({ ...current, audience: 'branch' }))} style={[s.audience, form.audience === 'branch' && s.audienceActive]}><Text style={[s.audienceText, form.audience === 'branch' && s.audienceTextActive]}>Specific branches</Text></TouchableOpacity><TouchableOpacity accessibilityRole="button" accessibilityState={{ selected: form.audience === 'national' }} onPress={() => setForm(current => ({ ...current, audience: 'national', branches: '', hostBranch: '' }))} style={[s.audience, form.audience === 'national' && s.audienceActive]}><Text style={[s.audienceText, form.audience === 'national' && s.audienceTextActive]}>National</Text></TouchableOpacity></View> : <View style={ux.lockedAudience}><Icon name="lock-outline" size={17} color={Colors.primary}/><Text style={ux.lockedAudienceText}>Branch only · {scope.branch_name || 'Your assigned branch'}</Text></View>}
          {canPublishNational && form.audience === 'branch' ? <>
            <FieldLabel required hint="Choose one or more registered branches. You can also add or edit names below.">Visible branches</FieldLabel>
            {availableBranches.length ? <View style={ux.branchPicker}>{availableBranches.map(branch => <TouchableOpacity key={branch} accessibilityRole="checkbox" accessibilityState={{ checked: isBranchSelected(branch) }} onPress={() => toggleBranchSelection(branch)} style={[ux.branchChoice, isBranchSelected(branch) && ux.branchChoiceSelected]}><Text style={[ux.branchChoiceText, isBranchSelected(branch) && ux.branchChoiceTextSelected]}>{isBranchSelected(branch) ? '✓ ' : ''}{branch}</Text></TouchableOpacity>)}</View> : null}
            <TextInput value={form.branches} onChangeText={updateVisibleBranches} placeholder="e.g. Ward 88, Ward 91" placeholderTextColor="#718078" autoCapitalize="words" accessibilityLabel="Event branches, separated by commas" style={s.input}/>
            {selectedBranchNames.length ? <>
              <FieldLabel required hint="Pick one of the visible branches. Members in every selected branch will see who is hosting.">Hosting branch</FieldLabel>
              <View style={ux.branchPicker}>{selectedBranchNames.map(branch => <TouchableOpacity key={branch} accessibilityRole="radio" accessibilityState={{ selected: hostingBranch === branch }} onPress={() => setForm(current => ({ ...current, hostBranch: branch }))} style={[ux.branchChoice, hostingBranch === branch && ux.branchChoiceSelected]}><Text style={[ux.branchChoiceText, hostingBranch === branch && ux.branchChoiceTextSelected]}>{hostingBranch === branch ? '✓ Hosting: ' : ''}{branch}</Text></TouchableOpacity>)}</View>
              <Text style={ux.hostingBranchNote}>Members will see “Hosted by {hostingBranch}” on this event.</Text>
            </> : <Text style={ux.hostingBranchPrompt}>Choose at least one visible branch to set the hosting branch.</Text>}
          </> : null}
          {!canPublishNational ? <View style={ux.hostingBranchNotice}><Icon name="account-balance" size={17} color={Colors.primary}/><Text style={ux.lockedAudienceText}>Hosted automatically by {scope.branch_name || 'your assigned branch'}.</Text></View> : null}
          {canPublishNational && form.audience === 'national' ? <View style={ux.hostingBranchNotice}><Icon name="public" size={17} color={Colors.primary}/><Text style={ux.lockedAudienceText}>Hosted by ANC National.</Text></View> : null}
        </FormSection>
        <FormSection number="5" title="Member message" copy="Add any details members need before they RSVP.">
          <FieldLabel hint="Optional, but recommended for a clear invitation.">Description</FieldLabel>
          <TextInput value={form.description} onChangeText={value => setForm(current => ({ ...current, description: value }))} placeholder="What will happen, who should attend, and anything members should bring." placeholderTextColor="#718078" multiline accessibilityLabel="Event description" style={[s.input, s.description]}/>
        </FormSection>
        <TouchableOpacity disabled={saving} style={[s.primaryButton, ux.publishButton, saving && s.disabled]} onPress={publishEvent}><Text style={s.primaryButtonText}>{saving ? 'Publishing…' : 'Publish event'}</Text></TouchableOpacity>
      </View>
      <View style={[s.panel, s.gridPanel, isMobile && s.gridPanelMobile]}><Text style={s.panelTitle}>Published events</Text>{(dashboard?.events || []).length ? dashboard.events.map(event => {
        const hostBranch = eventHostName(event);
        return <View key={event.id} style={s.event}>
          <Text style={s.eventTitle}>{event.title}</Text>
          <Text style={s.eventMeta}>{new Date(event.starts_at).toLocaleString()} · {event.audience === 'national' ? 'National' : event.target_branches?.join(', ') || event.branch_name}</Text>
          {hostBranch ? <Text style={s.eventMeta}>Hosted by {hostBranch}</Text> : null}
          <Text style={s.eventMeta}>{event.venue || event.location || 'Venue to be confirmed'} · {event.rsvp_count || 0} RSVPs</Text>
        </View>;
      }) : <Text style={s.empty}>No events have been published in your scope yet.</Text>}</View>
    </View>
    {canPublishNational ? <View style={[s.panel, ux.organiserPanel]}>
      <Text style={s.panelTitle}>Organiser access</Text>
      <Text style={s.panelCopy}>Only Super Admins can manage dashboard access. Members do not receive publishing rights unless you assign them here.</Text>
      {organiserNotice ? <Text style={ux.organiserNotice}>{organiserNotice}</Text> : null}
      {organiserActionError ? <Text style={s.error}>{organiserActionError}</Text> : null}
      {organiserDirectoryLoading ? <View style={ux.directoryLoading}><ActivityIndicator color={Colors.primary}/><Text style={ux.directoryLoadingText}>Loading member access…</Text></View> : null}
      {!organiserDirectoryLoading && organiserDirectoryError ? <View style={ux.directoryError}><Text style={ux.directoryErrorTitle}>Role management needs one setup step</Text><Text style={ux.directoryErrorCopy}>Run <Text style={ux.directoryErrorFile}>supabase/admin_role_management.sql</Text> once in the Supabase SQL Editor, then retry. Publishing remains available while this setup is pending.</Text><TouchableOpacity style={ux.directoryRetry} onPress={loadOrganiserDirectory}><Text style={ux.directoryRetryText}>Retry role management</Text></TouchableOpacity></View> : null}
      {!organiserDirectoryLoading && !organiserDirectoryError ? organiserDirectory.map(member => {
        const isSelf = member.user_id === user.id;
        const busy = organiserActionId === member.user_id;
        const roleLabel = member.role === 'super_admin' ? 'Super Admin' : member.role === 'branch_organiser' ? `Branch Organiser · ${member.organiser_branch_name || member.member_branch_name || 'Branch pending'}` : 'Member only';
        return <View key={member.user_id} style={ux.organiserRow}>
          <View style={ux.organiserIdentity}><Text style={ux.organiserName}>{member.full_name || 'ANC Member'}</Text><Text style={ux.organiserMeta}>{member.membership_number || 'Membership pending'} · {member.member_branch_name || 'No branch assigned'}</Text><Text style={[ux.rolePill, member.role === 'super_admin' && ux.rolePillAdmin, member.role === 'branch_organiser' && ux.rolePillOrganiser]}>{roleLabel}</Text></View>
          <View style={ux.organiserActions}>
            {!isSelf && member.role !== 'branch_organiser' ? <TouchableOpacity disabled={busy || !member.member_branch_name} style={[ux.roleButton, ux.branchRoleButton, (busy || !member.member_branch_name) && ux.roleButtonDisabled]} onPress={() => setOrganiserRole(member, 'branch_organiser')}><Text style={ux.branchRoleButtonText}>Make Branch Organiser</Text></TouchableOpacity> : null}
            {!isSelf && member.role !== 'super_admin' ? <TouchableOpacity disabled={busy} style={[ux.roleButton, busy && ux.roleButtonDisabled]} onPress={() => setOrganiserRole(member, 'super_admin')}><Text style={ux.roleButtonText}>Make Super Admin</Text></TouchableOpacity> : null}
            {!isSelf && member.role ? <TouchableOpacity disabled={busy} onPress={() => revokeOrganiserRole(member)}><Text style={[ux.removeRoleText, busy && ux.roleButtonDisabled]}>Remove dashboard access</Text></TouchableOpacity> : null}
            {isSelf ? <Text style={ux.currentAdminText}>Your Super Admin access</Text> : null}
          </View>
        </View>;
      }) : null}
    </View> : null}
    <View style={s.panel}><Text style={s.panelTitle}>Members in your scope</Text><Text style={s.panelCopy}>A limited operational directory for authorised organisers. Phone numbers and passwords are never shown.</Text>{(dashboard?.members || []).slice(0, 50).map(member => <View key={member.id} style={s.member}><View style={s.memberAvatar}><Text style={s.memberAvatarText}>{member.full_name.split(' ').map(part => part[0]).join('').slice(0, 2)}</Text></View><View style={{ flex: 1 }}><Text style={s.memberName}>{member.full_name}</Text><Text style={s.memberMeta}>{member.membership_number || 'Membership pending'} · {member.branch_name || 'Branch pending'}</Text></View></View>)}</View>
  </ScrollView>;
}

const s = StyleSheet.create({ center:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#F5F8F5'},loadingText:{marginTop:12,color:Colors.muted,fontWeight:'700'},authPage:{flex:1,backgroundColor:'#F2F6F3',alignItems:'center',justifyContent:'center',padding:24},authCard:{width:'100%',maxWidth:440,backgroundColor:Colors.white,borderRadius:18,padding:30,borderWidth:1,borderColor:'#DCE8DF'},brand:{fontSize:14,fontWeight:'900',letterSpacing:1.8,color:Colors.primary},authTitle:{fontSize:30,fontWeight:'900',color:Colors.ink,marginTop:10},authCopy:{fontSize:14,lineHeight:21,color:Colors.muted,marginTop:8,marginBottom:20},input:{minHeight:46,borderWidth:1,borderColor:'#DCE5DF',borderRadius:9,backgroundColor:'#FFF',paddingHorizontal:13,fontSize:14,color:Colors.ink,marginBottom:11},primaryButton:{minHeight:46,backgroundColor:Colors.primary,borderRadius:9,alignItems:'center',justifyContent:'center',paddingHorizontal:16},primaryButtonText:{color:Colors.white,fontWeight:'800',fontSize:14},help:{fontSize:12,lineHeight:18,color:Colors.muted,textAlign:'center',marginTop:18},error:{backgroundColor:'#FFF0E8',color:'#9A3F00',padding:12,borderRadius:9,fontSize:13,lineHeight:18,marginBottom:14},signOut:{color:'#B42318',fontWeight:'800',fontSize:12,marginTop:10,textAlign:'right'},page:{backgroundColor:'#F5F8F5',padding:30,gap:18,minHeight:'100%'},topbar:{maxWidth:1200,width:'100%',alignSelf:'center',flexDirection:'row',justifyContent:'space-between',alignItems:'center'},topTitle:{fontSize:28,fontWeight:'900',color:Colors.ink,marginTop:4},userBox:{alignItems:'flex-end'},userName:{fontSize:13,fontWeight:'800',color:Colors.ink},role:{fontSize:11,color:Colors.primary,fontWeight:'800',textTransform:'uppercase',marginTop:3},scope:{maxWidth:1200,width:'100%',alignSelf:'center',backgroundColor:'#E7F5EA',borderRadius:10,padding:13,flexDirection:'row',alignItems:'center',gap:8},scopeText:{color:Colors.primary,fontWeight:'700',fontSize:13},stats:{maxWidth:1200,width:'100%',alignSelf:'center',flexDirection:'row',gap:14},statsMobile:{flexDirection:'column',gap:10},stat:{flexGrow:1,flexShrink:1,flexBasis:0,minHeight:96,justifyContent:'center',backgroundColor:Colors.white,borderRadius:12,padding:18,borderWidth:1,borderColor:'#E0E9E1'},statMobile:{width:'100%',flexGrow:0,flexShrink:0,flexBasis:'auto',minHeight:88},statNumber:{fontSize:28,lineHeight:34,fontWeight:'900',color:Colors.ink},statLabel:{fontSize:12,lineHeight:18,color:Colors.muted,marginTop:4,fontWeight:'700'},grid:{maxWidth:1200,width:'100%',alignSelf:'center',flexDirection:'row',gap:18,alignItems:'flex-start'},gridMobile:{flexDirection:'column',gap:14},panel:{maxWidth:1200,width:'100%',alignSelf:'center',backgroundColor:Colors.white,borderRadius:12,padding:20,borderWidth:1,borderColor:'#E0E9E1'},gridPanel:{flexGrow:1,flexShrink:1,flexBasis:0,alignSelf:'auto'},gridPanelMobile:{width:'100%',flexGrow:0,flexShrink:0,flexBasis:'auto'},panelTitle:{fontSize:19,fontWeight:'900',color:Colors.ink,marginBottom:5},panelCopy:{fontSize:13,lineHeight:19,color:Colors.muted,marginBottom:16},fieldLabel:{fontSize:12,fontWeight:'800',color:Colors.ink,marginBottom:7},calendarBox:{borderWidth:1,borderColor:'#DCE5DF',borderRadius:10,backgroundColor:'#FBFDFB',padding:10,marginBottom:11},calendarHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:8},calendarMonth:{fontSize:14,fontWeight:'900',color:Colors.ink},monthButton:{width:30,height:30,borderRadius:15,alignItems:'center',justifyContent:'center',backgroundColor:'#E7F5EA'},monthButtonText:{fontSize:24,lineHeight:26,color:Colors.primary,fontWeight:'700'},calendarGrid:{flexDirection:'row',flexWrap:'wrap'},weekday:{width:'14.2857%',fontSize:10,fontWeight:'800',color:Colors.muted,textAlign:'center',paddingBottom:6},dayCell:{width:'14.2857%',height:32,alignItems:'center',justifyContent:'center'},day:{width:28,height:28,borderRadius:14,alignItems:'center',justifyContent:'center'},daySelected:{backgroundColor:Colors.primary},dayText:{fontSize:12,color:Colors.ink,fontWeight:'700'},dayTextSelected:{color:Colors.white},selectedDateRow:{borderTopWidth:1,borderTopColor:'#E6EEE7',paddingTop:10,marginTop:4,flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end',gap:8},selectedDateLabel:{fontSize:10,fontWeight:'800',textTransform:'uppercase',letterSpacing:.5,color:Colors.muted},selectedDate:{fontSize:12,color:Colors.ink,fontWeight:'800',marginTop:3},timeBox:{width:74},timeInput:{fontSize:13,color:Colors.ink,fontWeight:'800',paddingVertical:3,borderBottomWidth:1,borderBottomColor:Colors.primary,textAlign:'center'},audienceRow:{flexDirection:'row',gap:8,marginBottom:12},audience:{paddingVertical:10,paddingHorizontal:13,borderRadius:8,backgroundColor:'#F2F4F2'},audienceActive:{backgroundColor:Colors.primary},audienceText:{color:Colors.muted,fontWeight:'800',fontSize:12},audienceTextActive:{color:Colors.white},description:{height:84,paddingTop:12,textAlignVertical:'top'},disabled:{opacity:.65},event:{paddingVertical:13,borderBottomWidth:1,borderBottomColor:'#EDF1ED'},eventTitle:{fontSize:15,fontWeight:'900',color:Colors.ink},eventMeta:{fontSize:12,color:Colors.muted,marginTop:5},empty:{fontSize:13,color:Colors.muted,paddingVertical:20},member:{flexDirection:'row',alignItems:'center',paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#EDF1ED'},memberAvatar:{width:38,height:38,borderRadius:19,backgroundColor:Colors.gold,alignItems:'center',justifyContent:'center',marginRight:12},memberAvatarText:{color:Colors.primary,fontWeight:'900'},memberName:{fontSize:14,fontWeight:'800',color:Colors.ink},memberMeta:{fontSize:12,color:Colors.muted,marginTop:3} });
