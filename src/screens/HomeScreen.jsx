import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon, ReceiveMoneySvgIcon, SendMoneySvgIcon } from '../components/Icons';
import { Colors } from '../theme/colors';

const COMMUNITY_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHtomXsNt6ZfeyvGZOeE5XMikoE5zxU6RquvkfvLhr4T0JYKXccFIuYI8r2T8-9ZZlaqqwWNNziIBcMoWa6jD-ILIRWc02WFG9hRmYaM5BbCiDBXKNUaGsyOhxcgb2bbd-Rzx6m0FPLxfh6dQLM5XA30dGG_LKc4u72FFmXlnnxQsZ_gmIR0jV8GlW5p6QYUO-h6qfrqHZGSfWJY6mootTuO2zTIRBZjmzjM-J9VHYQU1WxM4WEO0i';
const NEWS_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHgtndFSg1VNHObIGcZIVyJ5csQDFMufbynzecuPzTzzip8_SF-7bE1hkBqrIDk2z9WdB1hn7AkKoRKDOPoriFESQprpaPvPA6Ho8WSsUUujbo0AHfZDXL7hrjhX2QtMPeRC1k8BjZvaMiIJfrxsBDvqyp6IXPPHOShgQ7OAxnrFAIm-k2Bi-gVqHYdMwDGMJuAdeIw59P2iO6C99NyhzmCY0_uxbJOPsLZtsOaecMLdGGehVIy_3GQW0_gNbsLDWnGA';
const AVATAR_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrqYetCBmAlp-mUDn8l5OIU6o0F7dliMQ9YlMujyt2i_rw30eTSl5oX57V5RvG6Uv3novo6hQqHuqXuxjPxnmQ64VJZhNknXZ4DhoAIDRlB_MEzW3GQdjyQXMzACivKaJvy5hjkaEoKyU3UZdq-hV15u4icDUiVm2q9ySZXpXL4mnHx7ueBa9KQERLutb2BCwMThrQ9XvvjjdL2bm8Hr_FTeNs1NvAV7TP1lenmhyAfTUTexR7q-_2';

