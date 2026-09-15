import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../components/Icons';
import { Colors } from '../theme/colors';

export default function VerificationSuccessScreen({ onContinue }) {
  return (
    <View style={s.page}>
      <View style={s.icon}><Icon name="check" size={40} color={Colors.white} /></View>
      <Text style={s.title}>Authentication successful</Text>
      <Text style={s.message}>Your email has been verified and your ANC member account is ready to use.</Text>
      <TouchableOpacity style={s.button} onPress={onContinue} accessibilityRole="button">
        <Text style={s.buttonText}>Continue to ANC Unity</Text>
        <Icon name="arrow-forward" size={20} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: 32 },
  icon: { width: 82, height: 82, borderRadius: 41, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '900', color: Colors.ink, textAlign: 'center' },
  message: { fontSize: 15, lineHeight: 23, color: Colors.muted, textAlign: 'center', marginTop: 10, maxWidth: 330 },
  button: { height: 54, borderRadius: 10, backgroundColor: Colors.primary, marginTop: 30, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  buttonText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
});
