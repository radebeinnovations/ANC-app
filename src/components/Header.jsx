import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Icon } from './Icons';

export default function Header({ screen, onBack, onOpenMenu, onOpenNotifications, unreadCount = 1, stepText }) {
  if (screen !== 'main' && screen !== 'welcome') {
    return (
      <View style={s.header}>
        <TouchableOpacity style={s.headerBackBtn} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrow-back" size={20} color={Colors.primary} />
        </TouchableOpacity>

        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>{getScreenTitle(screen)}</Text>
          {stepText ? <Text style={s.stepSub}>{stepText}</Text> : null}
        </View>

        <View style={{ width: 40 }} />
      </View>
    );
  }

  return (
    <View style={s.header}>
      <TouchableOpacity style={s.headerIconBtn} onPress={onOpenMenu} activeOpacity={0.7}>
        <Icon name="menu" size={22} color={Colors.primary} />
      </TouchableOpacity>

      <Text style={s.headerBrand}>ANC UNITY</Text>

      <TouchableOpacity style={s.headerIconBtn} onPress={onOpenNotifications} activeOpacity={0.7}>
        <Icon name="notifications-none" size={22} color={Colors.primary} />
        {unreadCount > 0 && <View style={s.badgeDot} />}
      </TouchableOpacity>
    </View>
  );
}

function getScreenTitle(screen) {
  if (screen === 'send') return 'Send Money';
  if (screen === 'services') return 'Pay Services';
  if (screen === 'donate') return 'Donate';
  if (screen === 'membership') return 'Membership';
  if (screen === 'profile') return 'Member Card';
  if (screen === 'cards') return 'My Cards';
  if (screen === 'branch') return 'My Branch';
  if (screen === 'notifications') return 'Notifications';
  return 'ANC UNITY';
}

const s = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  headerBrand: { fontSize: 18, color: Colors.primary, fontWeight: '900', letterSpacing: 1 },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  stepSub: { fontSize: 10, color: Colors.muted, fontWeight: '700', letterSpacing: 0.8, marginTop: 1 },
  headerIconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.error,
    borderRadius: 4,
    width: 8,
    height: 8,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
});
