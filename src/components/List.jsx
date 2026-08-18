import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';

export default function List({ badge = '•', title, sub, onPress }) {
  return (
    <TouchableOpacity style={s.list} onPress={onPress} activeOpacity={0.7}>
      <View style={s.badgeBox}>
        <Text style={s.badgeText}>{badge}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.listTitle}>{title}</Text>
        <Text style={s.listSub}>{sub}</Text>
      </View>
      <Text style={s.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  list: {
    borderBottomWidth: 1,
    borderColor: Colors.line,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badgeBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  badgeText: { color: Colors.primary, fontWeight: '900', fontSize: 11 },
  listTitle: { fontSize: 13, fontWeight: '700', color: Colors.ink },
  listSub: { fontSize: 11, color: Colors.muted, marginTop: 1 },
  chevron: { fontSize: 20, color: '#7B867E' },
});
