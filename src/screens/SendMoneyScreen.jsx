import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import { Icon } from '../components/Icons';
import Pills from '../components/Pills';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';

const rand = (n) => `R${Number(n || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function SendMoneyScreen({ finish, balance = 1500, onDeductBalance, setStepText }) {
  const [step, setStep] = useState(2); // Default to Step 2 of 3 as shown in screenshot
  const [amount, setAmount] = useState('500');
  const [note, setNote] = useState('Branch meeting contribution');
  const [speed, setSpeed] = useState('instant'); // instant (R5.00 fee)

  const activeContact = {
    name: 'Thabo Mokoena',
    phone: '+27 82 123 4567',
    initials: 'TM',
  };

  const fee = 5.00;
  const totalToSend = (parseFloat(amount) || 0) + fee;

  const goToStep = (n) => {
    setStep(n);
    if (setStepText) {
      if (n === 1) setStepText('STEP 1 OF 3');
      if (n === 2) setStepText('STEP 2 OF 3');
      if (n === 3) setStepText('STEP 3 OF 3');
    }
  };

  const handleConfirmSend = () => {
    const num = parseFloat(amount) || 0;
    if (onDeductBalance) {
      onDeductBalance(num + fee, `Transfer to ${activeContact.name}`);
    }
    finish(`Successfully sent ${rand(num)} to ${activeContact.name}.`);
  };

  // STEP 1: SELECT RECIPIENT
  if (step === 1) {
    return (
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.bigHeadline}>Who are you sending to?</Text>
        <Text style={s.subText}>Select a contact from your list or search for a recipient.</Text>

        <TouchableOpacity style={s.selectedRecipientCard} onPress={() => goToStep(2)} activeOpacity={0.8}>
          <View style={s.userIconSquare}>
            <Icon name="person" size={20} color={Colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.recipientName}>{activeContact.name}</Text>
            <Text style={s.recipientPhone}>{activeContact.phone}</Text>
          </View>
          <Icon name="check-circle" size={20} color={Colors.primary} />
        </TouchableOpacity>

        <Button text="CONTINUE TO AMOUNT  →" onPress={() => goToStep(2)} />
        <YamiFooter />
      </ScrollView>
    );
  }

  // STEP 2: ENTER AMOUNT (Screen 2 in screenshot)
  if (step === 2) {
    return (
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Selected Recipient Card */}
        <TouchableOpacity style={s.selectedRecipientCard} onPress={() => goToStep(1)} activeOpacity={0.8}>
          <View style={s.userIconSquare}>
            <Icon name="person" size={20} color={Colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.recipientName}>{activeContact.name}</Text>
            <Text style={s.recipientPhone}>{activeContact.phone}</Text>
          </View>
        </TouchableOpacity>

        {/* Big Amount Display */}
        <View style={s.amountDisplayCard}>
          <View style={s.amountInputRow}>
            <Text style={s.currencyPrefix}>R</Text>
            <TextInput
              style={s.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
          <Text style={s.availableSubText}>Available Balance: {rand(balance)}</Text>
          <View style={s.greenUnderline} />
        </View>

        {/* Quick Amount Pills */}
        <Pills value={amount} setValue={setAmount} options={[50, 100, 200, 500, 1000]} />

        {/* Transfer Fee & Arrival Card */}
        <View style={s.infoCard}>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Transfer Fee:</Text>
            <Text style={s.infoValue}>R5.00</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Arrival:</Text>
            <Text style={s.instantValue}>⚡ Instant</Text>
          </View>
        </View>

        {/* Add Note Field */}
        <View style={s.noteContainer}>
          <Icon name="edit-note" size={20} color={Colors.muted} />
          <TextInput
            style={s.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Add a note (optional)"
            placeholderTextColor="#97A39A"
          />
        </View>

        {/* Action Button */}
        <Button text="Review Transfer  →" onPress={() => goToStep(3)} />
      </ScrollView>
    );
  }

  // STEP 3: REVIEW & CONFIRM (Screen 3 in screenshot)
  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.step3Title}>Review Transfer</Text>

      {/* Recipient Card */}
      <View style={s.reviewRecipientCard}>
        <View style={s.userIconSquare}>
          <Icon name="person" size={22} color={Colors.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.sendingToLabel}>Sending to</Text>
          <Text style={s.recipientName}>{activeContact.name}</Text>
          <Text style={s.recipientPhone}>{activeContact.phone}</Text>
        </View>
      </View>

      {/* Summary Table Card */}
      <View style={s.summaryCard}>
        <View style={s.summaryRow}>
          <Text style={s.summaryLabel}>Amount</Text>
          <Text style={s.summaryVal}>R{parseFloat(amount || 0).toFixed(2)}</Text>
        </View>

        <View style={s.summaryRow}>
          <Text style={s.summaryLabel}>Fee</Text>
          <Text style={s.summaryVal}>R{fee.toFixed(2)}</Text>
        </View>

        <View style={[s.summaryRow, { borderBottomWidth: 0, paddingTop: 12 }]}>
          <Text style={s.totalLabel}>Total</Text>
          <Text style={s.totalVal}>{rand(totalToSend)}</Text>
        </View>

        <View style={s.arrivalLine}>
          <Text style={s.summaryLabel}>Arrival</Text>
          <Text style={s.arrivalVal}>Instant</Text>
        </View>
      </View>

      {/* Funding Source Card */}
      <View style={s.fundingCard}>
        <Text style={s.fundingCardTitle}>Funding Source</Text>
        <View style={s.fundingRow}>
          <View style={s.ancIconBox}>
            <Text style={s.ancIconText}>C</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={s.fundingName}>ANC Member Money</Text>
            <Text style={s.fundingSub}>Balance: {rand(balance)}</Text>
          </View>
        </View>
      </View>

      {/* Note Display Card */}
      {note ? (
        <View style={s.noteDisplayCard}>
          <Text style={s.noteDisplayLabel}>Note</Text>
          <Text style={s.noteDisplayText}>“{note}”</Text>
        </View>
      ) : null}

      {/* Security Footer Line */}
      <View style={s.securityRow}>
        <Icon name="lock" size={14} color={Colors.primary} />
        <Text style={s.securityText}>Your transfer is protected by secure authentication.</Text>
      </View>

      {/* Action Buttons */}
      <Button text="Confirm & Send" onPress={handleConfirmSend} />

      <TouchableOpacity style={s.editOutlineBtn} onPress={() => goToStep(2)} activeOpacity={0.8}>
        <Text style={s.editBtnText}>Edit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 90, backgroundColor: Colors.background },
  bigHeadline: { fontSize: 24, fontWeight: '900', color: Colors.ink, marginBottom: 4 },
  subText: { fontSize: 12, color: Colors.muted, marginBottom: 14 },

  selectedRecipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 16,
  },
  userIconSquare: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F0F9F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendingToLabel: { fontSize: 11, color: Colors.muted, fontWeight: '600' },
  recipientName: { fontSize: 15, fontWeight: '800', color: Colors.ink },
  recipientPhone: { fontSize: 12, color: Colors.muted, marginTop: 1 },

  amountDisplayCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 16,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyPrefix: { fontSize: 32, fontWeight: '900', color: Colors.primary, marginRight: 6 },
  amountInput: { fontSize: 44, fontWeight: '900', color: Colors.primary, minWidth: 160, textAlign: 'center' },
  availableSubText: { fontSize: 12, fontWeight: '700', color: Colors.muted, marginTop: 6 },
  greenUnderline: { width: 40, height: 3, backgroundColor: Colors.primary, borderRadius: 2, marginTop: 10 },

  infoCard: {
    backgroundColor: '#F7F8F7',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    gap: 8,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { fontSize: 13, color: Colors.muted, fontWeight: '600' },
  infoValue: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  instantValue: { fontSize: 13, fontWeight: '800', color: Colors.primary },

  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 16,
  },
  noteInput: { flex: 1, fontSize: 13, color: Colors.ink, marginLeft: 8 },

  step3Title: { fontSize: 24, fontWeight: '900', color: Colors.ink, marginBottom: 14, textAlign: 'center' },

  reviewRecipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 16,
  },

  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  summaryLabel: { fontSize: 13, color: Colors.muted, fontWeight: '600' },
  summaryVal: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  totalLabel: { fontSize: 16, fontWeight: '900', color: Colors.ink },
  totalVal: { fontSize: 22, fontWeight: '900', color: Colors.primary },

  arrivalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
  },
  arrivalVal: { fontSize: 13, fontWeight: '800', color: Colors.ink },

  fundingCard: {
    backgroundColor: '#F7F8F7',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  fundingCardTitle: { fontSize: 11, fontWeight: '800', color: Colors.muted, letterSpacing: 0.8, marginBottom: 8 },
  fundingRow: { flexDirection: 'row', alignItems: 'center' },
  ancIconBox: { width: 32, height: 32, borderRadius: 6, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  ancIconText: { fontSize: 14, fontWeight: '900', color: '#FECC00' },
  fundingName: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  fundingSub: { fontSize: 11, color: Colors.muted, marginTop: 1 },

  noteDisplayCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 16,
  },
  noteDisplayLabel: { fontSize: 11, fontWeight: '800', color: Colors.muted, marginBottom: 4 },
  noteDisplayText: { fontSize: 13, fontWeight: '700', color: Colors.ink, fontStyle: 'italic' },

  securityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 16 },
  securityText: { fontSize: 11, color: Colors.muted, fontWeight: '600' },

  editOutlineBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  editBtnText: { color: Colors.primary, fontWeight: '800', fontSize: 14 },
});
