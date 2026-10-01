import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from '../components/Icons';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';

// Card details belong exclusively to PayFast's hosted checkout. Keeping this
// screen informational prevents accidental local card/CVV capture.
export default function CardManagerScreen() {
  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.eyebrow}>PAYMENT SECURITY</Text>
      <Text style={s.h1}>Secure Payments</Text>
      <Text style={s.muted}>ANC Unity does not store your debit-card or credit-card details.</Text>

      <View style={s.securityCard}>
        <View style={s.iconWrap}><Icon name="lock" size={26} color={Colors.primary} /></View>
        <Text style={s.cardTitle}>PayFast hosted checkout</Text>
        <Text style={s.cardCopy}>When you add funds, PayFast opens its secure payment page. Choose your payment method there. ANC Unity never asks for, stores, or displays your card number or CVV.</Text>
      </View>

      <View style={s.infoRow}>
        <Icon name="verified-user" size={20} color={Colors.primary} />
        <View style={s.infoBody}>
          <Text style={s.infoTitle}>Your wallet changes after verification</Text>
          <Text style={s.infoCopy}>A top-up stays pending until PayFast sends a verified confirmation to the ANC backend.</Text>
        </View>
      </View>

      <YamiFooter />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 20, paddingBottom: 100 },
  eyebrow: { color: Colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2, fontFamily: 'Inter' },
  h1: { fontSize: 26, fontWeight: '900', color: Colors.ink, marginTop: 2, marginBottom: 4, fontFamily: 'Hanken Grotesk' },
  muted: { fontSize: 13, color: Colors.muted, fontFamily: 'Inter' },

  securityCard: { marginTop: 22, padding: 20, borderRadius: 16, backgroundColor: '#F0F9F2', borderWidth: 1, borderColor: '#C7E8D1' },
  iconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  cardTitle: { color: Colors.ink, fontSize: 18, fontWeight: '900', fontFamily: 'Hanken Grotesk' },
  cardCopy: { color: Colors.muted, fontSize: 13, lineHeight: 20, marginTop: 7, fontFamily: 'Inter' },
  infoRow: { flexDirection: 'row', gap: 12, padding: 16, marginTop: 16, borderRadius: 14, borderWidth: 1, borderColor: Colors.surfaceBorder, backgroundColor: Colors.white },
  infoBody: { flex: 1 },
  infoTitle: { color: Colors.ink, fontSize: 14, fontWeight: '800', fontFamily: 'Inter' },
  infoCopy: { color: Colors.muted, fontSize: 12, lineHeight: 18, marginTop: 4, fontFamily: 'Inter' },
});
