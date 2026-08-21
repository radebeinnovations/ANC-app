import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Components
import Header from './src/components/Header';
import Nav from './src/components/Nav';
import SideDrawer from './src/components/SideDrawer';

// Screens
import BranchScreen from './src/screens/BranchScreen';
import CardManagerScreen from './src/screens/CardManagerScreen';
import DonationScreen from './src/screens/DonationScreen';
import HomeScreen from './src/screens/HomeScreen';
import MembershipScreen from './src/screens/MembershipScreen';
import MoneyScreen from './src/screens/MoneyScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import NewsroomScreen from './src/screens/NewsroomScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ReceiveMoneyScreen from './src/screens/ReceiveMoneyScreen';
import SendMoneyScreen from './src/screens/SendMoneyScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import StatementDetailScreen from './src/screens/StatementDetailScreen';
import TransferMoneyScreen from './src/screens/TransferMoneyScreen';
import SignInScreen from './src/screens/SignInScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

import { Colors } from './src/theme/colors';

export default function App() {
  const [signedIn, setSignedIn] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [tab, setTab] = useState('Home');
  const [screen, setScreen] = useState('main');
  const [notice, setNotice] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Interactive Demo Wallet Balance & Transactions State
  const [balance, setBalance] = useState(1500.00);
  const [recentActivity, setRecentActivity] = useState([
    { id: '1', title: 'Deposit', amount: 500.00, time: 'Today, 10:23 AM', type: 'deposit' },
    { id: '2', title: 'Airtime Purchase', amount: 50.00, time: 'Yesterday', type: 'expense' },
    { id: '3', title: 'ANC Donation', amount: 100.00, time: '02 August 2026', type: 'expense' },
  ]);

  const [cards, setCards] = useState([
    { id: '1', title: 'ANC Member Wallet Card', last4: '4821', brand: 'VISA', exp: '12/28', color: Colors.primary, isDefault: true },
    { id: '2', title: 'Standard Bank Gold', last4: '1092', brand: 'MASTERCARD', exp: '09/27', color: Colors.ink, isDefault: false },
  ]);

  const [stepText, setStepText] = useState('STEP 1 OF 3');

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const linkId = 'google-fonts-anc';
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap';
        document.head.appendChild(link);
      }

      const styleId = 'global-inter-font-style';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          body, html, #root {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  const [initialSubScreen, setInitialSubScreen] = useState('hub');
  const [initialDonationStep, setInitialDonationStep] = useState(0);

  const open = (name, subScreen = 'hub') => {
    setNotice('');
    if (name === 'send') setStepText('STEP 1 OF 3');
    else setStepText('');

    if (['airtime', 'data', 'electricity', 'bills'].includes(name)) {
      setInitialSubScreen(name);
      setScreen('services');
    } else if (name === 'community') {
      setInitialDonationStep(1);
      setScreen('donate');
    } else if (name === 'donate') {
      setInitialDonationStep(2);
      setScreen('donate');
    } else {
      setInitialSubScreen(subScreen);
      setScreen(name);
    }
  };
  const finish = (message) => {
    setScreen('');
    setStepText('');
    if (typeof message === 'string' && message.trim().length > 0) {
      setNotice(message);
    } else {
      setNotice('');
    }
  };

  const handleAddCard = (newCard) => {
    setCards([...cards, { ...newCard, id: String(Date.now()), isDefault: false }]);
    setNotice(`Card ending in •••• ${newCard.last4} added successfully.`);
  };

  const handleDeductBalance = (amount, title) => {
    const num = parseFloat(amount) || 0;
    if (num <= 0) return;
    setBalance(prev => Math.max(0, prev - num));
    setRecentActivity(prev => [
      { id: String(Date.now()), title: title || 'Payment', amount: num, time: 'Just now', type: 'expense' },
      ...prev,
    ]);
  };

  const handleDepositFunds = (amount) => {
    const num = parseFloat(amount) || 0;
    if (num <= 0) return;
    setBalance(prev => prev + num);
    setRecentActivity(prev => [
      { id: String(Date.now()), title: 'Wallet Top Up', amount: num, time: 'Just now', type: 'deposit' },
      ...prev,
    ]);
    setNotice(`R${num.toFixed(2)} loaded to wallet!`);
  };

  const renderBody = () => {
    if (screen === 'send') return <SendMoneyScreen finish={finish} cards={cards} balance={balance} onDeductBalance={handleDeductBalance} setStepText={setStepText} />;
    if (screen === 'receive') return <ReceiveMoneyScreen finish={finish} setNotice={setNotice} />;
    if (screen === 'transfer') return <TransferMoneyScreen finish={finish} balance={balance} onDeductBalance={handleDeductBalance} setStepText={setStepText} setNotice={setNotice} />;
    if (screen === 'services') return <ServicesScreen finish={finish} cards={cards} balance={balance} onDeductBalance={handleDeductBalance} onDepositFunds={handleDepositFunds} setStepText={setStepText} initialSubScreen={initialSubScreen} />;
    if (screen === 'donate') return <DonationScreen finish={finish} cards={cards} balance={balance} onDeductBalance={handleDeductBalance} setStepText={setStepText} initialStep={initialDonationStep} />;
    if (screen === 'membership') return <MembershipScreen finish={finish} cards={cards} balance={balance} onDeductBalance={handleDeductBalance} />;
    if (screen === 'profile') return <ProfileScreen cards={cards} onOpenCards={() => open('cards')} setStepText={setStepText} />;
    if (screen === 'cards') return <CardManagerScreen cards={cards} onAddCard={handleAddCard} />;
    if (screen === 'branch') return <BranchScreen />;
    if (screen === 'notifications' || screen === 'updates') return <NotificationsScreen />;
    if (screen === 'newsroom') return <NewsroomScreen finish={finish} open={open} />;
    if (screen === 'statement_detail') return <StatementDetailScreen finish={finish} />;

    if (tab === 'Money') return <MoneyScreen open={open} cards={cards} balance={balance} onDepositFunds={handleDepositFunds} recentActivity={recentActivity} />;
    if (tab === 'Participate') return <HomeScreen open={open} balance={balance} />;
    if (tab === 'Updates') return <NotificationsScreen />;
    if (tab === 'Member') return <ProfileScreen cards={cards} onOpenCards={() => open('cards')} setStepText={setStepText} />;

    return <HomeScreen open={open} balance={balance} />;
  };

  return (
    <View style={s.outerContainer}>
      <View style={s.phoneFrame}>
        {!signedIn ? (
          showWelcome ? (
            <WelcomeScreen
              open={(target) => {
                if (target === 'signin') setShowWelcome(false);
                else if (target === 'home') setSignedIn(true);
                else setShowWelcome(false);
              }}
              onGetStarted={() => setShowWelcome(false)}
              onSignInClick={() => setShowWelcome(false)}
            />
          ) : (
            <SignInScreen
              finish={() => setSignedIn(true)}
              onSignIn={() => setSignedIn(true)}
            />
          )
        ) : (
          <SafeAreaView style={s.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <Header
              screen={screen}
              tab={tab}
              stepText={stepText}
              onBack={() => {
                if (tab === 'Member') setTab('Home');
                setScreen('main');
              }}
              onOpenMenu={() => setDrawerOpen(true)}
              onOpenNotifications={() => open('notifications')}
              unreadCount={1}
            />
            {notice ? (
              <TouchableOpacity style={s.toast} onPress={() => setNotice('')}>
                <Text style={s.toastText}>{notice}</Text>
                <Text style={s.toastText}>×</Text>
              </TouchableOpacity>
            ) : null}
            <View style={s.page}>{renderBody()}</View>
            {screen === 'main' ? (
              <Nav active={tab} onChange={(value) => { setTab(value); setScreen('main'); setStepText(''); }} />
            ) : null}

            <SideDrawer
              visible={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              onNavigate={(target) => open(target)}
              onSignOut={() => {
                setSignedIn(false);
                setShowWelcome(true);
              }}
            />
          </SafeAreaView>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0D140E',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  phoneFrame: {
    width: '100%',
    maxWidth: 440,
    height: '100%',
    backgroundColor: Colors.white,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },
  safe: { flex: 1, backgroundColor: Colors.white },
  page: { flex: 1 },
  toast: {
    position: 'absolute',
    zIndex: 5,
    top: 70,
    left: 16,
    right: 16,
    backgroundColor: Colors.ink,
    borderRadius: 10,
    padding: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 5,
  },
  toastText: { color: Colors.white, fontSize: 13, fontWeight: '600' },
});
