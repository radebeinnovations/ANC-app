import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';

export default function YamiFooter({ style }) {
  return (
    <View style={[s.yamiBadge, style]}>
      <Text style={s.yamiBadgeText}>⚡ Powered by <Text style={s.yamiBrand}>Yami</Text></Text>
    </View>
  );
}

const s = StyleSheet.create({
  yamiBadge: {
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#EFF5F0',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DCE8DE',
  },
  yamiBadgeText: { fontSize: 11, color: Colors.muted, fontWeight: '600' },
  yamiBrand: { color: Colors.primary, fontWeight: '800' },
});
