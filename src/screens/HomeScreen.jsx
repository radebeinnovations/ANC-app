import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon, ReceiveMoneySvgIcon, SendMoneySvgIcon } from '../components/Icons';
import { Colors } from '../theme/colors';

const COMMUNITY_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHtomXsNt6ZfeyvGZOeE5XMikoE5zxU6RquvkfvLhr4T0JYKXccFIuYI8r2T8-9ZZlaqqwWNNziIBcMoWa6jD-ILIRWc02WFG9hRmYaM5BbCiDBXKNUaGsyOhxcgb2bbd-Rzx6m0FPLxfh6dQLM5XA30dGG_LKc4u72FFmXlnnxQsZ_gmIR0jV8GlW5p6QYUO-h6qfrqHZGSfWJY6mootTuO2zTIRBZjmzjM-J9VHYQU1WxM4WEO0i';
const NEWS_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHR1a7BGP_bULWHfBqmlTZgAdHLDUGaQ9n42EuYpuscyM7zEqqysnBEFBchrBndc5olw-z7m9zHt8J2f1KlBsIEJcbViTOgrDKxoOMDSxwyhbm6Celjx0pd0-OYh-6kDsXNsIIzcF7FU30QbvhS_w9U5M0GZjAah-V1bZR0ig9UAONPSann0NLQ6JAl8wcx2iBNtAuzSB1IZwBp7qqfHtgzBTb68fJZD2IlcmApjWzMBVXT3-_Ba0X';
const AVATAR_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrqYetCBmAlp-mUDn8l5OIU6o0F7dliMQ9YlMujyt2i_rw30eTSl5oX57V5RvG6Uv3novo6hQqHuqXuxjPxnmQ64VJZhNknXZ4DhoAIDRlB_MEzW3GQdjyQXMzACivKaJvy5hjkaEoKyU3UZdq-hV15u4icDUiVm2q9ySZXpXL4mnHx7ueBa9KQERLutb2BCwMThrQ9XvvjjdL2bm8Hr_FTeNs1NvAV7TP1lenmhyAfTUTexR7q-_2';

export default function HomeScreen({ open }) {
  const [activeSegment, setActiveSegment] = useState('Important Dates');

  const segments = ['Important Dates', 'My Community', 'Quick Services', 'Latest Updates'];

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Header Profile Greeting Section (Matches Screenshots 2 & 3) */}
      <View style={s.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.greetingTitle}>Good morning, Lerumo</Text>
          <Text style={s.greetingSub}>ANC MEMBER · Johannesburg Region · Branch Name</Text>
        </View>

        <TouchableOpacity style={s.avatarContainer} onPress={() => open('profile')} activeOpacity={0.8}>
          <Image source={{ uri: AVATAR_IMG_URL }} style={s.avatarImage} />
        </TouchableOpacity>
      </View>

      {/* Member Status Card (1:1 with Screenshots 2 & 3) */}
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

      {/* SEGMENT 1: IMPORTANT DATES (DEFAULT MATCHING SCREENSHOTS 2 & 3) */}
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

      {/* SEGMENT 2: MY COMMUNITY */}
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

      {/* SEGMENT 3: QUICK SERVICES */}
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

      {/* SEGMENT 4: LATEST UPDATES */}
      {activeSegment === 'Latest Updates' && (
        <View style={s.segmentSection}>
          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionHeaderTitle}>LATEST UPDATES</Text>
            <TouchableOpacity onPress={() => open('updates')}>
              <Text style={s.viewAllLink}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={s.newsCard}>
            <Image source={{ uri: NEWS_IMG_URL }} style={s.newsImage} resizeMode="cover" />
            <View style={s.newsBody}>
              <View style={s.newsMetaRow}>
                <Text style={s.newsMetaTag}>ANC STATEMENT</Text>
                <Text style={s.newsMetaDate}>12 August 2026</Text>
              </View>
              <Text style={s.newsHeadline}>Building Stronger Local Government</Text>
              <Text style={s.newsSnippet}>
                Our commitment to service delivery and community empowerment remains steadfast as we approach the upcoming municipal elections.
              </Text>
              <TouchableOpacity style={s.readUpdateLink} onPress={() => open('updates')}>
                <Text style={s.readUpdateText}>Read Update</Text>
                <Icon name="arrow-forward" size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 100, backgroundColor: '#F9F9F9' },

  /* GREETING HEADER */
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: 'space-between' },
  greetingTitle: { fontSize: 26, fontWeight: '700', color: '#1A1C1C', fontFamily: 'Hanken Grotesk', marginBottom: 2 },
  greetingSub: { fontSize: 13, color: '#4A5568', fontFamily: 'Inter' },
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

  /* NEWS CARD */
  newsCard: { backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0' },
  newsImage: { width: '100%', height: 160 },
  newsBody: { padding: 16 },
  newsMetaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  newsMetaTag: { fontSize: 10, fontWeight: '900', color: Colors.primary, letterSpacing: 1, fontFamily: 'Inter' },
  newsMetaDate: { fontSize: 12, color: Colors.muted, fontFamily: 'Inter' },
  newsHeadline: { fontSize: 18, fontWeight: '800', color: '#1A1C1C', marginBottom: 6, fontFamily: 'Hanken Grotesk' },
  newsSnippet: { fontSize: 13, color: '#4A5568', lineHeight: 18, marginBottom: 12, fontFamily: 'Inter' },
  readUpdateLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  readUpdateText: { color: Colors.primary, fontSize: 13, fontWeight: '800', fontFamily: 'Inter' },
});
