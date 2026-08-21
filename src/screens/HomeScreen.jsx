import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon, ReceiveMoneySvgIcon, SendMoneySvgIcon } from '../components/Icons';
import { Colors } from '../theme/colors';

const AVATAR_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP7zlfBNbg5jSucUfG5tPD3BtnVuTQAY2I1kjxSuVqrYNxWqB2lpmvbct4HtE9rdYUrNvLmyCoODdPJBfEqJlKcTv1n486W4ZiNoD2hMMB6ygx62xZumjQQcA9Q5uBGXVyeqgizdBJTJZhYHK0e2jGRtVRt-uNnljNFVUKXpdgq2Cyhy3xUtsvwfSISYHxtEhER8JSmDx9fJe9hVTzN3FqNWNa4aOez8vY3D9vx2YwUd9oJmGKaKmb';
const COMMUNITY_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHtomXsNt6ZfeyvGZOeE5XMikoE5zxU6RquvkfvLhr4T0JYKXccFIuYI8r2T8-9ZZlaqqwWNNziIBcMoWa6jD-ILIRWc02WFG9hRmYaM5BbCiDBXKNUaGsyOhxcgb2bbd-Rzx6m0FPLxfh6dQLM5XA30dGG_LKc4u72FFmXlnnxQsZ_gmIR0jV8GlW5p6QYUO-h6qfrqHZGSfWJY6mootTuO2zTIRBZjmzjM-J9VHYQU1WxM4WEO0i';
const NEWS_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHR1a7BGP_bULWHfBqmlTZgAdHLDUGaQ9n42EuYpuscyM7zEqqysnBEFBchrBndc5olw-z7m9zHt8J2f1KlBsIEJcbViTOgrDKxoOMDSxwyhbm6Celjx0pd0-OYh-6kDsXNsIIzcF7FU30QbvhS_w9U5M0GZjAah-V1bZR0ig9UAONPSann0NLQ6JAl8wcx2iBNtAuzSB1IZwBp7qqfHtgzBTb68fJZD2IlcmApjWzMBVXT3-_Ba0X';

