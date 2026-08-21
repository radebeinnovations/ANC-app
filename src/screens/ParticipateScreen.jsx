import React, { useState } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon, ReceiveMoneySvgIcon, SendMoneySvgIcon } from '../components/Icons';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';

const AVATAR_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP7zlfBNbg5jSucUfG5tPD3BtnVuTQAY2I1kjxSuVqrYNxWqB2lpmvbct4HtE9rdYUrNvLmyCoODdPJBfEqJlKcTv1n486W4ZiNoD2hMMB6ygx62xZumjQQcA9Q5uBGXVyeqgizdBJTJZhYHK0e2jGRtVRt-uNnljNFVUKXpdgq2Cyhy3xUtsvwfSISYHxtEhER8JSmDx9fJe9hVTzN3FqNWNa4aOez8vY3D9vx2YwUd9oJmGKaKmb';
const COMMUNITY_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHtomXsNt6ZfeyvGZOeE5XMikoE5zxU6RquvkfvLhr4T0JYKXccFIuYI8r2T8-9ZZlaqqwWNNziIBcMoWa6jD-ILIRWc02WFG9hRmYaM5BbCiDBXKNUaGsyOhxcgb2bbd-Rzx6m0FPLxfh6dQLM5XA30dGG_LKc4u72FFmXlnnxQsZ_gmIR0jV8GlW5p6QYUO-h6qfrqHZGSfWJY6mootTuO2zTIRBZjmzjM-J9VHYQU1WxM4WEO0i';
const LATEST_HERO_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHgtndFSg1VNHObIGcZIVyJ5csQDFMufbynzecuPzTzzip8_SF-7bE1hkBqrIDk2z9WdB1hn7AkKoRKDOPoriFESQprpaPvPA6Ho8WSsUUujbo0AHfZDXL7hrjhX2QtMPeRC1k8BjZvaMiIJfrxsBDvqyp6IXPPHOShgQ7OAxnrFAIm-k2Bi-gVqHYdMwDGMJuAdeIw59P2iO6C99NyhzmCY0_uxbJOPsLZtsOaecMLdGGehVIy_3GQW0_gNbsLDWnGA';

export default function ParticipateScreen({ open }) {
  const [activeFilter, setActiveFilter] = useState('My Community');

  const filters = ['Important Dates', 'My Community', 'Quick Services', 'Latest Updates'];

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Top Greeting Header */}
      <View style={s.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.greetingTitle}>Good morning, Lerumo</Text>
          <Text style={s.greetingSub}>ANC MEMBER · Johannesburg Region · Branch Name</Text>
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
        <Text style={s.membershipNumberText}>ANC–1234567</Text>

        <View style={s.locationRow}>
          <Icon name="location-on" size={16} color="#4A5568" />
          <Text style={s.locationText}>Johannesburg Region Branch</Text>
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
          </View>

          <View style={s.communityCard}>
            <Image source={{ uri: COMMUNITY_IMG_URL }} style={s.communityImage} resizeMode="cover" />

            <View style={s.communityBody}>
              <Text style={s.branchTag}>BRANCH MEETING</Text>
              <Text style={s.meetingHeadline}>Monthly Strategy Session</Text>
              
              <View style={s.scheduleRow}>
                <Icon name="schedule" size={16} color="#4A5568" />
                <Text style={s.scheduleText}>Saturday · 10:00 at Walter Sisulu House</Text>
              </View>

              <TouchableOpacity style={s.viewEventBtn} onPress={() => open('branch')} activeOpacity={0.85}>
                <Text style={s.viewEventBtnText}>View Event & RSVP</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  communityImage: { width: '100%', height: 160 },
  communityBody: { padding: 16 },
  branchTag: { fontSize: 11, fontWeight: '800', color: '#006933', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4, fontFamily: 'Inter' },
  meetingHeadline: { fontSize: 18, fontWeight: '700', color: '#1A1C1C', marginBottom: 6, fontFamily: 'Hanken Grotesk' },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  scheduleText: { fontSize: 13, color: '#4A5568', fontFamily: 'Inter' },
  viewEventBtn: { backgroundColor: '#006933', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  viewEventBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', fontFamily: 'Inter' },

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
