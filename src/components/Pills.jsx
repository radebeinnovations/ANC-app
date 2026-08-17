import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';

export default function Pills({ value, setValue, options = [50, 100, 250, 500] }) {
  return (
    <View style={s.pills}>
      {options.map(n => {
        const isSelected = String(n) === String(value);
        return (
          <TouchableOpacity
            key={n}
            style={[s.pill, isSelected && s.pillOn]}
            onPress={() => setValue && setValue(String(n))}
            activeOpacity={0.7}
          >
            <Text style={[s.pillText, isSelected && s.pillTextOn]}>R{n}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  pills: { flexDirection: 'row', gap: 8, marginTop: 12 },
  pill: {
    borderWidth: 1,
    borderColor: '#CBD8CE',
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 13,
    backgroundColor: Colors.white,
  },
  pillOn: { backgroundColor: '#E2F4E5', borderColor: Colors.primary },
  pillText: { fontSize: 13, fontWeight: '700', color: '#344137' },
  pillTextOn: { color: Colors.primary },
});