export default function HomeScreen({ open }) {
  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Header Section (1:1 with Target HTML) */}
      <View style={s.headerRow}>
        <TouchableOpacity style={s.avatarContainer} onPress={() => open('profile')} activeOpacity={0.8}>
          <Image source={{ uri: AVATAR_IMG_URL }} style={s.avatarImage} />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.greetingTitle}>Good morning, Lerumo Thabo</Text>
          <Text style={s.greetingSub}>ANC Member · Johannesburg Region</Text>
        </View>

        <TouchableOpacity style={s.bellBtn} onPress={() => open('notifications')} activeOpacity={0.7}>
          <Icon name="notifications" size={22} color="#1A1C1C" />
          <View style={s.bellDotRed} />
        </TouchableOpacity>
      </View>

      {/* Section 1: Member Status (1:1 with Target HTML) */}
      <View style={s.statusCard}>
        <View style={s.cardHeaderRow}>
          <Text style={s.cardHeaderTitle}>MEMBER STATUS</Text>
          <View style={s.activeChipPill}>
            <View style={s.activeDotGreen} />
            <Text style={s.activeChipText}>ACTIVE</Text>
          </View>
        </View>

        <View style={s.detailsGrid2Col}>
          <View style={s.gridCol}>
            <Text style={s.gridLabel}>Membership Number</Text>
            <Text style={s.gridVal}>ANC-1234567</Text>
          </View>

          <View style={s.gridCol}>
            <Text style={s.gridLabel}>Branch</Text>
            <Text style={s.gridVal}>Johannesburg Region</Text>
          </View>
        </View>

        <View style={{ marginTop: 12, marginBottom: 14 }}>
          <Text style={s.gridLabel}>Validity</Text>
          <Text style={s.gridVal}>31 December 2026</Text>
        </View>

        <TouchableOpacity style={s.viewCardGreyBtn} onPress={() => open('profile')} activeOpacity={0.8}>
          <Icon name="badge" size={18} color="#1A1C1C" />
          <Text style={s.viewCardGreyBtnText}>View Member Card</Text>
        </TouchableOpacity>
      </View>

      {/* Section 2: Important Banner (1:1 with Target HTML) */}
      <View style={s.sectionContainer}>
        <Text style={s.sectionTitle}>Important</Text>

        <View style={s.importantYellowCard}>
          <View style={s.importantHeaderRow}>
            <Icon name="event-upcoming" size={24} color="#6E5700" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={s.importantCardTitle}>2026 Local Government Elections</Text>
              <Text style={s.importantCardSub}>04 November 2026</Text>
            </View>
          </View>

          <TouchableOpacity style={s.viewDatesBtn} onPress={() => open('updates')} activeOpacity={0.8}>
            <Text style={s.viewDatesBtnText}>View Important Dates</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Section 3: My Community (1:1 with Target HTML) */}
      <View style={s.sectionContainer}>
        <Text style={s.sectionTitle}>My Community</Text>

        <View style={s.communityCard}>
          <Image source={{ uri: COMMUNITY_IMG_URL }} style={s.communityImage} resizeMode="cover" />

          <View style={s.communityBody}>
            <Text style={s.branchMeetingTag}>BRANCH MEETING</Text>
            <Text style={s.meetingTitle}>Monthly Strategy Session</Text>

            <View style={s.scheduleRow}>
              <Icon name="schedule" size={16} color="#4A5568" />
              <Text style={s.scheduleText}>Saturday · 10:00 at Walter Sisulu House</Text>
            </View>

            <TouchableOpacity style={s.viewEventGreenBtn} onPress={() => open('branch')} activeOpacity={0.8}>
              <Text style={s.viewEventGreenBtnText}>View Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Section 4: Quick Services 3-Grid (1:1 with Target HTML) */}
      <View style={s.sectionContainer}>
        <Text style={s.sectionTitle}>Quick Services</Text>

        <View style={s.services3Grid}>
          {/* 1. Send Money */}
          <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('send')} activeOpacity={0.8}>
            <View style={[s.squircleIconBox, { backgroundColor: 'rgba(0, 105, 51, 0.1)' }]}>
              <SendMoneySvgIcon size={24} color="#006933" />
            </View>
            <Text style={s.serviceSquareLabel}>Send{'\n'}Money</Text>
          </TouchableOpacity>

          {/* 2. Receive Money */}
          <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('receive')} activeOpacity={0.8}>
            <View style={[s.squircleIconBox, { backgroundColor: 'rgba(0, 105, 51, 0.1)' }]}>
              <ReceiveMoneySvgIcon size={24} color="#006933" />
            </View>
            <Text style={s.serviceSquareLabel}>Receive{'\n'}Money</Text>
          </TouchableOpacity>

          {/* 3. Buy Airtime */}
          <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('airtime')} activeOpacity={0.8}>
            <View style={[s.squircleIconBox, { backgroundColor: '#E2E2E2' }]}>
              <Icon name="smartphone" size={22} color="#1A1C1C" />
            </View>
            <Text style={s.serviceSquareLabel}>Buy{'\n'}Airtime</Text>
          </TouchableOpacity>

          {/* 4. Buy Data */}
          <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('data')} activeOpacity={0.8}>
            <View style={[s.squircleIconBox, { backgroundColor: '#E2E2E2' }]}>
              <Icon name="wifi" size={22} color="#1A1C1C" />
            </View>
            <Text style={s.serviceSquareLabel}>Buy{'\n'}Data</Text>
          </TouchableOpacity>

          {/* 5. Buy Electricity */}
          <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('electricity')} activeOpacity={0.8}>
            <View style={[s.squircleIconBox, { backgroundColor: '#E2E2E2' }]}>
              <Icon name="bolt" size={22} color="#1A1C1C" />
            </View>
            <Text style={s.serviceSquareLabel}>Buy{'\n'}Electricity</Text>
          </TouchableOpacity>

          {/* 6. Donate Now */}
          <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('donate')} activeOpacity={0.8}>
            <View style={[s.squircleIconBox, { backgroundColor: '#FECC00' }]}>
              <Icon name="volunteer-activism" size={22} color="#6E5700" />
            </View>
            <Text style={s.serviceSquareLabel}>Donate{'\n'}Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Section 5: Latest from ANC (1:1 with Target HTML) */}
      <View style={s.sectionContainer}>
        <View style={s.sectionHeaderRow}>
          <Text style={s.sectionTitle}>Latest from ANC</Text>
          <TouchableOpacity onPress={() => open('newsroom')}>
            <Text style={s.viewAllLink}>View all</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={s.newsCard} onPress={() => open('statement_detail')} activeOpacity={0.85}>
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

            <TouchableOpacity style={s.readUpdateLink} onPress={() => open('statement_detail')} activeOpacity={0.7}>
              <Text style={s.readUpdateText}>Read Update</Text>
              <Icon name="arrow-forward" size={18} color="#006933" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 100, backgroundColor: '#F9F9F9' },

  /* HEADER SECTION */
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: 'space-between' },
  avatarContainer: { width: 48, height: 48, borderRadius: 24, overflow: 'hidden', borderWidth: 2, borderColor: '#E8E8E8' },
  avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  greetingTitle: { fontSize: 22, fontWeight: '700', color: '#1A1C1C', fontFamily: 'Hanken Grotesk', marginBottom: 2 },
  greetingSub: { fontSize: 13, color: '#4A5568', fontFamily: 'Inter' },
  bellBtn: { padding: 8, borderRadius: 20, position: 'relative' },
  bellDotRed: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#BA1A1A' },

  /* SECTION CONTAINERS */
  sectionContainer: { marginBottom: 22 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#1A1C1C', fontFamily: 'Hanken Grotesk', marginBottom: 12 },

  /* SECTION 1: MEMBER STATUS CARD */
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardHeaderTitle: { fontSize: 12, fontWeight: '700', color: '#4A5568', letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'Inter' },
  activeChipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 133, 66, 0.1)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  activeDotGreen: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#008542' },
  activeChipText: { fontSize: 12, fontWeight: '700', color: '#008542', fontFamily: 'Inter' },

  detailsGrid2Col: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  gridCol: { flex: 1 },
  gridLabel: { fontSize: 12, color: '#4A5568', marginBottom: 4, fontFamily: 'Inter' },
  gridVal: { fontSize: 15, fontWeight: '700', color: '#1A1C1C', fontFamily: 'Inter' },

  viewCardGreyBtn: {
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  viewCardGreyBtnText: { color: '#1A1C1C', fontSize: 14, fontWeight: '700', fontFamily: 'Inter' },

  /* SECTION 2: IMPORTANT BANNER */
  importantYellowCard: {
    backgroundColor: '#FECC00',
    borderRadius: 16,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  importantHeaderRow: { flexDirection: 'row', alignItems: 'flex-start' },
  importantCardTitle: { fontSize: 18, fontWeight: '700', color: '#6E5700', lineHeight: 22, fontFamily: 'Hanken Grotesk' },
  importantCardSub: { fontSize: 13, color: '#6E5700', opacity: 0.85, marginTop: 2, fontFamily: 'Inter' },
  viewDatesBtn: {
    backgroundColor: '#6E5700',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 14,
    alignSelf: 'flex-start',
  },
  viewDatesBtnText: { color: '#FECC00', fontSize: 13, fontWeight: '700', fontFamily: 'Inter' },

  /* SECTION 3: MY COMMUNITY */
  communityCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0' },
  communityImage: { width: '100%', height: 160 },
  communityBody: { padding: 16 },
  branchMeetingTag: { fontSize: 11, fontWeight: '800', color: '#006933', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4, fontFamily: 'Inter' },
  meetingTitle: { fontSize: 18, fontWeight: '700', color: '#1A1C1C', marginBottom: 6, fontFamily: 'Hanken Grotesk' },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  scheduleText: { fontSize: 13, color: '#4A5568', fontFamily: 'Inter' },
  viewEventGreenBtn: { backgroundColor: '#006933', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  viewEventGreenBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', fontFamily: 'Inter' },

  /* SECTION 4: QUICK SERVICES GRID */
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  squircleIconBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  serviceSquareLabel: { fontSize: 12, fontWeight: '700', color: '#1A1C1C', textAlign: 'center', lineHeight: 15, fontFamily: 'Inter' },

  /* SECTION 5: LATEST FROM ANC */
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  viewAllLink: { fontSize: 14, fontWeight: '700', color: '#006933', fontFamily: 'Inter' },
  newsCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0' },
  newsImage: { width: '100%', height: 180 },
  newsBody: { padding: 16 },
  newsMetaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  newsMetaTag: { fontSize: 11, fontWeight: '800', color: '#4A5568', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Inter' },
  newsMetaDate: { fontSize: 12, color: '#4A5568', fontFamily: 'Inter' },
  newsHeadline: { fontSize: 20, fontWeight: '700', color: '#1A1C1C', marginBottom: 6, fontFamily: 'Hanken Grotesk' },
  newsSnippet: { fontSize: 14, color: '#4A5568', lineHeight: 20, marginBottom: 14, fontFamily: 'Inter' },
  readUpdateLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  readUpdateText: { color: '#006933', fontSize: 14, fontWeight: '700', fontFamily: 'Inter' },
});
