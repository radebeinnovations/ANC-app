import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';

export default function YamiFooter({ style }) {
  return (
    <View style={[s.yamiBadge, style]}>
      <Text style={s.yamiBadgeText}>POWERED BY <Text style={s.yamiBrand}>YAMI</Text></Text>
    </View>
  );
}

const s = StyleSheet.create({
  yamiBadge: {
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#EFF5F0',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DCE8DE',
  },
  yamiBadgeText: { fontSize: 10, color: Colors.muted, fontWeight: '700', letterSpacing: 0.8 },
  yamiBrand: { color: Colors.primary, fontWeight: '900' },
});
