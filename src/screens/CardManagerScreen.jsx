import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import Field from '../components/Field';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';

export default function CardManagerScreen({ cards = [], onAddCard }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [holder, setHolder] = useState('Lerumo Thabo');
  const [cardNumber, setCardNumber] = useState('');
  const [exp, setExp] = useState('');
  const [cvv, setCvv] = useState('');

  const submitNewCard = () => {
    if (!cardNumber || cardNumber.length < 4) return;
    const last4 = cardNumber.slice(-4);
    onAddCard({
      title: `${holder}'s Card`,
      last4,
      brand: 'VISA',
      exp: exp || '12/29',
      color: '#005e30',
    });
    setCardNumber('');
    setExp('');
    setCvv('');
    setShowAddModal(false);
  };

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.eyebrow}>PAYMENT METHODS</Text>
      <Text style={s.h1}>My Cards</Text>
      <Text style={s.muted}>Manage your linked debit/credit cards for membership dues and services.</Text>

      <View style={{ marginTop: 18 }}>
        {cards.map(c => (
          <View key={c.id} style={[s.paymentCardVisual, { backgroundColor: c.color }]}>
            <View style={s.row}>
              <Text style={s.cardBrandText}>{c.brand}</Text>
              {c.isDefault ? <Text style={s.cardDefaultChip}>DEFAULT</Text> : null}
            </View>
            <Text style={s.cardNumberVisual}>•••• •••• •••• {c.last4}</Text>
            <View style={s.row}>
              <View>
                <Text style={s.cardHolderLabel}>CARDHOLDER</Text>
                <Text style={s.cardHolderName}>{c.title}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.cardHolderLabel}>EXPIRES</Text>
                <Text style={s.cardHolderName}>{c.exp}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={s.addCardOutlineBtn} onPress={() => setShowAddModal(true)} activeOpacity={0.7}>
        <Text style={s.addCardOutlineBtnText}>＋  Add New Payment Card</Text>
      </TouchableOpacity>

      <View style={s.securityBadgeBox}>
        <Text style={s.securityBadgeTitle}>🔒 PCI-DSS Compliant Tokenized Storage</Text>
        <Text style={s.securityBadgeSub}>Your payment details are tokenized and processed securely powered by Yami Payment Vault.</Text>
      </View>

      <YamiFooter />

      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <View style={s.row}>
              <Text style={s.modalTitle}>Add Payment Card</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={{ fontSize: 22, color: Colors.muted }}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={s.muted}>Connect a credit or debit card for instant payments.</Text>

            <Field label="CARDHOLDER NAME" value={holder} onChangeText={setHolder} placeholder="Full Name on Card" />
            <Field label="CARD NUMBER" value={cardNumber} onChangeText={setCardNumber} placeholder="4532 •••• •••• 8821" keyboardType="numeric" maxLength={16} />

            <View style={s.row}>
              <View style={{ width: '48%' }}>
                <Field label="EXPIRY (MM/YY)" value={exp} onChangeText={setExp} placeholder="12/28" keyboardType="numeric" />
              </View>
              <View style={{ width: '48%' }}>
                <Field label="CVV" value={cvv} onChangeText={setCvv} placeholder="123" keyboardType="numeric" secureTextEntry maxLength={4} />
              </View>
            </View>

            <Button text="🔒  Save Card Securely" onPress={submitNewCard} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 20, paddingBottom: 100 },
  eyebrow: { color: Colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  h1: { fontSize: 26, fontWeight: '900', color: Colors.ink, marginTop: 2, marginBottom: 4 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: Colors.ink },
  muted: { color: Colors.muted, fontSize: 13, lineHeight: 18 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentCardVisual: { borderRadius: 16, padding: 18, marginBottom: 14, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  cardBrandText: { color: Colors.white, fontWeight: '800', fontSize: 14, letterSpacing: 1.5 },
  cardDefaultChip: { backgroundColor: Colors.gold, color: Colors.ink, fontWeight: '900', fontSize: 9, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 4 },
  cardNumberVisual: { color: Colors.white, fontSize: 18, fontWeight: '700', letterSpacing: 2.5, marginVertical: 18 },
  cardHolderLabel: { color: '#FFFFFF99', fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  cardHolderName: { color: Colors.white, fontSize: 12, fontWeight: '700', marginTop: 2 },
  addCardOutlineBtn: { borderWidth: 1.5, borderColor: Colors.primary, borderStyle: 'dashed', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 6 },
  addCardOutlineBtnText: { color: Colors.primary, fontWeight: '800', fontSize: 13 },
  securityBadgeBox: { backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, padding: 14, marginTop: 20 },
  securityBadgeTitle: { color: Colors.ink, fontWeight: '800', fontSize: 12 },
  securityBadgeSub: { color: Colors.muted, fontSize: 11, marginTop: 4, lineHeight: 16 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, paddingBottom: 40 },
});
