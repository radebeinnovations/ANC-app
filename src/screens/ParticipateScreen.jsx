import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon, ReceiveMoneySvgIcon, SendMoneySvgIcon } from '../components/Icons';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';
import { getMemberProfile } from '../utils/memberProfile';
import { getMyPublishedEvents, subscribeToPublishedEventChanges } from '../services/eventsService';

const AVATAR_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP7zlfBNbg5jSucUfG5tPD3BtnVuTQAY2I1kjxSuVqrYNxWqB2lpmvbct4HtE9rdYUrNvLmyCoODdPJBfEqJlKcTv1n486W4ZiNoD2hMMB6ygx62xZumjQQcA9Q5uBGXVyeqgizdBJTJZhYHK0e2jGRtVRt-uNnljNFVUKXpdgq2Cyhy3xUtsvwfSISYHxtEhER8JSmDx9fJe9hVTzN3FqNWNa4aOez8vY3D9vx2YwUd9oJmGKaKmb';
const COMMUNITY_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHtomXsNt6ZfeyvGZOeE5XMikoE5zxU6RquvkfvLhr4T0JYKXccFIuYI8r2T8-9ZZlaqqwWNNziIBcMoWa6jD-ILIRWc02WFG9hRmYaM5BbCiDBXKNUaGsyOhxcgb2bbd-Rzx6m0FPLxfh6dQLM5XA30dGG_LKc4u72FFmXlnnxQsZ_gmIR0jV8GlW5p6QYUO-h6qfrqHZGSfWJY6mootTuO2zTIRBZjmzjM-J9VHYQU1WxM4WEO0i';
const LATEST_HERO_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHgtndFSg1VNHObIGcZIVyJ5csQDFMufbynzecuPzTzzip8_SF-7bE1hkBqrIDk2z9WdB1hn7AkKoRKDOPoriFESQprpaPvPA6Ho8WSsUUujbo0AHfZDXL7hrjhX2QtMPeRC1k8BjZvaMiIJfrxsBDvqyp6IXPPHOShgQ7OAxnrFAIm-k2Bi-gVqHYdMwDGMJuAdeIw59P2iO6C99NyhzmCY0_uxbJOPsLZtsOaecMLdGGehVIy_3GQW0_gNbsLDWnGA';
const eventHostName = event => {
  const explicitHost = event?.host_branch_name || event?.host_branch || event?.hosting_branch || event?.hostBranch || event?.hostingBranch;
  if (explicitHost) return explicitHost;
  if (event?.audience === 'national') return 'ANC National';
  const targets = event?.target_branches?.filter(Boolean) || [];
  return targets.length <= 1 ? event?.branch_name || targets[0] || '' : '';
};

