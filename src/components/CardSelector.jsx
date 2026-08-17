import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';

export default function CardSelector({ cards = [], selectedId, onSelect }) {
  return (
    <View style={{ marginTop: 18 }}>
      <Text style={s.fieldLabel}>PAYMENT METHOD</Text>
      {cards.map(c => {
        const isSelected = selectedId === c.id;
        return (
          <TouchableOpacity
            key={c.id}
            style={[s.cardOption, isSelected && s.cardOptionOn]}
            onPress={() => onSelect(c.id)}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 18 }}>💳</Text>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={s.cardTitle}>{c.title}</Text>
              <Text style={s.cardSub}>{c.brand} •••• {c.last4} (Exp {c.exp})</Text>
            </View>
            <Text style={{ fontSize: 16, color: Colors.primary }}>{isSelected ? '◉' : '○'}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  fieldLabel: { color: '#566158', fontSize: 10, fontWeight: '800', letterSpacing: 0.9 },
  cardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    backgroundColor: Colors.white,
  },
  cardOptionOn: { borderColor: Colors.primary, backgroundColor: '#F0F9F2' },
  cardTitle: { fontSize: 13, fontWeight: '700', color: Colors.ink },
  cardSub: { fontSize: 11, color: Colors.muted, marginTop: 2 },
});
