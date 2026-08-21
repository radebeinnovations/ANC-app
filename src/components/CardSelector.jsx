import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { MastercardLogo } from './Icons';

export default function CardSelector({ cards = [], selectedId, onSelect }) {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={s.fieldLabel}>FUNDING PAYMENT SOURCE</Text>
      {cards.map(c => {
        const isSelected = selectedId === c.id;
        return (
          <TouchableOpacity
            key={c.id}
            style={[s.cardOption, isSelected && s.cardOptionOn]}
            onPress={() => onSelect(c.id)}
            activeOpacity={0.7}
          >
            <View style={s.darkCardBox}>
              <MastercardLogo width={28} height={18} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={s.cardTitle}>{c.title || 'Standard Bank Mastercard'}</Text>
              <Text style={s.cardSub}>•••• •••• •••• {c.last4} (Exp {c.exp})</Text>
            </View>
            <Text style={{ fontSize: 12, color: Colors.primary, fontWeight: '800' }}>{isSelected ? 'ACTIVE' : 'SELECT'}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  fieldLabel: { color: '#566158', fontSize: 10, fontWeight: '800', letterSpacing: 0.9, fontFamily: 'Inter' },
  cardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    backgroundColor: Colors.white,
  },
  cardOptionOn: { borderColor: Colors.primary, backgroundColor: '#F0F9F2', borderWidth: 1.5 },
  darkCardBox: { width: 40, height: 26, borderRadius: 6, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 13, fontWeight: '700', color: Colors.ink, fontFamily: 'Inter' },
  cardSub: { fontSize: 11, color: Colors.muted, marginTop: 2, fontFamily: 'Inter' },
});
