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
      onDepositFunds(num);
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

        {/* 3 Core Action Buttons */}
        <View style={s.actionRow}>
          <TouchableOpacity style={s.sendActionBtn} onPress={() => open('send')} activeOpacity={0.8}>
            <Icon name="send" size={16} color={Colors.white} />
            <Text style={s.sendActionText}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.greyActionBtn} onPress={() => open('receive')} activeOpacity={0.8}>
            <Icon name="file-download" size={16} color={Colors.ink} />
            <Text style={s.greyActionText}>Receive</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.greyActionBtn} onPress={() => open('send')} activeOpacity={0.8}>
            <Icon name="swap-horiz" size={18} color={Colors.ink} />
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
            <Icon name="card-membership" size={18} color={Colors.white} />
          </View>
          <Text style={s.contributeTitle}>Membership</Text>
          <Icon name="chevron-right" size={18} color="#9E9E9E" />
        </TouchableOpacity>

        <TouchableOpacity style={s.contributeRow} onPress={() => open('branch')} activeOpacity={0.7}>
          <View style={[s.contributeSquare, { backgroundColor: '#3E4A3F' }]}>
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

      {/* Deposit Modal */}
      <Modal visible={showDepositModal} animationType="slide" transparent>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Deposit Funds</Text>
              <TouchableOpacity onPress={() => setShowDepositModal(false)}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.muted }}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={s.modalSub}>Select or enter an amount to top up your wallet balance.</Text>

            <Field label="AMOUNT (ZAR)" value={depositAmount} onChangeText={setDepositAmount} keyboardType="numeric" placeholder="Enter amount" />
            <Pills value={depositAmount} setValue={setDepositAmount} options={[100, 250, 500, 1000]} />

            <Button text={`＋ Deposit R${depositAmount}`} onPress={handleDeposit} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 90, backgroundColor: Colors.background },
  h1: { fontSize: 26, fontWeight: '900', color: Colors.ink },
  subText: { fontSize: 12, color: Colors.muted, marginTop: 2, marginBottom: 14, fontWeight: '600' },
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
  },
  balanceCardLeft: {
    marginBottom: 16,
  },
  balanceLabel: { fontSize: 10, fontWeight: '800', color: Colors.muted, letterSpacing: 1 },
  balanceAmount: { fontSize: 32, fontWeight: '900', color: Colors.ink, marginTop: 4 },

  addFundsPillBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  addFundsPillText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Inter',
  },

  bankGraphicContainer: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 60,
    height: 48,
    alignItems: 'center',
    justify: 'center',
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
  bankPillarsRow: {
    flexDirection: 'row',
    gap: 5,
    marginVertical: 3,
  },
  pillar: {
    width: 6,
    height: 20,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
  bankBase: {
    width: 52,
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sendActionBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  sendActionText: { color: Colors.white, fontWeight: '800', fontSize: 13 },

  greyActionBtn: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  greyActionText: { color: Colors.ink, fontWeight: '800', fontSize: 13 },

  sectionHeader: { fontSize: 15, fontWeight: '800', color: Colors.ink, marginTop: 14, marginBottom: 10 },

  servicesGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  serviceIconSquare: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F0F9F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  serviceCardLabel: { fontSize: 11, fontWeight: '700', color: Colors.ink },

  contributeStack: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 16,
  },
  contributeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  contributeSquare: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contributeTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.ink },

  activityHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewAllText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  activityList: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    paddingHorizontal: 14,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  activityIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F4F5F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  depositCircle: {
    backgroundColor: '#E2F4E5',
  },
  activityTitle: { fontSize: 13, fontWeight: '700', color: Colors.ink },
  activityTime: { fontSize: 11, color: Colors.muted, marginTop: 1 },
  positiveAmount: { fontSize: 13, fontWeight: '800', color: Colors.primary },
  negativeAmount: { fontSize: 13, fontWeight: '800', color: Colors.ink },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '900', color: Colors.ink },
  modalSub: { fontSize: 12, color: Colors.muted, marginTop: 4, marginBottom: 14 },
});
