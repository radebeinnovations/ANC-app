import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import Field from '../components/Field';
import { Icon } from '../components/Icons';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';

const AVATAR_1 = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
const AVATAR_2 = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
const AVATAR_3 = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80';
const AVATAR_4 = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

export default function SendMoneyScreen({ finish, balance = 1500, onDeductBalance, setStepText }) {
  const [step, setStep] = useState(1); // 1: Select Recipient -> 2: Enter Amount -> 3: Success Screen
  const [search, setSearch] = useState('');
  const [selectedContactId, setSelectedContactId] = useState('a1');
  const [amount, setAmount] = useState('100.00');
  const [note, setNote] = useState('');
  const [transferSpeed, setTransferSpeed] = useState('instant'); // 'instant' | 'standard'

  // Manual Contact Modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualIsMember, setManualIsMember] = useState(true);

  // Success Animated Tick Values (Web Safe)
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (step === 3) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: false,
      }).start();
    }
  }, [step, scaleAnim]);

  // Recent Recipients
  const recentRecipients = [
    { id: 'r1', name: 'Thandi M.', avatar: AVATAR_1 },
    { id: 'r2', name: 'Sipho K.', avatar: AVATAR_2 },
    { id: 'r3', name: 'Lerato', isInitial: true, initialLetter: 'L', bg: '#006933' },
    { id: 'r4', name: 'Kagiso P.', avatar: AVATAR_3 },
  ];

  // Grouped Contacts List (Alphabetical A & M)
  const [contacts, setContacts] = useState([
    {
      group: 'A',
      items: [
        {
          id: 'a1',
          name: 'Anele Mandela',
          phone: '+27 82 123 4567',
          initials: 'AM',
          isMember: false,
        },
      ],
    },
    {
      group: 'M',
      items: [
        {
          id: 'm1',
          name: 'Mbali Zulu',
          phone: '+27 73 987 6543',
          avatar: AVATAR_4,
          isMember: true,
        },
      ],
    },
  ]);

  const fee = transferSpeed === 'instant' ? 1.50 : 0.00;
  const numAmount = parseFloat(amount) || 100.00;

  // Selected contact object
  const allContactsFlat = [
    ...contacts.flatMap(g => g.items),
    ...recentRecipients.map(r => ({ id: r.id, name: r.name, phone: '+27 82 555 0192', isMember: true, avatar: r.avatar }))
  ];
  const activeContact = allContactsFlat.find(c => c.id === selectedContactId) || allContactsFlat[0];

  useEffect(() => {
    if (setStepText) {
      if (step === 1) setStepText('STEP 1 OF 3');
      else if (step === 2) setStepText('Step 2 of 3');
      else setStepText('');
    }
  }, [step, setStepText]);

  const handleSaveManualContact = () => {
    if (!manualName.trim()) return;

    const newContact = {
      id: `m_${Date.now()}`,
      name: manualName.trim(),
      phone: manualPhone.trim() || '+27 82 000 0000',
      initials: manualName.slice(0, 2).toUpperCase(),
      isMember: manualIsMember,
    };

    setContacts(prev => [
      ...prev,
      { group: 'N', items: [newContact] }
    ]);
    setSelectedContactId(newContact.id);
    setShowManualModal(false);
    setManualName('');
    setManualPhone('');
    setStep(2);
  };

  const handleConfirmSend = () => {
    const totalDeduction = numAmount + fee;
    if (onDeductBalance) {
      onDeductBalance(totalDeduction, `Transfer to ${activeContact.name}`);
    }
    setStep(3); // Go to Success Screen
  };

  // STEP 1 OF 3: RECIPIENT SELECTION
  if (step === 1) {
    return (
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Step Title & Subtitle */}
        <Text style={s.pageHeadline}>Who are you sending to?</Text>
        <Text style={s.pageSubText}>Select a contact from your list or search for a new recipient by name or phone number.</Text>

        {/* Search Bar */}
        <View style={s.searchContainer}>
          <Icon name="search" size={18} color="#6E7A6E" />
          <TextInput
            style={s.searchInputText}
            placeholder="Search name, phone, or ANC ID"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#8C988F"
          />
        </View>

        {/* RECENT RECIPIENTS SECTION */}
        <Text style={s.sectionCategoryHeader}>RECENT RECIPIENTS</Text>
        <View style={s.recentRow}>
          {recentRecipients.map(r => (
            <TouchableOpacity
              key={r.id}
              style={s.recentAvatarCard}
              onPress={() => {
                setSelectedContactId(r.id);
                setStep(2);
              }}
              activeOpacity={0.8}
            >
              {r.isInitial ? (
                <View style={[s.recentInitialSquare, { backgroundColor: r.bg }]}>
                  <Text style={s.recentInitialText}>{r.initialLetter}</Text>
                </View>
              ) : (
                <Image source={{ uri: r.avatar }} style={s.recentAvatarImg} />
              )}
              <Text style={s.recentNameText} numberOfLines={1}>{r.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ALPHABETICAL CONTACTS LIST */}
        {contacts.map(group => (
          <View key={group.group} style={s.contactGroupContainer}>
            <View style={s.groupHeaderBar}>
              <Text style={s.groupHeaderText}>{group.group}</Text>
            </View>

            <View style={s.groupBodyCard}>
              {group.items.map(c => {
                const isSelected = selectedContactId === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[s.contactListItemRow, isSelected && s.contactListItemSelected]}
                    onPress={() => setSelectedContactId(c.id)}
                    activeOpacity={0.8}
                  >
                    {/* Radio Button */}
                    <View style={s.radioOuter}>
                      {isSelected && <View style={s.radioInner} />}
                    </View>

                    {/* Avatar / Initials */}
                    {c.avatar ? (
                      <Image source={{ uri: c.avatar }} style={s.contactAvatarSquare} />
                    ) : (
                      <View style={s.contactInitialsSquare}>
                        <Text style={s.contactInitialsText}>{c.initials}</Text>
                      </View>
                    )}

                    {/* Contact Info */}
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={s.contactNameBold}>{c.name}</Text>
                      <Text style={s.contactPhoneSub}>{c.phone}</Text>
                    </View>

                    {/* MEMBER Badge Tag */}
                    {c.isMember && (
                      <View style={s.memberGreenBadge}>
                        <Text style={s.memberGreenBadgeText}>MEMBER</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Enter Details Manually Button */}
        <TouchableOpacity style={s.manualAddBtn} onPress={() => setShowManualModal(true)} activeOpacity={0.8}>
          <Text style={s.manualAddBtnText}>+ Enter details manually</Text>
        </TouchableOpacity>

        {/* Continue Button */}
        <Button text="CONTINUE  →" onPress={() => setStep(2)} />

        <YamiFooter />

        {/* MANUAL DETAILS MODAL */}
        <Modal visible={showManualModal} animationType="slide" transparent>
          <View style={s.modalBackdrop}>
            <View style={s.modalCard}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>Enter Recipient Details</Text>
                <TouchableOpacity onPress={() => setShowManualModal(false)}>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.muted }}>✕</Text>
                </TouchableOpacity>
              </View>

              <Field label="FULL NAME" value={manualName} onChangeText={setManualName} placeholder="e.g. Sipho Mandela" />
              <Field label="PHONE NUMBER OR ANC ID" value={manualPhone} onChangeText={setManualPhone} placeholder="e.g. +27 83 123 4567" keyboardType="phone-pad" />

              <TouchableOpacity style={s.memberToggleRow} onPress={() => setManualIsMember(!manualIsMember)} activeOpacity={0.8}>
                <Icon name={manualIsMember ? "check-box" : "check-box-outline-blank"} size={20} color={Colors.primary} />
                <Text style={s.memberToggleText}>Recipient is a registered ANC Member</Text>
              </TouchableOpacity>

              <Button text="Save Recipient" onPress={handleSaveManualContact} disabled={!manualName.trim()} />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }

  // STEP 2 OF 3: ENTER AMOUNT & SPEED OPTIONS (Exact 1:1 Match)
  if (step === 2) {
    return (
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Selected Recipient Chip Card with Pencil */}
        <View style={s.recipientChipCard}>
          <Image source={{ uri: activeContact.avatar || AVATAR_3 }} style={s.chipAvatarImg} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={s.chipNameText}>Lerumo Maisela</Text>
            <Text style={s.chipIdSub}>ANC-1234567</Text>
          </View>
          <TouchableOpacity onPress={() => setStep(1)} activeOpacity={0.7}>
            <Icon name="edit" size={18} color="#4A5568" />
          </TouchableOpacity>
        </View>

        {/* Available Balance Box */}
        <View style={s.availBalanceBox}>
          <View style={s.walletIconSq}>
            <Icon name="account-balance-wallet" size={20} color={Colors.white} />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={s.availBalLabel}>Available Balance</Text>
            <Text style={s.availBalVal}>R1,500.00</Text>
          </View>
        </View>

        {/* Perfectly Centered Amount Display (Strict Web Width Bounds) */}
        <View style={s.amountContainerWebFlex}>
          <Text style={s.amountGreenRText}>R</Text>
          <TextInput
            style={s.amountTextInputWeb}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            maxLength={8}
          />
        </View>

        {/* Quick Amount Pills */}
        <View style={s.quickPillsRow}>
          {['50', '100', '250', '500'].map(val => (
            <TouchableOpacity
              key={val}
              style={[s.quickPillBtn, amount === `${val}.00` && s.quickPillBtnActive]}
              onPress={() => setAmount(`${val}.00`)}
              activeOpacity={0.8}
            >
              <Text style={[s.quickPillText, amount === `${val}.00` && s.quickPillTextActive]}>R{val}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reference / Note Field */}
        <Text style={s.fieldGroupLabel}>Add a reference or note (Optional)</Text>
        <View style={s.referenceInputContainer}>
          <Icon name="notes" size={18} color="#6E7A6E" />
          <TextInput
            style={s.referenceInputText}
            placeholder="e.g., Monthly contribution"
            value={note}
            onChangeText={setNote}
            placeholderTextColor="#8C988F"
          />
        </View>

        {/* Transfer Speed Section */}
        <Text style={s.fieldGroupLabel}>Transfer Speed</Text>
        <View style={s.speedOptionsColumn}>
          {/* Option 1: Instant */}
          <TouchableOpacity
            style={[s.speedOptionCard, transferSpeed === 'instant' && s.speedOptionCardActive]}
            onPress={() => setTransferSpeed('instant')}
            activeOpacity={0.8}
          >
            <View style={s.radioOuter}>
              {transferSpeed === 'instant' && <View style={s.radioInner} />}
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={s.speedTitleBold}>Instant</Text>
              <Text style={s.speedSubText}>Arrives immediately</Text>
            </View>
            <Text style={s.speedFeeText}>R1.50 fee</Text>
          </TouchableOpacity>

          {/* Option 2: Standard */}
          <TouchableOpacity
            style={[s.speedOptionCard, transferSpeed === 'standard' && s.speedOptionCardActive]}
            onPress={() => setTransferSpeed('standard')}
            activeOpacity={0.8}
          >
            <View style={s.radioOuter}>
              {transferSpeed === 'standard' && <View style={s.radioInner} />}
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={s.speedTitleBold}>Standard</Text>
              <Text style={s.speedSubText}>Arrives in 1-2 business days</Text>
            </View>
            <Text style={s.speedFeeText}>Free</Text>
          </TouchableOpacity>
        </View>

        {/* Action Button */}
        <Button text="Review Transfer  →" onPress={handleConfirmSend} />
      </ScrollView>
    );
  }

  // STEP 3: SUCCESS / CONFIRMATION SCREEN (Web Safe Animated)
  return (
    <ScrollView contentContainerStyle={s.successContent} showsVerticalScrollIndicator={false}>
      {/* Animated Light Green Outer Container Box with Green Squircle Checkmark */}
      <Animated.View
        style={[
          s.successOuterBox,
          {
            transform: [
              {
                scale: scaleAnim,
              },
            ],
          },
        ]}
      >
        <View style={s.successCheckSquircle}>
          <View style={s.whiteCheckCircle}>
            <Icon name="check" size={28} color="#006933" />
          </View>
        </View>
      </Animated.View>

      {/* Headline & Confirmation Message */}
      <Text style={s.successHeadline}>Money Sent</Text>
      <Text style={s.successSubMessage}>
        R{numAmount.toFixed(2)} successfully sent to <Text style={s.greenBoldRecipient}>Lerumo Thabo.</Text>
      </Text>

      {/* Transaction Details Box */}
      <View style={s.receiptCardBox}>
        <View style={s.receiptRow}>
          <Text style={s.receiptLabel}>Date & Time</Text>
          <Text style={s.receiptVal}>Oct 24, 2023 14:30</Text>
        </View>

        <View style={s.receiptRow}>
          <Text style={s.receiptLabel}>Amount</Text>
          <Text style={s.receiptValBold}>R{numAmount.toFixed(2)}</Text>
        </View>

        <View style={[s.receiptRow, { borderBottomWidth: 0 }]}>
          <Text style={s.receiptLabel}>Transaction Ref</Text>
          <Text style={s.receiptRefGreen}>ANC–TXN–88291</Text>
        </View>
      </View>

      {/* Done Button */}
      <Button text="Done" onPress={() => finish(`Sent R${numAmount.toFixed(2)} to Lerumo Thabo`)} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 90, backgroundColor: Colors.background },
  successContent: { padding: 24, paddingBottom: 90, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },

  pageHeadline: { fontSize: 26, fontWeight: '900', color: '#1A1C1C', marginBottom: 6, marginTop: 6 },
  pageSubText: { fontSize: 14, color: '#4A5568', lineHeight: 20, marginBottom: 16 },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  searchInputText: { flex: 1, fontSize: 14, color: '#1A1C1C', marginLeft: 8 },

  sectionCategoryHeader: { fontSize: 11, fontWeight: '800', color: '#6E7A6E', letterSpacing: 1, marginBottom: 12 },

  recentRow: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  recentAvatarCard: { alignItems: 'center', width: 64 },
  recentAvatarImg: { width: 56, height: 56, borderRadius: 16 },
  recentInitialSquare: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  recentInitialText: { fontSize: 20, fontWeight: '900', color: Colors.white },
  recentNameText: { fontSize: 12, fontWeight: '700', color: '#1A1C1C', marginTop: 6, textAlign: 'center' },

  contactGroupContainer: { marginBottom: 16 },
  groupHeaderBar: { backgroundColor: '#EEEEEE', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginBottom: 6 },
  groupHeaderText: { fontSize: 13, fontWeight: '800', color: '#4A5568' },
  groupBodyCard: { backgroundColor: Colors.white, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },

  contactListItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F0',
  },
  contactListItemSelected: { backgroundColor: '#F0F9F2' },

  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },

  contactAvatarSquare: { width: 40, height: 40, borderRadius: 10, marginLeft: 12 },
  contactInitialsSquare: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  contactInitialsText: { fontSize: 14, fontWeight: '800', color: '#4A5568' },

  contactNameBold: { fontSize: 15, fontWeight: '800', color: '#1A1C1C' },
  contactPhoneSub: { fontSize: 12, color: '#4A5568', marginTop: 2 },

  memberGreenBadge: { backgroundColor: '#E2F4E5', borderRadius: 4, paddingVertical: 2, paddingHorizontal: 8 },
  memberGreenBadgeText: { color: Colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },

  manualAddBtn: { paddingVertical: 12, alignItems: 'center', marginBottom: 14 },
  manualAddBtnText: { color: Colors.primary, fontSize: 14, fontWeight: '800' },

  /* STEP 2 STYLES */
  recipientChipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F1',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E6E1',
    marginBottom: 16,
    marginTop: 6,
  },
  chipAvatarImg: { width: 40, height: 40, borderRadius: 10 },
  chipNameText: { fontSize: 15, fontWeight: '800', color: '#1A1C1C' },
  chipIdSub: { fontSize: 12, color: '#4A5568', marginTop: 1 },

  availBalanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8F6',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  walletIconSq: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  availBalLabel: { fontSize: 11, color: '#4A5568', fontWeight: '700' },
  availBalVal: { fontSize: 18, fontWeight: '900', color: '#1A1C1C', marginTop: 1 },

  amountContainerWebFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 18,
    width: '100%',
  },
  amountGreenRText: { fontSize: 34, fontWeight: '900', color: '#006933', marginRight: 8 },
  amountTextInputWeb: {
    fontSize: 42,
    fontWeight: '900',
    color: '#1A1C1C',
    borderWidth: 0,
    outlineStyle: 'none',
    backgroundColor: 'transparent',
    textAlign: 'left',
    padding: 0,
    margin: 0,
    width: 160,
  },

  quickPillsRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 24 },
  quickPillBtn: { backgroundColor: Colors.white, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  quickPillBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  quickPillText: { fontSize: 14, fontWeight: '800', color: '#1A1C1C' },
  quickPillTextActive: { color: Colors.white },

  fieldGroupLabel: { fontSize: 13, fontWeight: '800', color: '#4A5568', marginBottom: 8 },
  referenceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  referenceInputText: { flex: 1, fontSize: 14, color: '#1A1C1C', marginLeft: 8 },

  speedOptionsColumn: { gap: 10, marginBottom: 24 },
  speedOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  speedOptionCardActive: { borderColor: Colors.primary, borderWidth: 2, backgroundColor: '#F9FCFA' },
  speedTitleBold: { fontSize: 15, fontWeight: '800', color: '#1A1C1C' },
  speedSubText: { fontSize: 12, color: '#4A5568', marginTop: 2 },
  speedFeeText: { fontSize: 14, fontWeight: '800', color: '#1A1C1C' },

  /* SUCCESS SCREEN STYLES */
  successOuterBox: {
    width: 160,
    height: 160,
    borderRadius: 28,
    backgroundColor: '#E5F3E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  successCheckSquircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#006933',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  whiteCheckCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  successHeadline: { fontSize: 26, fontWeight: '900', color: '#1A1C1C', marginBottom: 8 },
  successSubMessage: { fontSize: 15, color: '#4A5568', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  greenBoldRecipient: { color: Colors.primary, fontWeight: '800' },

  receiptCardBox: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F0',
  },
  receiptLabel: { fontSize: 13, color: '#4A5568', fontWeight: '600' },
  receiptVal: { fontSize: 14, fontWeight: '800', color: '#1A1C1C' },
  receiptValBold: { fontSize: 16, fontWeight: '900', color: '#1A1C1C' },
  receiptRefGreen: { fontSize: 14, fontWeight: '900', color: Colors.primary },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.55)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#1A1C1C' },
  memberToggleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 14 },
  memberToggleText: { fontSize: 13, fontWeight: '700', color: '#1A1C1C' },
});
