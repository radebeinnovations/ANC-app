import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import Field from '../components/Field';
import { Icon, MastercardLogo } from '../components/Icons';
import Pills from '../components/Pills';
import { Colors } from '../theme/colors';

const rand = (n) => `R${Number(n || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ServicesScreen({ finish, balance = 1500, onDeductBalance, onDepositFunds, setStepText, initialSubScreen = 'hub' }) {
  const [activeSubScreen, setActiveSubScreen] = useState(initialSubScreen || 'hub'); // 'hub' | 'airtime' | 'data' | 'electricity' | 'bills'

  // Clear stepText header subtitle on Services screen so it doesn't show "STEP 1 OF 3"
  React.useEffect(() => {
    if (setStepText) setStepText('');
  }, [setStepText]);

  // Dynamic Favourites State
  const [favourites, setFavourites] = useState([
    { id: '1', title: 'MTN Airtime', icon: 'smartphone', color: Colors.primary, bg: '#F0F9F2', type: 'airtime' },
    { id: '2', title: 'Home Electricity', icon: 'bolt', color: '#D4A000', bg: '#FFF9E6', type: 'electricity' },
  ]);

  // Add Favourite Modal State
  const [showAddFavModal, setShowAddFavModal] = useState(false);
  const [newFavTitle, setNewFavTitle] = useState('');
  const [newFavType, setNewFavType] = useState('Airtime'); // 'Airtime' | 'Data' | 'Electricity' | 'Bills'
  const [newFavNumber, setNewFavNumber] = useState('');

  // Top Up Modal State
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('500');

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

  // STS Electricity Token Voucher Modal State
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');
  const [tokenUnits, setTokenUnits] = useState('');
  const [tokenAmount, setTokenAmount] = useState(0);
  const [tokenMeter, setTokenMeter] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);

  const generateSTSToken = () => {
    const g = () => Math.floor(1000 + Math.random() * 9000);
    return `${g()} ${g()} ${g()} ${g()} ${g()}`;
  };

  const copyTokenToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(generatedToken.replace(/\s+/g, ''));
    }
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  // Bills State
  const [selectedBiller, setSelectedBiller] = useState('City of Johannesburg');
  const [billAccount, setBillAccount] = useState('9876 5432 10');
  const [billAmount, setBillAmount] = useState('350');

  const billers = [
    { id: 'coj', name: 'City of Johannesburg', icon: 'location-city' },
    { id: 'tshwane', name: 'City of Tshwane', icon: 'location-city' },
    { id: 'ekurhuleni', name: 'Ekurhuleni Municipality', icon: 'location-city' },
    { id: 'eskom', name: 'Eskom Direct', icon: 'bolt' },
  ];

  const handleAddFavourite = () => {
    if (!newFavTitle.trim()) return;

    let icon = 'smartphone';
    let color = Colors.primary;
    let bg = '#F0F9F2';

    if (newFavType === 'Data') {
      icon = 'wifi';
      color = '#0080FF';
      bg = '#EBF5FF';
    } else if (newFavType === 'Electricity') {
      icon = 'bolt';
      color = '#D4A000';
      bg = '#FFF9E6';
    } else if (newFavType === 'Bills') {
      icon = 'receipt-long';
      color = '#006933';
      bg = '#F0F9F2';
    }

    const newFavItem = {
      id: String(Date.now()),
      title: newFavTitle,
      icon,
      color,
      bg,
      type: newFavType.toLowerCase(),
    };

    setFavourites([...favourites, newFavItem]);
    setShowAddFavModal(false);
    setNewFavTitle('');
    setNewFavNumber('');
  };

  const handleDeposit = () => {
    const num = parseFloat(depositAmount);
    if (!isNaN(num) && num > 0 && onDepositFunds) {
      onDepositFunds(num);
      setShowDepositModal(false);
      setDepositAmount('500');
    }
  };

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
    const estimatedKwh = (num / 2.65).toFixed(1);
    const newToken = generateSTSToken();

    if (onDeductBalance) onDeductBalance(num, `Prepaid Electricity Token (${newToken})`);

    setGeneratedToken(newToken);
    setTokenUnits(estimatedKwh);
    setTokenAmount(num);
    setTokenMeter(meterNumber);
    setActiveSubScreen('token_receipt');
  };

  const handlePayBills = () => {
    const num = parseFloat(billAmount) || 0;
    if (onDeductBalance) onDeductBalance(num, `Bill Payment (${selectedBiller})`);
    finish(`Bill payment of ${rand(num)} to ${selectedBiller} complete.`);
  };

  // 1. HUB SCREEN (Matches Screenshot)
  if (activeSubScreen === 'hub') {
    return (
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.h1}>Pay & Services</Text>
        <Text style={s.subText}>Everyday services, all in one place.</Text>

        {/* Green Balance Card Banner */}
        <View style={s.hubBalanceCard}>
          <Text style={s.hubBalanceLabel}>AVAILABLE BALANCE</Text>
          <Text style={s.hubBalanceAmount}>{rand(balance)}</Text>
          <TouchableOpacity style={s.addFundsBtn} onPress={() => setShowDepositModal(true)} activeOpacity={0.8}>
            <Text style={s.addFundsBtnText}>＋ Add Funds</Text>
          </TouchableOpacity>
        </View>

        {/* Favourites Section */}
        <Text style={s.sectionHeader}>Favourites</Text>
        <View style={s.favouritesRow}>
          {favourites.map(fav => (
            <TouchableOpacity
              key={fav.id}
              style={s.favouriteCard}
              onPress={() => setActiveSubScreen(fav.type === 'electricity' ? 'electricity' : (fav.type === 'bills' ? 'bills' : 'airtime'))}
              activeOpacity={0.8}
            >
              <View style={[s.favIconSquare, { backgroundColor: fav.bg }]}>
                <Icon name={fav.icon} size={22} color={fav.color} />
              </View>
              <Text style={s.favText} numberOfLines={2}>{fav.title}</Text>
            </TouchableOpacity>
          ))}

          {/* Add New Favourite Button */}
          <TouchableOpacity style={s.addFavCardDashed} onPress={() => setShowAddFavModal(true)} activeOpacity={0.8}>
            <View style={s.addFavPlusSquare}>
              <Text style={s.addFavPlusText}>＋</Text>
            </View>
            <Text style={s.addFavLabelText}>Add New</Text>
          </TouchableOpacity>
        </View>

        {/* All Services 6-Grid */}
        <Text style={s.sectionHeader}>All Services</Text>
        <View style={s.allServicesGrid}>
          <TouchableOpacity style={s.gridServiceCard} onPress={() => setActiveSubScreen('airtime')} activeOpacity={0.8}>
            <View style={s.gridIconCircle}>
              <Icon name="smartphone" size={22} color={Colors.primary} />
            </View>
            <Text style={s.gridServiceText}>Airtime</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.gridServiceCard} onPress={() => setActiveSubScreen('data')} activeOpacity={0.8}>
            <View style={s.gridIconCircle}>
              <Icon name="wifi" size={22} color={Colors.primary} />
            </View>
            <Text style={s.gridServiceText}>Data</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.gridServiceCard} onPress={() => setActiveSubScreen('electricity')} activeOpacity={0.8}>
            <View style={s.gridIconCircle}>
              <Icon name="bolt" size={22} color={Colors.primary} />
            </View>
            <Text style={s.gridServiceText}>Electricity</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.gridServiceCard} onPress={() => setActiveSubScreen('bills')} activeOpacity={0.8}>
            <View style={s.gridIconCircle}>
              <Icon name="receipt-long" size={22} color={Colors.primary} />
            </View>
            <Text style={s.gridServiceText}>Bills</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.gridServiceCard} onPress={() => finish('Donation screen')} activeOpacity={0.8}>
            <View style={s.gridIconCircle}>
              <Icon name="volunteer-activism" size={22} color={Colors.primary} />
            </View>
            <Text style={s.gridServiceText}>Donations</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.gridServiceCard} onPress={() => finish('Membership screen')} activeOpacity={0.8}>
            <View style={s.gridIconCircle}>
              <Icon name="card-membership" size={22} color={Colors.primary} />
            </View>
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

        {/* ADD NEW FAVOURITE MODAL */}
        <Modal visible={showAddFavModal} animationType="slide" transparent>
          <View style={s.modalBackdrop}>
            <View style={s.modalCard}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>Add New Favourite</Text>
                <TouchableOpacity onPress={() => setShowAddFavModal(false)}>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.muted }}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={s.modalSub}>Save a quick shortcut to your Favourites section.</Text>

              {/* Service Type Selection */}
              <Text style={s.typeLabel}>SERVICE TYPE</Text>
              <View style={s.typePillRow}>
                {['Airtime', 'Data', 'Electricity', 'Bills'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[s.typePill, newFavType === type && s.typePillSelected]}
                    onPress={() => setNewFavType(type)}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.typePillText, newFavType === type && s.typePillTextSelected]}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Field
                label="FAVOURITE TITLE / NAME"
                value={newFavTitle}
                onChangeText={setNewFavTitle}
                placeholder="e.g. Vodacom Data or Office Electricity"
              />

              <Field
                label="MOBILE / METER NUMBER (OPTIONAL)"
                value={newFavNumber}
                onChangeText={setNewFavNumber}
                placeholder="e.g. +27 82 123 4567"
                keyboardType="numeric"
              />

              <Button text="Save Favourite" onPress={handleAddFavourite} disabled={!newFavTitle.trim()} />
            </View>
          </View>
        </Modal>

        {/* DEPOSIT / TOP UP MODAL */}
        <Modal visible={showDepositModal} animationType="slide" transparent>
          <View style={s.modalBackdrop}>
            <View style={s.modalCard}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>Add Funds to Wallet</Text>
                <TouchableOpacity onPress={() => setShowDepositModal(false)}>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.muted }}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={s.modalSub}>Select or enter an amount to top up your available balance.</Text>

              <Field label="AMOUNT (ZAR)" value={depositAmount} onChangeText={setDepositAmount} keyboardType="numeric" placeholder="Enter amount" />
              <Pills value={depositAmount} setValue={setDepositAmount} options={[100, 250, 500, 1000]} />

              {/* Linked Mastercard Payment Source */}
              <Text style={s.paymentMethodLabel}>FUNDING PAYMENT SOURCE</Text>
              <View style={s.linkedCardRow}>
                <View style={s.cardDarkIconBox}>
                  <MastercardLogo width={32} height={20} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={s.cardTitleText}>Standard Bank Gold Mastercard</Text>
                  <Text style={s.cardSubText}>•••• •••• •••• 4892 · Exp 08/28</Text>
                </View>
                <View style={s.defaultCardBadge}>
                  <Text style={s.defaultCardBadgeText}>DEFAULT</Text>
                </View>
              </View>

              <View style={{ marginTop: 20 }}>
                <Button text={`＋ Deposit R${depositAmount}`} onPress={handleDeposit} />
              </View>
            </View>
          </View>
        </Modal>
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

        {/* Network Selection Helpful Note */}
        <View style={s.networkNoteBanner}>
          <Icon name="info-outline" size={16} color={Colors.primary} />
          <Text style={s.networkNoteText}>
            <Text style={{ fontWeight: '800' }}>Note:</Text> Please ensure you select the correct mobile network operator (MTN, Vodacom, Telkom, Cell C) matching the recipient's phone number so the top-up completes successfully.
          </Text>
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

        <Button text={`Pay R${airtimeAmount}`} onPress={handlePayAirtime} />
      </ScrollView>
    );
  }

  // 3. DATA SCREEN
  if (activeSubScreen === 'data') {
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

        <Text style={s.h1}>Buy Data Bundles</Text>
        <Text style={s.subText}>Fast data packages directly to your line.</Text>

        <Field label="RECIPIENT NUMBER" value={dataRecipient} onChangeText={setDataRecipient} keyboardType="phone-pad" />

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

        {/* Network Selection Helpful Note */}
        <View style={s.networkNoteBanner}>
          <Icon name="info-outline" size={16} color={Colors.primary} />
          <Text style={s.networkNoteText}>
            <Text style={{ fontWeight: '800' }}>Note:</Text> Please ensure you select the correct mobile network operator (MTN, Vodacom, Telkom, Cell C) matching the recipient's phone number so the data bundle top-up is processed successfully.
          </Text>
        </View>

        <Text style={s.subSectionLabel}>SELECT BUNDLE</Text>
        <View style={s.bundleStack}>
          {dataBundles.map((b, idx) => {
            const isSelected = selectedDataBundle === b.label;
            return (
              <TouchableOpacity
                key={idx}
                style={[s.bundleRow, isSelected && s.bundleRowOn]}
                onPress={() => setSelectedDataBundle(b.label)}
                activeOpacity={0.8}
              >
                <View style={{ flex: 1 }}>
                  <Text style={s.bundleLabel}>{b.label}</Text>
                  <Text style={s.bundleSub}>{b.sub}</Text>
                </View>
                <Text style={s.bundlePrice}>R{b.price}.00</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button text={`Purchase ${selectedDataBundle}`} onPress={handlePayData} />
      </ScrollView>
    );
  }

  // 4. PAY BILLS SCREEN
  if (activeSubScreen === 'bills') {
    return (
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={s.backSubHeader} onPress={() => setActiveSubScreen('hub')}>
          <Icon name="arrow-back" size={18} color={Colors.primary} />
          <Text style={s.backSubText}>Pay & Services</Text>
        </TouchableOpacity>

        <Text style={s.h1}>Pay Bills & Utilities</Text>
        <Text style={s.subText}>Pay municipal accounts, water, rates and utility bills.</Text>

        <Text style={s.subSectionLabel}>SELECT BILLER / MUNICIPALITY</Text>
        <View style={s.bundleStack}>
          {billers.map(biller => {
            const isSelected = selectedBiller === biller.name;
            return (
              <TouchableOpacity
                key={biller.id}
                style={[s.bundleRow, isSelected && s.bundleRowOn]}
                onPress={() => setSelectedBiller(biller.name)}
                activeOpacity={0.8}
              >
                <View style={[s.gridIconCircle, { marginBottom: 0, marginRight: 10 }]}>
                  <Icon name={biller.icon} size={20} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.bundleLabel}>{biller.name}</Text>
                  <Text style={s.bundleSub}>Municipal Rates & Taxes</Text>
                </View>
                {isSelected ? <Icon name="check-circle" size={18} color={Colors.primary} /> : null}
              </TouchableOpacity>
            );
          })}
        </View>

        <Field label="ACCOUNT / METER NUMBER" value={billAccount} onChangeText={setBillAccount} keyboardType="numeric" />

        <Field label="AMOUNT TO PAY (ZAR)" value={billAmount} onChangeText={setBillAmount} keyboardType="numeric" />
        <Pills value={billAmount} setValue={setBillAmount} options={[100, 250, 500, 1000]} />

        <Button text={`Pay R${billAmount} to ${selectedBiller}`} onPress={handlePayBills} />
      </ScrollView>
    );
  }

  // 6. DEDICATED ELECTRICITY TOKEN RECEIPT SCREEN
  if (activeSubScreen === 'token_receipt') {
    return (
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={s.backSubHeader} onPress={() => setActiveSubScreen('hub')}>
          <Icon name="arrow-back" size={18} color={Colors.primary} />
          <Text style={s.backSubText}>Pay & Services</Text>
        </TouchableOpacity>

        {/* Success Header Badge */}
        <View style={s.receiptSuccessCard}>
          <View style={s.receiptSuccessIconCircle}>
            <Icon name="check" size={24} color="#008542" />
          </View>
          <Text style={s.receiptSuccessTitle}>Electricity Voucher Token</Text>
          <Text style={s.receiptSuccessSub}>Your 20-digit STS prepaid electricity token has been generated.</Text>
        </View>

        {/* Giant 20-Digit Token Display Box */}
        <View style={s.giantTokenCard}>
          <Text style={s.giantTokenHeaderLabel}>20-DIGIT METER TOKEN PIN</Text>
          <Text style={s.giantTokenPinText}>{generatedToken}</Text>

          <TouchableOpacity style={s.giantCopyBtn} onPress={copyTokenToClipboard} activeOpacity={0.8}>
            <Icon name="content-copy" size={18} color={Colors.white} />
            <Text style={s.giantCopyBtnText}>{copiedToast ? '✓ Copied to Clipboard!' : 'Copy 20-Digit Token'}</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Stack */}
        <View style={s.receiptSummaryStack}>
          <View style={s.receiptSummaryRow}>
            <Text style={s.receiptSummaryLabel}>Meter Number</Text>
            <Text style={s.receiptSummaryValue}>{tokenMeter}</Text>
          </View>

          <View style={s.receiptSummaryRow}>
            <Text style={s.receiptSummaryLabel}>Units Issued</Text>
            <Text style={s.receiptSummaryValueGreen}>{tokenUnits} kWh</Text>
          </View>

          <View style={s.receiptSummaryRow}>
            <Text style={s.receiptSummaryLabel}>Tariff Rate</Text>
            <Text style={s.receiptSummaryValue}>~R2.65 / kWh</Text>
          </View>

          <View style={[s.receiptSummaryRow, { borderBottomWidth: 0 }]}>
            <Text style={s.receiptSummaryLabel}>Total Amount Paid</Text>
            <Text style={s.receiptSummaryValue}>R{Number(tokenAmount).toFixed(2)}</Text>
          </View>
        </View>

        {/* Keypad Meter Notice */}
        <View style={s.meterNoticeBox}>
          <Icon name="lightbulb" size={20} color="#6E5700" />
          <Text style={s.meterNoticeText}>
            Key in this 20-digit PIN number into your prepaid keypad meter at home followed by the enter (↵) button to load your electricity units.
          </Text>
        </View>

        <Button text="Done" onPress={() => finish('')} />
      </ScrollView>
    );
  }

  // 5. ELECTRICITY SCREEN
  const numElectricity = parseFloat(electricityAmount || 0);
  const estimatedKwh = (numElectricity / 2.65).toFixed(1);

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={s.backSubHeader} onPress={() => setActiveSubScreen('hub')}>
        <Icon name="arrow-back" size={18} color={Colors.primary} />
        <Text style={s.backSubText}>Pay & Services</Text>
      </TouchableOpacity>

      <Text style={s.h1}>Prepaid Electricity</Text>
      <Text style={s.subText}>Purchase electricity tokens instantly.</Text>

      <Field label="METER NUMBER" value={meterNumber} onChangeText={setMeterNumber} keyboardType="numeric" />

      <Field label="AMOUNT (ZAR)" value={electricityAmount} onChangeText={setElectricityAmount} keyboardType="numeric" />
      <Pills value={electricityAmount} setValue={setElectricityAmount} options={[50, 100, 250, 500]} />

      {/* ESTIMATED UNITS / KWH CALCULATOR CARD */}
      <View style={s.kwhInfoCard}>
        <View style={s.kwhIconCircle}>
          <Icon name="bolt" size={24} color="#6E5700" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.kwhLabel}>ESTIMATED ELECTRICITY UNITS</Text>
          <View style={s.kwhValueRow}>
            <Text style={s.kwhValueText}>{estimatedKwh}</Text>
            <Text style={s.kwhUnitText}>kWh</Text>
          </View>
          <Text style={s.kwhSubText}>Based on SA municipal domestic prepaid tariff (~R2.65 / kWh incl. VAT)</Text>
        </View>
      </View>

      <Button text={`Buy R${electricityAmount} Token (${estimatedKwh} kWh)`} onPress={handlePayElectricity} />

      {/* PREPAID ELECTRICITY STS TOKEN VOUCHER MODAL */}
      <Modal visible={showTokenModal} animationType="slide" transparent>
        <View style={s.modalBackdrop}>
          <View style={[s.modalCard, { backgroundColor: '#FFFFFF' }]}>
            <View style={s.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={s.tokenIconCircle}>
                  <Icon name="bolt" size={20} color="#6E5700" />
                </View>
                <Text style={s.modalTitle}>Electricity Voucher Token</Text>
              </View>
              <TouchableOpacity onPress={() => setShowTokenModal(false)}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.muted }}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={s.tokenSuccessSub}>
              Your 20-digit STS prepaid electricity voucher token has been generated successfully.
            </Text>

            {/* 20-Digit Token Display Box */}
            <View style={s.tokenDisplayCard}>
              <Text style={s.tokenDisplayLabel}>20-DIGIT METER TOKEN PIN</Text>
              <Text style={s.tokenPinText}>{generatedToken}</Text>
              
              <TouchableOpacity style={s.copyTokenBtn} onPress={copyTokenToClipboard} activeOpacity={0.8}>
                <Icon name="content-copy" size={16} color={Colors.white} />
                <Text style={s.copyTokenBtnText}>{copiedToast ? '✓ Copied to Clipboard!' : 'Copy 20-Digit Token'}</Text>
              </TouchableOpacity>
            </View>

            {/* Summary Details Stack */}
            <View style={s.tokenDetailsStack}>
              <View style={s.tokenDetailRow}>
                <Text style={s.tokenDetailLabel}>Meter Number</Text>
                <Text style={s.tokenDetailValue}>{tokenMeter}</Text>
              </View>

              <View style={s.tokenDetailRow}>
                <Text style={s.tokenDetailLabel}>Units Issued</Text>
                <Text style={s.tokenDetailValueHighlight}>{tokenUnits} kWh</Text>
              </View>

              <View style={[s.tokenDetailRow, { borderBottomWidth: 0 }]}>
                <Text style={s.tokenDetailLabel}>Amount Paid</Text>
                <Text style={s.tokenDetailValue}>R{Number(tokenAmount).toFixed(2)}</Text>
              </View>
            </View>

            <Text style={s.meterInstructionsNotice}>
              💡 Key in this 20-digit number into your prepaid keypad meter followed by the enter button.
            </Text>

            <Button text="Done" onPress={() => setShowTokenModal(false)} />
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

  hubBalanceCard: {
    backgroundColor: '#006933',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  hubBalanceLabel: { fontSize: 10, fontWeight: '900', color: '#FECC00', letterSpacing: 1 },
  hubBalanceAmount: { fontSize: 32, fontWeight: '900', color: Colors.white, marginVertical: 6 },
  addFundsBtn: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addFundsBtnText: { color: Colors.white, fontSize: 12, fontWeight: '800' },

  sectionHeader: { fontSize: 15, fontWeight: '800', color: Colors.ink, marginTop: 14, marginBottom: 10 },

  favouritesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  favouriteCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  favIconSquare: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  favText: { fontSize: 11, fontWeight: '800', color: Colors.ink, textAlign: 'center' },

  addFavCardDashed: {
    flex: 1,
    backgroundColor: '#F9FAF9',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#C0C7C1',
    borderStyle: 'dashed',
  },
  addFavPlusSquare: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addFavPlusText: { fontSize: 20, fontWeight: '900', color: Colors.muted },
  addFavLabelText: { fontSize: 11, fontWeight: '800', color: Colors.muted, marginTop: 2 },

  allServicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  gridServiceCard: {
    width: '31%',
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  gridIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F0F9F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  gridServiceText: { fontSize: 11, fontWeight: '800', color: Colors.ink },

  activityCard: {
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
  activityIconCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  activityTitle: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  activityTime: { fontSize: 11, color: Colors.muted, marginTop: 1 },
  negativeAmount: { fontSize: 13, fontWeight: '800', color: Colors.ink },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.55)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '900', color: Colors.ink },
  modalSub: { fontSize: 12, color: Colors.muted, marginTop: 4, marginBottom: 14 },

  typeLabel: { fontSize: 10, fontWeight: '800', color: Colors.muted, letterSpacing: 0.8, marginBottom: 8 },
  typePillRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  typePill: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  typePillSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typePillText: { fontSize: 12, fontWeight: '800', color: Colors.ink },
  typePillTextSelected: { color: Colors.white },

  backSubHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  backSubText: { fontSize: 13, fontWeight: '800', color: Colors.primary },
  fieldGroup: { marginBottom: 14 },
  fieldLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  fieldLabel: { fontSize: 10, fontWeight: '800', color: Colors.muted, letterSpacing: 0.8 },
  useMyNumberText: { fontSize: 11, fontWeight: '800', color: Colors.primary },
  input: { backgroundColor: Colors.white, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: Colors.surfaceBorder, fontSize: 13, color: Colors.ink },
  subSectionLabel: { fontSize: 11, fontWeight: '800', color: Colors.muted, letterSpacing: 0.8, marginTop: 10, marginBottom: 8 },

  networkCardRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  networkBox: { flex: 1, backgroundColor: Colors.white, borderRadius: 12, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder, position: 'relative' },
  networkBoxOn: { borderColor: Colors.primary, backgroundColor: '#F9FCFA' },
  networkCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  networkCircleLetter: { fontSize: 14, fontWeight: '900' },
  networkNameLabel: { fontSize: 10, fontWeight: '800', color: Colors.ink },
  networkCheckCircle: { position: 'absolute', top: 4, right: 4 },

  amountGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  amountGridBox: { width: '31%', backgroundColor: Colors.white, borderRadius: 10, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder },
  amountGridBoxOn: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  amountGridText: { fontSize: 14, fontWeight: '800', color: Colors.ink },
  amountGridTextOn: { color: Colors.white },

  bundleStack: { gap: 8, marginBottom: 14 },
  bundleRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: Colors.surfaceBorder },
  bundleRowOn: { borderColor: Colors.primary, backgroundColor: '#F9FCFA' },
  bundleLabel: { fontSize: 14, fontWeight: '800', color: Colors.ink },
  bundleSub: { fontSize: 11, color: Colors.muted, marginTop: 1 },
  bundlePrice: { fontSize: 14, fontWeight: '900', color: Colors.primary },

  kwhInfoCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  kwhIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FECC00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kwhLabel: { fontSize: 10, fontWeight: '900', color: '#6E5700', letterSpacing: 1, fontFamily: 'Inter' },
  kwhValueRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 2, marginBottom: 2 },
  kwhValueText: { fontSize: 26, fontWeight: '900', color: '#6E5700', fontFamily: 'Hanken Grotesk' },
  kwhUnitText: { fontSize: 14, fontWeight: '800', color: '#92400E', marginLeft: 4, fontFamily: 'Inter' },
  kwhSubText: { fontSize: 11, color: '#92400E', fontFamily: 'Inter' },

  networkNoteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 105, 51, 0.2)',
    padding: 10,
    marginTop: 4,
    marginBottom: 14,
  },
  networkNoteText: { flex: 1, marginLeft: 8, fontSize: 11, color: Colors.ink, lineHeight: 15, fontFamily: 'Inter' },

  tokenIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FECC00', alignItems: 'center', justifyContent: 'center' },
  tokenSuccessSub: { fontSize: 13, color: Colors.muted, marginBottom: 14, fontFamily: 'Inter' },
  tokenDisplayCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  tokenDisplayLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 6, fontFamily: 'Inter' },
  tokenPinText: { color: '#FECC00', fontSize: 20, fontWeight: '900', letterSpacing: 2, fontFamily: 'monospace', textAlign: 'center', marginBottom: 12 },
  copyTokenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  copyTokenBtnText: { color: Colors.white, fontSize: 12, fontWeight: '800', fontFamily: 'Inter' },

  tokenDetailsStack: { backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 14, marginBottom: 14 },
  tokenDetailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tokenDetailLabel: { fontSize: 12, color: Colors.muted, fontFamily: 'Inter' },
  tokenDetailValue: { fontSize: 13, fontWeight: '700', color: Colors.ink, fontFamily: 'Inter' },
  tokenDetailValueHighlight: { fontSize: 13, fontWeight: '800', color: Colors.primary, fontFamily: 'Inter' },

  meterInstructionsNotice: { fontSize: 11, color: Colors.muted, lineHeight: 16, marginBottom: 16, fontFamily: 'Inter' },

  receiptSuccessCard: { alignItems: 'center', marginVertical: 12 },
  receiptSuccessIconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E2F4E6', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  receiptSuccessTitle: { fontSize: 22, fontWeight: '900', color: Colors.ink, fontFamily: 'Hanken Grotesk' },
  receiptSuccessSub: { fontSize: 13, color: Colors.muted, marginTop: 2, fontFamily: 'Inter', textAlign: 'center' },

  giantTokenCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginVertical: 16,
    borderWidth: 2,
    borderColor: '#FECC00',
  },
  giantTokenHeaderLabel: { color: '#94A3B8', fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 10, fontFamily: 'Inter' },
  giantTokenPinText: { color: '#FECC00', fontSize: 24, fontWeight: '900', letterSpacing: 2, fontFamily: 'monospace', textAlign: 'center', marginBottom: 16 },
  giantCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#006933',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  giantCopyBtnText: { color: Colors.white, fontSize: 13, fontWeight: '800', fontFamily: 'Inter' },

  receiptSummaryStack: { backgroundColor: Colors.white, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, marginBottom: 16 },
  receiptSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  receiptSummaryLabel: { fontSize: 13, color: Colors.muted, fontFamily: 'Inter' },
  receiptSummaryValue: { fontSize: 14, fontWeight: '700', color: Colors.ink, fontFamily: 'Inter' },
  receiptSummaryValueGreen: { fontSize: 14, fontWeight: '900', color: '#008542', fontFamily: 'Inter' },

  meterNoticeBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  meterNoticeText: { flex: 1, fontSize: 12, color: '#92400E', lineHeight: 17, fontFamily: 'Inter' },

  paymentMethodLabel: { fontSize: 10, fontWeight: '800', color: Colors.muted, letterSpacing: 0.9, marginTop: 16, marginBottom: 8, fontFamily: 'Inter' },
  linkedCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#006933',
    padding: 12,
  },
  cardDarkIconBox: {
    width: 44,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleText: { fontSize: 13, fontWeight: '700', color: Colors.ink, fontFamily: 'Inter' },
  cardSubText: { fontSize: 11, color: Colors.muted, marginTop: 2, fontFamily: 'Inter' },
  defaultCardBadge: { backgroundColor: 'rgba(0, 105, 51, 0.1)', borderRadius: 6, paddingVertical: 4, paddingHorizontal: 8 },
  defaultCardBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.primary, fontFamily: 'Inter' },
});
