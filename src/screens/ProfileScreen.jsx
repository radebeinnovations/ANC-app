import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import { Icon } from '../components/Icons';
import List from '../components/List';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';

export default function ProfileScreen({ cards = [], onOpenCards, setStepText }) {
  const [tab, setTab] = useState('CARD'); // 'CARD' | 'DETAILS'
  const [isFlipped, setIsFlipped] = useState(false); // Toggle between Front Credential & QR Back Card

  // Clear stepText header subtitle on Member Card screen
  React.useEffect(() => {
    if (setStepText) setStepText('');
  }, [setStepText]);

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
          {/* Card View - Interactive Flip between Front & Back QR View */}
          {!isFlipped ? (
            /* FRONT CARD VIEW (Green Credential Card - Image 1) */
            <TouchableOpacity
              style={s.memberCardContainer}
              onPress={() => setIsFlipped(true)}
              activeOpacity={0.9}
            >
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
            </TouchableOpacity>
          ) : (
            /* BACK QR CARD VIEW (Gray QR Card - Image 2) */
            <TouchableOpacity
              style={s.qrBackCardContainer}
              onPress={() => setIsFlipped(false)}
              activeOpacity={0.9}
            >
              {/* QR Code Container Box */}
              <View style={s.qrGraphicBox}>
                <View style={s.qrPatternMatrix}>
                  <View style={s.qrCornerSquareTopLeft} />
                  <View style={s.qrCornerSquareTopRight} />
                  <View style={s.qrCornerSquareBottomLeft} />
                  <Text style={s.qrSimText}>
                    ████  ██  ████{'\n'}
                    █  █  ██  █  █{'\n'}
                    ████  ██  ████{'\n'}
                    ██  ████  ██  {'\n'}
                    ████  ██  ████{'\n'}
                    █  █  ██  █  █{'\n'}
                    ████  ██  ████
                  </Text>
                </View>
              </View>

              <View style={s.qrCardBottomGrid}>
                <View>
                  <Text style={s.qrGridLabel}>Province</Text>
                  <Text style={s.qrGridVal}>GAUTENG</Text>
                </View>
                <View>
                  <Text style={s.qrGridLabel}>Region</Text>
                  <Text style={s.qrGridVal}>JOHANNESBURG</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* Subtitle Instruction */}
          <Text style={s.qrInstructionText}>
            Tap the card to view your verification QR code and regional details. Present this digital card at official events.
          </Text>

          {/* Action Buttons */}
          <Button text="📥  Save Offline Copy" onPress={() => {}} />

          <TouchableOpacity style={s.flipToggleBtn} onPress={() => setIsFlipped(!isFlipped)} activeOpacity={0.8}>
            <Icon name="flip-camera-android" size={18} color={Colors.primary} />
            <Text style={s.flipToggleText}>{isFlipped ? 'View Front Credential Card' : 'View QR Verification Card'}</Text>
          </TouchableOpacity>
        </>
      ) : (
        /* DETAILS TAB VIEW */
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

  /* FRONT GREEN CREDENTIAL CARD */
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

  /* BACK QR CARD VIEW (Gray Card - Image 2) */
  qrBackCardContainer: {
    backgroundColor: '#EAEAEA',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#D8DDD9',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  qrGraphicBox: {
    width: 200,
    height: 200,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 20,
    position: 'relative',
    padding: 12,
  },
  qrPatternMatrix: { alignItems: 'center', justifyContent: 'center' },
  qrSimText: { fontSize: 14, fontFamily: 'monospace', letterSpacing: 2, lineHeight: 18, color: Colors.ink },
  qrCornerSquareTopLeft: { position: 'absolute', top: 12, left: 12, width: 28, height: 28, borderWidth: 4, borderColor: Colors.ink },
  qrCornerSquareTopRight: { position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderWidth: 4, borderColor: Colors.ink },
  qrCornerSquareBottomLeft: { position: 'absolute', bottom: 12, left: 12, width: 28, height: 28, borderWidth: 4, borderColor: Colors.ink },

  qrCardBottomGrid: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#D0D6D1',
  },
  qrGridLabel: { fontSize: 11, color: Colors.muted, fontWeight: '600' },
  qrGridVal: { fontSize: 14, fontWeight: '900', color: Colors.ink, marginTop: 2 },

  qrInstructionText: { fontSize: 12, color: Colors.muted, textAlign: 'center', marginBottom: 16, lineHeight: 18, paddingHorizontal: 10 },

  flipToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 10,
    backgroundColor: Colors.white,
  },
  flipToggleText: { fontSize: 13, fontWeight: '800', color: Colors.primary },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.ink, marginBottom: 12 },
});
