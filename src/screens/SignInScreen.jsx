import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import Field from '../components/Field';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';

export default function SignInScreen({ onSignIn }) {
  const [pin, setPin] = useState('');
  const [biometricsLoading, setBiometricsLoading] = useState(false);

  const handleBiometricAuth = () => {
    setBiometricsLoading(true);
    setTimeout(() => {
      setBiometricsLoading(false);
      onSignIn();
    }, 800);
  };

  return (
    <SafeAreaView style={[s.safe, s.login]}>
      <ScrollView contentContainerStyle={s.loginContent} showsVerticalScrollIndicator={false}>
        <View style={s.loginTop}>
          <View style={s.emblem}><Text style={s.emblemText}>ANC</Text></View>
          <Text style={s.eyebrow}>WELCOME TO</Text>
          <Text style={s.brand}>ANC <Text style={s.brandLight}>UNITY</Text></Text>
          <Text style={s.subtitle}>Your movement. Your membership. Your future.</Text>
        </View>

        <View style={s.signCard}>
          <Text style={s.h1}>Welcome back</Text>
          <Text style={s.muted}>Sign in to manage your membership.</Text>
          <Field label="MEMBERSHIP NUMBER" value="ANC-1234567" editable={false} />
          <Field label="PIN" value={pin} onChangeText={setPin} placeholder="Enter your PIN" secureTextEntry keyboardType="numeric" maxLength={6} />

          <Button text="Sign In with PIN" onPress={onSignIn} />

          <View style={s.dividerRow}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>OR</Text>
            <View style={s.dividerLine} />
          </View>

          <TouchableOpacity style={s.bioButton} onPress={handleBiometricAuth} activeOpacity={0.7}>
            <Text style={s.bioText}>
              {biometricsLoading ? 'Verifying Face ID...' : 'Sign in with Face ID / Fingerprint'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity><Text style={s.textButton}>Forgot your PIN?</Text></TouchableOpacity>
        </View>

        <View style={s.yamiFooterBox}>
          <Text style={s.help}>Need help? Contact member support</Text>
          <YamiFooter />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FCF8' },
  login: { flex: 1 },
  loginContent: { padding: 24, justifyContent: 'center', flexGrow: 1 },
  loginTop: { alignItems: 'center' },
  emblem: { width: 58, height: 36, borderRadius: 8, backgroundColor: '#DFF3E3', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emblemText: { fontSize: 13, fontWeight: '900', color: Colors.primary },
  eyebrow: { color: Colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  brand: { fontSize: 31, fontWeight: '800', color: Colors.ink, letterSpacing: 1 },
  brandLight: { fontWeight: '400' },
  subtitle: { fontSize: 13, color: Colors.muted, textAlign: 'center', marginTop: 6 },
  signCard: {
    backgroundColor: Colors.white,
    borderRadius: 17,
    padding: 20,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#14361A',
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  h1: { fontSize: 24, fontWeight: '800', color: Colors.ink, marginBottom: 4 },
  muted: { color: Colors.muted, fontSize: 13, lineHeight: 18 },
  textButton: { textAlign: 'center', color: Colors.primary, fontSize: 12, fontWeight: '800', marginTop: 14 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.line },
  dividerText: { marginHorizontal: 10, color: Colors.muted, fontSize: 11, fontWeight: '700' },
  bioButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2F3E6',
    borderRadius: 10,
    padding: 13,
    borderWidth: 1,
    borderColor: '#C4E5CA',
  },
  bioText: { color: Colors.primary, fontWeight: '800', fontSize: 13 },
  yamiFooterBox: { marginTop: 24, alignItems: 'center' },
  help: { textAlign: 'center', fontSize: 11, color: '#708078' },
});
