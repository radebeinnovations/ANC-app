import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';

export default function MemberCardVisual({ name = 'LERUMO THABO', memberNumber = 'ANC-1234567', status = 'ACTIVE MEMBER', branch = 'Orlando East Branch' }) {
  return (
    <View style={s.memberCard}>
      <View style={s.topRow}>
        <View style={s.emblemSmall}>
          <Text style={s.emblemText}>✦</Text>
        </View>
        <View style={s.activeChip}>
          <Text style={s.activeChipText}>{status}</Text>
        </View>
      </View>

      <Text style={s.heroLabel}>ANC OFFICIAL DIGITAL MEMBER ID</Text>
      <Text style={s.memberName}>{name.toUpperCase()}</Text>
      <Text style={s.heroNumber}>{memberNumber}</Text>
      <Text style={s.branchSub}>{branch}</Text>

      <View style={s.barcodeSimBox}>
        <Text style={s.barcodeSimText}>||||||||||||||||||||||||||||||||||||||||</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  memberCard: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 20,
    marginTop: 18,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  emblemSmall: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.2)', alignItems: 'center', justifyContent: 'center' },
  emblemText: { color: Colors.gold, fontSize: 18, fontWeight: '800' },
  activeChip: { backgroundColor: Colors.gold, borderRadius: 4, paddingVertical: 4, paddingHorizontal: 8 },
  activeChipText: { color: Colors.ink, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  heroLabel: { fontSize: 9, letterSpacing: 1.2, color: Colors.white, fontWeight: '800', opacity: 0.8, marginTop: 18 },
  memberName: { fontSize: 22, fontWeight: '900', color: Colors.white, marginTop: 4, letterSpacing: 0.5 },
  heroNumber: { fontSize: 13, color: Colors.white, opacity: 0.95, marginTop: 2, fontWeight: '700' },
  branchSub: { fontSize: 11, color: Colors.gold, marginTop: 6, fontWeight: '600' },
  barcodeSimBox: { marginTop: 18, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.2)', alignItems: 'center' },
  barcodeSimText: { color: Colors.white, fontSize: 14, letterSpacing: 2, opacity: 0.85 },
});
