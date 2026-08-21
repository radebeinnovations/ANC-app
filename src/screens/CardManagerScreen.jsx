import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import Field from '../components/Field';
import { MastercardLogo } from '../components/Icons';
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
      title: `${holder}'s Gold Card`,
      last4,
      brand: 'Mastercard',
      exp: exp || '08/28',
      color: '#0F172A',
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
      <Text style={s.muted}>Manage your linked debit/credit Mastercard for instant wallet top-ups and services.</Text>

      <View style={{ marginTop: 18 }}>
        {cards.map(c => (
          <View key={c.id} style={[s.paymentCardVisual, { backgroundColor: c.color || '#0F172A' }]}>
            <View style={s.row}>
              <View style={s.brandLogoRow}>
                <MastercardLogo width={36} height={24} />
                <Text style={s.cardBrandText}>{c.brand || 'Mastercard'}</Text>
              </View>
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
        <Text style={s.addCardOutlineBtnText}>＋  Add New Mastercard</Text>
      </TouchableOpacity>

      <YamiFooter />

      {/* ADD CARD MODAL */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <MastercardLogo width={32} height={20} />
                <Text style={s.modalTitle}>Link New Mastercard</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.muted }}>✕</Text>
              </TouchableOpacity>
            </View>

            <Field label="CARDHOLDER NAME" value={holder} onChangeText={setHolder} placeholder="Full Name on Card" />
            <Field label="CARD NUMBER" value={cardNumber} onChangeText={setCardNumber} placeholder="4532 •••• •••• ••••" keyboardType="numeric" />
            
            <View style={s.twoCol}>
              <View style={{ flex: 1 }}>
                <Field label="EXPIRES" value={exp} onChangeText={setExp} placeholder="MM/YY" />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Field label="CVV" value={cvv} onChangeText={setCvv} placeholder="123" keyboardType="numeric" />
              </View>
            </View>

            <Button text="Link Mastercard" onPress={submitNewCard} disabled={!cardNumber} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 20, paddingBottom: 100 },
  eyebrow: { color: Colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2, fontFamily: 'Inter' },
  h1: { fontSize: 26, fontWeight: '900', color: Colors.ink, marginTop: 2, marginBottom: 4, fontFamily: 'Hanken Grotesk' },
  muted: { fontSize: 13, color: Colors.muted, fontFamily: 'Inter' },

  paymentCardVisual: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandLogoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardBrandText: { color: Colors.white, fontSize: 14, fontWeight: '800', letterSpacing: 1, fontFamily: 'Inter' },
  cardDefaultChip: { backgroundColor: '#FECC00', color: '#241A00', fontSize: 9, fontWeight: '900', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 4, fontFamily: 'Inter' },
  cardNumberVisual: { color: Colors.white, fontSize: 18, fontWeight: '800', letterSpacing: 2, marginVertical: 22, fontFamily: 'monospace' },
  cardHolderLabel: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 9, fontWeight: '800', letterSpacing: 1, fontFamily: 'Inter' },
  cardHolderName: { color: Colors.white, fontSize: 13, fontWeight: '700', marginTop: 2, fontFamily: 'Inter' },

  addCardOutlineBtn: { borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 12 },
  addCardOutlineBtnText: { color: Colors.primary, fontWeight: '800', fontSize: 13, fontFamily: 'Inter' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: Colors.ink, fontFamily: 'Hanken Grotesk' },
  twoCol: { flexDirection: 'row' },
});
