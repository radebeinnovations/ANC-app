import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import { Icon } from '../components/Icons';
import Pills from '../components/Pills';
import { Colors } from '../theme/colors';

const rand = (n) => `R${Number(n || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ServicesScreen({ finish, balance = 1500, onDeductBalance }) {
  const [activeSubScreen, setActiveSubScreen] = useState('hub'); // 'hub' | 'airtime' | 'data' | 'electricity'
  
  // Airtime State
  const [airtimeMobile, setAirtimeMobile] = useState('+27 82 123 4567');
  const [selectedNetwork, setSelectedNetwork] = useState('MTN');
  const [airtimeAmount, setAirtimeAmount] = useState('50');

  // Data State
  const [dataRecipient, setDataRecipient] = useState('+27 82 123 4567');
  const [selectedDataBundle, setSelectedDataBundle] = useState('1 GB');
  const dataBundles = [
    { label: '500 MB', sub: 'Standard Validity', price: 15 },
    { label: '1 GB', sub: 'Valid for 7 days', price: 35 },
    { label: '2 GB', sub: 'Standard Validity', price: 50 },
    { label: '5 GB', sub: 'Standard Validity', price: 100 },
  ];

  // Electricity State
  const [meterNumber, setMeterNumber] = useState('1234 5678 9012');
  const [electricityAmount, setElectricityAmount] = useState('250');
  const [saveAsHome, setSaveAsHome] = useState(true);

  const handlePayAirtime = () => {
    const num = parseFloat(airtimeAmount) || 0;
    if (onDeductBalance) onDeductBalance(num, `Airtime Purchase (${selectedNetwork})`);
    finish(`Airtime purchase of ${rand(num)} complete.`);
  };

  const handlePayData = () => {
    const bundle = dataBundles.find(b => b.label === selectedDataBundle) || dataBundles[1];
    if (onDeductBalance) onDeductBalance(bundle.price, `Data Purchase (${selectedDataBundle})`);
    finish(`Data bundle (${selectedDataBundle}) purchase of ${rand(bundle.price)} complete.`);
  };

  const handlePayElectricity = () => {
    const num = parseFloat(electricityAmount) || 0;
    if (onDeductBalance) onDeductBalance(num, `Prepaid Electricity (${meterNumber})`);
    finish(`Electricity purchase of ${rand(num)} complete.`);
  };

  // 1. HUB SCREEN
  if (activeSubScreen === 'hub') {
    return (
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.h1}>Pay & Services</Text>
        <Text style={s.subText}>Everyday services, all in one place.</Text>

        {/* Green Balance Card */}
        <View style={s.hubBalanceCard}>
          <Text style={s.hubBalanceLabel}>AVAILABLE BALANCE</Text>
          <Text style={s.hubBalanceAmount}>{rand(balance)}</Text>
          <TouchableOpacity style={s.addFundsBtn}>
            <Icon name="add-circle" size={16} color={Colors.white} />
            <Text style={s.addFundsBtnText}>Add Funds</Text>
          </TouchableOpacity>
        </View>

        {/* Favourites Section */}
        <Text style={s.sectionHeader}>Favourites</Text>
        <View style={s.favouritesRow}>
          <TouchableOpacity style={s.favouriteCard} onPress={() => setActiveSubScreen('airtime')} activeOpacity={0.8}>
            <View style={s.favIconCircle}>
              <Icon name="smartphone" size={22} color={Colors.primary} />
            </View>
            <Text style={s.favText}>MTN Airtime</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.favouriteCard} onPress={() => setActiveSubScreen('electricity')} activeOpacity={0.8}>
            <View style={s.favIconCircle}>
              <Icon name="bolt" size={22} color={Colors.goldText} />
            </View>
            <Text style={s.favText}>Home Electricity</Text>
          </TouchableOpacity>

          <View style={s.addFavCard}>
            <Text style={s.addFavPlus}>＋</Text>
            <Text style={s.addFavText}>Add New</Text>
          </View>
        </View>

        {/* All Services Grid */}
        <Text style={s.sectionHeader}>All Services</Text>
        <View style={s.allServicesGrid}>
          <TouchableOpacity style={s.gridServiceCard} onPress={() => setActiveSubScreen('airtime')} activeOpacity={0.8}>
            <Icon name="smartphone" size={24} color={Colors.primary} />
            <Text style={s.gridServiceText}>Airtime</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.gridServiceCard} onPress={() => setActiveSubScreen('data')} activeOpacity={0.8}>
            <Icon name="wifi" size={24} color={Colors.primary} />
            <Text style={s.gridServiceText}>Data</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.gridServiceCard} onPress={() => setActiveSubScreen('electricity')} activeOpacity={0.8}>
            <Icon name="bolt" size={24} color={Colors.primary} />
            <Text style={s.gridServiceText}>Electricity</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.gridServiceCard} onPress={() => setActiveSubScreen('airtime')} activeOpacity={0.8}>
            <Icon name="receipt-long" size={24} color={Colors.primary} />
            <Text style={s.gridServiceText}>Bills</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.gridServiceCard} onPress={() => finish('Donation screen')} activeOpacity={0.8}>
            <Icon name="volunteer-activism" size={24} color={Colors.primary} />
            <Text style={s.gridServiceText}>Donations</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.gridServiceCard} onPress={() => finish('Membership screen')} activeOpacity={0.8}>
            <Icon name="card-membership" size={24} color={Colors.primary} />
            <Text style={[s.gridServiceText, { color: Colors.primary }]}>Membership</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <Text style={s.sectionHeader}>Recent Activity</Text>
        <View style={s.activityCard}>
          <View style={s.activityRow}>
            <View style={s.activityIconCircle}>
              <Icon name="smartphone" size={18} color={Colors.muted} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={s.activityTitle}>Airtime Purchase</Text>
              <Text style={s.activityTime}>Today, 09:42</Text>
            </View>
            <Text style={s.negativeAmount}>-R50.00</Text>
          </View>

          <View style={[s.activityRow, { borderBottomWidth: 0 }]}>
            <View style={s.activityIconCircle}>
              <Icon name="bolt" size={18} color={Colors.muted} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={s.activityTitle}>Prepaid Electricity</Text>
              <Text style={s.activityTime}>Yesterday, 19:20</Text>
            </View>
            <Text style={s.negativeAmount}>-R250.00</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  // 2. BUY AIRTIME SCREEN
  if (activeSubScreen === 'airtime') {
    const networks = [
      { id: 'MTN', name: 'MTN', bg: '#FECC00', text: '#1A1C1C' },
      { id: 'Vodacom', name: 'Vodacom', bg: '#E50000', text: '#FFFFFF' },
      { id: 'Telkom', name: 'Telkom', bg: '#0099FF', text: '#FFFFFF' },
      { id: 'CellC', name: 'Cell C', bg: '#000000', text: '#FFFFFF' },
    ];

    return (
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={s.backSubHeader} onPress={() => setActiveSubScreen('hub')}>
          <Icon name="arrow-back" size={18} color={Colors.primary} />
          <Text style={s.backSubText}>Pay & Services</Text>
        </TouchableOpacity>

        <Text style={s.h1}>Buy Airtime</Text>
        <Text style={s.subText}>Top up your mobile in seconds.</Text>

        <View style={s.fieldGroup}>
          <View style={s.fieldLabelRow}>
            <Text style={s.fieldLabel}>MOBILE NUMBER</Text>
            <TouchableOpacity onPress={() => setAirtimeMobile('+27 82 123 4567')}>
              <Text style={s.useMyNumberText}>Use my number</Text>
            </TouchableOpacity>
          </View>
          <TextInput style={s.input} value={airtimeMobile} onChangeText={setAirtimeMobile} keyboardType="phone-pad" />
        </View>

        {/* Recent Recipients */}
        <Text style={s.subSectionLabel}>RECENT</Text>
        <View style={s.recentPillRow}>
          <TouchableOpacity style={[s.recentPill, s.recentPillOn]} onPress={() => setAirtimeMobile('+27 82 123 4567')}>
            <View style={s.pillBadgeGreen}><Text style={s.pillBadgeText}>M</Text></View>
            <Text style={s.recentPillText}>My Number</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.recentPill} onPress={() => setAirtimeMobile('+27 82 999 8888')}>
            <View style={s.pillBadgeGold}><Text style={s.pillBadgeText}>T</Text></View>
            <Text style={s.recentPillText}>Thabo</Text>
          </TouchableOpacity>
        </View>

        {/* SELECT NETWORK Cards */}
        <Text style={s.subSectionLabel}>SELECT NETWORK</Text>
        <View style={s.networkCardRow}>
          {networks.map(net => {
            const isSelected = selectedNetwork === net.id;
            return (
              <TouchableOpacity
                key={net.id}
                style={[s.networkBox, isSelected && s.networkBoxOn]}
                onPress={() => setSelectedNetwork(net.id)}
                activeOpacity={0.8}
              >
                <View style={[s.networkCircle, { backgroundColor: net.bg }]}>
                  <Text style={[s.networkCircleLetter, { color: net.text }]}>{net.name[0]}</Text>
                </View>
                <Text style={s.networkNameLabel}>{net.name}</Text>
                {isSelected ? (
                  <View style={s.networkCheckCircle}>
                    <Icon name="check-circle" size={16} color={Colors.primary} />
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Select Amount */}
        <Text style={s.subSectionLabel}>SELECT AMOUNT</Text>
        <View style={s.amountGrid}>
          {['10', '20', '30', '50', '100', '200'].map(val => {
            const isSelected = airtimeAmount === val;
            return (
              <TouchableOpacity
                key={val}
                style={[s.amountGridBox, isSelected && s.amountGridBoxOn]}
                onPress={() => setAirtimeAmount(val)}
                activeOpacity={0.8}
              >
                <Text style={[s.amountGridText, isSelected && s.amountGridTextOn]}>R{val}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Other Amount */}
        <View style={s.fieldGroup}>
          <Text style={s.fieldLabel}>OTHER AMOUNT</Text>
          <TextInput
            style={s.input}
            value={airtimeAmount}
            onChangeText={setAirtimeAmount}
            placeholder="R 0.00"
            keyboardType="numeric"
          />
        </View>

        {/* Purchase Summary */}
        <View style={s.summaryCard}>
          <Text style={s.summaryHeaderTitle}>PURCHASE SUMMARY</Text>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Airtime</Text>
            <Text style={s.summaryValue}>{rand(airtimeAmount)}</Text>
          </View>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Fee</Text>
            <Text style={s.summaryValue}>R0.00</Text>
          </View>
          <View style={s.separator} />
          <View style={s.summaryRow}>
            <Text style={s.totalLabel}>Total</Text>
            <Text style={s.totalValue}>{rand(airtimeAmount)}</Text>
          </View>
          <View style={s.fundingCard}>
            <Text style={s.fundingLabel}>Payment Method</Text>
            <Text style={s.fundingTitle}>ANC Member Money (Balance: {rand(balance)})</Text>
          </View>
        </View>

        <Button text={`Pay ${rand(airtimeAmount)} Airtime  →`} onPress={handlePayAirtime} />
      </ScrollView>
    );
  }

  // 3. BUY DATA SCREEN
  if (activeSubScreen === 'data') {
    const selectedObj = dataBundles.find(b => b.label === selectedDataBundle) || dataBundles[1];
    return (
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={s.backSubHeader} onPress={() => setActiveSubScreen('hub')}>
          <Icon name="arrow-back" size={18} color={Colors.primary} />
          <Text style={s.backSubText}>Pay & Services</Text>
        </TouchableOpacity>

        <Text style={s.h1}>Buy Data</Text>
        <Text style={s.subText}>Choose a data bundle.</Text>

        {/* Recipient Box */}
        <Text style={s.subSectionLabel}>RECIPIENT</Text>
        <View style={s.dataRecipientCard}>
          <View style={s.mobileIconBox}><Icon name="smartphone" size={20} color={Colors.primary} /></View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={s.recipientPhoneText}>{dataRecipient}</Text>
            <Text style={s.networkSub}>MTN Network</Text>
          </View>
          <TouchableOpacity onPress={() => setDataRecipient('+27 82 999 8888')}>
            <Text style={s.changeText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Data Bundles */}
        <Text style={s.subSectionLabel}>DATA BUNDLES</Text>
        <View style={s.bundleStack}>
          {dataBundles.map(bundle => {
            const isSelected = selectedDataBundle === bundle.label;
            return (
              <TouchableOpacity
                key={bundle.label}
                style={[s.bundleCard, isSelected && s.bundleCardOn]}
                onPress={() => setSelectedDataBundle(bundle.label)}
                activeOpacity={0.8}
              >
                <View style={{ flex: 1 }}>
                  <Text style={s.bundleTitle}>{bundle.label}</Text>
                  <Text style={s.bundleSub}>{bundle.sub}</Text>
                </View>
                <Text style={s.bundlePrice}>R{bundle.price}</Text>
                <View style={[s.radioCircle, isSelected && s.radioCircleOn]}>
                  {isSelected ? <Icon name="check" size={12} color={Colors.white} /> : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Order Summary */}
        <View style={s.summaryCard}>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Data Bundle ({selectedObj.label})</Text>
            <Text style={s.summaryValue}>{rand(selectedObj.price)}</Text>
          </View>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Fee</Text>
            <Text style={s.summaryValue}>R0.00</Text>
          </View>
          <View style={s.separator} />
          <View style={s.summaryRow}>
            <Text style={s.totalLabel}>Total</Text>
            <Text style={s.totalValue}>{rand(selectedObj.price)}</Text>
          </View>
          <View style={s.fundingCard}>
            <Text style={s.fundingLabel}>Payment Method</Text>
            <Text style={s.fundingTitle}>ANC Member Money (Balance: {rand(balance)})</Text>
          </View>
        </View>

        <Button text={`Review Purchase (${rand(selectedObj.price)})  →`} onPress={handlePayData} />
      </ScrollView>
    );
  }

  // 4. BUY ELECTRICITY SCREEN
  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={s.backSubHeader} onPress={() => setActiveSubScreen('hub')}>
        <Icon name="arrow-back" size={18} color={Colors.primary} />
        <Text style={s.backSubText}>Pay & Services</Text>
      </TouchableOpacity>

      <Text style={s.h1}>Buy Electricity</Text>
      <Text style={s.subText}>Buy electricity for your home or business.</Text>

      {/* Meter Number Field */}
      <View style={s.fieldGroup}>
        <Text style={s.fieldLabel}>METER NUMBER</Text>
        <TextInput style={s.input} value={meterNumber} onChangeText={setMeterNumber} keyboardType="numeric" />
      </View>

      {/* Saved Home Card */}
      <View style={s.savedMeterCard}>
        <View style={s.homeIconCircle}><Icon name="home" size={18} color={Colors.primary} /></View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={s.savedMeterTitle}>Home Electricity</Text>
          <Text style={s.savedMeterSub}>Johannesburg Municipality</Text>
        </View>
        <TouchableOpacity style={s.checkboxRow} onPress={() => setSaveAsHome(!saveAsHome)}>
          <Icon name={saveAsHome ? "check-box" : "check-box-outline-blank"} size={18} color={Colors.primary} />
          <Text style={s.checkboxText}>Save as Home</Text>
        </TouchableOpacity>
      </View>

      {/* Select Amount */}
      <Text style={s.subSectionLabel}>Select Amount</Text>
      <View style={s.amountGrid}>
        {['50', '100', '250', '500'].map(val => {
          const isSelected = electricityAmount === val;
          return (
            <TouchableOpacity
              key={val}
              style={[s.amountGridBox, isSelected && s.amountGridBoxOn]}
              onPress={() => setElectricityAmount(val)}
              activeOpacity={0.8}
            >
              <Text style={[s.amountGridText, isSelected && s.amountGridTextOn]}>R{val}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={s.fieldGroup}>
        <Text style={s.fieldLabel}>CUSTOM AMOUNT (ZAR)</Text>
        <TextInput style={s.input} value={electricityAmount} onChangeText={setElectricityAmount} keyboardType="numeric" />
      </View>

      {/* Order Summary */}
      <View style={s.summaryCard}>
        <View style={s.summaryRow}>
          <Text style={s.summaryLabel}>Electricity</Text>
          <Text style={s.summaryValue}>{rand(electricityAmount)}</Text>
        </View>
        <View style={s.summaryRow}>
          <Text style={s.summaryLabel}>Network Fee</Text>
          <Text style={s.summaryValue}>R0.00</Text>
        </View>
        <View style={s.separator} />
        <View style={s.summaryRow}>
          <Text style={s.totalLabel}>Total</Text>
          <Text style={s.totalValue}>{rand(electricityAmount)}</Text>
        </View>
        <View style={s.fundingCard}>
          <Text style={s.fundingLabel}>Payment Method</Text>
          <Text style={s.fundingTitle}>ANC Member Money (Balance: {rand(balance)})</Text>
        </View>
      </View>

      <Button text={`Pay ${rand(electricityAmount)} Electricity  →`} onPress={handlePayElectricity} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 100, backgroundColor: Colors.background },
  h1: { fontSize: 26, fontWeight: '900', color: Colors.ink },
  subText: { fontSize: 12, color: Colors.muted, marginTop: 2, marginBottom: 14, fontWeight: '600' },

  backSubHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  backSubText: { fontSize: 12, color: Colors.primary, fontWeight: '800', marginLeft: 4 },

  hubBalanceCard: { backgroundColor: Colors.primaryDark, borderRadius: 16, padding: 18, marginBottom: 20 },
  hubBalanceLabel: { fontSize: 10, fontWeight: '900', color: Colors.gold, letterSpacing: 1.2 },
  hubBalanceAmount: { fontSize: 32, fontWeight: '900', color: Colors.white, marginVertical: 6 },
  addFundsBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start' },
  addFundsBtnText: { color: Colors.white, fontSize: 11, fontWeight: '800', marginLeft: 6 },

  sectionHeader: { fontSize: 16, fontWeight: '800', color: Colors.ink, marginTop: 16, marginBottom: 12 },
  favouritesRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  favouriteCard: { flex: 1, backgroundColor: Colors.white, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder },
  favIconCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  favText: { fontSize: 11, fontWeight: '700', color: Colors.ink, textAlign: 'center' },
  addFavCard: { flex: 1, borderStyle: 'dashed', borderWidth: 1.5, borderColor: Colors.surfaceBorder, borderRadius: 14, padding: 12, alignItems: 'center', justifyContent: 'center' },
  addFavPlus: { fontSize: 18, color: Colors.muted },
  addFavText: { fontSize: 11, fontWeight: '700', color: Colors.muted, marginTop: 2 },

  allServicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  gridServiceCard: { width: '31%', backgroundColor: Colors.white, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder },
  gridServiceText: { fontSize: 11, fontWeight: '700', color: Colors.ink, marginTop: 6, textAlign: 'center' },

  activityCard: { backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 14, borderWidth: 1, borderColor: Colors.surfaceBorder },
  activityRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.line },
  activityIconCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  activityTitle: { fontSize: 13, fontWeight: '700', color: Colors.ink },
  activityTime: { fontSize: 11, color: Colors.muted, marginTop: 1 },
  negativeAmount: { fontSize: 13, fontWeight: '800', color: Colors.ink },

  fieldGroup: { marginTop: 14, marginBottom: 10 },
  fieldLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fieldLabel: { color: '#566158', fontSize: 10, fontWeight: '800', letterSpacing: 0.9 },
  useMyNumberText: { color: Colors.primary, fontSize: 11, fontWeight: '800' },
  input: { borderWidth: 1, borderColor: '#DCE4DD', borderRadius: 9, padding: 12, marginTop: 6, fontSize: 14, color: Colors.ink, backgroundColor: Colors.white },

  subSectionLabel: { fontSize: 10, fontWeight: '900', color: Colors.muted, letterSpacing: 1.2, marginTop: 16, marginBottom: 8 },
  recentPillRow: { flexDirection: 'row', gap: 8 },
  recentPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.surfaceBorder },
  recentPillOn: { borderColor: Colors.primary, backgroundColor: '#F0F9F2' },
  pillBadgeGreen: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  pillBadgeGold: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  pillBadgeText: { fontSize: 10, fontWeight: '900', color: Colors.white },
  recentPillText: { fontSize: 12, fontWeight: '700', color: Colors.ink },

  networkCardRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  networkBox: {
    width: 80,
    height: 84,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  networkBoxOn: { borderColor: Colors.primary, backgroundColor: '#F0F9F2' },
  networkCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  networkCircleLetter: { fontSize: 16, fontWeight: '900' },
  networkNameLabel: { fontSize: 11, fontWeight: '700', color: Colors.ink },
  networkCheckCircle: { position: 'absolute', top: 4, right: 4 },

  amountGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  amountGridBox: { width: '31%', backgroundColor: Colors.white, borderRadius: 10, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder },
  amountGridBoxOn: { backgroundColor: Colors.primary, borderColor: Colors.primaryDark },
  amountGridText: { fontSize: 15, fontWeight: '800', color: Colors.ink },
  amountGridTextOn: { color: Colors.white },

  dataRecipientCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: Colors.surfaceBorder },
  mobileIconBox: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E3F3E7', alignItems: 'center', justifyContent: 'center' },
  recipientPhoneText: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  networkSub: { fontSize: 11, color: Colors.muted },
  changeText: { fontSize: 12, fontWeight: '800', color: Colors.primary },

  bundleStack: { gap: 8, marginBottom: 16 },
  bundleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: Colors.surfaceBorder },
  bundleCardOn: { borderColor: Colors.primary, backgroundColor: '#F0F9F2' },
  bundleTitle: { fontSize: 15, fontWeight: '800', color: Colors.ink },
  bundleSub: { fontSize: 11, color: Colors.muted, marginTop: 2 },
  bundlePrice: { fontSize: 16, fontWeight: '900', color: Colors.ink, marginRight: 10 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.surfaceBorder, alignItems: 'center', justifyContent: 'center' },
  radioCircleOn: { backgroundColor: Colors.primary, borderColor: Colors.primary },

  summaryCard: { backgroundColor: Colors.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: Colors.surfaceBorder, marginTop: 14, marginBottom: 14 },
  summaryHeaderTitle: { fontSize: 10, fontWeight: '900', color: Colors.muted, letterSpacing: 1.2, marginBottom: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  summaryLabel: { fontSize: 12, color: Colors.muted },
  summaryValue: { fontSize: 12, fontWeight: '700', color: Colors.ink },
  separator: { height: 1, backgroundColor: Colors.line, marginVertical: 8 },
  totalLabel: { fontSize: 15, fontWeight: '800', color: Colors.ink },
  totalValue: { fontSize: 18, fontWeight: '900', color: Colors.primary },
  fundingCard: { backgroundColor: Colors.surfaceContainerLow, borderRadius: 8, padding: 10, marginTop: 10 },
  fundingLabel: { fontSize: 9, fontWeight: '900', color: Colors.muted, letterSpacing: 0.8 },
  fundingTitle: { fontSize: 11, fontWeight: '700', color: Colors.ink, marginTop: 2 },

  savedMeterCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: Colors.surfaceBorder, marginTop: 10 },
  homeIconCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E3F3E7', alignItems: 'center', justifyContent: 'center' },
  savedMeterTitle: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  savedMeterSub: { fontSize: 11, color: Colors.muted },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  checkboxText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
});
