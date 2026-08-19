import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from '../components/Icons';
import { Colors } from '../theme/colors';

export default function TransferMoneyScreen({ finish, balance = 1500, onDeductBalance, setStepText, setNotice }) {
  const [step, setStep] = useState(1); // 1: Form | 2: Select Destination | 3: Review | 4: Success
  const [destination, setDestination] = useState('Savings Vault'); // Default destination or null
  const [showDestModal, setShowDestModal] = useState(false);
  const [amount, setAmount] = useState('0.00');
  const [isCustomInput, setIsCustomInput] = useState(false);

  const destinations = [
    { id: '1', title: 'Savings Vault', desc: 'ANC Member Savings (3.5% APY)', icon: 'savings', balance: 'R4,200.00' },
    { id: '2', title: 'ANC Community Fund', desc: 'Local Branch Development Fund', icon: 'account-balance', balance: 'R0.00' },
    { id: '3', title: 'Linked Bank Account', desc: 'Standard Bank •••• 1092', icon: 'credit-card', balance: 'External' },
  ];

  const handleSelectAmountPill = (val) => {
    setAmount(val);
    setIsCustomInput(false);
  };

  const numericAmount = parseFloat(amount) || 0;
  const isValidAmount = numericAmount > 0 && numericAmount <= balance;

  const handleTransferSubmit = () => {
    if (!isValidAmount) return;

    if (step === 1) {
      setStep(3); // Go to review step
      if (setStepText) setStepText('STEP 2 OF 2');
    } else if (step === 3) {
      // Execute Transfer
      if (onDeductBalance) {
        onDeductBalance(numericAmount, `Transfer to ${destination}`);
      }
      setStep(4); // Success step
    }
  };

  const handleDone = () => {
    if (finish) finish(`R${numericAmount.toFixed(2)} transferred to ${destination}!`);
  };

  // STEP 4: SUCCESS VIEW
  if (step === 4) {
    return (
      <ScrollView contentContainerStyle={s.successContent} showsVerticalScrollIndicator={false}>
        <View style={s.successBadgeCircle}>
          <Icon name="check" size={36} color={Colors.white} />
        </View>
        <Text style={s.successTitle}>Transfer Successful!</Text>
        <Text style={s.successSubText}>Your internal transfer has been processed immediately.</Text>

        <View style={s.receiptCard}>
          <Text style={s.receiptHeroAmount}>R{numericAmount.toFixed(2)}</Text>
          <View style={s.receiptDivider} />
          
          <View style={s.receiptRow}>
            <Text style={s.receiptLabel}>From</Text>
            <Text style={s.receiptVal}>Main Wallet</Text>
          </View>
          
          <View style={s.receiptRow}>
            <Text style={s.receiptLabel}>To Destination</Text>
            <Text style={s.receiptVal}>{destination}</Text>
          </View>

          <View style={s.receiptRow}>
            <Text style={s.receiptLabel}>Transfer Fee</Text>
            <Text style={[s.receiptVal, { color: '#008542' }]}>Free</Text>
          </View>

          <View style={s.receiptRow}>
            <Text style={s.receiptLabel}>Reference ID</Text>
            <Text style={s.receiptVal}>TRF-{Math.floor(100000 + Math.random() * 900000)}</Text>
          </View>
        </View>

        <TouchableOpacity style={s.doneGreenBtn} onPress={handleDone} activeOpacity={0.8}>
          <Text style={s.doneGreenBtnText}>Done</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // STEP 3: REVIEW TRANSFER STEP
  if (step === 3) {
    return (
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Top Progress Line */}
        <View style={s.topProgressLineBg}>
          <View style={[s.topProgressLineFill, { width: '100%' }]} />
        </View>
        <Text style={s.stepSubHeader}>STEP 2 OF 2</Text>

        <View style={s.reviewCardBox}>
          <Text style={s.reviewCardLabel}>TOTAL TRANSFER AMOUNT</Text>
          <Text style={s.reviewHeroAmount}>R{numericAmount.toFixed(2)}</Text>
          
          <View style={s.receiptDivider} />

          <View style={s.receiptRow}>
            <Text style={s.receiptLabel}>From Account</Text>
            <Text style={s.receiptVal}>Main Wallet (R{balance.toFixed(2)})</Text>
          </View>

          <View style={s.receiptRow}>
            <Text style={s.receiptLabel}>To Destination</Text>
            <Text style={s.receiptVal}>{destination}</Text>
          </View>

          <View style={s.receiptRow}>
            <Text style={s.receiptLabel}>Transfer Fee</Text>
            <Text style={[s.receiptVal, { color: '#008542' }]}>Free</Text>
          </View>

          <View style={s.receiptRow}>
            <Text style={s.receiptLabel}>Processing Time</Text>
            <Text style={s.receiptVal}>Instant</Text>
          </View>
        </View>

        <TouchableOpacity style={s.actionGreenBtn} onPress={handleTransferSubmit} activeOpacity={0.8}>
          <Text style={s.actionGreenBtnText}>Confirm & Transfer R{numericAmount.toFixed(2)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.backOutlineBtn} onPress={() => setStep(1)} activeOpacity={0.8}>
          <Text style={s.backOutlineBtnText}>Back to Edit</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // STEP 1: TRANSFER FORM (MATCHES SCREENSHOT 2 100%)
  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Top Green Progress Line (50%) */}
      <View style={s.topProgressLineBg}>
        <View style={[s.topProgressLineFill, { width: '50%' }]} />
      </View>
      <Text style={s.stepSubHeader}>STEP 1 OF 2</Text>

      {/* FROM / TO ACCOUNTS CARD CONTAINER */}
      <View style={s.accountsWrapper}>
        {/* FROM CARD */}
        <View style={s.accountCardFrom}>
          <View style={s.squircleIconBox}>
            <Icon name="account-balance-wallet" size={20} color="#4A5568" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.accountSubLabel}>From</Text>
            <Text style={s.accountTitleBold}>Main Wallet</Text>
          </View>
          <Text style={s.accountBalanceText}>
            R{Number(balance).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>

        {/* SWAP ICON BADGE */}
        <View style={s.swapBadgeCircle}>
          <Icon name="swap-vert" size={18} color="#4A5568" />
        </View>

        {/* TO CARD (DASHED GREEN BORDER) */}
        <TouchableOpacity
          style={s.accountCardToDashed}
          onPress={() => setShowDestModal(true)}
          activeOpacity={0.85}
        >
          <View style={s.squircleIconBoxGreen}>
            <Icon name="account-balance" size={20} color="#008542" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.accountSubLabel}>To</Text>
            <Text style={s.accountTitleGreen}>{destination || 'Select destination'}</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#4A5568" />
        </TouchableOpacity>
      </View>

      {/* ENTER AMOUNT SECTION */}
      <Text style={s.enterAmountLabel}>Enter Amount</Text>
      
      <View style={s.amountRowContainer}>
        <Text style={s.currencySymbol}>R</Text>
        <TextInput
          style={s.amountTextInput}
          value={amount}
          onChangeText={(val) => {
            setAmount(val);
            setIsCustomInput(true);
          }}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor="#A0AEC0"
        />
      </View>

      {/* AVAILABLE BALANCE PILL */}
      <View style={s.availablePillBadge}>
        <Text style={s.availablePillText}>
          Available: R{Number(balance).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      </View>

      {/* QUICK PRESET PILLS GRID */}
      <View style={s.presetGridRow}>
        {['50', '100', '250', '500'].map((val) => {
          const isSelected = amount === val && !isCustomInput;
          return (
            <TouchableOpacity
              key={val}
              style={[s.presetPillCard, isSelected && s.presetPillCardActive]}
              onPress={() => handleSelectAmountPill(val)}
              activeOpacity={0.8}
            >
              <Text style={[s.presetPillText, isSelected && s.presetPillTextActive]}>R{val}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* SUMMARY BREAKDOWN */}
      <View style={s.dividerLine} />

      <View style={s.summaryRow}>
        <Text style={s.summaryLabel}>Transfer fee</Text>
        <Text style={s.summaryFreeText}>Free</Text>
      </View>

      <View style={s.summaryRow}>
        <Text style={s.summaryLabelBold}>Total</Text>
        <Text style={s.summaryTotalVal}>R{numericAmount.toFixed(2)}</Text>
      </View>

      {/* REVIEW TRANSFER BUTTON */}
      <TouchableOpacity
        style={[s.reviewBtnDisabled, isValidAmount && s.reviewBtnActive]}
        onPress={handleTransferSubmit}
        disabled={!isValidAmount}
        activeOpacity={0.8}
      >
        <Text style={[s.reviewBtnTextDisabled, isValidAmount && s.reviewBtnTextActive]}>
          Review Transfer
        </Text>
      </TouchableOpacity>

      {/* LOCK SECURITY FOOTER */}
      <View style={s.securityFooterRow}>
        <Icon name="lock-outline" size={14} color="#6E7A6E" />
        <Text style={s.securityFooterText}>Secure internal transfer</Text>
      </View>

      {/* SELECT DESTINATION MODAL */}
      <Modal visible={showDestModal} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalContainer}>
            <View style={s.modalHeaderRow}>
              <Text style={s.modalTitle}>Select Destination</Text>
              <TouchableOpacity onPress={() => setShowDestModal(false)}>
                <Icon name="close" size={22} color="#1A1C1C" />
              </TouchableOpacity>
            </View>

            {destinations.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[s.destOptionRow, destination === item.title && s.destOptionRowActive]}
                onPress={() => {
                  setDestination(item.title);
                  setShowDestModal(false);
                }}
                activeOpacity={0.8}
              >
                <View style={s.destIconBox}>
                  <Icon name={item.icon} size={20} color={Colors.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={s.destTitleBold}>{item.title}</Text>
                  <Text style={s.destDescSub}>{item.desc}</Text>
                </View>
                {destination === item.title && (
                  <Icon name="check-circle" size={20} color="#008542" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 90, backgroundColor: Colors.background },

  /* TOP PROGRESS BAR */
  topProgressLineBg: { height: 3, backgroundColor: '#E2E8F0', width: '100%', marginBottom: 8 },
  topProgressLineFill: { height: '100%', backgroundColor: '#006933' },
  stepSubHeader: { fontSize: 12, fontWeight: '800', color: '#6E7A6E', letterSpacing: 1.2, textAlign: 'center', marginBottom: 16, fontFamily: 'Inter' },

  /* ACCOUNTS WRAPPER */
  accountsWrapper: { marginBottom: 24, position: 'relative' },
  
  accountCardFrom: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  squircleIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F0F3F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountSubLabel: { fontSize: 12, color: '#6E7A6E', fontFamily: 'Inter' },
  accountTitleBold: { fontSize: 15, fontWeight: '800', color: '#1A1C1C', marginTop: 1, fontFamily: 'Inter' },
  accountBalanceText: { fontSize: 15, fontWeight: '900', color: '#1A1C1C', fontFamily: 'Inter' },

  swapBadgeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -16,
    zIndex: 10,
  },

  accountCardToDashed: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F2',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#008542',
    borderStyle: 'dashed',
    padding: 16,
  },
  squircleIconBoxGreen: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountTitleGreen: { fontSize: 15, fontWeight: '800', color: '#008542', marginTop: 1, fontFamily: 'Inter' },

  /* AMOUNT SECTION */
  enterAmountLabel: { fontSize: 13, color: '#4A5568', textAlign: 'center', marginBottom: 8, fontFamily: 'Inter' },
  amountRowContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  currencySymbol: { fontSize: 28, fontWeight: '800', color: '#4A5568', marginRight: 10, fontFamily: 'Inter' },
  amountTextInput: { fontSize: 44, fontWeight: '900', color: '#1A1C1C', textAlign: 'center', minWidth: 120, fontFamily: 'Inter' },

  availablePillBadge: {
    backgroundColor: '#F0F9F2',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 14,
    alignSelf: 'center',
    marginBottom: 20,
  },
  availablePillText: { fontSize: 12, fontWeight: '800', color: '#008542', fontFamily: 'Inter' },

  /* PRESET PILLS */
  presetGridRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 24 },
  presetPillCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  presetPillCardActive: { borderColor: '#008542', backgroundColor: '#F0F9F2', borderWidth: 2 },
  presetPillText: { fontSize: 14, fontWeight: '800', color: '#1A1C1C', fontFamily: 'Inter' },
  presetPillTextActive: { color: '#008542' },

  /* SUMMARY */
  dividerLine: { height: 1, backgroundColor: '#E2E8F0', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: '#4A5568', fontFamily: 'Inter' },
  summaryFreeText: { fontSize: 14, fontWeight: '800', color: '#008542', fontFamily: 'Inter' },
  summaryLabelBold: { fontSize: 15, fontWeight: '800', color: '#1A1C1C', fontFamily: 'Inter' },
  summaryTotalVal: { fontSize: 16, fontWeight: '900', color: '#1A1C1C', fontFamily: 'Inter' },

  /* REVIEW BUTTON */
  reviewBtnDisabled: {
    backgroundColor: '#EFEFEF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  reviewBtnActive: { backgroundColor: Colors.primary },
  reviewBtnTextDisabled: { color: '#A0AEC0', fontSize: 15, fontWeight: '800', fontFamily: 'Inter' },
  reviewBtnTextActive: { color: Colors.white },

  securityFooterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  securityFooterText: { fontSize: 12, color: '#6E7A6E', fontFamily: 'Inter' },

  /* MODAL STYLES */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#1A1C1C', fontFamily: 'Hanken Grotesk' },
  destOptionRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 10 },
  destOptionRowActive: { borderColor: '#008542', backgroundColor: '#F0F9F2' },
  destIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F3F0', alignItems: 'center', justifyContent: 'center' },
  destTitleBold: { fontSize: 14, fontWeight: '800', color: '#1A1C1C', fontFamily: 'Inter' },
  destDescSub: { fontSize: 12, color: '#4A5568', marginTop: 1, fontFamily: 'Inter' },

  /* REVIEW & SUCCESS STEP STYLES */
  reviewCardBox: { backgroundColor: Colors.white, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 20, marginBottom: 20 },
  reviewCardLabel: { fontSize: 11, fontWeight: '900', color: '#6E7A6E', letterSpacing: 1, marginBottom: 4, fontFamily: 'Inter' },
  reviewHeroAmount: { fontSize: 36, fontWeight: '900', color: '#1A1C1C', marginBottom: 16, fontFamily: 'Inter' },

  receiptCard: { backgroundColor: Colors.white, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 20, width: '100%', marginBottom: 24 },
  receiptHeroAmount: { fontSize: 36, fontWeight: '900', color: Colors.primary, textAlign: 'center', marginBottom: 12, fontFamily: 'Inter' },
  receiptDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 12 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  receiptLabel: { fontSize: 13, color: '#4A5568', fontFamily: 'Inter' },
  receiptVal: { fontSize: 13, fontWeight: '800', color: '#1A1C1C', fontFamily: 'Inter' },

  actionGreenBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  actionGreenBtnText: { color: Colors.white, fontSize: 15, fontWeight: '800', fontFamily: 'Inter' },
  backOutlineBtn: { backgroundColor: Colors.white, borderRadius: 12, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  backOutlineBtnText: { color: '#1A1C1C', fontSize: 15, fontWeight: '800', fontFamily: 'Inter' },

  successContent: { padding: 24, paddingBottom: 90, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  successBadgeCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: '900', color: '#1A1C1C', marginBottom: 6, fontFamily: 'Hanken Grotesk' },
  successSubText: { fontSize: 14, color: '#4A5568', textAlign: 'center', marginBottom: 24, fontFamily: 'Inter' },
  doneGreenBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 16, width: '100%', alignItems: 'center' },
  doneGreenBtnText: { color: Colors.white, fontSize: 15, fontWeight: '800', fontFamily: 'Inter' },
});
