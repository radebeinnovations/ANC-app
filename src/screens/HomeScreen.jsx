import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../components/Icons';
import { Colors } from '../theme/colors';

export default function HomeScreen({ open, balance = 1500 }) {
  const [filterTab, setFilterTab] = useState('Important Dates');

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Header Greeting */}
      <View style={s.greetingRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.greetingTitle}>Good morning, Lerumo</Text>
          <Text style={s.greetingSub}>ANC MEMBER · Johannesburg Region - Branch Name</Text>
        </View>
        <TouchableOpacity style={s.avatarBox} onPress={() => open('profile')}>
          <Text style={s.avatarText}>LT</Text>
        </TouchableOpacity>
      </View>

      {/* Member Status Card */}
      <View style={s.statusCard}>
        <View style={s.cardHeader}>
          <Text style={s.statusCardTitle}>MEMBER STATUS</Text>
          <View style={s.activeChip}>
            <View style={s.activeDot} />
            <Text style={s.activeText}>ACTIVE</Text>
          </View>
        </View>

        <View style={s.detailsGrid}>
          <View style={s.gridCol}>
            <Text style={s.gridLabel}>MEMBERSHIP NUMBER</Text>
            <Text style={s.gridVal}>ANC-1234567</Text>
          </View>
          <View style={s.gridCol}>
            <Text style={s.gridLabel}>BRANCH</Text>
            <Text style={s.gridVal}>Johannesburg Region</Text>
          </View>
        </View>

        <TouchableOpacity style={s.viewCardBtn} onPress={() => open('profile')} activeOpacity={0.8}>
          <Text style={s.viewCardBtnText}>View Member Card  →</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Toggle Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabScroll} contentContainerStyle={s.tabBar}>
        {['Important Dates', 'My Community', 'Quick Services', 'Latest Updates'].map(tabName => {
          const isActive = filterTab === tabName;
          return (
            <TouchableOpacity
              key={tabName}
              style={[s.filterPill, isActive && s.filterPillOn]}
              onPress={() => setFilterTab(tabName)}
              activeOpacity={0.7}
            >
              <Text style={[s.filterPillText, isActive && s.filterPillTextOn]}>{tabName}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Section 1: Important Dates */}
      {filterTab === 'Important Dates' && (
        <View style={s.sectionBox}>
          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionHeaderTitle}>IMPORTANT DATES</Text>
            <TouchableOpacity><Text style={s.viewAllText}>View all</Text></TouchableOpacity>
          </View>

          <TouchableOpacity style={s.importantCard} onPress={() => open('updates')} activeOpacity={0.8}>
            <View style={s.dateBox}>
              <Text style={s.dateMonth}>NOV</Text>
              <Text style={s.dateNum}>04</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.importantTitle}>2026 Local Government Elections</Text>
              <Text style={s.importantSub}>Saturday, 04 November 2026</Text>
            </View>
            <Text style={s.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Section 2: My Community */}
      {filterTab === 'My Community' && (
        <View style={s.sectionBox}>
          <Text style={s.sectionHeaderTitle}>MY COMMUNITY</Text>

          <TouchableOpacity style={s.communityCard} onPress={() => open('branch')} activeOpacity={0.8}>
            <View style={s.alertBadgeRow}>
              <Icon name="campaign" size={16} color={Colors.goldText} />
              <Text style={s.communityTag}>BRANCH ALERT</Text>
            </View>
            <Text style={s.communityTitle}>Johannesburg Region Branch Meeting</Text>

            <View style={s.eventTimeRow}>
              <View style={s.eventChip}>
                <Icon name="event" size={14} color={Colors.ink} />
                <Text style={s.eventChipText}>Saturday</Text>
              </View>
              <View style={s.eventChip}>
                <Icon name="schedule" size={14} color={Colors.ink} />
                <Text style={s.eventChipText}>10:00 AM</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Section 3: Quick Services */}
      {filterTab === 'Quick Services' && (
        <View style={s.sectionBox}>
          <Text style={s.sectionHeaderTitle}>QUICK SERVICES</Text>

          <View style={s.services2Grid}>
            <TouchableOpacity style={s.serviceGridCard} onPress={() => open('send')} activeOpacity={0.8}>
              <View style={s.serviceIconCircle}>
                <Icon name="send" size={22} color={Colors.primary} />
              </View>
              <Text style={s.serviceGridLabel}>Send Money</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.serviceGridCard} onPress={() => open('send')} activeOpacity={0.8}>
              <View style={s.serviceIconCircle}>
                <Icon name="file-download" size={22} color={Colors.primary} />
              </View>
              <Text style={s.serviceGridLabel}>Receive Money</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.serviceGridCard} onPress={() => open('services')} activeOpacity={0.8}>
              <View style={s.serviceIconCircle}>
                <Icon name="smartphone" size={22} color={Colors.primary} />
              </View>
              <Text style={s.serviceGridLabel}>Airtime</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.serviceGridCard} onPress={() => open('services')} activeOpacity={0.8}>
              <View style={s.serviceIconCircle}>
                <Icon name="wifi" size={22} color={Colors.primary} />
              </View>
              <Text style={s.serviceGridLabel}>Data</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.serviceGridCard} onPress={() => open('services')} activeOpacity={0.8}>
              <View style={s.serviceIconCircle}>
                <Icon name="bolt" size={22} color={Colors.primary} />
              </View>
              <Text style={s.serviceGridLabel}>Electricity</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.serviceGridCard} onPress={() => open('donate')} activeOpacity={0.8}>
              <View style={s.serviceIconCircle}>
                <Icon name="volunteer-activism" size={22} color={Colors.primary} />
              </View>
              <Text style={s.serviceGridLabel}>Donate</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Section 4: Latest Updates */}
      {filterTab === 'Latest Updates' && (
        <View style={s.sectionBox}>
          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionHeaderTitle}>LATEST FROM THE ANC</Text>
            <TouchableOpacity><Text style={s.viewAllText}>View all</Text></TouchableOpacity>
          </View>

          <View style={s.newsCard}>
            <View style={s.newsHeaderRow}>
              <View style={s.newsTagBox}>
                <Text style={s.newsTagText}>ANC STATEMENT</Text>
              </View>
              <Text style={s.newsDateText}>12 August 2026</Text>
            </View>

            <Text style={s.newsTitle}>Building Stronger Local Government</Text>
            <Text style={s.newsBody}>Our commitment to service delivery and community empowerment remains steadfast as we approach municipal elections.</Text>

            <TouchableOpacity style={s.readUpdateBtn} onPress={() => open('updates')}>
              <Text style={s.readUpdateText}>Read Update  →</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 90, backgroundColor: Colors.background },
  greetingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greetingTitle: { fontSize: 22, fontWeight: '900', color: Colors.ink },
  greetingSub: { fontSize: 11, color: Colors.muted, marginTop: 2, fontWeight: '600' },
  avatarBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '900', color: Colors.ink, fontSize: 13 },
  
  statusCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  statusCardTitle: { fontSize: 10, fontWeight: '900', color: Colors.muted, letterSpacing: 1.2 },
  activeChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E2F4E5', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.activeDot, marginRight: 5 },
  activeText: { color: Colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  detailsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  gridCol: { width: '48%' },
  gridLabel: { fontSize: 9, color: Colors.muted, fontWeight: '800', letterSpacing: 0.8 },
  gridVal: { fontSize: 14, fontWeight: '800', color: Colors.ink, marginTop: 3 },
  viewCardBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  viewCardBtnText: { color: Colors.white, fontWeight: '800', fontSize: 13 },

  tabScroll: { marginBottom: 16 },
  tabBar: { flexDirection: 'row', gap: 8 },
  filterPill: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: Colors.surfaceContainer, alignItems: 'center' },
  filterPillOn: { backgroundColor: Colors.primary },
  filterPillText: { fontSize: 12, fontWeight: '700', color: Colors.muted },
  filterPillTextOn: { color: Colors.white },

  sectionBox: { marginBottom: 16 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionHeaderTitle: { fontSize: 10, fontWeight: '900', color: Colors.muted, letterSpacing: 1.2 },
  viewAllText: { fontSize: 11, fontWeight: '800', color: Colors.primary },

  importantCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.surfaceBorder },
  dateBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: Colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder },
  dateMonth: { fontSize: 9, fontWeight: '900', color: Colors.primary },
  dateNum: { fontSize: 16, fontWeight: '900', color: Colors.ink, marginTop: -2 },
  importantTitle: { fontSize: 14, fontWeight: '800', color: Colors.ink },
  importantSub: { fontSize: 11, color: Colors.muted, marginTop: 2 },
  chevron: { fontSize: 20, color: '#7B867E' },

  communityCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.surfaceBorder },
  alertBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  communityTag: { fontSize: 10, color: Colors.goldText, fontWeight: '900', letterSpacing: 1 },
  communityTitle: { fontSize: 16, fontWeight: '900', color: Colors.ink },
  eventTimeRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  eventChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.surfaceContainerLow, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8 },
  eventChipText: { fontSize: 11, color: Colors.ink, fontWeight: '700' },

  services2Grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  serviceGridCard: { width: '48%', backgroundColor: Colors.white, borderRadius: 14, padding: 18, alignItems: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder },
  serviceIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  serviceGridLabel: { fontSize: 12, fontWeight: '800', color: Colors.ink, textAlign: 'center' },

  newsCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.surfaceBorder },
  newsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  newsTagBox: { backgroundColor: Colors.goldContainer, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },
  newsTagText: { fontSize: 9, fontWeight: '900', color: Colors.goldText, letterSpacing: 0.8 },
  newsDateText: { fontSize: 11, color: Colors.muted },
  newsTitle: { fontSize: 16, fontWeight: '900', color: Colors.ink },
  newsBody: { fontSize: 12, color: Colors.muted, marginTop: 4, lineHeight: 18 },
  readUpdateBtn: { marginTop: 12 },
  readUpdateText: { color: Colors.primary, fontWeight: '800', fontSize: 13 },
});
