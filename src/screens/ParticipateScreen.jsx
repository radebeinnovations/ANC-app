import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import { Icon } from '../components/Icons';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';

const AVATAR_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP7zlfBNbg5jSucUfG5tPD3BtnVuTQAY2I1kjxSuVqrYNxWqB2lpmvbct4HtE9rdYUrNvLmyCoODdPJBfEqJlKcTv1n486W4ZiNoD2hMMB6ygx62xZumjQQcA9Q5uBGXVyeqgizdBJTJZhYHK0e2jGRtVRt-uNnljNFVUKXpdgq2Cyhy3xUtsvwfSISYHxtEhER8JSmDx9fJe9hVTzN3FqNWNa4aOez8vY3D9vx2YwUd9oJmGKaKmb';
const COMMUNITY_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHtomXsNt6ZfeyvGZOeE5XMikoE5zxU6RquvkfvLhr4T0JYKXccFIuYI8r2T8-9ZZlaqqwWNNziIBcMoWa6jD-ILIRWc02WFG9hRmYaM5BbCiDBXKNUaGsyOhxcgb2bbd-Rzx6m0FPLxfh6dQLM5XA30dGG_LKc4u72FFmXlnnxQsZ_gmIR0jV8GlW5p6QYUO-h6qfrqHZGSfWJY6mootTuO2zTIRBZjmzjM-J9VHYQU1WxM4WEO0i';