export default function ParticipateScreen({ open, user }) {
  const [activeFilter, setActiveFilter] = useState('My Community');
  const [communityEvents, setCommunityEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const [eventsError, setEventsError] = useState('');
  const member = getMemberProfile(user);

  const filters = ['Important Dates', 'My Community', 'Quick Services', 'Latest Updates'];

  async function loadCommunityEvents({ showLoading = false } = {}) {
    if (!user) {
      setCommunityEvents([]);
      setEventsError('');
      setEventsLoaded(true);
      return;
    }
    if (showLoading) setEventsLoading(true);
    setEventsError('');
    try {
      setCommunityEvents(await getMyPublishedEvents());
    } catch {
      setCommunityEvents([]);
      setEventsError('We could not load upcoming events right now.');
    } finally {
      setEventsLoaded(true);
      if (showLoading) setEventsLoading(false);
    }
  }

  useEffect(() => {
    if (!user) return undefined;
    loadCommunityEvents({ showLoading: true });
    const unsubscribe = subscribeToPublishedEventChanges(loadCommunityEvents);
    const refreshTimer = setInterval(loadCommunityEvents, 30000);
    return () => { unsubscribe(); clearInterval(refreshTimer); };
  }, [user?.id]);

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Top Greeting Header */}
      <View style={s.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.greetingTitle}>Good morning, {member.firstName}</Text>
          <Text style={s.greetingSub}>ANC MEMBER · {member.branchName}</Text>
        </View>

        <TouchableOpacity style={s.avatarContainer} onPress={() => open('profile')} activeOpacity={0.8}>
          <Image source={{ uri: AVATAR_IMG_URL }} style={s.avatarImage} />
        </TouchableOpacity>
      </View>

      {/* Member Status Card (1:1 with Target HTML) */}
      <View style={s.statusCard}>
        <View style={s.cardHeaderRow}>
          <View style={s.activeChipPill}>
            <View style={s.activeDotGreen} />
            <Text style={s.activeChipText}>ACTIVE</Text>
          </View>
        </View>

        <Text style={s.cardLabel}>MEMBERSHIP NUMBER</Text>
        <Text style={s.membershipNumberText}>{member.membershipNumber}</Text>

        <View style={s.locationRow}>
          <Icon name="location-on" size={16} color="#4A5568" />
          <Text style={s.locationText}>{member.branchName}</Text>
        </View>

        <TouchableOpacity style={s.viewMemberCardBtn} onPress={() => open('profile')} activeOpacity={0.85}>
          <Text style={s.viewMemberCardBtnText}>View Member Card</Text>
          <Icon name="arrow-forward" size={16} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Category Filter Pills Row (Exact 1:1 with Target HTML) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.pillsRow}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[s.pillBtn, activeFilter === filter && s.pillBtnActive]}
            onPress={() => setActiveFilter(filter)}
            activeOpacity={0.8}
          >
            <Text style={[s.pillText, activeFilter === filter && s.pillTextActive]}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* DYNAMIC SECTION RENDERER BASED ON ACTIVE FILTER */}

      {/* 1. IMPORTANT DATES */}
      {(activeFilter === 'Important Dates' || activeFilter === 'All') && (
        <View style={s.sectionContainer}>
          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionTitle}>IMPORTANT DATES</Text>
            <TouchableOpacity onPress={() => open('updates')}>
              <Text style={s.viewAllLink}>View all</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={s.importantDateCard} onPress={() => open('updates')} activeOpacity={0.85}>
            <View style={s.dateBoxSquare}>
              <Text style={s.dateBoxMonth}>NOV</Text>
              <Text style={s.dateBoxDay}>04</Text>
            </View>

            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={s.importantDateHeadline}>2026 Local Government Elections</Text>
              <Text style={s.importantDateSub}>Nationwide Municipal Polling Day</Text>
            </View>

            <Icon name="chevron-right" size={20} color="#BDCABC" />
          </TouchableOpacity>
        </View>
      )}

      {/* 2. MY COMMUNITY */}
      {(activeFilter === 'My Community' || activeFilter === 'All') && (
        <View style={s.sectionContainer}>
          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionTitle}>MY COMMUNITY</Text>
            <TouchableOpacity accessibilityLabel="Refresh community events" onPress={() => loadCommunityEvents({ showLoading: true })} style={s.eventsRefresh} disabled={eventsLoading}>
              {eventsLoading ? <ActivityIndicator size="small" color="#006933" /> : <Icon name="refresh" size={18} color="#006933" />}
              <Text style={s.eventsRefreshText}>{eventsLoading ? 'Updating' : 'Refresh'}</Text>
            </TouchableOpacity>
          </View>

          {!eventsLoaded ? <View style={s.eventsStatus}><ActivityIndicator size="small" color="#006933" /><Text style={s.eventsStatusText}>Loading upcoming events…</Text></View> : null}

          {eventsLoaded && communityEvents.map((event, index) => {
            const eventVenue = event.venue || event.location || 'Venue to be confirmed';
            const eventSchedule = event.starts_at
              ? `${new Date(event.starts_at).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })} · ${new Date(event.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} at ${eventVenue}`
              : `Date and time to be confirmed at ${eventVenue}`;
            const eventTag = event.audience === 'national' ? 'ANC NATIONAL EVENT' : event.target_branches?.length > 1 ? 'MULTI-BRANCH EVENT' : 'BRANCH MEETING';
            const hostBranch = eventHostName(event);
            return <View key={event.id} style={[s.communityCard, index > 0 && s.communityCardStacked]}>
              <Image source={{ uri: COMMUNITY_IMG_URL }} style={s.communityImage} resizeMode="cover" />
              <View style={s.communityBody}>
                <Text style={s.branchTag}>{eventTag}</Text>
                <Text style={s.meetingHeadline}>{event.title}</Text>
                {hostBranch ? <View style={s.hostedByRow}><Icon name="account-balance" size={15} color="#006933" /><Text style={s.hostedByText}>Hosted by {hostBranch}</Text></View> : null}
                <View style={s.scheduleRow}>
                  <Icon name="schedule" size={16} color="#4A5568" />
                  <Text style={s.scheduleText}>{eventSchedule}</Text>
                </View>
                <TouchableOpacity style={s.viewEventBtn} onPress={() => open('event', event)} activeOpacity={0.85}>
                  <Text style={s.viewEventBtnText}>View Event & RSVP</Text>
                </TouchableOpacity>
              </View>
            </View>;
          })}

          {eventsLoaded && !communityEvents.length ? <View style={s.emptyEventsCard}>
            <View style={s.emptyEventsIcon}><Icon name={eventsError ? 'error-outline' : 'event-upcoming'} size={22} color={eventsError ? '#B54708' : '#006933'} /></View>
            <View style={s.emptyEventsCopy}>
              <Text style={s.emptyEventsTitle}>{eventsError ? 'Events are temporarily unavailable' : user ? 'No upcoming events for your branch yet' : 'Sign in to see your upcoming events'}</Text>
              <Text style={s.emptyEventsText}>{eventsError ? 'Tap Refresh to try again.' : 'Published national events and events for your registered branch will appear here as individual cards.'}</Text>
            </View>
          </View> : null}

          {eventsLoaded && !eventsError && user ? <Text style={s.eventsSyncNote}>New events appear automatically. You can also tap Refresh at any time.</Text> : null}
        </View>
      )}

      {/* 3. QUICK SERVICES */}
      {(activeFilter === 'Quick Services' || activeFilter === 'All') && (
        <View style={s.sectionContainer}>
          <Text style={s.sectionTitle}>QUICK SERVICES</Text>

          <View style={s.services3Grid}>
            <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('send')} activeOpacity={0.8}>
              <View style={[s.squircleIconBox, { backgroundColor: 'rgba(0, 105, 51, 0.1)' }]}>
                <SendMoneySvgIcon size={24} color="#006933" />
              </View>
              <Text style={s.serviceSquareLabel}>Send{'\n'}Money</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('receive')} activeOpacity={0.8}>
              <View style={[s.squircleIconBox, { backgroundColor: 'rgba(0, 105, 51, 0.1)' }]}>
                <ReceiveMoneySvgIcon size={24} color="#006933" />
              </View>
              <Text style={s.serviceSquareLabel}>Receive{'\n'}Money</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('airtime')} activeOpacity={0.8}>
              <View style={[s.squircleIconBox, { backgroundColor: '#E2E2E2' }]}>
                <Icon name="smartphone" size={22} color="#1A1C1C" />
              </View>
              <Text style={s.serviceSquareLabel}>Buy{'\n'}Airtime</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('data')} activeOpacity={0.8}>
              <View style={[s.squircleIconBox, { backgroundColor: '#E2E2E2' }]}>
                <Icon name="wifi" size={22} color="#1A1C1C" />
              </View>
              <Text style={s.serviceSquareLabel}>Buy{'\n'}Data</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('electricity')} activeOpacity={0.8}>
              <View style={[s.squircleIconBox, { backgroundColor: '#E2E2E2' }]}>
                <Icon name="bolt" size={22} color="#1A1C1C" />
              </View>
              <Text style={s.serviceSquareLabel}>Buy{'\n'}Electricity</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('donate')} activeOpacity={0.8}>
              <View style={[s.squircleIconBox, { backgroundColor: '#FECC00' }]}>
                <Icon name="volunteer-activism" size={22} color="#6E5700" />
              </View>
              <Text style={s.serviceSquareLabel}>Donate{'\n'}Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 4. LATEST UPDATES (HERO EDITORIAL CARD MATCHING SCREENSHOT 100%) */}
      {(activeFilter === 'Latest Updates' || activeFilter === 'All') && (
        <View style={s.sectionContainer}>
          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionTitle}>LATEST FROM THE ANC</Text>
          </View>

          <TouchableOpacity style={s.latestHeroCard} onPress={() => open('statement_detail')} activeOpacity={0.85}>
            <ImageBackground source={{ uri: LATEST_HERO_IMG_URL }} style={s.latestHeroBg} resizeMode="cover">
              {/* Dark Gradient Overlay Container */}
              <View style={s.latestHeroOverlay}>
                <View style={s.latestHeroMetaRow}>
                  <View style={s.goldStatementBadge}>
                    <Text style={s.goldStatementBadgeText}>ANC STATEMENT</Text>
                  </View>
                  <Text style={s.latestHeroDateText}>12 August 2026</Text>
                </View>

                <Text style={s.latestHeroHeadline}>Building Stronger Local Government</Text>

                <View style={s.readFullRow}>
                  <Text style={s.readFullText}>Read Full Statement</Text>
                  <Icon name="arrow-forward" size={16} color={Colors.white} />
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      )}

      <YamiFooter />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 100, backgroundColor: '#F9F9F9' },

  /* HEADER */
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  greetingTitle: { fontSize: 24, fontWeight: '800', color: '#1A1C1C', fontFamily: 'Hanken Grotesk' },
  greetingSub: { fontSize: 11, fontWeight: '700', color: '#4A5568', textTransform: 'uppercase', marginTop: 2, fontFamily: 'Inter' },
  avatarContainer: { width: 48, height: 48, borderRadius: 24, overflow: 'hidden', borderWidth: 2, borderColor: '#E8E8E8' },
  avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  /* MEMBER STATUS CARD */
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: { marginBottom: 10 },
  activeChipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 133, 66, 0.1)',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  activeDotGreen: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#008542' },
  activeChipText: { fontSize: 11, fontWeight: '800', color: '#008542', letterSpacing: 0.5, fontFamily: 'Inter' },

  cardLabel: { fontSize: 10, fontWeight: '800', color: '#4A5568', letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'Inter' },
  membershipNumberText: { fontSize: 22, fontWeight: '800', color: '#1A1C1C', marginTop: 2, marginBottom: 12, fontFamily: 'Hanken Grotesk' },

  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  locationText: { fontSize: 13, color: '#4A5568', fontWeight: '600', fontFamily: 'Inter' },

  viewMemberCardBtn: {
    backgroundColor: '#006933',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  viewMemberCardBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', fontFamily: 'Inter' },

  /* CATEGORY PILLS BAR */
  pillsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  pillBtn: {
    backgroundColor: '#EEEEEE',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pillBtnActive: { backgroundColor: '#006933' },
  pillText: { fontSize: 13, fontWeight: '700', color: '#4A5568', fontFamily: 'Inter' },
  pillTextActive: { color: '#FFFFFF' },

  /* SECTIONS */
  sectionContainer: { marginBottom: 22 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 11, fontWeight: '900', color: '#4A5568', letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'Inter' },
  viewAllLink: { fontSize: 13, fontWeight: '700', color: '#006933', fontFamily: 'Inter' },

  /* IMPORTANT DATES CARD */
  importantDateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBoxSquare: {
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateBoxMonth: { fontSize: 11, fontWeight: '800', color: '#4A5568', textTransform: 'uppercase', fontFamily: 'Inter' },
  dateBoxDay: { fontSize: 20, fontWeight: '800', color: '#006933', fontFamily: 'Hanken Grotesk' },
  importantDateHeadline: { fontSize: 16, fontWeight: '700', color: '#1A1C1C', marginBottom: 2, fontFamily: 'Hanken Grotesk' },
  importantDateSub: { fontSize: 13, color: '#4A5568', fontFamily: 'Inter' },

  /* MY COMMUNITY CARD */
  communityCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0' },
  communityCardStacked: { marginTop: 14 },
  communityImage: { width: '100%', height: 160 },
  communityBody: { padding: 16 },
  branchTag: { fontSize: 11, fontWeight: '800', color: '#006933', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4, fontFamily: 'Inter' },
  meetingHeadline: { fontSize: 18, fontWeight: '700', color: '#1A1C1C', marginBottom: 6, fontFamily: 'Hanken Grotesk' },
  hostedByRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 7, paddingRight: 4 },
  hostedByText: { flexShrink: 1, color: '#006933', fontSize: 12, lineHeight: 17, fontWeight: '700', fontFamily: 'Inter' },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  scheduleText: { fontSize: 13, color: '#4A5568', fontFamily: 'Inter' },
  viewEventBtn: { backgroundColor: '#006933', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  viewEventBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', fontFamily: 'Inter' },
  eventsRefresh: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 6, paddingVertical: 5 },
  eventsRefreshText: { color: '#006933', fontSize: 13, fontWeight: '800', fontFamily: 'Inter' },
  eventsStatus: { minHeight: 124, borderWidth: 1, borderColor: '#DCE8DF', borderRadius: 16, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 18 },
  eventsStatusText: { color: '#4A5568', fontSize: 13, fontWeight: '700', fontFamily: 'Inter' },
  emptyEventsCard: { minHeight: 130, borderWidth: 1, borderColor: '#DCE8DF', borderRadius: 16, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16 },
  emptyEventsIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8F5EB', alignItems: 'center', justifyContent: 'center' },
  emptyEventsCopy: { flex: 1, paddingTop: 1 },
  emptyEventsTitle: { color: '#1A1C1C', fontSize: 15, fontWeight: '800', lineHeight: 21, fontFamily: 'Hanken Grotesk' },
  emptyEventsText: { color: '#4A5568', fontSize: 13, lineHeight: 19, marginTop: 4, fontFamily: 'Inter' },
  eventsSyncNote: { color: '#4A5568', fontSize: 12, lineHeight: 17, marginTop: 10, fontFamily: 'Inter' },

  /* QUICK SERVICES GRID */
  services3Grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  serviceSquareCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  squircleIconBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  serviceSquareLabel: { fontSize: 12, fontWeight: '700', color: '#1A1C1C', textAlign: 'center', lineHeight: 15, fontFamily: 'Inter' },

  /* LATEST HERO EDITORIAL CARD (MATCHING SCREENSHOT 100%) */
  latestHeroCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  latestHeroBg: { width: '100%', height: 260, justifyContent: 'flex-end' },
  latestHeroOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    padding: 18,
    justifyContent: 'flex-end',
  },
  latestHeroMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  goldStatementBadge: { backgroundColor: '#FECC00', borderRadius: 4, paddingVertical: 4, paddingHorizontal: 8 },
  goldStatementBadgeText: { color: '#241A00', fontSize: 11, fontWeight: '900', letterSpacing: 0.5, fontFamily: 'Inter' },
  latestHeroDateText: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 12, fontWeight: '600', fontFamily: 'Inter' },
  latestHeroHeadline: { color: Colors.white, fontSize: 20, fontWeight: '800', lineHeight: 26, marginBottom: 12, fontFamily: 'Hanken Grotesk' },
  readFullRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  readFullText: { color: Colors.white, fontSize: 14, fontWeight: '700', fontFamily: 'Inter' },
});
