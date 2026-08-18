import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import { Icon } from '../components/Icons';
import Pills from '../components/Pills';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';

const rand = (n) => `R${Number(n || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function SendMoneyScreen({ finish, balance = 1500, onDeductBalance, setStepText }) {
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedContactId, setSelectedContactId] = useState('1');
  const [amount, setAmount] = useState('100');
  const [note, setNote] = useState('e.g., Monthly contribution');
  const [speed, setSpeed] = useState('instant'); // 'instant' (R1.50) | 'standard' (Free)
  const [confirmCheckbox, setConfirmCheckbox] = useState(true);

  const contacts = [
    { id: '1', name: 'Anele Mandela', phone: '+27 82 123 4567', initials: 'AM' },
    { id: '2', name: 'Thandi Mokoena', phone: '+27 82 555 0105', initials: 'TM' },
    { id: '3', name: 'Sipho Khumalo', phone: '+27 83 444 3322', initials: 'SK' },
    { id: '4', name: 'Lerato Phiri', phone: '+27 71 888 9900', initials: 'LP' },
  ];

  const recentRecipients = [
    { name: 'Thandi M.', bg: '#006933' },
    { name: 'Sipho K.', bg: '#FECC00' },
    { name: 'Lerato', bg: '#0080FF' },
    { name: 'Kagiso P.', bg: '#3E4A3F' },
  ];

  const fee = speed === 'instant' ? 1.50 : 0.00;
  const totalToSend = (parseFloat(amount) || 0) + fee;
  const activeContact = contacts.find(c => c.id === selectedContactId) || contacts[0];

  const goToStep = (n) => {
    setStep(n);
    if (setStepText) {
      if (n === 1) setStepText('STEP 1 OF 3');
      if (n === 2) setStepText('Step 2 of 3');
      if (n === 3) setStepText('Step 3 of 3');
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
        <Text style={s.subText}>Select a contact from your list or search for a new recipient by name or phone number.</Text>

        {/* Search Bar Input */}
        <View style={s.searchBox}>
          <Icon name="search" size={18} color={Colors.muted} />
          <TextInput
            style={s.searchInput}
            placeholder="Search name, phone, or ANC ID"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#97A39A"
          />
        </View>

        {/* RECENT RECIPIENTS (Horizontal Avatars) */}
        <Text style={s.sectionHeader}>RECENT RECIPIENTS</Text>
        <View style={s.recentAvatarRow}>
          {recentRecipients.map((item, idx) => (
            <TouchableOpacity key={idx} style={s.avatarItem} onPress={() => goToStep(2)} activeOpacity={0.8}>
              <View style={[s.avatarCircle, { backgroundColor: item.bg }]}>
                <Text style={s.avatarCircleText}>{item.name[0]}</Text>
              </View>
              <Text style={s.avatarItemName} numberOfLines={1}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact List */}
        <Text style={s.sectionHeader}>A</Text>
        <View style={s.contactList}>
          {contacts.map(c => {
            const isSelected = selectedContactId === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                style={[s.contactRow, isSelected && s.contactRowOn]}
                onPress={() => setSelectedContactId(c.id)}
                activeOpacity={0.8}
              >
                <View style={s.contactAvatar}>
                  <Text style={s.contactAvatarText}>{c.initials}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={s.contactName}>{c.name}</Text>
                  <Text style={s.contactPhone}>{c.phone}</Text>
                </View>
                <View style={[s.radioCircle, isSelected && s.radioCircleOn]}>
                  {isSelected ? <View style={s.radioInnerDot} /> : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button text="CONTINUE  →" onPress={() => goToStep(2)} />

        <YamiFooter />
      </ScrollView>
    );
  }

  // STEP 2: ENTER AMOUNT
  if (step === 2) {
    return (
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Sender Info Pill */}
        <View style={s.senderPillCard}>
          <View style={s.senderAvatar}>
            <Text style={s.senderAvatarText}>LT</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={s.senderName}>Lerumo Maisela</Text>
            <Text style={s.senderId}>ANC-1234567</Text>
          </View>
          <TouchableOpacity style={s.editIconBtn}>
            <Icon name="edit" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Available Balance Pill */}
        <View style={s.availableBalancePill}>
          <Icon name="account-balance-wallet" size={16} color={Colors.primary} />
          <Text style={s.availableBalanceText}>Available Balance: {rand(balance)}</Text>
        </View>

        {/* Big Amount Display */}
        <View style={s.bigAmountContainer}>
          <Text style={s.currencySymbol}>R</Text>
          <TextInput
            style={s.bigAmountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            autoFocus
          />
        </View>

        {/* Quick Amount Pills */}
        <Pills value={amount} setValue={setAmount} options={[50, 100, 250, 500]} />

        {/* Add Note */}
        <View style={s.noteGroup}>
          <Text style={s.fieldLabel}>Add a reference or note (Optional)</Text>
          <View style={s.noteInputBox}>
            <Icon name="notes" size={18} color={Colors.muted} />
            <TextInput
              style={s.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="e.g., Monthly contribution"
              placeholderTextColor="#97A39A"
            />
          </View>
        </View>

        {/* Transfer Speed Selection */}
        <Text style={s.sectionHeader}>Transfer Speed</Text>
        <TouchableOpacity
          style={[s.speedCard, speed === 'instant' && s.speedCardOn]}
          onPress={() => setSpeed('instant')}
          activeOpacity={0.8}
        >
          <View style={[s.radioCircle, speed === 'instant' && s.radioCircleOn]}>
            {speed === 'instant' ? <View style={s.radioInnerDot} /> : null}
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={s.speedTitle}>Instant</Text>
            <Text style={s.speedSub}>Arrives immediately</Text>
          </View>
          <Text style={s.speedFeeText}>R1.50 fee</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.speedCard, speed === 'standard' && s.speedCardOn]}
          onPress={() => setSpeed('standard')}
          activeOpacity={0.8}
        >
          <View style={[s.radioCircle, speed === 'standard' && s.radioCircleOn]}>
            {speed === 'standard' ? <View style={s.radioInnerDot} /> : null}
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={s.speedTitle}>Standard</Text>
            <Text style={s.speedSub}>Arrives in 1-2 business days</Text>
          </View>
          <Text style={s.speedFeeText}>Free</Text>
        </TouchableOpacity>

        <Button text="Review Transfer  →" onPress={() => goToStep(3)} />
      </ScrollView>
    );
  }

  // STEP 3: REVIEW & CONFIRM
  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Progress Bar */}
      <View style={s.progressRow}>
        <View style={s.progressBarTrack}>
          <View style={[s.progressBarFill, { width: '100%' }]} />
        </View>
        <Text style={s.progressStepText}>Step 3</Text>
      </View>

      {/* Total Card */}
      <View style={s.totalCard}>
        <Text style={s.totalCardLabel}>Total to Send</Text>
        <Text style={s.totalCardAmount}>{rand(totalToSend)}</Text>
      </View>

      {/* Details Breakdown Table */}
      <View style={s.reviewTableCard}>
        <View style={s.tableRow}>
          <Text style={s.tableLabel}>From Account</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.tableValue}>Main Wallet</Text>
            <Text style={s.tableSub}>Balance: {rand(balance)}</Text>
          </View>
        </View>

        <View style={s.tableRow}>
          <Text style={s.tableLabel}>Recipient</Text>
          <View style={s.tableRecipientRow}>
            <View style={s.miniAvatar}><Text style={s.miniAvatarText}>{activeContact.initials}</Text></View>
            <Text style={s.tableValue}>{activeContact.name}</Text>
          </View>
        </View>

        <View style={s.tableRow}>
          <Text style={s.tableLabel}>Amount</Text>
          <Text style={s.tableValue}>{rand(amount)}</Text>
        </View>

        <View style={s.tableRow}>
          <Text style={s.tableLabel}>Fee</Text>
          <Text style={s.tableValue}>{rand(fee)}</Text>
        </View>

        <View style={s.tableRow}>
          <Text style={s.tableLabel}>Speed</Text>
          <Text style={s.tableValue}>{speed === 'instant' ? 'Instant' : 'Standard'}</Text>
        </View>
      </View>

      {/* Confirmation Checkbox */}
      <TouchableOpacity style={s.confirmCheckboxRow} onPress={() => setConfirmCheckbox(!confirmCheckbox)}>
        <Icon name={confirmCheckbox ? "check-box" : "check-box-outline-blank"} size={20} color={Colors.primary} />
        <Text style={s.checkboxText}>I confirm these transfer details are correct.</Text>
      </TouchableOpacity>

      <Button text="Confirm & Send" onPress={handleConfirmSend} disabled={!confirmCheckbox} />

      <TouchableOpacity style={s.cancelOutlineBtn} onPress={() => goToStep(2)}>
        <Text style={s.cancelBtnText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 100, backgroundColor: Colors.background },
  bigHeadline: { fontSize: 24, fontWeight: '900', color: Colors.ink, marginBottom: 4 },
  subText: { fontSize: 12, color: Colors.muted, marginBottom: 14, lineHeight: 17 },

  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: Colors.surfaceBorder, marginBottom: 16 },
  searchInput: { flex: 1, fontSize: 13, color: Colors.ink, marginLeft: 8 },

  sectionHeader: { fontSize: 10, fontWeight: '900', color: Colors.muted, letterSpacing: 1.2, marginTop: 14, marginBottom: 10 },
  recentAvatarRow: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  avatarItem: { alignItems: 'center', width: 64 },
  avatarCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  avatarCircleText: { fontSize: 16, fontWeight: '900', color: Colors.white },
  avatarItemName: { fontSize: 11, fontWeight: '700', color: Colors.ink, textAlign: 'center' },

  contactList: { backgroundColor: Colors.white, borderRadius: 14, borderWidth: 1, borderColor: Colors.surfaceBorder, paddingHorizontal: 12, marginBottom: 16 },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.line },
  contactRowOn: { backgroundColor: '#F0F9F2' },
  contactAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  contactAvatarText: { fontSize: 12, fontWeight: '900', color: Colors.ink },
  contactName: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  contactPhone: { fontSize: 11, color: Colors.muted, marginTop: 1 },

  radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: Colors.surfaceBorder, alignItems: 'center', justifyContent: 'center' },
  radioCircleOn: { borderColor: Colors.primary },
  radioInnerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },

  senderPillCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: Colors.surfaceBorder, marginBottom: 14 },
  senderAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
  senderAvatarText: { fontSize: 12, fontWeight: '900', color: Colors.ink },
  senderName: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  senderId: { fontSize: 11, color: Colors.muted },
  editIconBtn: { padding: 4 },

  availableBalancePill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', backgroundColor: '#E2F4E5', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, gap: 6, marginBottom: 14 },
  availableBalanceText: { fontSize: 12, fontWeight: '800', color: Colors.primary },

  bigAmountContainer: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginVertical: 10 },
  currencySymbol: { fontSize: 24, fontWeight: '900', color: Colors.primary, marginRight: 6 },
  bigAmountInput: { fontSize: 40, fontWeight: '900', color: Colors.primary, minWidth: 140, textAlign: 'center' },

  noteGroup: { marginTop: 16, marginBottom: 10 },
  fieldLabel: { color: '#566158', fontSize: 10, fontWeight: '800', letterSpacing: 0.9, marginBottom: 6 },
  noteInputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: Colors.surfaceBorder },
  noteInput: { flex: 1, fontSize: 13, color: Colors.ink, marginLeft: 8 },

  speedCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: Colors.surfaceBorder, marginBottom: 8 },
  speedCardOn: { borderColor: Colors.primary, backgroundColor: '#F0F9F2' },
  speedTitle: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  speedSub: { fontSize: 11, color: Colors.muted, marginTop: 1 },
  speedFeeText: { fontSize: 12, fontWeight: '800', color: Colors.ink },

  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  progressBarTrack: { flex: 1, height: 4, backgroundColor: Colors.surfaceContainerLow, borderRadius: 2 },
  progressBarFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
  progressStepText: { fontSize: 11, fontWeight: '800', color: Colors.muted },

  totalCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder, marginBottom: 14 },
  totalCardLabel: { fontSize: 11, fontWeight: '800', color: Colors.muted, letterSpacing: 1 },
  totalCardAmount: { fontSize: 34, fontWeight: '900', color: Colors.primary, marginTop: 4 },

  reviewTableCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.surfaceBorder, marginBottom: 14 },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.line },
  tableLabel: { fontSize: 13, color: Colors.muted },
  tableValue: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  tableSub: { fontSize: 11, color: Colors.muted, marginTop: 1 },
  tableRecipientRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  miniAvatar: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  miniAvatarText: { fontSize: 9, fontWeight: '900', color: Colors.white },

  confirmCheckboxRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 10 },
  checkboxText: { fontSize: 12, fontWeight: '700', color: Colors.ink },

  cancelOutlineBtn: { borderWidth: 1, borderColor: Colors.surfaceBorder, borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  cancelBtnText: { color: Colors.muted, fontWeight: '800', fontSize: 13 },
});
