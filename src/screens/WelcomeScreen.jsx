import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';

export default function WelcomeScreen({ onGetStarted, onSignInClick }) {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.topHero}>
          <View style={s.emblemBox}>
            <Text style={s.emblemText}>ANC</Text>
          </View>
          <Text style={s.tagline}>AFRICAN NATIONAL CONGRESS</Text>
          <Text style={s.title}>ANC <Text style={s.brandLight}>UNITY</Text></Text>
          <Text style={s.sub}>Your movement. Your membership. Your future.</Text>
        </View>

        <View style={s.cardStack}>
          <View style={s.featureCard}>
            <View style={s.featureBadge}>
              <Text style={s.featureBadgeText}>ID</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.featureTitle}>Digital Member ID Card</Text>
              <Text style={s.featureSub}>Verify active membership status instantly anywhere across all structures.</Text>
            </View>
          </View>

          <View style={s.featureCard}>
            <View style={s.featureBadge}>
              <Text style={s.featureBadgeText}>PAY</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.featureTitle}>ANC Member Money</Text>
              <Text style={s.featureSub}>Send money to members, pay electricity, data & airtime securely.</Text>
            </View>
          </View>

          <View style={s.featureCard}>
            <View style={s.featureBadge}>
              <Text style={s.featureBadgeText}>ORG</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.featureTitle}>Community & Branch Action</Text>
              <Text style={s.featureSub}>Stay informed with local ward notices, voting events, and campaigns.</Text>
            </View>
          </View>
        </View>

        <Button text="Get Started — Sign In" onPress={onSignInClick} />
        
        <TouchableOpacity style={s.secondaryBtn} onPress={onGetStarted}>
          <Text style={s.secondaryBtnText}>Explore Unity Movement</Text>
        </TouchableOpacity>

        <YamiFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FCF8' },
  content: { padding: 24, justifyContent: 'center', flexGrow: 1 },
  topHero: { alignItems: 'center', marginTop: 10 },
  emblemBox: { width: 64, height: 40, borderRadius: 10, backgroundColor: '#DFF3E3', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emblemText: { fontSize: 14, fontWeight: '900', color: Colors.primary },
  tagline: { fontSize: 10, fontWeight: '900', color: Colors.primary, letterSpacing: 1.5 },
  title: { fontSize: 32, fontWeight: '900', color: Colors.ink, letterSpacing: 1, marginTop: 4 },
  brandLight: { fontWeight: '400' },
  sub: { fontSize: 13, color: Colors.muted, textAlign: 'center', marginTop: 6, lineHeight: 18 },
  cardStack: { marginTop: 24 },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  featureBadge: { width: 36, height: 36, borderRadius: 8, backgroundColor: Colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder },
  featureBadgeText: { fontSize: 10, fontWeight: '900', color: Colors.primary },
  featureTitle: { fontSize: 14, fontWeight: '800', color: Colors.ink },
  featureSub: { fontSize: 12, color: Colors.muted, marginTop: 2, lineHeight: 16 },
  secondaryBtn: { alignItems: 'center', marginTop: 14, padding: 10 },
  secondaryBtnText: { color: Colors.primary, fontWeight: '800', fontSize: 13 },
});
