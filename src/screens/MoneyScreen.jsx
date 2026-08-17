import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import List from '../components/List';
import { Colors } from '../theme/colors';

export default function MoneyScreen({ open, cards = [] }) {
  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <Text style={s.h1}>Money</Text>
      <Text style={s.subText}>Manage your money and everyday services.</Text>

      {/* Available Balance Card */}
      <View style={s.balanceCard}>
        <Text style={s.balanceLabel}>AVAILABLE BALANCE</Text>
        <Text style={s.balanceAmount}>R1,500.00</Text>

        {/* 3 Core Action Buttons */}
        <View style={s.actionRow}>
          <TouchableOpacity style={s.primaryActionBtn} onPress={() => open('send')} activeOpacity={0.8}>
            <Text style={s.primaryActionIcon}>↗</Text>
            <Text style={s.primaryActionText}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.secondaryActionBtn} onPress={() => open('send')} activeOpacity={0.8}>
            <Text style={s.secondaryActionIcon}>↙</Text>
            <Text style={s.secondaryActionText}>Receive</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.secondaryActionBtn} onPress={() => open('send')} activeOpacity={0.8}>
            <Text style={s.secondaryActionIcon}>⇄</Text>
            <Text style={s.secondaryActionText}>Transfer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Member Services */}
      <Text style={s.sectionHeader}>MEMBER SERVICES</Text>
      <View style={s.servicesGrid}>
        <TouchableOpacity style={s.serviceBtn} onPress={() => open('services')}>
          <Text style={s.serviceIcon}>📱</Text>
          <Text style={s.serviceText}>Airtime</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.serviceBtn} onPress={() => open('services')}>
          <Text style={s.serviceIcon}>📶</Text>
          <Text style={s.serviceText}>Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.serviceBtn} onPress={() => open('services')}>
          <Text style={s.serviceIcon}>⚡</Text>
          <Text style={s.serviceText}>Electricity</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.serviceBtn} onPress={() => open('services')}>
          <Text style={s.serviceIcon}>📄</Text>
          <Text style={s.serviceText}>Bills</Text>
        </TouchableOpacity>
      </View>

      {/* Support The Movement */}
      <Text style={s.sectionHeader}>SUPPORT THE MOVEMENT</Text>
      <List icon="🤝" title="Donation" sub="Support community action programmes" onPress={() => open('donate')} />
      <List icon="🪪" title="Membership Payment" sub="Renew & keep your status active" onPress={() => open('membership')} />
      <List icon="💳" title="My Saved Payment Cards" sub={`${cards.length} cards connected`} onPress={() => open('cards')} />

      {/* Recent Activity */}
      <Text style={s.sectionHeader}>RECENT ACTIVITY</Text>
      <View style={s.activityList}>
        <View style={s.activityRow}>
          <Text style={s.activityIcon}>↓</Text>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={s.activityTitle}>Deposit</Text>
            <Text style={s.activityTime}>Today, 10:23 AM</Text>
          </View>
          <Text style={s.positiveAmount}>+R500.00</Text>
        </View>

        <View style={s.activityRow}>
          <Text style={s.activityIcon}>📱</Text>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={s.activityTitle}>Airtime Purchase</Text>
            <Text style={s.activityTime}>Yesterday</Text>
          </View>
          <Text style={s.negativeAmount}>-R50.00</Text>
        </View>

        <View style={s.activityRow}>
          <Text style={s.activityIcon}>🤝</Text>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={s.activityTitle}>ANC Donation</Text>
            <Text style={s.activityTime}>02 August 2026</Text>
          </View>
          <Text style={s.negativeAmount}>-R100.00</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 90, backgroundColor: Colors.background },
  h1: { fontSize: 26, fontWeight: '900', color: Colors.primary },
  subText: { fontSize: 12, color: Colors.muted, marginTop: 2, marginBottom: 14, fontWeight: '600' },
  
  balanceCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  balanceLabel: { fontSize: 10, fontWeight: '900', color: Colors.muted, letterSpacing: 1.2 },
  balanceAmount: { fontSize: 34, fontWeight: '900', color: Colors.ink, marginVertical: 8 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  primaryActionBtn: { flex: 1, backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  primaryActionIcon: { color: Colors.white, fontSize: 16, fontWeight: '800' },
  primaryActionText: { color: Colors.white, fontWeight: '800', fontSize: 12, marginTop: 2 },
  secondaryActionBtn: { flex: 1, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder },
  secondaryActionIcon: { color: Colors.primary, fontSize: 16, fontWeight: '800' },
  secondaryActionText: { color: Colors.ink, fontWeight: '800', fontSize: 12, marginTop: 2 },

  sectionHeader: { fontSize: 11, fontWeight: '900', color: Colors.muted, letterSpacing: 1.2, marginTop: 22, marginBottom: 10 },
  servicesGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  serviceBtn: { width: '23%', backgroundColor: Colors.white, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder },
  serviceIcon: { fontSize: 20, marginBottom: 4 },
  serviceText: { fontSize: 11, fontWeight: '700', color: Colors.ink },

  activityList: { backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 14, borderWidth: 1, borderColor: Colors.surfaceBorder },
  activityRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.line },
  activityIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.surfaceContainerLow, textAlign: 'center', paddingTop: 6, fontSize: 16 },
  activityTitle: { fontSize: 13, fontWeight: '700', color: Colors.ink },
  activityTime: { fontSize: 11, color: Colors.muted, marginTop: 1 },
  positiveAmount: { fontSize: 13, fontWeight: '800', color: Colors.primary },
  negativeAmount: { fontSize: 13, fontWeight: '800', color: Colors.ink },
});
