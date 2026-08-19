import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../components/Icons';
import { Colors } from '../theme/colors';

const COMMUNITY_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHtomXsNt6ZfeyvGZOeE5XMikoE5zxU6RquvkfvLhr4T0JYKXccFIuYI8r2T8-9ZZlaqqwWNNziIBcMoWa6jD-ILIRWc02WFG9hRmYaM5BbCiDBXKNUaGsyOhxcgb2bbd-Rzx6m0FPLxfh6dQLM5XA30dGG_LKc4u72FFmXlnnxQsZ_gmIR0jV8GlW5p6QYUO-h6qfrqHZGSfWJY6mootTuO2zTIRBZjmzjM-J9VHYQU1WxM4WEO0i';
const NEWS_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHR1a7BGP_bULWHfBqmlTZgAdHLDUGaQ9n42EuYpuscyM7zEqqysnBEFBchrBndc5olw-z7m9zHt8J2f1KlBsIEJcbViTOgrDKxoOMDSxwyhbm6Celjx0pd0-OYh-6kDsXNsIIzcF7FU30QbvhS_w9U5M0GZjAah-V1bZR0ig9UAONPSann0NLQ6JAl8wcx2iBNtAuzSB1IZwBp7qqfHtgzBTb68fJZD2IlcmApjWzMBVXT3-_Ba0X';
const AVATAR_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP7zlfBNbg5jSucUfG5tPD3BtnVuTQAY2I1kjxSuVqrYNxWqB2lpmvbct4HtE9rdYUrNvLmyCoODdPJBfEqJlKcTv1n486W4ZiNoD2hMMB6ygx62xZumjQQcA9Q5uBGXVyeqgizdBJTJZhYHK0e2jGRtVRt-uNnljNFVUKXpdgq2Cyhy3xUtsvwfSISYHxtEhER8JSmDx9fJe9hVTzN3FqNWNa4aOez8vY3D9vx2YwUd9oJmGKaKmb';

