import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from '../components/Icons';
import { Colors } from '../theme/colors';

const rand = (n) => `R${Number(n || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function MembershipScreen({ finish, balance = 1500, onDeductBalance }) {
  const [amount, setAmount] = useState('250');
  const [frequency, setFrequency] = useState('Monthly');
  const [isCustom, setIsCustom] = useState(false);

  const handleSelectAmount = (val) => {
    setAmount(val);
    setIsCustom(false);
  };

  const numericAmount = parseFloat(amount) || 0;

  const handleReviewContribution = () => {
    if (numericAmount <= 0) return;
    if (onDeductBalance) {
      onDeductBalance(numericAmount, `Membership Contribution (${frequency})`);
    }
    if (finish) {
      finish(`Membership ${frequency.toLowerCase()} contribution of R${numericAmount.toFixed(2)} completed successfully!`);
    }
  };

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={s.headerSection}>
        <Text style={s.pageTitle}>Membership</Text>
        <Text style={s.pageSubtitle}>Manage your membership contribution.</Text>
      </View>

      {/* Bento Grid: Member Identity & Membership Status */}
      <View style={s.bentoGrid}>
        {/* Member Identity Card */}
        <View style={s.identityCard}>
          <View style={s.watermarkCircle} />
          <Text style={s.identityLabel}>MEMBER IDENTITY</Text>
          <Text style={s.memberName}>LERUMO THABO</Text>
          <Text style={s.memberIdCode}>ANC-1234567</Text>
        </View>

        {/* Membership Status Card */}
        <View style={s.statusCard}>
          <View style={s.statusRow}>
            <Text style={s.statusLabel}>Membership Status</Text>
            <View style={s.activeBadgePill}>
              <Text style={s.activeBadgeText}>ACTIVE</Text>
            </View>
          </View>

          <View style={s.statusRow}>
            <Text style={s.statusLabel}>Contribution Status</Text>
            <Text style={s.statusValBold}>Up to date</Text>
          </View>

          <View style={[s.statusRow, { borderBottomWidth: 0 }]}>
            <Text style={s.statusLabel}>Next Contribution</Text>
            <Text style={s.statusValBold}>31 August 2026</Text>
          </View>
        </View>
      </View>

      {/* Contribution Options Section */}
      <View style={s.cardBox}>
        <Text style={s.cardSectionTitle}>Contribution Options</Text>

        <Text style={s.fieldLabel}>Select Amount</Text>
        <View style={s.amountGrid}>
          {['50', '100', '250', '500'].map((val) => {
            const isSelected = amount === val && !isCustom;
            return (
              <TouchableOpacity
                key={val}
                style={[s.amountPill, isSelected && s.amountPillSelected]}
                onPress={() => handleSelectAmount(val)}
                activeOpacity={0.8}
              >
                <Text style={[s.amountPillText, isSelected && s.amountPillTextSelected]}>
                  R{val}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={s.fieldLabel}>Custom Amount</Text>
        <View style={s.customInputWrapper}>
          <Text style={s.customCurrencyPrefix}>R</Text>
          <TextInput
            style={s.customTextInput}
            value={amount}
            onChangeText={(val) => {
              setAmount(val);
              setIsCustom(true);
            }}
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor="#A0AEC0"
          />
        </View>
      </View>

      {/* Frequency & Payment Method Grid */}
      <View style={s.bentoGrid}>
        {/* Frequency Selector */}
        <View style={s.cardBoxFlex}>
          <Text style={s.cardSectionTitle}>Frequency</Text>
          <View style={s.radioStack}>
            {['Monthly', 'Annual', 'One-time'].map((item) => {
              const isSelected = frequency === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[s.radioRow, isSelected && s.radioRowSelected]}
                  onPress={() => setFrequency(item)}
                  activeOpacity={0.8}
                >
                  <View style={[s.radioOuterCircle, isSelected && s.radioOuterCircleSelected]}>
                    {isSelected && <View style={s.radioInnerDot} />}
                  </View>
                  <Text style={[s.radioLabel, isSelected && s.radioLabelSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Payment Method */}
        <View style={s.cardBoxFlex}>
          <Text style={s.cardSectionTitle}>Payment Method</Text>
          <View style={s.paymentMethodBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={s.walletIconCircle}>
                <Icon name="account-balance-wallet" size={20} color={Colors.primary} />
              </View>
              <View>
                <Text style={s.walletTitleBold}>ANC Member Money</Text>
                <Text style={s.walletSubLabel}>Available Balance</Text>
              </View>
            </View>
            <Text style={s.walletBalanceVal}>
              R{Number(balance).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>
      </View>

      {/* Summary & CTA Section */}
      <View style={s.cardBox}>
        <Text style={s.cardSectionTitle}>Summary</Text>

        <View style={s.summaryDashedRow}>
          <Text style={s.summaryLabel}>Membership Contribution</Text>
          <Text style={s.summaryVal}>R{numericAmount.toFixed(2)}</Text>
        </View>

        <View style={s.summaryDashedRow}>
          <Text style={s.summaryLabel}>Frequency</Text>
          <Text style={s.summaryVal}>{frequency}</Text>
        </View>

        <View style={s.summaryDashedRow}>
          <Text style={s.summaryLabel}>Next payment date</Text>
          <Text style={s.summaryVal}>31 August 2026</Text>
        </View>

        <View style={s.summaryTotalRow}>
          <Text style={s.totalTitleText}>Total</Text>
          <Text style={s.totalAmountVal}>R{numericAmount.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={s.reviewCtaBtn}
          onPress={handleReviewContribution}
          activeOpacity={0.8}
        >
          <Text style={s.reviewCtaText}>REVIEW CONTRIBUTION</Text>
          <Icon name="arrow-forward" size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 100, backgroundColor: Colors.background },

  /* HEADER */
  headerSection: { marginBottom: 20 },
  pageTitle: { fontSize: 28, fontWeight: '700', color: '#1a1c1c', fontFamily: 'Hanken Grotesk', marginBottom: 4 },
  pageSubtitle: { fontSize: 16, color: '#3e4a3f', fontFamily: 'Inter' },

  /* BENTO GRID */
  bentoGrid: { gap: 16, marginBottom: 16 },

  /* MEMBER IDENTITY CARD */
  identityCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  watermarkCircle: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 105, 51, 0.04)',
  },
  identityLabel: { fontSize: 12, fontWeight: '500', color: '#4A5568', letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'Inter' },
  memberName: { fontSize: 24, fontWeight: '600', color: '#1a1c1c', marginTop: 4, fontFamily: 'Hanken Grotesk' },
  memberIdCode: { fontSize: 14, fontWeight: '600', color: Colors.primary, marginTop: 4, fontFamily: 'Inter' },

  /* MEMBERSHIP STATUS CARD */
  statusCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  statusLabel: { fontSize: 16, color: '#3e4a3f', fontFamily: 'Inter' },
  activeBadgePill: {
    backgroundColor: 'rgba(0, 133, 66, 0.1)',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  activeBadgeText: { fontSize: 14, fontWeight: '600', color: '#008542', letterSpacing: 0.5, fontFamily: 'Inter' },
  statusValBold: { fontSize: 14, fontWeight: '600', color: '#1a1c1c', fontFamily: 'Inter' },

  /* CARD BOX CONTAINERS */
  cardBox: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardBoxFlex: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardSectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1c1c',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 8,
    marginBottom: 16,
    fontFamily: 'Hanken Grotesk',
  },

  /* AMOUNT GRID & INPUT */
  fieldLabel: { fontSize: 14, fontWeight: '600', color: '#3e4a3f', marginBottom: 8, fontFamily: 'Inter' },
  amountGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 16 },
  amountPill: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  amountPillSelected: {
    backgroundColor: 'rgba(0, 133, 66, 0.08)',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  amountPillText: { fontSize: 14, fontWeight: '600', color: '#1a1c1c', fontFamily: 'Inter' },
  amountPillTextSelected: { color: Colors.primary },

  customInputWrapper: { position: 'relative', justifyContent: 'center' },
  customCurrencyPrefix: { position: 'absolute', left: 16, fontSize: 18, color: '#4A5568', zIndex: 5, fontFamily: 'Inter' },
  customTextInput: {
    height: 48,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingLeft: 36,
    paddingRight: 16,
    fontSize: 18,
    color: '#1a1c1c',
    fontFamily: 'Inter',
  },

  /* FREQUENCY RADIO LIST */
  radioStack: { gap: 8 },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 14,
    backgroundColor: Colors.white,
  },
  radioRowSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(0, 105, 51, 0.05)',
  },
  radioOuterCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6E7A6E',
    alignItems: 'center',
    justify: 'center',
  },
  radioOuterCircleSelected: { borderColor: Colors.primary },
  radioInnerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  radioLabel: { fontSize: 16, color: '#1a1c1c', fontFamily: 'Inter' },
  radioLabelSelected: { fontWeight: '600', color: '#1a1c1c' },

  /* PAYMENT METHOD CARD */
  paymentMethodBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 12,
  },
  walletIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 105, 51, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletTitleBold: { fontSize: 16, color: '#1a1c1c', fontFamily: 'Inter' },
  walletSubLabel: { fontSize: 12, color: '#3e4a3f', marginTop: 1, fontFamily: 'Inter' },
  walletBalanceVal: { fontSize: 24, fontWeight: '600', color: '#1a1c1c', fontFamily: 'Hanken Grotesk' },

  /* SUMMARY & CTA */
  summaryDashedRow: {
    flexDirection: 'row',
    justify: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  summaryLabel: { fontSize: 16, color: '#3e4a3f', fontFamily: 'Inter' },
  summaryVal: { fontSize: 16, color: '#1a1c1c', fontFamily: 'Inter' },

  summaryTotalRow: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 4,
  },
  totalTitleText: { fontSize: 24, fontWeight: '600', color: '#1a1c1c', fontFamily: 'Hanken Grotesk' },
  totalAmountVal: { fontSize: 24, fontWeight: '600', color: Colors.primary, fontFamily: 'Hanken Grotesk' },

  reviewCtaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewCtaText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: 'Inter',
  },
});