export default function HomeScreen({ open }) {
  const [activeSegment, setActiveSegment] = useState('Latest Updates');

  const segments = ['Important Dates', 'My Community', 'Quick Services', 'Latest Updates'];

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Header Profile Greeting Section */}
      <View style={s.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.greetingTitle}>Good morning, Lerumo</Text>
          <Text style={s.greetingSub}>ANC MEMBER · Johannesburg Region</Text>
          <Text style={s.greetingBranch}>Branch Name</Text>
        </View>

        <TouchableOpacity style={s.avatarContainer} onPress={() => open('profile')} activeOpacity={0.8}>
          <Image source={{ uri: AVATAR_IMG_URL }} style={s.avatarImage} />
        </TouchableOpacity>
      </View>

      {/* Member Status Card (1:1 with Target Screenshot) */}
      <View style={s.statusCard}>
        <View style={s.cardHeaderRow}>
          <View style={s.activeChipPill}>
            <View style={s.activeDot} />
            <Text style={s.activeChipText}>ACTIVE</Text>
          </View>
        </View>

        <Text style={s.memberNumLabel}>MEMBERSHIP NUMBER</Text>
        <Text style={s.memberNumVal}>ANC-1234567</Text>

        <View style={s.branchLocationRow}>
          <Icon name="location-on" size={16} color="#3e4a3f" />
          <Text style={s.branchLocationText}>Johannesburg Region Branch</Text>
        </View>

        <TouchableOpacity style={s.viewCardGreenBtn} onPress={() => open('profile')} activeOpacity={0.8}>
          <Text style={s.viewCardGreenBtnText}>View Member Card</Text>
          <Icon name="arrow-forward" size={16} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Horizontal Scrollable Segment Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.segmentsScrollRow}
      >
        {segments.map((seg) => {
          const isSelected = activeSegment === seg;
          return (
            <TouchableOpacity
              key={seg}
              style={[s.segmentPill, isSelected && s.segmentPillSelected]}
              onPress={() => setActiveSegment(seg)}
              activeOpacity={0.8}
            >
              <Text style={[s.segmentPillText, isSelected && s.segmentPillTextSelected]}>
                {seg}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* DYNAMIC CONTENT BASED ON ACTIVE SEGMENT */}

      {/* SEGMENT: LATEST UPDATES (EXACT MATCH TO TARGET SCREENSHOT) */}
      {activeSegment === 'Latest Updates' && (
        <View style={s.segmentSection}>
          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionHeaderTitle}>LATEST FROM THE ANC</Text>
          </View>

          <TouchableOpacity
            style={s.newsCardOverlay}
            onPress={() => open('updates')}
            activeOpacity={0.85}
          >
            <Image source={{ uri: NEWS_IMG_URL }} style={s.newsBgImage} resizeMode="cover" />
            <View style={s.newsGradientScrim} />

            <View style={s.newsCardContent}>
              <View style={s.newsTopMetaRow}>
                <View style={s.goldStatementBadge}>
                  <Text style={s.goldStatementText}>ANC STATEMENT</Text>
                </View>
                <Text style={s.newsDateText}>12 August 2026</Text>
              </View>

              <Text style={s.newsHeadlineOverlay}>Building Stronger Local Government</Text>

              <View style={s.readFullBtnRow}>
                <Text style={s.readFullBtnText}>Read Full Statement</Text>
                <Icon name="arrow-forward" size={16} color={Colors.white} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* SEGMENT: IMPORTANT DATES */}
      {activeSegment === 'Important Dates' && (
        <View style={s.segmentSection}>
          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionHeaderTitle}>IMPORTANT DATES</Text>
            <TouchableOpacity onPress={() => open('updates')}>
              <Text style={s.viewAllLink}>View all</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={s.dateCardBox} onPress={() => open('updates')} activeOpacity={0.8}>
            <View style={s.dateBoxBadge}>
              <Text style={s.dateMonthText}>NOV</Text>
              <Text style={s.dateDayText}>04</Text>
            </View>

            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={s.dateTitleBold}>2026 Local Government Elections</Text>
              <Text style={s.dateSubText}>Nationwide</Text>
            </View>

            <Icon name="chevron-right" size={20} color="#A0AEC0" />
          </TouchableOpacity>
        </View>
      )}

      {/* SEGMENT: MY COMMUNITY */}
      {activeSegment === 'My Community' && (
        <View style={s.segmentSection}>
          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionHeaderTitle}>MY COMMUNITY</Text>
            <TouchableOpacity onPress={() => open('branch')}>
              <Text style={s.viewAllLink}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={s.communityCard}>
            <Image source={{ uri: COMMUNITY_IMG_URL }} style={s.communityImage} resizeMode="cover" />
            <View style={s.communityBody}>
              <Text style={s.branchMeetingTag}>BRANCH MEETING</Text>
              <Text style={s.meetingTitle}>Monthly Strategy Session</Text>
              <View style={s.scheduleRow}>
                <Icon name="schedule" size={16} color={Colors.muted} />
                <Text style={s.scheduleText}>Saturday · 10:00 at Walter Sisulu House</Text>
              </View>
              <TouchableOpacity style={s.viewEventBtn} onPress={() => open('branch')} activeOpacity={0.8}>
                <Text style={s.viewEventBtnText}>View Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* SEGMENT: QUICK SERVICES */}
      {activeSegment === 'Quick Services' && (
        <View style={s.segmentSection}>
          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionHeaderTitle}>QUICK SERVICES</Text>
            <TouchableOpacity onPress={() => open('services')}>
              <Text style={s.viewAllLink}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={s.services3Grid}>
            <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('send')} activeOpacity={0.8}>
              <View style={[s.squircleIconBox, { backgroundColor: '#E2F4E5' }]}>
                <SendMoneySvgIcon size={24} color="#006933" />
              </View>
              <Text style={s.serviceSquareLabel}>Send{'\n'}Money</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('receive')} activeOpacity={0.8}>
              <View style={[s.squircleIconBox, { backgroundColor: '#E2F4E5' }]}>
                <ReceiveMoneySvgIcon size={24} color="#006933" />
              </View>
              <Text style={s.serviceSquareLabel}>Receive{'\n'}Money</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('airtime')} activeOpacity={0.8}>
              <View style={[s.squircleIconBox, { backgroundColor: '#EBEBEB' }]}>
                <Icon name="smartphone" size={22} color="#1A1C1C" />
              </View>
              <Text style={s.serviceSquareLabel}>Buy{'\n'}Airtime</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('data')} activeOpacity={0.8}>
              <View style={[s.squircleIconBox, { backgroundColor: '#EBEBEB' }]}>
                <Icon name="wifi" size={22} color="#1A1C1C" />
              </View>
              <Text style={s.serviceSquareLabel}>Buy{'\n'}Data</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('electricity')} activeOpacity={0.8}>
              <View style={[s.squircleIconBox, { backgroundColor: '#EBEBEB' }]}>
                <Icon name="bolt" size={22} color="#1A1C1C" />
              </View>
              <Text style={s.serviceSquareLabel}>Buy{'\n'}Electricity</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('donate')} activeOpacity={0.8}>
              <View style={[s.squircleIconBox, { backgroundColor: '#FFF4CE' }]}>
                <Icon name="volunteer-activism" size={22} color="#735C00" />
              </View>
              <Text style={s.serviceSquareLabel}>Donate{'\n'}Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 100, backgroundColor: '#F9F9F9' },

  /* GREETING HEADER */
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20, justifyContent: 'space-between' },
  greetingTitle: { fontSize: 26, fontWeight: '700', color: '#1A1C1C', fontFamily: 'Hanken Grotesk', marginBottom: 2 },
  greetingSub: { fontSize: 13, color: '#4A5568', fontFamily: 'Inter' },
  greetingBranch: { fontSize: 13, color: '#4A5568', fontFamily: 'Inter' },
  avatarContainer: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', borderWidth: 2, borderColor: '#E8E8E8' },
  avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  /* MEMBER STATUS CARD */
  statusCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 12 },
  activeChipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 133, 66, 0.1)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#008542' },
  activeChipText: { fontSize: 11, fontWeight: '800', color: '#008542', letterSpacing: 0.5, fontFamily: 'Inter' },

  memberNumLabel: { fontSize: 11, fontWeight: '800', color: '#4A5568', letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'Inter' },
  memberNumVal: { fontSize: 22, fontWeight: '800', color: '#1A1C1C', marginTop: 2, fontFamily: 'Inter' },

  branchLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, marginBottom: 18 },
  branchLocationText: { fontSize: 14, color: '#3e4a3f', fontFamily: 'Inter' },

  viewCardGreenBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  viewCardGreenBtnText: { color: Colors.white, fontSize: 14, fontWeight: '600', fontFamily: 'Inter' },

  /* SEGMENT FILTER PILLS ROW */
  segmentsScrollRow: { gap: 10, marginBottom: 24, paddingRight: 16 },
  segmentPill: {
    backgroundColor: '#F0F3F0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  segmentPillSelected: {
    backgroundColor: Colors.primary,
  },
  segmentPillText: { fontSize: 14, fontWeight: '600', color: '#3e4a3f', fontFamily: 'Inter' },
  segmentPillTextSelected: { color: Colors.white },

  /* SEGMENT SECTIONS */
  segmentSection: { marginBottom: 16 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingBottom: 8 },
  sectionHeaderTitle: { fontSize: 12, fontWeight: '800', color: '#4A5568', letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'Inter' },
  viewAllLink: { fontSize: 12, fontWeight: '800', color: Colors.primary, fontFamily: 'Inter' },

  /* EDITORIAL NEWS CARD OVERLAY (1:1 WITH TARGET SCREENSHOT) */
  newsCardOverlay: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  newsBgImage: { width: '100%', height: '100%', position: 'absolute' },
  newsGradientScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  newsCardContent: {
    flex: 1,
    justify: 'flex-end',
    padding: 20,
  },
  newsTopMetaRow: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goldStatementBadge: {
    backgroundColor: '#E5B800',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  goldStatementText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#241a00',
    letterSpacing: 0.5,
    fontFamily: 'Inter',
  },
  newsDateText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontFamily: 'Inter',
  },
  newsHeadlineOverlay: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
    fontFamily: 'Hanken Grotesk',
    marginBottom: 12,
    lineHeight: 26,
  },
  readFullBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  readFullBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Inter',
  },

  /* DATES CARD */
  dateCardBox: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  dateBoxBadge: {
    backgroundColor: '#F0F3F0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 58,
  },
  dateMonthText: { fontSize: 11, fontWeight: '800', color: '#4A5568', textTransform: 'uppercase', fontFamily: 'Inter' },
  dateDayText: { fontSize: 22, fontWeight: '900', color: Colors.primary, fontFamily: 'Hanken Grotesk' },
  dateTitleBold: { fontSize: 17, fontWeight: '800', color: '#1A1C1C', marginBottom: 2, fontFamily: 'Hanken Grotesk' },
  dateSubText: { fontSize: 13, color: '#4A5568', fontFamily: 'Inter' },

  /* COMMUNITY CARD */
  communityCard: { backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0' },
  communityImage: { width: '100%', height: 160 },
  communityBody: { padding: 16 },
  branchMeetingTag: { fontSize: 10, fontWeight: '900', color: Colors.primary, letterSpacing: 1, marginBottom: 4, fontFamily: 'Inter' },
  meetingTitle: { fontSize: 18, fontWeight: '800', color: '#1A1C1C', marginBottom: 8, fontFamily: 'Hanken Grotesk' },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  scheduleText: { fontSize: 13, color: Colors.muted, fontFamily: 'Inter' },
  viewEventBtn: { backgroundColor: '#F0F3F0', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  viewEventBtnText: { color: Colors.ink, fontSize: 13, fontWeight: '800', fontFamily: 'Inter' },

  /* QUICK SERVICES GRID */
  services3Grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  serviceSquareCard: {
    width: '31%',
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  squircleIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  serviceSquareLabel: { fontSize: 12, fontWeight: '800', color: '#1A1C1C', textAlign: 'center', lineHeight: 15, fontFamily: 'Inter' },
});
