import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';

export default function HomeScreen({ open }) {
  const [filterTab, setFilterTab] = useState('My Community');

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

      {/* Filter Tabs (Important Dates / My Community) */}
      <View style={s.tabBar}>
        {['Important Dates', 'My Community'].map(tabName => (
          <TouchableOpacity
            key={tabName}
            style={[s.filterPill, filterTab === tabName && s.filterPillOn]}
            onPress={() => setFilterTab(tabName)}
            activeOpacity={0.7}
          >
            <Text style={[s.filterPillText, filterTab === tabName && s.filterPillTextOn]}>{tabName}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content Section */}
      {filterTab === 'Important Dates' ? (
        <View style={s.importantBanner}>
          <Text style={s.bannerTag}>📢 ELECTION NOTICE</Text>
          <Text style={s.bannerTitle}>2026 Local Government Elections</Text>
          <Text style={s.bannerSub}>📅 Saturday, 04 November 2026</Text>
          <TouchableOpacity style={s.bannerBtn} onPress={() => open('updates')}>
            <Text style={s.bannerBtnText}>View Election Timetable  →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={s.communityCard}>
          <Text style={s.communityTag}>📢 BRANCH ALERT</Text>
          <Text style={s.communityTitle}>Johannesburg Region Branch Meeting</Text>
          <View style={s.eventTimeRow}>
            <Text style={s.eventChip}>📅 Saturday</Text>
            <Text style={s.eventChip}>⏰ 10:00 AM</Text>
          </View>
          <TouchableOpacity style={s.viewEventBtn} onPress={() => open('branch')}>
            <Text style={s.viewEventBtnText}>View Branch Venue  →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Quick Services Section */}
      <Text style={s.sectionHeader}>QUICK SERVICES</Text>
      <View style={s.servicesGrid}>
        <TouchableOpacity style={s.serviceCard} onPress={() => open('send')}>
          <View style={s.serviceIconCircle}>
            <Text style={s.serviceIcon}>↗</Text>
          </View>
          <Text style={s.serviceLabel}>Send Money</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.serviceCard} onPress={() => open('send')}>
          <View style={s.serviceIconCircle}>
            <Text style={s.serviceIcon}>↙</Text>
          </View>
          <Text style={s.serviceLabel}>Receive Money</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.serviceCard} onPress={() => open('services')}>
          <View style={s.serviceIconCircle}>
            <Text style={s.serviceIcon}>📱</Text>
          </View>
          <Text style={s.serviceLabel}>Airtime</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.serviceCard} onPress={() => open('services')}>
          <View style={s.serviceIconCircle}>
            <Text style={s.serviceIcon}>📶</Text>
          </View>
          <Text style={s.serviceLabel}>Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.serviceCard} onPress={() => open('services')}>
          <View style={s.serviceIconCircle}>
            <Text style={s.serviceIcon}>⚡</Text>
          </View>
          <Text style={s.serviceLabel}>Electricity</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.serviceCard} onPress={() => open('donate')}>
          <View style={s.serviceIconCircle}>
            <Text style={s.serviceIcon}>🤝</Text>
          </View>
          <Text style={s.serviceLabel}>Donate</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 18,
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

  tabBar: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterPill: { flex: 1, paddingVertical: 10, borderRadius: 20, backgroundColor: Colors.surfaceContainer, alignItems: 'center' },
  filterPillOn: { backgroundColor: Colors.primary },
  filterPillText: { fontSize: 12, fontWeight: '700', color: Colors.muted },
  filterPillTextOn: { color: Colors.white },

  importantBanner: { backgroundColor: '#FFF8DF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#F0E0B0', marginBottom: 20 },
  bannerTag: { fontSize: 10, color: Colors.goldText, fontWeight: '900', letterSpacing: 1 },
  bannerTitle: { fontSize: 17, fontWeight: '900', color: Colors.ink, marginTop: 4 },
  bannerSub: { fontSize: 12, color: Colors.muted, marginTop: 4, fontWeight: '600' },
  bannerBtn: { backgroundColor: Colors.primary, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14, alignSelf: 'flex-start', marginTop: 12 },
  bannerBtnText: { color: Colors.white, fontWeight: '800', fontSize: 12 },

  communityCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.surfaceBorder, marginBottom: 20 },
  communityTag: { fontSize: 10, color: Colors.goldText, fontWeight: '900', letterSpacing: 1 },
  communityTitle: { fontSize: 17, fontWeight: '900', color: Colors.ink, marginTop: 4 },
  eventTimeRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  eventChip: { backgroundColor: Colors.surfaceContainerLow, fontSize: 11, color: Colors.ink, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8, fontWeight: '700' },
  viewEventBtn: { marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.line },
  viewEventBtnText: { color: Colors.primary, fontWeight: '800', fontSize: 12 },

  sectionHeader: { fontSize: 11, fontWeight: '900', color: Colors.muted, letterSpacing: 1.2, marginBottom: 12 },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  serviceCard: { width: '31%', backgroundColor: Colors.white, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder },
  serviceIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E3F3E7', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  serviceIcon: { fontSize: 18, color: Colors.primary },
  serviceLabel: { fontSize: 11, fontWeight: '700', color: Colors.ink, textAlign: 'center' },
});
