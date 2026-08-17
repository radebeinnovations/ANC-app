import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import List from '../components/List';
import MemberCardVisual from '../components/MemberCardVisual';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';

export default function ProfileScreen({ cards = [], onOpenCards }) {
  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.center}>
        <View style={s.avatarLarge}>
          <Text style={s.avatarLargeText}>LT</Text>
        </View>
        <Text style={s.h1}>Lerumo Thabo</Text>
        <Text style={s.muted}>ANC-1234567</Text>
      </View>

      <MemberCardVisual />

      <Text style={s.sectionTitle}>My Member Details</Text>
      <List icon="☎" title="082 555 0105" sub="Verified Mobile Number" />
      <List icon="✉" title="lerumo.thabo@anc-unity.org.za" sub="Verified Email Address" />
      <List icon="⌖" title="Soweto, Gauteng" sub="Home Address (Ward 62)" />
      <List icon="💳" title="Saved Payment Cards" sub={`${cards.length} linked cards`} onPress={onOpenCards} />
      <List icon="⚙" title="App Settings & Security" sub="Biometrics & PIN lock" />

      <YamiFooter />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 20, paddingBottom: 100 },
  center: { alignItems: 'center' },
  avatarLarge: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  avatarLargeText: { fontSize: 24, fontWeight: '900', color: Colors.ink },
  h1: { fontSize: 24, fontWeight: '900', color: Colors.ink, marginTop: 8 },
  muted: { color: Colors.muted, fontSize: 13 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.ink, marginTop: 24, marginBottom: 10 },
});
