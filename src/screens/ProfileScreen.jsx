import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../components/Icons';
import List from '../components/List';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';

export default function ProfileScreen({ cards = [], onOpenCards }) {
  const [tab, setTab] = useState('CARD'); // 'CARD' | 'DETAILS'

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Segmented Tab Bar */}
      <View style={s.segmentBar}>
        <TouchableOpacity
          style={[s.segmentBtn, tab === 'CARD' && s.segmentBtnOn]}
          onPress={() => setTab('CARD')}
          activeOpacity={0.8}
        >
          <Text style={[s.segmentText, tab === 'CARD' && s.segmentTextOn]}>CARD</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.segmentBtn, tab === 'DETAILS' && s.segmentBtnOn]}
          onPress={() => setTab('DETAILS')}
          activeOpacity={0.8}
        >
          <Text style={[s.segmentText, tab === 'DETAILS' && s.segmentTextOn]}>DETAILS</Text>
        </TouchableOpacity>
      </View>

      {tab === 'CARD' ? (
        <>
          {/* Digital Member Card Visual */}
          <View style={s.memberCardContainer}>
            <View style={s.topGoldBar} />
            <View style={s.cardHeaderRow}>
              <View style={s.emblemCircle}>
                <Text style={s.emblemCircleText}>ANC</Text>
              </View>
              <View>
                <Text style={s.cardHeading}>AFRICAN NATIONAL CONGRESS</Text>
                <Text style={s.cardSubHeading}>Digital Credential</Text>
              </View>
            </View>

            <Text style={s.memberName}>LERUMO THABO</Text>

            <View style={s.badgeRow}>
              <View style={s.memberRoleBadge}>
                <Text style={s.memberRoleText}>MEMBER</Text>
              </View>
              <View style={s.activeOutlineBadge}>
                <View style={s.activeDot} />
                <Text style={s.activeOutlineText}>ACTIVE</Text>
              </View>
            </View>

            <Text style={s.memberIdNumber}>ANC-1234567</Text>

            <View style={s.cardDetailsGrid}>
              <View>
                <Text style={s.gridDetailLabel}>PROVINCE</Text>
                <Text style={s.gridDetailVal}>GAUTENG</Text>
              </View>
              <View>
                <Text style={s.gridDetailLabel}>REGION</Text>
                <Text style={s.gridDetailVal}>JOHANNESBURG</Text>
              </View>
            </View>
          </View>

          {/* QR Code Container Box */}
          <View style={s.qrBox}>
            <View style={s.qrBarcodeSim}>
              <Text style={s.qrBarcodeText}>||||||||||||||||||||||||||||||||||||||||||||||||</Text>
            </View>
            <Text style={s.qrInstructionText}>
              Tap the card to view your verification QR code and regional details. Present this digital card at official events.
            </Text>
          </View>

          <TouchableOpacity style={s.saveOfflineBtn} activeOpacity={0.8}>
            <Icon name="file-download" size={18} color={Colors.white} />
            <Text style={s.saveOfflineText}>Save Offline Copy</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={{ marginTop: 12 }}>
          <Text style={s.sectionTitle}>My Member Details</Text>
          <List badge="MOB" title="082 555 0105" sub="Verified Mobile Number" />
          <List badge="EML" title="lerumo.thabo@anc-unity.org.za" sub="Verified Email Address" />
          <List badge="LOC" title="Soweto, Gauteng" sub="Home Address (Ward 62)" />
          <List badge="CRD" title="Saved Payment Cards" sub={`${cards.length} linked cards`} onPress={onOpenCards} />
          <List badge="SET" title="App Settings & Security" sub="Biometrics & PIN lock" />
        </View>
      )}

      <YamiFooter />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 100, backgroundColor: Colors.background },

  segmentBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder, marginBottom: 16 },
  segmentBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  segmentBtnOn: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  segmentText: { fontSize: 12, fontWeight: '800', color: Colors.muted },
  segmentTextOn: { color: Colors.primary },

  memberCardContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 16,
  },
  topGoldBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: Colors.gold },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  emblemCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  emblemCircleText: { color: Colors.primary, fontWeight: '900', fontSize: 12 },
  cardHeading: { fontSize: 14, fontWeight: '900', color: Colors.white, letterSpacing: 0.5 },
  cardSubHeading: { fontSize: 10, color: Colors.gold, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },

  memberName: { fontSize: 24, fontWeight: '900', color: Colors.white, letterSpacing: 1, marginTop: 4 },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  memberRoleBadge: { backgroundColor: Colors.gold, borderRadius: 4, paddingVertical: 3, paddingHorizontal: 8 },
  memberRoleText: { color: Colors.ink, fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  activeOutlineBadge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', borderRadius: 4, paddingVertical: 3, paddingHorizontal: 8, gap: 5 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34D399' },
  activeOutlineText: { color: Colors.white, fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },

  memberIdNumber: { fontSize: 14, color: Colors.white, opacity: 0.9, fontWeight: '700', letterSpacing: 2, marginTop: 12 },
  cardDetailsGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 14, marginTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' },
  gridDetailLabel: { fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: '800', letterSpacing: 1 },
  gridDetailVal: { fontSize: 13, fontWeight: '800', color: Colors.white, marginTop: 2 },

  qrBox: { backgroundColor: Colors.white, borderRadius: 14, padding: 18, borderWidth: 1, borderColor: Colors.surfaceBorder, alignItems: 'center', marginBottom: 16 },
  qrBarcodeSim: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.line, width: '100%', alignItems: 'center' },
  qrBarcodeText: { color: Colors.ink, fontSize: 16, letterSpacing: 3, opacity: 0.9 },
  qrInstructionText: { fontSize: 11, color: Colors.muted, textAlign: 'center', marginTop: 12, lineHeight: 16 },

  saveOfflineBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  saveOfflineText: { color: Colors.white, fontWeight: '800', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.ink, marginTop: 12, marginBottom: 10 },
});
