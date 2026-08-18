import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import List from '../components/List';
import { Colors } from '../theme/colors';

export default function BranchScreen() {
  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.eyebrow}>YOUR LOCAL STRUCTURE</Text>
      <Text style={s.h1}>My Branch</Text>

      <View style={s.mapPlaceholder}>
        <Text style={s.mapBadge}>ORLANDO EAST BRANCH</Text>
        <Text style={s.mapSub}>Ward 62 · Soweto Region · Gauteng</Text>
      </View>

      <Text style={s.sectionTitle}>Branch Executive Committee</Text>
      <List badge="SEC" title="Branch Secretary" sub="Nomsa Dlamini (082 112 4490)" />
      <List badge="CHR" title="Branch Chairperson" sub="Sibusiso Thwala" />
      <List badge="TEL" title="Branch Office Contact" sub="011 935 2200" />
      <List badge="VEN" title="Branch Meeting Venue" sub="Orlando East Community Hall" />

      <TouchableOpacity style={s.outlineBtn} activeOpacity={0.7}>
        <Text style={s.outlineBtnText}>Get Directions to Branch Office</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 20, paddingBottom: 100 },
  eyebrow: { color: Colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  h1: { fontSize: 26, fontWeight: '900', color: Colors.ink, marginTop: 2, marginBottom: 12 },
  mapPlaceholder: {
    height: 120,
    borderRadius: 16,
    backgroundColor: '#E1EEE3',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#C2DEC6',
    padding: 16,
  },
  mapBadge: { color: Colors.primary, fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  mapSub: { color: Colors.muted, fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.ink, marginTop: 24, marginBottom: 10 },
  outlineBtn: { borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 24 },
  outlineBtnText: { color: Colors.primary, fontWeight: '800', fontSize: 13 },
});
