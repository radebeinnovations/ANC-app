import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import CardSelector from '../components/CardSelector';
import Field from '../components/Field';
import Pills from '../components/Pills';
import { Colors } from '../theme/colors';

const rand = (n) => `R${Number(n || 0).toFixed(2)}`;

export default function DonationScreen({ finish, cards = [], onDeductBalance }) {
  const [amount, setAmount] = useState('100');
  const [message, setMessage] = useState('');
  const [cardId, setCardId] = useState(cards[0]?.id || '1');

  const handleDonate = () => {
    const num = parseFloat(amount) || 0;
    if (onDeductBalance) {
      onDeductBalance(num, 'Community Campaign Donation');
    }
    finish(`Thank you for your ${rand(amount)} donation.`);
  };

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.eyebrow}>COMMUNITY CAMPAIGN</Text>
      <Text style={s.h1}>Make a donation</Text>

      <View style={s.campaignCard}>
        <Text style={s.campaignBadge}>ACTION</Text>
        <Text style={s.campaignTitle}>Build Stronger Communities</Text>
        <Text style={s.campaignCopy}>Every contribution directly supports local ward youth programmes and local community action.</Text>
      </View>

      <Field label="DONATION AMOUNT (ZAR)" value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="Enter amount" />
      <Pills value={amount} setValue={setAmount} />
      <CardSelector cards={cards} selectedId={cardId} onSelect={setCardId} />
      <Field label="MESSAGE OF SUPPORT (OPTIONAL)" value={message} onChangeText={setMessage} placeholder="Leave a message for your branch..." multiline />

      <Button text={`Donate ${rand(amount)}  →`} onPress={handleDonate} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 20, paddingBottom: 100 },
  eyebrow: { color: Colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  h1: { fontSize: 26, fontWeight: '900', color: Colors.ink, marginTop: 2, marginBottom: 12 },
  campaignCard: { backgroundColor: Colors.primaryDark, borderRadius: 16, padding: 18, marginTop: 4 },
  campaignBadge: { color: Colors.gold, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  campaignTitle: { fontSize: 20, fontWeight: '900', color: Colors.white, marginTop: 6 },
  campaignCopy: { color: '#D4E4D7', fontSize: 13, lineHeight: 18, marginTop: 6 },
});
