import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import Field from '../components/Field';
import { Icon } from '../components/Icons';
import Pills from '../components/Pills';
import { Colors } from '../theme/colors';

export default function MoneyScreen({ open, cards = [], balance = 1500, onDepositFunds, recentActivity = [] }) {
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

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Title & Context Header */}
      <Text style={s.h1}>Money</Text>
      <Text style={s.subText}>
        Lerumo Thabo • ANC-1234567 • <Text style={s.activeText}>ACTIVE</Text>
      </Text>

      {/* Available Balance Card */}
      <View style={s.balanceCard}>
        <View style={s.balanceHeaderRow}>
          <Text style={s.balanceLabel}>AVAILABLE BALANCE</Text>
          <TouchableOpacity style={s.topUpBtn} onPress={() => setShowDepositModal(true)} activeOpacity={0.8}>
            <Text style={s.topUpBtnText}>＋ Top Up</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.balanceAmount}>R{Number(balance).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>

        {/* 3 Core Action Buttons */}
        <View style={s.actionRow}>
          <TouchableOpacity style={s.primaryActionBtn} onPress={() => open('send')} activeOpacity={0.8}>
            <Icon name="send" size={18} color={Colors.white} />
            <Text style={s.primaryActionText}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.secondaryActionBtn} onPress={() => open('send')} activeOpacity={0.8}>
            <Icon name="file-download" size={18} color={Colors.primary} />
            <Text style={s.secondaryActionText}>Receive</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.secondaryActionBtn} onPress={() => open('send')} activeOpacity={0.8}>
            <Icon name="swap-horiz" size={20} color={Colors.primary} />
            <Text style={s.secondaryActionText}>Transfer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pay Services */}
      <Text style={s.sectionHeader}>Pay Services</Text>
      <View style={s.servicesGrid}>
        <TouchableOpacity style={s.serviceBtn} onPress={() => open('services')}>
          <View style={s.serviceIconCircle}>
            <Icon name="smartphone" size={22} color={Colors.primary} />
          </View>
          <Text style={s.serviceText}>Airtime</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.serviceBtn} onPress={() => open('services')}>
          <View style={s.serviceIconCircle}>
            <Icon name="wifi" size={22} color={Colors.primary} />
          </View>
          <Text style={s.serviceText}>Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.serviceBtn} onPress={() => open('services')}>
          <View style={s.serviceIconCircle}>
            <Icon name="bolt" size={22} color={Colors.primary} />
          </View>
          <Text style={s.serviceText}>Electricity</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.serviceBtn} onPress={() => open('services')}>
          <View style={s.serviceIconCircle}>
            <Icon name="receipt-long" size={22} color={Colors.primary} />
          </View>
          <Text style={s.serviceText}>Bills</Text>
        </TouchableOpacity>
      </View>

      {/* Contribute Section */}
      <Text style={s.sectionHeader}>Contribute</Text>
      <View style={s.contributeStack}>
        <TouchableOpacity style={s.contributeRow} onPress={() => open('donate')} activeOpacity={0.7}>
          <View style={[s.contributeSquare, { backgroundColor: '#FECC00' }]}>
            <Icon name="volunteer-activism" size={20} color={Colors.ink} />
          </View>
          <Text style={s.contributeTitle}>Donate</Text>
          <Text style={s.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.contributeRow} onPress={() => open('membership')} activeOpacity={0.7}>
          <View style={[s.contributeSquare, { backgroundColor: Colors.primary }]}>
            <Icon name="card-membership" size={20} color={Colors.white} />
          </View>
          <Text style={s.contributeTitle}>Membership</Text>
          <Text style={s.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.contributeRow} onPress={() => open('branch')} activeOpacity={0.7}>
          <View style={[s.contributeSquare, { backgroundColor: '#3E4A3F' }]}>
            <Icon name="groups" size={20} color={Colors.white} />
          </View>
          <Text style={s.contributeTitle}>Community</Text>
          <Text style={s.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <View style={s.activityHeaderRow}>
        <Text style={s.sectionHeader}>Recent Activity</Text>
        <TouchableOpacity><Text style={s.viewAllText}>View All</Text></TouchableOpacity>
      </View>

      <View style={s.activityList}>
        {recentActivity.map((item, idx) => (
          <View key={item.id || idx} style={s.activityRow}>
            <View style={[s.activityIconCircle, item.type === 'deposit' && s.depositCircle]}>
              <Icon
                name={item.type === 'deposit' ? 'arrow-downward' : (item.title.includes('Airtime') ? 'smartphone' : 'bolt')}
                size={18}
                color={item.type === 'deposit' ? Colors.primary : Colors.muted}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.activityTitle}>{item.title}</Text>
              <Text style={s.activityTime}>{item.time || 'Today'}</Text>
            </View>
            <Text style={item.type === 'deposit' ? s.positiveAmount : s.negativeAmount}>
              {item.type === 'deposit' ? '+' : '-'}R{Number(item.amount).toFixed(2)}
            </Text>
          </View>
        ))}
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
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  balanceHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { fontSize: 10, fontWeight: '900', color: Colors.muted, letterSpacing: 1.2 },
  topUpBtn: { backgroundColor: '#E2F4E5', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: '#C4E5CA' },
  topUpBtnText: { fontSize: 11, fontWeight: '900', color: Colors.primary },
  balanceAmount: { fontSize: 34, fontWeight: '900', color: Colors.ink, marginVertical: 8 },

  actionRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  primaryActionBtn: { flex: 1, backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  primaryActionText: { color: Colors.white, fontWeight: '800', fontSize: 13 },
  secondaryActionBtn: { flex: 1, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6, borderWidth: 1, borderColor: Colors.surfaceBorder },
  secondaryActionText: { color: Colors.ink, fontWeight: '800', fontSize: 13 },

  sectionHeader: { fontSize: 16, fontWeight: '800', color: Colors.ink, marginTop: 18, marginBottom: 12 },
  servicesGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  serviceBtn: { width: '23%', backgroundColor: Colors.white, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder },
  serviceIconCircle: { marginBottom: 6 },
  serviceText: { fontSize: 11, fontWeight: '700', color: Colors.ink },

  contributeStack: { gap: 8, marginBottom: 10 },
  contributeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: Colors.surfaceBorder },
  contributeSquare: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  contributeTitle: { flex: 1, fontSize: 14, fontWeight: '800', color: Colors.ink },
  chevron: { fontSize: 20, color: '#7B867E' },

  activityHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  viewAllText: { fontSize: 12, fontWeight: '800', color: Colors.primary },
  activityList: { backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 14, borderWidth: 1, borderColor: Colors.surfaceBorder },
  activityRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.line },
  activityIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  depositCircle: { backgroundColor: '#E2F4E5' },
  activityTitle: { fontSize: 13, fontWeight: '700', color: Colors.ink },
  activityTime: { fontSize: 11, color: Colors.muted, marginTop: 1 },
  positiveAmount: { fontSize: 13, fontWeight: '800', color: Colors.primary },
  negativeAmount: { fontSize: 13, fontWeight: '800', color: Colors.ink },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 36 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '900', color: Colors.ink },
  modalSub: { fontSize: 12, color: Colors.muted, marginTop: 4, marginBottom: 12 },
});
