import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';

export default function Button({ text, onPress, style, textStyle, disabled }) {
  return (
    <TouchableOpacity
      style={[s.primary, disabled && s.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[s.primaryText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  primary: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  disabled: { opacity: 0.5 },
  primaryText: { color: Colors.white, fontWeight: '800', fontSize: 14 },
});