export default function ParticipateScreen({ open }) {
  const [activeSegment, setActiveSegment] = useState('All');

  const segments = ['All', 'My Community', 'Branch Executive', 'Campaigns'];

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Header Greeting Row */}
      <View style={s.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.greetingTitle}>Good morning, Lerumo</Text>
          <Text style={s.greetingSub}>ANC MEMBER · Johannesburg Region · Branch Name</Text>
        </View>

        <TouchableOpacity style={s.avatarContainer} onPress={() => open('profile')} activeOpacity={0.8}>
          <Image source={{ uri: AVATAR_IMG_URL }} style={s.avatarImage} />
        </TouchableOpacity>
      </View>

      {/* Member Status Card */}
      <View style={s.statusCard}>
        <View style={s.activeChipPill}>
          <View style={s.activeDotGreen} />
          <Text style={s.activeChipText}>ACTIVE</Text>
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

      {/* Segment Filter Pills Carousel */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.segmentsRow}>
        {segments.map(seg => (
          <TouchableOpacity
            key={seg}
            style={[s.segPill, activeSegment === seg && s.segPillActive]}
            onPress={() => setActiveSegment(seg)}
            activeOpacity={0.8}
          >
            <Text style={[s.segPillText, activeSegment === seg && s.segPillTextActive]}>{seg}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Section 1: My Community Event Card */}
      <Text style={s.sectionHeaderTitle}>MY COMMUNITY</Text>
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

      {/* Section 2: Branch Executive Committee List */}
      <Text style={s.sectionHeaderTitle}>BRANCH EXECUTIVE COMMITTEE</Text>
      <View style={s.executiveCardStack}>
        <View style={s.execRow}>
          <View style={[s.badgeCircle, { backgroundColor: '#E2F4E6' }]}>
            <Text style={[s.badgeText, { color: Colors.primary }]}>SEC</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.execTitle}>Nomsa Dlamini</Text>
            <Text style={s.execRole}>Branch Secretary · 082 112 4490</Text>
          </View>
          <TouchableOpacity style={s.contactIconBtn} onPress={() => open('branch')}>
            <Icon name="phone" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={s.execRow}>
          <View style={[s.badgeCircle, { backgroundColor: '#FEF3C7' }]}>
            <Text style={[s.badgeText, { color: '#B45309' }]}>CHR</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.execTitle}>Sibusiso Thwala</Text>
            <Text style={s.execRole}>Branch Chairperson</Text>
          </View>
          <TouchableOpacity style={s.contactIconBtn} onPress={() => open('branch')}>
            <Icon name="person" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={[s.execRow, { borderBottomWidth: 0 }]}>
          <View style={[s.badgeCircle, { backgroundColor: '#E2E8F0' }]}>
            <Text style={[s.badgeText, { color: '#475569' }]}>VEN</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.execTitle}>Orlando East Community Hall</Text>
            <Text style={s.execRole}>Branch Meeting Venue · Ward 62</Text>
          </View>
          <TouchableOpacity style={s.contactIconBtn} onPress={() => open('branch')}>
            <Icon name="navigation" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Section 3: Active Volunteer Campaigns */}
      <Text style={s.sectionHeaderTitle}>VOLUNTEER & PARTICIPATE</Text>
      <View style={s.campaignCard}>
        <View style={s.campaignHeaderRow}>
          <View style={s.campaignIconSquare}>
            <Icon name="how-to-vote" size={20} color="#6E5700" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.campaignTitle}>2026 Local Elections Volunteer</Text>
            <Text style={s.campaignSub}>Ward Mobilization & Voter Registration</Text>
          </View>
        </View>
        <TouchableOpacity style={s.volunteerBtn} onPress={() => open('branch')} activeOpacity={0.85}>
          <Text style={s.volunteerBtnText}>Join Ward Volunteer Team</Text>
        </TouchableOpacity>
      </View>

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
  avatarContainer: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', borderWidth: 2, borderColor: '#E8E8E8' },
  avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  /* MEMBER STATUS CARD */
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  activeChipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 133, 66, 0.1)',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    marginBottom: 12,
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

  /* SEGMENTS CAROUSEL */
  segmentsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  segPill: { backgroundColor: '#EEEEEE', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16 },
  segPillActive: { backgroundColor: Colors.primary },
  segPillText: { fontSize: 13, fontWeight: '700', color: '#4A5568', fontFamily: 'Inter' },
  segPillTextActive: { color: '#FFFFFF' },

  sectionHeaderTitle: { fontSize: 11, fontWeight: '900', color: '#4A5568', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10, fontFamily: 'Inter' },

  /* MY COMMUNITY CARD */
  communityCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 22 },
  communityImage: { width: '100%', height: 160 },
  communityBody: { padding: 16 },
  branchTag: { fontSize: 11, fontWeight: '800', color: '#006933', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4, fontFamily: 'Inter' },
  meetingHeadline: { fontSize: 18, fontWeight: '700', color: '#1A1C1C', marginBottom: 6, fontFamily: 'Hanken Grotesk' },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  scheduleText: { fontSize: 13, color: '#4A5568', fontFamily: 'Inter' },
  viewEventBtn: { backgroundColor: '#006933', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  viewEventBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', fontFamily: 'Inter' },

  /* EXECUTIVE STACK */
  executiveCardStack: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, marginBottom: 22 },
  execRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  badgeCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 11, fontWeight: '900', fontFamily: 'Inter' },
  execTitle: { fontSize: 14, fontWeight: '700', color: '#1A1C1C', fontFamily: 'Inter' },
  execRole: { fontSize: 12, color: '#4A5568', marginTop: 2, fontFamily: 'Inter' },
  contactIconBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0, 105, 51, 0.1)', alignItems: 'center', justifyContent: 'center' },

  /* CAMPAIGN CARD */
  campaignCard: { backgroundColor: '#FFFBEB', borderRadius: 16, borderWidth: 1, borderColor: '#FEF3C7', padding: 16, marginBottom: 24 },
  campaignHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  campaignIconSquare: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#FECC00', alignItems: 'center', justifyContent: 'center' },
  campaignTitle: { fontSize: 15, fontWeight: '700', color: '#6E5700', fontFamily: 'Hanken Grotesk' },
  campaignSub: { fontSize: 12, color: '#92400E', marginTop: 2, fontFamily: 'Inter' },
  volunteerBtn: { backgroundColor: '#6E5700', borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginTop: 14 },
  volunteerBtnText: { color: '#FECC00', fontSize: 13, fontWeight: '700', fontFamily: 'Inter' },
});
