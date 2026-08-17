import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Components
import Header from './src/components/Header';
import Nav from './src/components/Nav';

// Screens
import BranchScreen from './src/screens/BranchScreen';
import CardManagerScreen from './src/screens/CardManagerScreen';
import DonationScreen from './src/screens/DonationScreen';
import HomeScreen from './src/screens/HomeScreen';
import MembershipScreen from './src/screens/MembershipScreen';
import MoneyScreen from './src/screens/MoneyScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SendMoneyScreen from './src/screens/SendMoneyScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import SignInScreen from './src/screens/SignInScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

import { Colors } from './src/theme/colors';

export default function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [tab, setTab] = useState('Home');
  const [screen, setScreen] = useState('main');
  const [notice, setNotice] = useState('');

  const [cards, setCards] = useState([
    { id: '1', title: 'ANC Member Wallet Card', last4: '4821', brand: 'VISA', exp: '12/28', color: Colors.primary, isDefault: true },
    { id: '2', title: 'Standard Bank Gold', last4: '1092', brand: 'MASTERCARD', exp: '09/27', color: Colors.ink, isDefault: false },
  ]);

  const open = (name) => { setNotice(''); setScreen(name); };
  const finish = (message) => { setScreen('main'); setNotice(message); };

  const handleAddCard = (newCard) => {
    setCards([...cards, { ...newCard, id: String(Date.now()), isDefault: false }]);
    setNotice(`Card ending in •••• ${newCard.last4} added successfully.`);
  };

  const renderBody = () => {
    if (screen === 'send') return <SendMoneyScreen finish={finish} cards={cards} />;
    if (screen === 'services') return <ServicesScreen finish={finish} cards={cards} />;
    if (screen === 'donate') return <DonationScreen finish={finish} cards={cards} />;
    if (screen === 'membership') return <MembershipScreen finish={finish} cards={cards} />;
    if (screen === 'profile') return <ProfileScreen cards={cards} onOpenCards={() => open('cards')} />;
    if (screen === 'cards') return <CardManagerScreen cards={cards} onAddCard={handleAddCard} />;
    if (screen === 'branch') return <BranchScreen />;
    if (screen === 'notifications') return <NotificationsScreen />;

    if (tab === 'Money') return <MoneyScreen open={open} cards={cards} />;
    if (tab === 'Participate') return <DonationScreen finish={finish} cards={cards} />;
    if (tab === 'Updates') return <NotificationsScreen />;
    if (tab === 'Member') return <ProfileScreen cards={cards} onOpenCards={() => open('cards')} />;

    return <HomeScreen open={open} />;
  };

  return (
    <View style={s.outerContainer}>
      <View style={s.phoneFrame}>
        {!signedIn ? (
          showWelcome ? (
            <WelcomeScreen
              onGetStarted={() => setShowWelcome(false)}
              onSignInClick={() => setShowWelcome(false)}
            />
          ) : (
            <SignInScreen onSignIn={() => setSignedIn(true)} />
          )
        ) : (
          <SafeAreaView style={s.safe}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
            <Header
              screen={screen}
              onBack={() => setScreen('main')}
              onOpenNotifications={() => open('notifications')}
              unreadCount={2}
            />
            {notice ? (
              <TouchableOpacity style={s.toast} onPress={() => setNotice('')}>
                <Text style={s.toastText}>{notice}</Text>
                <Text style={s.toastText}>×</Text>
              </TouchableOpacity>
            ) : null}
            <View style={s.page}>{renderBody()}</View>
            <Nav active={tab} onChange={(value) => { setTab(value); setScreen('main'); }} />
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
