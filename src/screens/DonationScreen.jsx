import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import { Icon } from '../components/Icons';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';

const COMMUNITY_HERO_IMG = require('../assets/community_garden.jpg');
const NATIONAL_FUND_IMG = require('../assets/community_hero_banner.png');

export default function DonationScreen({ finish, cards = [], balance = 1500, onDeductBalance, setStepText }) {
  const [step, setStep] = useState(0); // 0: Dashboard -> 1: Campaign Details -> 2: Make Donation Form -> 3: Review -> 4: Success
  const [selectedCause, setSelectedCause] = useState('Community Development');
  const [frequency, setFrequency] = useState('one-time'); // 'one-time' | 'monthly'
  const [amount, setAmount] = useState('250');
  const [customAmount, setCustomAmount] = useState('');

  // Web-Safe Animated values for Success Receipt checkmark
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (step === 4) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: false,
      }).start();
    }
  }, [step, scaleAnim]);

  useEffect(() => {
    if (setStepText) {
      if (step === 3) setStepText('Step 3 of 3');
      else setStepText('');
    }
  }, [step, setStepText]);

  const causes = [
    { id: 'c1', title: 'National Fund', icon: 'account-balance' },
    { id: 'c2', title: 'Community Programmes', icon: 'groups' },
    { id: 'c3', title: 'Youth Development', icon: 'school' },
    { id: 'c4', title: 'Women\'s Development', icon: 'person' },
    { id: 'c5', title: 'Election Campaign', icon: 'how-to-vote' },
    { id: 'c6', title: 'Humanitarian Support', icon: 'volunteer-activism' },
  ];

  const recentContributions = [
    { id: 'rc1', title: 'National Fund', date: '12 Aug 2026', amount: 'R100' },
    { id: 'rc2', title: 'Youth Development', date: '04 Jul 2026', amount: 'R250' },
  ];

  const activeAmount = customAmount ? customAmount : amount;
  const numAmount = parseFloat(activeAmount) || 250;

  const handleConfirmDonate = () => {
    if (onDeductBalance) {
      onDeductBalance(numAmount, `Donation: ${selectedCause}`);
    }
    setStep(4);
  };

  // STEP 0: DONATIONS DASHBOARD (Exact 1:1 Match to Screen 1)
  if (step === 0) {
    return (
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <Text style={s.pageTitle}>Donations</Text>
        <Text style={s.pageSubText}>Support the work happening in communities across South Africa.</Text>

        {/* Featured Campaign Card */}
        <View style={s.featuredCard}>
          <Image source={COMMUNITY_HERO_IMG} style={s.featuredImg} />
          
          <View style={s.featuredBody}>
            <View style={s.starBadgeRow}>
              <Icon name="star" size={16} color={Colors.primary} />
              <Text style={s.starBadgeText}>FEATURED CAMPAIGN</Text>
            </View>

            <Text style={s.featuredTitle}>NATIONAL FUND</Text>
            <Text style={s.featuredSubText}>Help support programmes and initiatives serving communities.</Text>

            {/* Progress Bar & Stats */}
            <View style={s.progressTextRow}>
              <Text style={s.raisedBoldText}>R1.8M raised</Text>
              <Text style={s.goalSubText}>of R3M goal</Text>
            </View>

            <View style={s.progressBarBg}>
              <View style={[s.progressBarFill, { width: '60%' }]} />
            </View>

            <TouchableOpacity
              style={s.donateNowGreenBtn}
              onPress={() => {
                setSelectedCause('National Fund');
                setStep(1);
              }}
              activeOpacity={0.8}
            >
              <Text style={s.donateNowBtnText}>Donate Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support a Cause Section (6 Grid) */}
        <Text style={s.sectionHeaderTitle}>Support a Cause</Text>
        <View style={s.causeGridContainer}>
          {causes.map(c => (
            <TouchableOpacity
              key={c.id}
              style={s.causeCard}
              onPress={() => {
                setSelectedCause(c.title);
                setStep(1);
              }}
              activeOpacity={0.8}
            >
              <View style={s.causeIconCircle}>
                <Icon name={c.icon} size={22} color="#1A1C1C" />
              </View>
              <Text style={s.causeCardTitle}>{c.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Your Contributions Section */}
        <Text style={s.sectionHeaderTitle}>Your Contributions</Text>
        <View style={s.contributionsCardBox}>
          {recentContributions.map((item, index) => (
            <View
              key={item.id}
              style={[
                s.contributionRow,
                index < recentContributions.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={s.receiptIconCircle}>
                  <Icon name="receipt-long" size={18} color="#4A5568" />
                </View>
                <View>
                  <Text style={s.contribTitleBold}>{item.title}</Text>
                  <Text style={s.contribDateSub}>{item.date}</Text>
                </View>
              </View>
              <Text style={s.contribAmountVal}>{item.amount}</Text>
            </View>
          ))}
        </View>

        {/* Transparency Link */}
        <TouchableOpacity style={s.transparencyRow} activeOpacity={0.7}>
          <Icon name="info" size={16} color={Colors.primary} />
          <Text style={s.transparencyText}>Where your contribution goes</Text>
        </TouchableOpacity>

        <YamiFooter />
      </ScrollView>
    );
  }

  // STEP 1: CAMPAIGN DETAILS VIEW (Exact 1:1 Match to Screen 2)
  if (step === 1) {
    return (
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Campaign Hero Banner */}
        <View style={s.heroBannerCard}>
          <Image source={NATIONAL_FUND_IMG} style={s.heroBannerImg} />
          <View style={s.heroOverlayScrim} />

          <View style={s.heroContentContainer}>
            <View style={s.goldBadgePill}>
              <Text style={s.goldBadgePillText}>ACTIVE CAMPAIGN</Text>
            </View>

            <Text style={s.heroTitleText}>{selectedCause}</Text>

            {/* Blurred Progress Box */}
            <View style={s.heroGlassBox}>
              <View style={s.heroProgressRow}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={s.heroRaisedText}>R1.8M</Text>
                  <Text style={s.heroGoalText}> raised of R3M goal</Text>
                </View>
                <Text style={s.heroPercentageText}>60%</Text>
              </View>
              <View style={s.heroProgressBg}>
                <View style={[s.heroProgressFill, { width: '60%' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* About Campaign Card */}
        <View style={s.aboutCard}>
          <View style={s.aboutHeaderRow}>
            <Icon name="info" size={20} color={Colors.primary} />
            <Text style={s.aboutHeaderTitle}>About this campaign</Text>
          </View>
          <Text style={s.aboutParagraph}>
            Supporting local development efforts across the nation. This campaign focuses on building sustainable infrastructure, providing essential resources, and fostering economic growth in communities that need it most. Your contribution directly empowers local leaders and citizens to create lasting change.
          </Text>
        </View>

        {/* Campaign Impact Section */}
        <Text style={s.sectionHeaderTitle}>Campaign Impact</Text>
        <View style={s.impactGrid}>
          {/* Metric 1 */}
          <View style={s.impactCard}>
            <View style={s.impactIconBg}>
              <Icon name="groups" size={22} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.impactValBold}>24</Text>
              <Text style={s.impactDescText}>Communities supported across 5 provinces.</Text>
            </View>
          </View>

          {/* Metric 2 */}
          <View style={s.impactCard}>
            <View style={s.impactIconBg}>
              <Icon name="build" size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.impactValBold}>12</Text>
              <Text style={s.impactDescText}>Infrastructure projects currently underway.</Text>
            </View>
          </View>
        </View>

        {/* Latest Update Box */}
        <View style={s.updateBorderBox}>
          <Text style={s.updateCategoryText}>LATEST UPDATE • 12 AUGUST 2026</Text>
          <Text style={s.updateTitleBold}>Community programme update</Text>
          <TouchableOpacity style={s.readUpdateLink} activeOpacity={0.7}>
            <Text style={s.readUpdateLinkText}>Read update</Text>
            <Icon name="arrow-forward" size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Donate Now CTA Button */}
        <Button text="Donate Now" onPress={() => setStep(2)} />
      </ScrollView>
    );
  }

  // STEP 2: MAKE A DONATION FORM (Exact 1:1 Match to Screen 3)
  if (step === 2) {
    return (
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.pageTitle}>Make a Donation</Text>
        <Text style={s.pageSubText}>Your contribution strengthens our communities and builds a better future for all.</Text>

        {/* Selected Campaign Card */}
        <View style={s.selectedCampaignCard}>
          <View style={s.campaignIconSquircle}>
            <Icon name="volunteer-activism" size={22} color={Colors.white} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.selectedCapLabel}>SELECTED CAMPAIGN</Text>
            <Text style={s.selectedCapTitle}>{selectedCause}</Text>
            <TouchableOpacity style={s.changeCapRow} onPress={() => setStep(0)} activeOpacity={0.7}>
              <Text style={s.changeCapText}>Change campaign</Text>
              <Icon name="chevron-right" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Frequency Toggle */}
        <Text style={s.fieldLabel}>Donation Frequency</Text>
        <View style={s.frequencyToggleBg}>
          <TouchableOpacity
            style={[s.freqSegmentBtn, frequency === 'one-time' && s.freqSegmentActive]}
            onPress={() => setFrequency('one-time')}
            activeOpacity={0.8}
          >
            <Text style={[s.freqSegmentText, frequency === 'one-time' && s.freqSegmentTextActive]}>One-time</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.freqSegmentBtn, frequency === 'monthly' && s.freqSegmentActive]}
            onPress={() => setFrequency('monthly')}
            activeOpacity={0.8}
          >
            <Text style={[s.freqSegmentText, frequency === 'monthly' && s.freqSegmentTextActive]}>Monthly</Text>
          </TouchableOpacity>
        </View>

        {/* Select Amount Grid */}
        <Text style={s.fieldLabel}>Select Amount</Text>
        <View style={s.amountGrid3Col}>
          {['50', '100', '250', '500', '1000', '2500'].map(val => {
            const isSelected = !customAmount && amount === val;
            return (
              <TouchableOpacity
                key={val}
                style={[s.amountGridBtn, isSelected && s.amountGridBtnActive]}
                onPress={() => {
                  setAmount(val);
                  setCustomAmount('');
                }}
                activeOpacity={0.8}
              >
                <Text style={[s.amountGridText, isSelected && s.amountGridTextActive]}>R{val}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Amount Input Box */}
        <View style={s.customAmountInputContainer}>
          <Text style={s.customRSymbol}>R</Text>
          <TextInput
            style={s.customAmountField}
            placeholder="Other amount"
            value={customAmount}
            onChangeText={txt => {
              setCustomAmount(txt);
              setAmount('');
            }}
            keyboardType="numeric"
            placeholderTextColor="#A0AEC0"
          />
        </View>

        {/* Payment Method Card */}
        <View style={s.paymentMethodHeaderRow}>
          <Text style={s.fieldLabel}>Payment Method</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={s.changePaymentLinkText}>Change</Text>
          </TouchableOpacity>
        </View>

        <View style={s.paymentMethodCard}>
          <View style={s.walletGreenSq}>
            <Icon name="account-balance-wallet" size={20} color={Colors.white} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.paymentTitleBold}>ANC Member Money</Text>
            <Text style={s.paymentBalSub}>Balance: R{Number(balance).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</Text>
          </View>
          <Icon name="check-circle" size={22} color="#008542" />
        </View>

        {/* Donation Summary Box */}
        <View style={s.summaryCardBox}>
          <Text style={s.summaryHeaderTitle}>Donation Summary</Text>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Campaign</Text>
            <Text style={s.summaryValBold}>{selectedCause}</Text>
          </View>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Frequency</Text>
            <Text style={s.summaryValBold}>{frequency === 'one-time' ? 'One-time' : 'Monthly'}</Text>
          </View>
          <View style={[s.summaryRow, { borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingBottom: 10 }]}>
            <Text style={s.summaryLabel}>Amount</Text>
            <Text style={s.summaryValBold}>R{numAmount.toFixed(2)}</Text>
          </View>

          <View style={[s.summaryRow, { paddingTop: 10, borderBottomWidth: 0 }]}>
            <Text style={s.summaryTotalLabel}>Total Due</Text>
            <Text style={s.summaryTotalVal}>R{numAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Action Button */}
        <Button text="Review Donation  →" onPress={() => setStep(3)} />

        <View style={s.secureFooterRow}>
          <Icon name="lock" size={14} color="#6E7A6E" />
          <Text style={s.secureFooterText}>Secure transaction</Text>
        </View>
      </ScrollView>
    );
  }

  // STEP 3: REVIEW DONATION / CONFIRMATION (Exact 1:1 Match to Screen 4)
  if (step === 3) {
    return (
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Step Progress Bar Header */}
        <View style={s.stepProgressBarContainer}>
          <View style={s.stepProgressHeaderRow}>
            <Text style={s.stepProgressTitle}>Confirmation</Text>
            <Text style={s.stepProgressSub}>Step 3 of 3</Text>
          </View>
          <View style={s.stepProgressTrack}>
            <View style={[s.stepProgressFill, { width: '100%' }]} />
          </View>
        </View>

        {/* Hero Total Donation Header */}
        <View style={s.totalHeaderBox}>
          <Text style={s.totalHeaderLabel}>Total Donation</Text>
          <Text style={s.totalHeaderVal}>R{numAmount.toFixed(2)}</Text>

          <View style={s.freqPillTag}>
            <Icon name="volunteer-activism" size={14} color="#4A5568" />
            <Text style={s.freqPillTagText}>{frequency === 'one-time' ? 'One-time contribution' : 'Monthly contribution'}</Text>
          </View>
        </View>

        {/* Review breakdown card */}
        <View style={s.reviewCardBox}>
          {/* Campaign Row */}
          <View style={s.reviewRowItem}>
            <Image source={COMMUNITY_HERO_IMG} style={s.reviewThumbImg} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={s.reviewLabelSub}>CAMPAIGN</Text>
              <Text style={s.reviewValTitle}>{selectedCause}</Text>
            </View>
          </View>

          {/* Payment Method Row */}
          <View style={s.reviewRowItem}>
            <View style={s.reviewWalletIconSq}>
              <Icon name="account-balance-wallet" size={18} color="#4A5568" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={s.reviewValTitle}>ANC Member Money</Text>
              <Text style={s.reviewBalSub}>Balance: R{Number(balance).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={s.changePaymentLinkText}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Amounts */}
          <View style={s.reviewCostRow}>
            <Text style={s.reviewCostLabel}>Donation Amount</Text>
            <Text style={s.reviewCostVal}>R{numAmount.toFixed(2)}</Text>
          </View>
          <View style={s.reviewCostRow}>
            <Text style={s.reviewCostLabel}>Platform Fee</Text>
            <Text style={s.reviewCostVal}>R0.00</Text>
          </View>

          <View style={[s.reviewCostRow, { borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 10 }]}>
            <Text style={s.reviewTotalLabel}>Total</Text>
            <Text style={s.reviewTotalVal}>R{numAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Security Notice Box */}
        <View style={s.securityNoticeBox}>
          <Icon name="lock" size={16} color="#008542" />
          <Text style={s.securityNoticeText}>Your donation is processed securely through ANC Unity.</Text>
        </View>

        {/* Confirm & Cancel Buttons */}
        <TouchableOpacity style={s.confirmDonateGreenBtn} onPress={handleConfirmDonate} activeOpacity={0.8}>
          <Text style={s.confirmDonateBtnText}>Confirm & Donate</Text>
          <Icon name="check-circle" size={18} color={Colors.white} />
        </TouchableOpacity>

        <TouchableOpacity style={s.cancelBtn} onPress={() => setStep(0)} activeOpacity={0.8}>
          <Text style={s.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // STEP 4: DONATION SUCCESSFUL RECEIPT (Exact 1:1 Match to Screen 5)
  return (
    <ScrollView contentContainerStyle={s.successContent} showsVerticalScrollIndicator={false}>
      {/* Green Checkmark Badge Box */}
      <Animated.View style={[s.successBadgeBox, { transform: [{ scale: scaleAnim }] }]}>
        <Icon name="check" size={36} color={Colors.white} />
      </Animated.View>

      {/* Success Title & Subtitle */}
      <Text style={s.successTitle}>Donation Successful</Text>
      <Text style={s.successSubText}>Thank you for your contribution to the {selectedCause} campaign.</Text>

      {/* Receipt Details Box */}
      <View style={s.receiptBoxCard}>
        <Text style={s.receiptTotalLabel}>TOTAL AMOUNT</Text>
        <Text style={s.receiptTotalVal}>R{numAmount.toFixed(2)}</Text>

        <View style={s.receiptDetailRow}>
          <Text style={s.receiptLabel}>Campaign</Text>
          <Text style={s.receiptValBold}>{selectedCause}</Text>
        </View>

        <View style={s.receiptDetailRow}>
          <Text style={s.receiptLabel}>Date</Text>
          <Text style={s.receiptValBold}>24 October 2026</Text>
        </View>

        <View style={[s.receiptDetailRow, { borderBottomWidth: 0 }]}>
          <Text style={s.receiptLabel}>Reference</Text>
          <Text style={s.receiptRefGreen}>ANC–DON–99281</Text>
        </View>
      </View>

      {/* Impact Note Box */}
      <View style={s.impactGreenBox}>
        <View style={s.greenHeartCircle}>
          <Icon name="favorite" size={16} color={Colors.white} />
        </View>
        <Text style={s.impactGreenText}>Your contribution helps build stronger local communities.</Text>
      </View>

      {/* Done Button */}
      <Button text="Done" onPress={() => finish(`Donated R${numAmount.toFixed(2)} to ${selectedCause}`)} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 90, backgroundColor: Colors.background },
  successContent: { padding: 24, paddingBottom: 90, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },

  pageTitle: { fontSize: 28, fontWeight: '900', color: '#1A1C1C', marginBottom: 4, marginTop: 4 },
  pageSubText: { fontSize: 14, color: '#4A5568', lineHeight: 20, marginBottom: 20 },

  /* FEATURED CAMPAIGN */
  featuredCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  featuredImg: { width: '100%', height: 180, resizeMode: 'cover' },
  featuredBody: { padding: 18 },

  starBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  starBadgeText: { fontSize: 11, fontWeight: '900', color: Colors.primary, letterSpacing: 1 },
  featuredTitle: { fontSize: 22, fontWeight: '900', color: '#1A1C1C', marginBottom: 4 },
  featuredSubText: { fontSize: 14, color: '#4A5568', lineHeight: 20, marginBottom: 14 },

  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  raisedBoldText: { fontSize: 13, fontWeight: '800', color: '#1A1C1C' },
  goalSubText: { fontSize: 12, color: '#4A5568' },

  progressBarBg: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden', marginBottom: 16 },
  progressBarFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },

  donateNowGreenBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  donateNowBtnText: { color: Colors.white, fontSize: 15, fontWeight: '800' },

  /* CAUSES 6 GRID */
  sectionHeaderTitle: { fontSize: 18, fontWeight: '900', color: '#1A1C1C', marginBottom: 14, marginTop: 4 },
  causeGridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  causeCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  causeIconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0F3F0', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  causeCardTitle: { fontSize: 13, fontWeight: '800', color: '#1A1C1C', textAlign: 'center' },

  /* CONTRIBUTIONS LIST */
  contributionsCardBox: { backgroundColor: Colors.white, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 24, overflow: 'hidden' },
  contributionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  receiptIconCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F0F3F0', alignItems: 'center', justifyContent: 'center' },
  contribTitleBold: { fontSize: 14, fontWeight: '800', color: '#1A1C1C' },
  contribDateSub: { fontSize: 12, color: '#4A5568', marginTop: 1 },
  contribAmountVal: { fontSize: 15, fontWeight: '900', color: '#1A1C1C' },

  transparencyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, marginBottom: 20 },
  transparencyText: { color: Colors.primary, fontSize: 14, fontWeight: '800' },

  /* STEP 1: CAMPAIGN DETAILS STYLES */
  heroBannerCard: { height: 320, borderRadius: 20, overflow: 'hidden', marginBottom: 20, justifyContent: 'flex-end', padding: 16, backgroundColor: '#1A1C1C' },
  heroBannerImg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.8 },
  heroOverlayScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },

  heroContentContainer: { zIndex: 5 },
  goldBadgePill: { backgroundColor: '#E5B800', borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10, alignSelf: 'flex-start', marginBottom: 8 },
  goldBadgePillText: { fontSize: 10, fontWeight: '900', color: '#1A1C1C', letterSpacing: 1 },
  heroTitleText: { fontSize: 32, fontWeight: '900', color: Colors.white, marginBottom: 14 },

  heroGlassBox: { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' },
  heroProgressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  heroRaisedText: { fontSize: 18, fontWeight: '900', color: Colors.white },
  heroGoalText: { fontSize: 12, color: '#E2E8F0' },
  heroPercentageText: { fontSize: 13, fontWeight: '900', color: '#8DF9A8' },
  heroProgressBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, overflow: 'hidden' },
  heroProgressFill: { height: '100%', backgroundColor: '#8DF9A8', borderRadius: 4 },

  aboutCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  aboutHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  aboutHeaderTitle: { fontSize: 16, fontWeight: '900', color: Colors.primary },
  aboutParagraph: { fontSize: 14, color: '#4A5568', lineHeight: 22 },

  impactGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  impactCard: { flex: 1, backgroundColor: Colors.white, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  impactIconBg: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#E2F4E5', alignItems: 'center', justifyContent: 'center' },
  impactValBold: { fontSize: 20, fontWeight: '900', color: Colors.primary },
  impactDescText: { fontSize: 11, color: '#4A5568', lineHeight: 15, marginTop: 2 },

  updateBorderBox: { backgroundColor: '#F5F8F6', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', borderLeftWidth: 4, borderLeftColor: Colors.primary, marginBottom: 24 },
  updateCategoryText: { fontSize: 10, fontWeight: '800', color: '#6E7A6E', letterSpacing: 0.8, marginBottom: 4 },
  updateTitleBold: { fontSize: 15, fontWeight: '800', color: '#1A1C1C', marginBottom: 8 },
  readUpdateLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  readUpdateLinkText: { fontSize: 13, fontWeight: '800', color: Colors.primary },

  /* STEP 2: MAKE A DONATION FORM STYLES */
  selectedCampaignCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  campaignIconSquircle: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  selectedCapLabel: { fontSize: 10, fontWeight: '900', color: '#6E7A6E', letterSpacing: 0.8 },
  selectedCapTitle: { fontSize: 16, fontWeight: '900', color: '#1A1C1C', marginTop: 1 },
  changeCapRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 },
  changeCapText: { fontSize: 12, fontWeight: '800', color: Colors.primary },

  fieldLabel: { fontSize: 13, fontWeight: '800', color: '#4A5568', marginBottom: 8 },

  frequencyToggleBg: { flexDirection: 'row', backgroundColor: '#F0F3F0', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  freqSegmentBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  freqSegmentActive: { backgroundColor: Colors.white, borderWidth: 1, borderColor: '#E2E8F0' },
  freqSegmentText: { fontSize: 14, fontWeight: '700', color: '#4A5568' },
  freqSegmentTextActive: { color: Colors.primary, fontWeight: '900' },

  amountGrid3Col: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  amountGridBtn: { width: '31%', backgroundColor: Colors.white, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  amountGridBtnActive: { borderColor: Colors.primary, borderWidth: 2, backgroundColor: '#F0F9F2' },
  amountGridText: { fontSize: 16, fontWeight: '800', color: '#1A1C1C' },
  amountGridTextActive: { color: Colors.primary, fontWeight: '900' },

  customAmountInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  customRSymbol: { fontSize: 18, fontWeight: '900', color: '#4A5568', marginRight: 6 },
  customAmountField: { flex: 1, fontSize: 16, fontWeight: '800', color: '#1A1C1C', borderWidth: 0, outlineStyle: 'none' },

  paymentMethodHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  changePaymentLinkText: { fontSize: 12, fontWeight: '800', color: Colors.primary },

  paymentMethodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  walletGreenSq: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  paymentTitleBold: { fontSize: 15, fontWeight: '800', color: '#1A1C1C' },
  paymentBalSub: { fontSize: 12, color: '#4A5568', marginTop: 1 },

  summaryCardBox: { backgroundColor: '#F5F8F6', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 24 },
  summaryHeaderTitle: { fontSize: 14, fontWeight: '800', color: '#1A1C1C', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  summaryLabel: { fontSize: 13, color: '#4A5568' },
  summaryValBold: { fontSize: 14, fontWeight: '800', color: '#1A1C1C' },
  summaryTotalLabel: { fontSize: 15, fontWeight: '900', color: '#1A1C1C' },
  summaryTotalVal: { fontSize: 18, fontWeight: '900', color: Colors.primary },

  secureFooterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 12 },
  secureFooterText: { fontSize: 12, color: '#6E7A6E', fontWeight: '700' },

  /* STEP 3: REVIEW DONATION STYLES */
  stepProgressBarContainer: { marginBottom: 20, marginTop: 4 },
  stepProgressHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  stepProgressTitle: { fontSize: 15, fontWeight: '900', color: '#1A1C1C' },
  stepProgressSub: { fontSize: 13, fontWeight: '800', color: Colors.primary },
  stepProgressTrack: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  stepProgressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },

  totalHeaderBox: { alignItems: 'center', marginVertical: 16 },
  totalHeaderLabel: { fontSize: 13, color: '#4A5568', fontWeight: '700' },
  totalHeaderVal: { fontSize: 36, fontWeight: '900', color: '#1A1C1C', marginVertical: 4 },
  freqPillTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F0F3F0', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14 },
  freqPillTagText: { fontSize: 12, fontWeight: '800', color: '#4A5568' },

  reviewCardBox: { backgroundColor: Colors.white, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  reviewRowItem: { flexDirection: 'row', alignItems: 'center', paddingBottom: 14, marginBottom: 14, borderBottomWidth: 1, borderBottomColor: '#F0F3F0' },
  reviewThumbImg: { width: 44, height: 44, borderRadius: 10, resizeMode: 'cover' },
  reviewLabelSub: { fontSize: 10, fontWeight: '900', color: '#6E7A6E', letterSpacing: 0.8 },
  reviewValTitle: { fontSize: 15, fontWeight: '800', color: '#1A1C1C' },
  reviewBalSub: { fontSize: 12, color: '#4A5568', marginTop: 1 },
  reviewWalletIconSq: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F0F3F0', alignItems: 'center', justifyContent: 'center' },

  reviewCostRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reviewCostLabel: { fontSize: 13, color: '#4A5568' },
  reviewCostVal: { fontSize: 14, fontWeight: '800', color: '#1A1C1C' },
  reviewTotalLabel: { fontSize: 15, fontWeight: '900', color: '#1A1C1C' },
  reviewTotalVal: { fontSize: 16, fontWeight: '900', color: Colors.primary },

  securityNoticeBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F5F8F6', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 24 },
  securityNoticeText: { flex: 1, fontSize: 12, color: '#4A5568', fontWeight: '700', lineHeight: 17 },

  confirmDonateGreenBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 16, marginBottom: 10 },
  confirmDonateBtnText: { color: Colors.white, fontSize: 16, fontWeight: '900' },

  cancelBtn: { backgroundColor: Colors.white, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  cancelBtnText: { color: '#4A5568', fontSize: 14, fontWeight: '800' },

  /* STEP 4: SUCCESS RECEIPT STYLES */
  successBadgeBox: { width: 72, height: 72, borderRadius: 20, backgroundColor: '#008542', alignItems: 'center', justifyContent: 'center', marginBottom: 20, marginTop: 30 },
  successTitle: { fontSize: 24, fontWeight: '900', color: '#006D35', marginBottom: 6 },
  successSubText: { fontSize: 14, color: '#4A5568', textAlign: 'center', lineHeight: 20, marginBottom: 24 },

  receiptBoxCard: { width: '100%', backgroundColor: Colors.white, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  receiptTotalLabel: { fontSize: 11, fontWeight: '900', color: '#6E7A6E', letterSpacing: 0.8, textAlign: 'center' },
  receiptTotalVal: { fontSize: 36, fontWeight: '900', color: '#1A1C1C', textAlign: 'center', marginVertical: 6, marginBottom: 16 },

  receiptDetailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F3F0' },
  receiptLabel: { fontSize: 13, color: '#4A5568' },
  receiptValBold: { fontSize: 14, fontWeight: '800', color: '#1A1C1C' },
  receiptRefGreen: { fontSize: 14, fontWeight: '900', color: Colors.primary },

  impactGreenBox: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F0F9F2', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#C6EAD0', marginBottom: 24 },
  greenHeartCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  impactGreenText: { flex: 1, fontSize: 13, fontWeight: '700', color: '#005226', lineHeight: 18 },
});
