import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../theme/colors';

export default function Field({ label, ...props }) {
  return (
    <View style={s.field}>
      {label ? <Text style={s.fieldLabel}>{label}</Text> : null}
      <TextInput style={s.input} placeholderTextColor="#97A39A" {...props} />
    </View>
  );
}

const s = StyleSheet.create({
  field: { marginTop: 16 },
  fieldLabel: { color: '#566158', fontSize: 10, fontWeight: '800', letterSpacing: 0.9 },
  input: {
    borderWidth: 1,
    borderColor: '#DCE4DD',
    borderRadius: 9,
    padding: 13,
    marginTop: 6,
    fontSize: 14,
    color: Colors.ink,
    backgroundColor: Colors.white,
  },
});