export default function HomeScreen({ open }) {
  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Header Profile Greeting Section */}
      <View style={s.headerRow}>
        <View style={s.avatarContainer}>
          <Image source={{ uri: AVATAR_IMG_URL }} style={s.avatarImage} />
        </View>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.greetingTitle}>Good morning, Lerumo Thabo</Text>
          <Text style={s.greetingSub}>ANC Member · Johannesburg Region</Text>
        </View>

        <TouchableOpacity style={s.bellBtn} onPress={() => open('notifications')} activeOpacity={0.7}>
          <Icon name="notifications" size={22} color={Colors.ink} />
          <View style={s.bellDot} />
        </TouchableOpacity>
      </View>

      {/* Section 1: Member Status Card */}
      <View style={s.statusCard}>
        <View style={s.cardHeaderRow}>
          <Text style={s.cardHeaderTitle}>MEMBER STATUS</Text>
          <View style={s.activeChip}>
            <View style={s.activeDot} />
            <Text style={s.activeText}>ACTIVE</Text>
          </View>
        </View>

        <View style={s.detailsGrid}>
          <View style={s.gridCol}>
            <Text style={s.gridLabel}>Membership Number</Text>
            <Text style={s.gridVal}>ANC-1234567</Text>
          </View>

          <View style={s.gridCol}>
            <Text style={s.gridLabel}>Branch</Text>
            <Text style={s.gridVal}>Johannesburg Region</Text>
          </View>
        </View>

        <View style={{ marginTop: 10, marginBottom: 14 }}>
          <Text style={s.gridLabel}>Validity</Text>
          <Text style={s.gridVal}>31 December 2026</Text>
        </View>

        <TouchableOpacity style={s.viewCardGreyBtn} onPress={() => open('profile')} activeOpacity={0.8}>
          <Icon name="badge" size={18} color={Colors.ink} />
          <Text style={s.viewCardGreyText}>View Member Card</Text>
        </TouchableOpacity>
      </View>

      {/* Section 2: Important Banner */}
      <View style={s.sectionContainer}>
        <Text style={s.sectionTitle}>Important</Text>

        <View style={s.importantYellowCard}>
          <View style={s.importantHeaderRow}>
            <View style={s.importantIconSquare}>
              <Icon name="event-upcoming" size={22} color="#574500" />
            </View>
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

      {/* Section 3: My Community */}
      <View style={s.sectionContainer}>
        <Text style={s.sectionTitle}>My Community</Text>

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

      {/* Section 4: Quick Services */}
      <View style={s.sectionContainer}>
        <Text style={s.sectionTitle}>Quick Services</Text>

        <View style={s.services3Grid}>
          {/* Send Money */}
          <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('send')} activeOpacity={0.8}>
            <View style={[s.serviceCircle, { backgroundColor: 'rgba(0, 105, 51, 0.1)' }]}>
              <Icon name="send-money" size={20} color={Colors.primary} />
            </View>
            <Text style={s.serviceSquareLabel}>Send{'\n'}Money</Text>
          </TouchableOpacity>

          {/* Receive Money */}
          <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('send')} activeOpacity={0.8}>
            <View style={[s.serviceCircle, { backgroundColor: 'rgba(0, 105, 51, 0.1)' }]}>
              <Icon name="request-quote" size={20} color={Colors.primary} />
            </View>
            <Text style={s.serviceSquareLabel}>Receive{'\n'}Money</Text>
          </TouchableOpacity>

          {/* Buy Airtime */}
          <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('services')} activeOpacity={0.8}>
            <View style={[s.serviceCircle, { backgroundColor: '#F0F3F0' }]}>
              <Icon name="phone-iphone" size={20} color={Colors.ink} />
            </View>
            <Text style={s.serviceSquareLabel}>Buy{'\n'}Airtime</Text>
          </TouchableOpacity>

          {/* Buy Data */}
          <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('services')} activeOpacity={0.8}>
            <View style={[s.serviceCircle, { backgroundColor: '#F0F3F0' }]}>
              <Icon name="wifi" size={20} color={Colors.ink} />
            </View>
            <Text style={s.serviceSquareLabel}>Buy{'\n'}Data</Text>
          </TouchableOpacity>

          {/* Buy Electricity */}
          <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('services')} activeOpacity={0.8}>
            <View style={[s.serviceCircle, { backgroundColor: '#F0F3F0' }]}>
              <Icon name="electric-bolt" size={20} color={Colors.ink} />
            </View>
            <Text style={s.serviceSquareLabel}>Buy{'\n'}Electricity</Text>
          </TouchableOpacity>

          {/* Donate Now */}
          <TouchableOpacity style={s.serviceSquareCard} onPress={() => open('donate')} activeOpacity={0.8}>
            <View style={[s.serviceCircle, { backgroundColor: '#FFF4CE' }]}>
              <Icon name="volunteer-activism" size={20} color="#6E5700" />
            </View>
            <Text style={s.serviceSquareLabel}>Donate{'\n'}Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Section 5: Latest from ANC */}
      <View style={s.sectionContainer}>
        <View style={s.sectionHeaderRow}>
          <Text style={s.sectionTitle}>Latest from ANC</Text>
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
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 100, backgroundColor: '#F9F9F9' },

  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, justifyContent: 'space-between' },
  avatarContainer: { width: 48, height: 48, borderRadius: 24, overflow: 'hidden', borderWidth: 2, borderColor: '#E8E8E8' },
  avatarImage: { width: '100%', height: '100%' },
  greetingTitle: { fontSize: 18, fontWeight: '800', color: '#1A1C1C' },
  greetingSub: { fontSize: 12, color: '#4A5568', marginTop: 2 },
  bellBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F3F3', position: 'relative' },
  bellDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.error, borderWidth: 1.5, borderColor: '#F3F3F3' },

  statusCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardHeaderTitle: { fontSize: 11, fontWeight: '800', color: '#4A5568', letterSpacing: 1.2 },
  activeChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E2F4E5', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, gap: 5 },
  activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#008542' },
  activeText: { color: '#008542', fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },

  detailsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  gridCol: { width: '48%' },
  gridLabel: { fontSize: 11, color: '#4A5568', fontWeight: '600' },
  gridVal: { fontSize: 14, fontWeight: '800', color: '#1A1C1C', marginTop: 2 },

  viewCardGreyBtn: { backgroundColor: '#F3F3F3', borderRadius: 10, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  viewCardGreyText: { color: '#1A1C1C', fontWeight: '800', fontSize: 13 },

  sectionContainer: { marginBottom: 22 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#1A1C1C', marginBottom: 12 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  viewAllLink: { fontSize: 13, fontWeight: '800', color: Colors.primary },

  importantYellowCard: { backgroundColor: '#FECC00', borderRadius: 16, padding: 18, position: 'relative', overflow: 'hidden' },
  importantHeaderRow: { flexDirection: 'row', alignItems: 'flex-start' },
  importantIconSquare: { width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(0, 0, 0, 0.08)', alignItems: 'center', justifyContent: 'center' },
  importantCardTitle: { fontSize: 17, fontWeight: '900', color: '#574500' },
  importantCardSub: { fontSize: 12, color: '#574500', opacity: 0.85, marginTop: 2, fontWeight: '600' },
  viewDatesBtn: { backgroundColor: '#574500', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'flex-start', marginTop: 14 },
  viewDatesBtnText: { color: '#FECC00', fontWeight: '800', fontSize: 12 },

  communityCard: { backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  communityImage: { width: '100%', height: 170 },
  communityBody: { padding: 16 },
  branchMeetingTag: { fontSize: 10, fontWeight: '900', color: Colors.primary, letterSpacing: 1, marginBottom: 4 },
  meetingTitle: { fontSize: 18, fontWeight: '900', color: '#1A1C1C' },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, marginBottom: 16 },
  scheduleText: { fontSize: 13, color: '#4A5568', fontWeight: '600' },
  viewEventBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  viewEventBtnText: { color: Colors.white, fontWeight: '800', fontSize: 13 },

  services3Grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  serviceSquareCard: { width: '31%', backgroundColor: Colors.white, borderRadius: 14, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  serviceCircle: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  serviceSquareLabel: { fontSize: 11, fontWeight: '800', color: '#1A1C1C', textAlign: 'center', lineHeight: 14 },

  newsCard: { backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  newsImage: { width: '100%', height: 180 },
  newsBody: { padding: 16 },
  newsMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  newsMetaTag: { fontSize: 10, fontWeight: '900', color: '#4A5568', letterSpacing: 1 },
  newsMetaDate: { fontSize: 11, color: '#4A5568', fontWeight: '600' },
  newsHeadline: { fontSize: 18, fontWeight: '900', color: '#1A1C1C' },
  newsSnippet: { fontSize: 13, color: '#4A5568', marginTop: 4, lineHeight: 19 },
  readUpdateLink: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 14 },
  readUpdateText: { color: Colors.primary, fontWeight: '800', fontSize: 13 },
});
