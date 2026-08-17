import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import CardSelector from '../components/CardSelector';
import Field from '../components/Field';
import Pills from '../components/Pills';
import { Colors } from '../theme/colors';

const rand = (n) => `R${Number(n || 0).toFixed(2)}`;

export default function SendMoneyScreen({ finish, cards = [] }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('250');
  const [recipient, setRecipient] = useState('Thandi Mokoena');
  const [reference, setReference] = useState('Family support');
  const [cardId, setCardId] = useState(cards[0]?.id || '1');

  if (step === 3) {
    return (
      <ScrollView contentContainerStyle={[s.content, s.center]} showsVerticalScrollIndicator={false}>
        <View style={s.successCircle}>
          <Text style={s.successCheck}>✓</Text>
        </View>
        <Text style={s.eyebrow}>PAYMENT SUCCESSFUL</Text>
        <Text style={s.h1}>Money sent!</Text>
        <Text style={s.muted}>
          You sent <Text style={s.strong}>{rand(amount)}</Text> to {recipient}.
        </Text>
        <View style={s.reviewBox}>
          <View style={s.reviewLine}><Text style={s.muted}>Recipient</Text><Text style={s.strong}>{recipient}</Text></View>
          <View style={s.reviewLine}><Text style={s.muted}>Reference</Text><Text style={s.strong}>{reference}</Text></View>
          <View style={s.reviewLine}><Text style={s.muted}>Paid via</Text><Text style={s.strong}>{cards.find(c => c.id === cardId)?.title || 'Wallet'}</Text></View>
          <View style={s.reviewLine}><Text style={s.muted}>Transaction ID</Text><Text style={s.strong}>ANC-8F27A1</Text></View>
        </View>
        <Button text="Done" onPress={() => finish('Payment completed successfully.')} />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.eyebrow}>ANC MEMBER MONEY</Text>
      <Text style={s.h1}>{step === 1 ? 'Send money' : 'Review transfer'}</Text>
      {step === 1 ? (
        <>
          <Field label="RECIPIENT" value={recipient} onChangeText={setRecipient} placeholder="Enter recipient name or number" />
          <Field label="AMOUNT (ZAR)" value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="Enter amount" />
          <Pills value={amount} setValue={setAmount} />
          <CardSelector cards={cards} selectedId={cardId} onSelect={setCardId} />
          <Field label="REFERENCE" value={reference} onChangeText={setReference} placeholder="Enter reference" />
          <Button text="Continue  →" onPress={() => setStep(2)} />
        </>
      ) : (
        <>
          <View style={s.reviewBox}>
            <View style={s.reviewLine}><Text style={s.muted}>To</Text><Text style={s.strong}>{recipient}</Text></View>
            <View style={s.reviewLine}><Text style={s.muted}>Reference</Text><Text style={s.strong}>{reference}</Text></View>
            <View style={s.reviewLine}><Text style={s.muted}>Payment Method</Text><Text style={s.strong}>{cards.find(c => c.id === cardId)?.title}</Text></View>
            <View style={s.separator} />
            <View style={s.reviewLine}><Text style={s.totalLabel}>Total</Text><Text style={s.totalAmount}>{rand(amount)}</Text></View>
          </View>
          <Button text="🔒  Confirm & Send" onPress={() => setStep(3)} />
        </>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 20, paddingBottom: 100 },
  eyebrow: { color: Colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  h1: { fontSize: 26, fontWeight: '900', color: Colors.ink, marginTop: 2, marginBottom: 12 },
  muted: { color: Colors.muted, fontSize: 13, lineHeight: 18 },
  strong: { fontWeight: '800', color: Colors.ink },
  center: { alignItems: 'center', textAlign: 'center' },
  successCircle: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#DFF3E3', alignItems: 'center', justifyContent: 'center', marginTop: 30, marginBottom: 16 },
  successCheck: { color: Colors.primary, fontSize: 36, fontWeight: '900' },
  reviewBox: { backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, padding: 16, marginTop: 20 },
  reviewLine: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  separator: { height: 1, backgroundColor: Colors.line, marginVertical: 10 },
  totalLabel: { fontSize: 15, fontWeight: '700', color: Colors.ink },
  totalAmount: { fontSize: 20, fontWeight: '900', color: Colors.primary },
});
