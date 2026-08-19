import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import { Icon } from '../components/Icons';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';

function QRCodeMatrixGraphic() {
  const qrGridData = [
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1],
    [0,1,0,0,1,0,0,1,1,0,0,1,1,0,1,0,0],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1,1],
    [0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,1],
    [1,0,1,1,1,0,1,1,1,1,0,1,0,0,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,1,1,0,0,1,1],
    [1,1,1,1,1,1,1,0,0,1,0,1,0,1,1,0,1],
  ];

  return (
    <View style={{ width: 170, height: 170, backgroundColor: Colors.white }}>
      {qrGridData.map((row, rIdx) => (
        <View key={rIdx} style={{ flexDirection: 'row', flex: 1 }}>
          {row.map((cell, cIdx) => (
            <View
              key={cIdx}
              style={{
                flex: 1,
                backgroundColor: cell === 1 ? '#1A1C1C' : '#FFFFFF',
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

export default function ProfileScreen({ cards = [], onOpenCards, setStepText }) {
  const [showFrontCard, setShowFrontCard] = useState(false); // Default false -> shows QR Card (Stitch target)

  // Explicitly clear stepText header subtitle on Member Card screen
  React.useEffect(() => {
    if (setStepText) setStepText('');
  }, [setStepText]);

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {!showFrontCard ? (
        /* EXACT STITCH MEMBER CARD (Gray QR Card) */
        <TouchableOpacity
          style={s.qrBackCardContainer}
          onPress={() => setShowFrontCard(true)}
          activeOpacity={0.9}
        >
          {/* Centered QR Code Box */}
          <View style={s.qrGraphicBox}>
            <QRCodeMatrixGraphic />
          </View>

          {/* Card Bottom Row: Province & Region */}
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
      ) : (
        /* FRONT GREEN DIGITAL CREDENTIAL CARD */
        <TouchableOpacity
          style={s.memberCardContainer}
          onPress={() => setShowFrontCard(false)}
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
      )}

      {/* Instruction Subtitle below card */}
      <Text style={s.qrInstructionText}>
        Tap the card to view your verification QR code and regional details. Present this digital card at official events.
      </Text>

      {/* Action Buttons */}
      <Button text="📥  Save Offline Copy" onPress={() => {}} />

      <TouchableOpacity
        style={s.flipToggleBtn}
        onPress={() => setShowFrontCard(!showFrontCard)}
        activeOpacity={0.8}
      >
        <Icon name="flip-camera-android" size={18} color={Colors.primary} />
        <Text style={s.flipToggleText}>
          {showFrontCard ? 'View Verification QR Code' : 'View Digital Credential Card'}
        </Text>
      </TouchableOpacity>

      <YamiFooter />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 100, backgroundColor: Colors.background },

  /* BACK QR CARD VIEW (Gray Card - Exact Stitch Match) */
  qrBackCardContainer: {
    backgroundColor: '#EAEAEA',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#D8DDD9',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  qrGraphicBox: {
    width: 210,
    height: 210,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D6DDD8',
    marginBottom: 24,
    padding: 12,
  },

  qrCardBottomGrid: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#CCD3CE',
  },
  qrGridLabel: { fontSize: 11, color: Colors.muted, fontWeight: '600' },
  qrGridVal: { fontSize: 15, fontWeight: '900', color: Colors.ink, marginTop: 2 },

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
    marginBottom: 20,
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

  qrInstructionText: { fontSize: 13, color: Colors.muted, textAlign: 'center', marginBottom: 16, lineHeight: 18, paddingHorizontal: 12 },

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
});
