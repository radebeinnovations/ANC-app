import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';

export default function List({ icon, title, sub, onPress }) {
  return (
    <TouchableOpacity style={s.list} onPress={onPress} activeOpacity={0.7}>
      <Text style={s.listIcon}>{icon}</Text>
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
    borderTopWidth: 1,
    borderColor: Colors.line,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E3F3E7',
    textAlign: 'center',
    paddingTop: 8,
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 16,
  },
  listTitle: { fontSize: 14, fontWeight: '700', color: Colors.ink },
  listSub: { fontSize: 12, color: Colors.muted, marginTop: 2 },
  chevron: { fontSize: 24, color: '#7B867E' },
});
