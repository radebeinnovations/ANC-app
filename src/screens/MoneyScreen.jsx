import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import Field from '../components/Field';
import { Icon } from '../components/Icons';
import Pills from '../components/Pills';
import { Colors } from '../theme/colors';

export default function MoneyScreen({ open, balance = 1500, onDepositFunds, recentActivity = [] }) {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('500');

  const handleDeposit = () => {
    const num = parseFloat(depositAmount);
    if (!isNaN(num) && num > 0) {
      if (onDepositFunds) onDepositFunds(num);
      setShowDepositModal(false);
      setDepositAmount('500');
    }
  };

  const defaultActivity = [
    { id: '1', title: 'Received from Thabo Mokoena', amount: 500.00, time: 'Today, 14:32', type: 'deposit', icon: 'arrow-downward' },
    { id: '2', title: 'Electricity', amount: 250.00, time: 'Today, 10:15', type: 'expense', icon: 'bolt' },
    { id: '3', title: 'Airtime', amount: 50.00, time: 'Yesterday', type: 'expense', icon: 'smartphone' },
  ];

  const displayList = recentActivity.length > 0 ? recentActivity : defaultActivity;

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Title & Sub */}
      <Text style={s.h1}>Money</Text>
      <Text style={s.subText}>
        Lerumo Thabo • ANC-1234567 • <Text style={s.activeText}>ACTIVE</Text>
      </Text>

      {/* Available Balance Card with Graphic */}
      <View style={s.balanceCard}>
        <View style={s.balanceCardLeft}>
          <Text style={s.balanceLabel}>AVAILABLE BALANCE</Text>
          <Text style={s.balanceAmount}>R{Number(balance).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
        </View>

        {/* Bank Pillars Graphic */}
        <View style={s.bankGraphicContainer}>
          <View style={s.bankRoof} />
          <View style={s.bankPillarsRow}>
            <View style={s.pillar} />
            <View style={s.pillar} />
            <View style={s.pillar} />
            <View style={s.pillar} />
          </View>
          <View style={s.bankBase} />
        </View>

        {/* 4 Core Action Buttons */}
        <View style={s.actionRow}>
          {/* 1. Add Funds (Gold Button) */}
          <TouchableOpacity style={s.addFundsGoldBtn} onPress={() => setShowDepositModal(true)} activeOpacity={0.8}>
            <Icon name="add" size={16} color="#241A00" />
            <Text style={s.addFundsGoldText}>Add Funds</Text>
          </TouchableOpacity>

          {/* 2. Send */}
          <TouchableOpacity style={s.sendActionBtn} onPress={() => open('send')} activeOpacity={0.8}>
            <Icon name="send" size={14} color={Colors.white} />
            <Text style={s.sendActionText}>Send</Text>
          </TouchableOpacity>

          {/* 3. Receive */}
          <TouchableOpacity style={s.greyActionBtn} onPress={() => open('receive')} activeOpacity={0.8}>
            <Icon name="file-download" size={14} color={Colors.ink} />
            <Text style={s.greyActionText}>Receive</Text>
          </TouchableOpacity>

          {/* 4. Transfer */}
          <TouchableOpacity style={s.greyActionBtn} onPress={() => open('transfer')} activeOpacity={0.8}>
            <Icon name="swap-horiz" size={16} color={Colors.ink} />
            <Text style={s.greyActionText}>Transfer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pay Services Grid */}
      <Text style={s.sectionHeader}>Pay Services</Text>
      <View style={s.servicesGrid}>
        <TouchableOpacity style={s.serviceCard} onPress={() => open('airtime')} activeOpacity={0.8}>
          <View style={s.serviceIconSquare}>
            <Icon name="smartphone" size={20} color={Colors.primary} />
          </View>
          <Text style={s.serviceCardLabel}>Airtime</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.serviceCard} onPress={() => open('data')} activeOpacity={0.8}>
          <View style={s.serviceIconSquare}>
            <Icon name="wifi" size={20} color={Colors.primary} />
          </View>
          <Text style={s.serviceCardLabel}>Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.serviceCard} onPress={() => open('electricity')} activeOpacity={0.8}>
          <View style={s.serviceIconSquare}>
            <Icon name="bolt" size={20} color={Colors.primary} />
          </View>
          <Text style={s.serviceCardLabel}>Electricity</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.serviceCard} onPress={() => open('bills')} activeOpacity={0.8}>
          <View style={s.serviceIconSquare}>
            <Icon name="receipt-long" size={20} color={Colors.primary} />
          </View>
          <Text style={s.serviceCardLabel}>Bills</Text>
        </TouchableOpacity>
      </View>

      {/* Contribute Stack */}
      <Text style={s.sectionHeader}>Contribute</Text>
      <View style={s.contributeStack}>
        <TouchableOpacity style={s.contributeRow} onPress={() => open('donate')} activeOpacity={0.7}>
          <View style={[s.contributeSquare, { backgroundColor: '#FECC00' }]}>
            <Icon name="volunteer-activism" size={18} color={Colors.ink} />
          </View>
          <Text style={s.contributeTitle}>Donate</Text>
          <Icon name="chevron-right" size={18} color="#9E9E9E" />
        </TouchableOpacity>

        <TouchableOpacity style={s.contributeRow} onPress={() => open('membership')} activeOpacity={0.7}>
          <View style={[s.contributeSquare, { backgroundColor: Colors.primary }]}>
            <Icon name="badge" size={18} color={Colors.white} />
          </View>
          <Text style={s.contributeTitle}>Membership</Text>
          <Icon name="chevron-right" size={18} color="#9E9E9E" />
        </TouchableOpacity>

        <TouchableOpacity style={s.contributeRow} onPress={() => open('branch')} activeOpacity={0.7}>
          <View style={[s.contributeSquare, { backgroundColor: '#4A5568' }]}>
            <Icon name="groups" size={18} color={Colors.white} />
          </View>
          <Text style={s.contributeTitle}>Community</Text>
          <Icon name="chevron-right" size={18} color="#9E9E9E" />
        </TouchableOpacity>
      </View>

      {/* Recent Activity Section */}
      <View style={s.activityHeaderRow}>
        <Text style={s.sectionHeader}>Recent Activity</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={s.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={s.activityList}>
        {displayList.map((item, idx) => {
          const isDeposit = item.type === 'deposit';
          return (
            <View key={item.id || idx} style={s.activityRow}>
              <View style={[s.activityIconCircle, isDeposit && s.depositCircle]}>
                <Icon
                  name={isDeposit ? 'arrow-downward' : (item.icon || 'bolt')}
                  size={16}
                  color={isDeposit ? Colors.primary : Colors.muted}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.activityTitle}>{item.title}</Text>
                <Text style={s.activityTime}>{item.time || 'Today'}</Text>
              </View>
              <Text style={isDeposit ? s.positiveAmount : s.negativeAmount}>
                {isDeposit ? '+' : '-'}R{Number(item.amount).toFixed(2)}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Deposit / Add Funds Modal */}
      <Modal visible={showDepositModal} animationType="slide" transparent>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Add Funds to Wallet</Text>
              <TouchableOpacity onPress={() => setShowDepositModal(false)}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.muted }}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={s.modalSub}>Select or enter an amount to instant top-up your ANC Member Wallet.</Text>

            <Field label="AMOUNT (ZAR)" value={depositAmount} onChangeText={setDepositAmount} keyboardType="numeric" placeholder="Enter amount" />
            <Pills value={depositAmount} setValue={setDepositAmount} options={[100, 250, 500, 1000]} />

            <View style={{ marginTop: 20 }}>
              <Button text={`＋ Deposit R${depositAmount}`} onPress={handleDeposit} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 90, backgroundColor: Colors.background },
  h1: { fontSize: 26, fontWeight: '900', color: Colors.ink, fontFamily: 'Hanken Grotesk' },
  subText: { fontSize: 12, color: Colors.muted, marginTop: 2, marginBottom: 14, fontWeight: '600', fontFamily: 'Inter' },
  activeText: { color: Colors.primary, fontWeight: '900' },

  balanceCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  balanceCardLeft: { marginBottom: 16 },
  balanceLabel: { fontSize: 10, fontWeight: '800', color: Colors.muted, letterSpacing: 1, fontFamily: 'Inter' },
  balanceAmount: { fontSize: 32, fontWeight: '900', color: Colors.ink, marginTop: 4, fontFamily: 'Hanken Grotesk' },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },

  addFundsGoldBtn: {
    flex: 1.2,
    backgroundColor: '#FECC00',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addFundsGoldText: { color: '#241A00', fontSize: 12, fontWeight: '800', fontFamily: 'Inter' },

  sendActionBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  sendActionText: { color: Colors.white, fontSize: 12, fontWeight: '800', fontFamily: 'Inter' },

  greyActionBtn: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  greyActionText: { color: Colors.ink, fontSize: 12, fontWeight: '800', fontFamily: 'Inter' },

  bankGraphicContainer: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 60,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.25,
  },
  bankRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 26,
    borderRightWidth: 26,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.primary,
  },
  bankPillarsRow: { flexDirection: 'row', gap: 5, marginVertical: 3 },
  pillar: { width: 6, height: 20, backgroundColor: Colors.primary, borderRadius: 1 },
  bankBase: { width: 52, height: 4, backgroundColor: Colors.primary, borderRadius: 1 },

  sectionHeader: { fontSize: 18, fontWeight: '900', color: Colors.ink, marginTop: 14, marginBottom: 10, fontFamily: 'Hanken Grotesk' },
  servicesGrid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  serviceCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  serviceIconSquare: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F9F2', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  serviceCardLabel: { fontSize: 12, fontWeight: '700', color: Colors.ink, fontFamily: 'Inter' },

  contributeStack: { backgroundColor: Colors.white, borderRadius: 14, borderWidth: 1, borderColor: Colors.surfaceBorder, marginBottom: 16, overflow: 'hidden' },
  contributeRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: Colors.line },
  contributeSquare: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  contributeTitle: { flex: 1, marginLeft: 12, fontSize: 14, fontWeight: '700', color: Colors.ink, fontFamily: 'Inter' },

  activityHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAllText: { fontSize: 12, fontWeight: '800', color: Colors.primary, fontFamily: 'Inter' },
  activityList: { backgroundColor: Colors.white, borderRadius: 14, borderWidth: 1, borderColor: Colors.surfaceBorder, padding: 14, marginBottom: 16 },
  activityRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.line },
  activityIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EEEEEE', alignItems: 'center', justifyContent: 'center' },
  depositCircle: { backgroundColor: '#F0F9F2' },
  activityTitle: { fontSize: 13, fontWeight: '700', color: Colors.ink, fontFamily: 'Inter' },
  activityTime: { fontSize: 11, color: Colors.muted, marginTop: 2, fontFamily: 'Inter' },
  positiveAmount: { fontSize: 14, fontWeight: '800', color: Colors.primary, fontFamily: 'Inter' },
  negativeAmount: { fontSize: 14, fontWeight: '800', color: Colors.ink, fontFamily: 'Inter' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: Colors.ink, fontFamily: 'Hanken Grotesk' },
  modalSub: { fontSize: 13, color: Colors.muted, marginBottom: 16, fontFamily: 'Inter' },
});
