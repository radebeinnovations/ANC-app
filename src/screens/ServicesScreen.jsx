import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import CardSelector from '../components/CardSelector';
import Field from '../components/Field';
import Pills from '../components/Pills';
import { Colors } from '../theme/colors';

const rand = (n) => `R${Number(n || 0).toFixed(2)}`;

export default function ServicesScreen({ finish, cards = [] }) {
  const [service, setService] = useState('Airtime');
  const [mobile, setMobile] = useState('082 555 0105');
  const [amount, setAmount] = useState('100');
  const [cardId, setCardId] = useState(cards[0]?.id || '1');

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.eyebrow}>PAY & SERVICES</Text>
      <Text style={s.h1}>Buy {service.toLowerCase()}</Text>
      
      <View style={s.tabs}>
        {['Airtime', 'Data', 'Electricity'].map(x => (
          <TouchableOpacity
            key={x}
            onPress={() => setService(x)}
            style={[s.pill, service === x && s.pillOn]}
            activeOpacity={0.7}
          >
            <Text style={[s.pillText, service === x && s.pillTextOn]}>{x}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Field
        label={service === 'Electricity' ? 'METER NUMBER' : 'MOBILE NUMBER'}
        value={mobile}
        onChangeText={setMobile}
        placeholder={service === 'Electricity' ? 'Enter meter number' : 'Enter mobile number'}
        keyboardType="phone-pad"
      />
      
      <Field label="AMOUNT (ZAR)" value={amount} onChangeText={setAmount} placeholder="Enter custom amount" keyboardType="numeric" />
      <Pills value={amount} setValue={setAmount} />
      <CardSelector cards={cards} selectedId={cardId} onSelect={setCardId} />

      <View style={s.reviewBox}>
        <View style={s.reviewLine}>
          <Text style={s.muted}>Paying with</Text>
          <Text style={s.strong}>{cards.find(c => c.id === cardId)?.title}</Text>
        </View>
        <View style={s.reviewLine}>
          <Text style={s.muted}>Total cost</Text>
          <Text style={s.totalAmount}>{rand(amount)}</Text>
        </View>
      </View>

      <Button text={`Pay ${rand(amount)} now  →`} onPress={() => finish(`${service} purchase of ${rand(amount)} complete.`)} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 20, paddingBottom: 100 },
  eyebrow: { color: Colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  h1: { fontSize: 26, fontWeight: '900', color: Colors.ink, marginTop: 2, marginBottom: 12 },
  muted: { color: Colors.muted, fontSize: 13 },
  strong: { fontWeight: '800', color: Colors.ink },
  tabs: { flexDirection: 'row', gap: 8, marginTop: 4, flexWrap: 'wrap' },
  pill: { borderWidth: 1, borderColor: Colors.line, borderRadius: 8, paddingVertical: 9, paddingHorizontal: 14, backgroundColor: Colors.white },
  pillOn: { backgroundColor: '#E2F4E5', borderColor: Colors.primary },
  pillText: { fontSize: 13, fontWeight: '700', color: '#344137' },
  pillTextOn: { color: Colors.primary },
  reviewBox: { backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, padding: 15, marginTop: 20 },
  reviewLine: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  totalAmount: { fontSize: 18, fontWeight: '900', color: Colors.primary },
});
