import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import CardSelector from '../components/CardSelector';
import Field from '../components/Field';
import Pills from '../components/Pills';
import { Colors } from '../theme/colors';

const rand = (n) => `R${Number(n || 0).toFixed(2)}`;

export default function MembershipScreen({ finish, cards = [] }) {
  const [amount, setAmount] = useState('250');
  const [frequency, setFrequency] = useState('Monthly');
  const [cardId, setCardId] = useState(cards[0]?.id || '1');

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.eyebrow}>MEMBERSHIP</Text>
      <Text style={s.h1}>Contribution</Text>

      <View style={s.statusReview}>
        <Text style={s.strong}>LERUMO THABO</Text>
        <Text style={s.muted}>ANC-1234567</Text>
        <View style={s.statusRow}>
          <Text style={s.muted}>Membership status</Text>
          <Text style={s.goodText}>Active (Good Standing)</Text>
        </View>
      </View>

      <Text style={s.sectionTitle}>Select Amount</Text>
      <Pills value={amount} setValue={setAmount} />
      <Field label="CUSTOM AMOUNT (ZAR)" value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="Enter custom amount" />

      <CardSelector cards={cards} selectedId={cardId} onSelect={setCardId} />

      <Text style={s.sectionTitle}>Frequency</Text>
      {['Monthly', 'Annual', 'One-time'].map(item => (
        <TouchableOpacity
          key={item}
          onPress={() => setFrequency(item)}
          style={s.radioRow}
          activeOpacity={0.7}
        >
          <Text style={s.radioIcon}>{frequency === item ? '◉' : '○'}</Text>
          <Text style={[s.radioText, frequency === item && s.radioTextOn]}>{item}</Text>
        </TouchableOpacity>
      ))}

      <View style={s.reviewBox}>
        <View style={s.reviewLine}><Text style={s.muted}>Frequency</Text><Text style={s.strong}>{frequency}</Text></View>
        <View style={s.reviewLine}><Text style={s.muted}>Next Due Date</Text><Text style={s.strong}>31 August 2026</Text></View>
        <View style={s.reviewLine}><Text style={s.totalLabel}>Total Contribution</Text><Text style={s.totalAmount}>{rand(amount)}</Text></View>
      </View>

      <Button
        text={`Review ${frequency} Contribution (${rand(amount)})  →`}
        onPress={() => finish(`Membership ${frequency.toLowerCase()} contribution of ${rand(amount)} scheduled.`)}
      />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 20, paddingBottom: 100 },
  eyebrow: { color: Colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  h1: { fontSize: 26, fontWeight: '900', color: Colors.ink, marginTop: 2, marginBottom: 12 },
  muted: { color: Colors.muted, fontSize: 13 },
  strong: { fontWeight: '800', color: Colors.ink },
  goodText: { color: Colors.primary, fontWeight: '900' },
  statusReview: { backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, padding: 16, marginTop: 4 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.ink, marginTop: 20, marginBottom: 10 },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  radioIcon: { fontSize: 18, color: Colors.primary, marginRight: 10 },
  radioText: { fontSize: 14, color: Colors.ink },
  radioTextOn: { fontWeight: '800', color: Colors.primary },
  reviewBox: { backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, padding: 16, marginTop: 20 },
  reviewLine: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  totalLabel: { fontSize: 15, fontWeight: '700', color: Colors.ink },
  totalAmount: { fontSize: 18, fontWeight: '900', color: Colors.primary },
});
