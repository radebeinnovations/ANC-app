import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import { Icon } from '../components/Icons';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';

const rand = (n) => `R${Number(n || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function SendMoneyScreen({ finish, balance = 1500, onDeductBalance, setStepText }) {
  const [step, setStep] = useState(1); // Step 1: Select Recipient -> Step 2: Enter Amount -> Step 3: Review Transfer
  const [search, setSearch] = useState('');
  const [selectedContactId, setSelectedContactId] = useState('1');
  const [amount, setAmount] = useState('500');
  const [note, setNote] = useState('Branch meeting contribution');

  const contacts = [
    {
      id: '1',
      name: 'Thabo Mokoena',
      phone: '+27 82 123 4567',
      initials: 'TM',
      isMember: true,
      bg: '#006933',
    },
    {
      id: '2',
      name: 'Naledi Dlamini',
      phone: '+27 71 456 7890',
      initials: 'ND',
      isMember: false,
      bg: '#E0E0E0',
    },
  ];

  const activeContact = contacts.find(c => c.id === selectedContactId) || contacts[0];
  const fee = 5.00;
  const totalToSend = (parseFloat(amount) || 0) + fee;

  React.useEffect(() => {
    if (setStepText) setStepText(`STEP ${step} OF 3`);
  }, [step]);

  const goToStep = (n) => {
    setStep(n);
    if (setStepText) {
      setStepText(`STEP ${n} OF 3`);
    }
  };

  const handleConfirmSend = () => {
    const num = parseFloat(amount) || 0;
    if (onDeductBalance) {
      onDeductBalance(num + fee, `Transfer to ${activeContact.name}`);
    }
    finish(`Successfully sent ${rand(num)} to ${activeContact.name}.`);
  };

  // STEP 1: SELECT RECIPIENT (Image 1 in screenshot)
  if (step === 1) {
    return (
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Step Progress Line Bar */}
        <View style={s.stepProgressHeader}>
          <View style={s.progressTrack}>
            <View style={[s.progressSegment, s.segmentActive]} />
            <View style={s.progressSegment} />
            <View style={s.progressSegment} />
          </View>
          <Text style={s.stepSubTitle}>STEP 1 OF 3</Text>
        </View>

        {/* Title */}
        <Text style={s.pageHeadline}>Choose a recipient</Text>

        {/* Search Bar */}
        <View style={s.searchContainer}>
          <Icon name="search" size={18} color={Colors.muted} />
          <TextInput
            style={s.searchInputText}
            placeholder="Search by name, phone number or acc"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#8C988F"
          />
        </View>

        {/* Enter Details Manually Card */}
        <TouchableOpacity style={s.manualCard} activeOpacity={0.8}>
          <View style={s.manualPlusIconBox}>
            <Text style={s.manualPlusText}>＋</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.manualCardTitle}>Enter details manually</Text>
            <Text style={s.manualCardSub}>Send to a new contact</Text>
          </View>
        </TouchableOpacity>

        {/* RECENT Section */}
        <Text style={s.recentSectionHeader}>RECENT</Text>

        <View style={s.contactsStack}>
          {contacts.map(c => {
            const isSelected = selectedContactId === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                style={[s.contactRowCard, isSelected && s.contactRowCardSelected]}
                onPress={() => setSelectedContactId(c.id)}
                activeOpacity={0.8}
              >
                <View style={s.avatarWrapper}>
                  <View style={[s.contactAvatarCircle, { backgroundColor: c.bg }]}>
                    <Text style={[s.contactAvatarText, !c.isMember && { color: Colors.ink }]}>{c.initials}</Text>
                  </View>
                  {c.isMember && (
                    <View style={s.badgeCheckDot}>
                      <Icon name="check" size={10} color={Colors.white} />
                    </View>
                  )}
                </View>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={s.contactNameText}>{c.name}</Text>
                  <Text style={s.contactPhoneText}>{c.phone}</Text>
                </View>

                {c.isMember ? (
                  <View style={s.ancMemberTag}>
                    <Text style={s.ancMemberTagText}>ANC MEMBER</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom Continue Button */}
        <Button text="Continue" onPress={() => goToStep(2)} />

        <YamiFooter />
      </ScrollView>
    );
  }

  // STEP 2: ENTER AMOUNT (Image 2 in screenshot)
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

        {/* Big Amount Display Card */}
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

        {/* Quick Amount Pills (4 on top, 1 centered below) */}
        <View style={s.pillsLayoutContainer}>
          <View style={s.pillsTopRow}>
            {['50', '100', '200', '500'].map(val => (
              <TouchableOpacity
                key={val}
                style={[s.pillBtn, amount === val && s.pillBtnSelected]}
                onPress={() => setAmount(val)}
                activeOpacity={0.8}
              >
                <Text style={[s.pillText, amount === val && s.pillTextSelected]}>R{val}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[s.pillBtnCenter, amount === '1000' && s.pillBtnSelected]}
            onPress={() => setAmount('1000')}
            activeOpacity={0.8}
          >
            <Text style={[s.pillText, amount === '1000' && s.pillTextSelected]}>R1,000</Text>
          </TouchableOpacity>
        </View>

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

  // STEP 3: REVIEW & CONFIRM (Image 3 in screenshot)
  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.step3Title}>Review Transfer</Text>

      {/* Recipient Box */}
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

        {/* Funding Source inside card */}
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

        {/* Note Display inside card */}
        {note ? (
          <View style={s.noteDisplayCard}>
            <Text style={s.noteDisplayLabel}>Note</Text>
            <Text style={s.noteDisplayText}>“{note}”</Text>
          </View>
        ) : null}
      </View>

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

  stepProgressHeader: { marginBottom: 14 },
  progressTrack: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  progressSegment: { flex: 1, height: 3, backgroundColor: '#E0E0E0', borderRadius: 2 },
  segmentActive: { backgroundColor: Colors.primary },
  stepSubTitle: { fontSize: 10, fontWeight: '800', color: Colors.muted, letterSpacing: 0.8 },

  pageHeadline: { fontSize: 22, fontWeight: '900', color: Colors.ink, marginBottom: 14 },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 14,
  },
  searchInputText: { flex: 1, fontSize: 13, color: Colors.ink, marginLeft: 8 },

  manualCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 16,
  },
  manualPlusIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F0F9F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  manualPlusText: { fontSize: 18, fontWeight: '900', color: Colors.primary },
  manualCardTitle: { fontSize: 14, fontWeight: '800', color: Colors.ink },
  manualCardSub: { fontSize: 11, color: Colors.muted, marginTop: 1 },

  recentSectionHeader: { fontSize: 11, fontWeight: '800', color: Colors.muted, letterSpacing: 1, marginBottom: 10 },

  contactsStack: { gap: 10, marginBottom: 20 },
  contactRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  contactRowCardSelected: { borderColor: Colors.primary, backgroundColor: '#F9FCFA' },
  avatarWrapper: { position: 'relative' },
  contactAvatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactAvatarText: { fontSize: 14, fontWeight: '900', color: Colors.white },
  badgeCheckDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  contactNameText: { fontSize: 14, fontWeight: '800', color: Colors.ink },
  contactPhoneText: { fontSize: 12, color: Colors.muted, marginTop: 1 },

  ancMemberTag: {
    backgroundColor: '#E2F4E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ancMemberTagText: { fontSize: 9, fontWeight: '900', color: Colors.primary, letterSpacing: 0.5 },

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
  currencyPrefix: { fontSize: 24, fontWeight: '800', color: '#566158', marginRight: 8 },
  amountInput: { fontSize: 44, fontWeight: '900', color: Colors.primary, minWidth: 160, textAlign: 'center' },
  availableSubText: { fontSize: 12, fontWeight: '700', color: Colors.muted, marginTop: 6 },
  greenUnderline: { width: 40, height: 3, backgroundColor: Colors.primary, borderRadius: 2, marginTop: 10 },

  pillsLayoutContainer: { marginBottom: 16 },
  pillsTopRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  pillBtn: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  pillBtnCenter: {
    width: '48%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  pillBtnSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  pillTextSelected: { color: Colors.white },

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
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
    marginBottom: 12,
  },
  arrivalVal: { fontSize: 13, fontWeight: '800', color: Colors.ink },

  fundingCard: {
    backgroundColor: '#F7F8F7',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  fundingCardTitle: { fontSize: 11, fontWeight: '800', color: Colors.muted, letterSpacing: 0.8, marginBottom: 6 },
  fundingRow: { flexDirection: 'row', alignItems: 'center' },
  ancIconBox: { width: 32, height: 32, borderRadius: 6, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  ancIconText: { fontSize: 14, fontWeight: '900', color: '#FECC00' },
  fundingName: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  fundingSub: { fontSize: 11, color: Colors.muted, marginTop: 1 },

  noteDisplayCard: {
    backgroundColor: '#F7F8F7',
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
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
