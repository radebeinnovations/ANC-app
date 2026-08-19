import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Icon } from './Icons';

export default function Header({ screen, tab, onBack, onOpenMenu, onOpenNotifications, unreadCount = 1, stepText }) {
  if (screen !== 'main' && screen !== 'welcome') {
    const isStep2 = screen === 'send' && stepText === 'Step 2 of 3';

    return (
      <View style={s.header}>
        <TouchableOpacity style={s.headerBackBtn} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrow-back" size={20} color={Colors.primary} />
        </TouchableOpacity>

        <View style={s.headerCenter}>
          <Text style={[s.headerTitle, isStep2 && s.headerTitleStep2]}>
            {isStep2 ? 'Step 2 of 3' : getScreenTitle(screen, stepText)}
          </Text>
          {!isStep2 && stepText ? <Text style={s.stepSub}>{stepText}</Text> : null}
        </View>

        <View style={{ width: 40 }} />
      </View>
    );
  }

  // When viewing Member Card via bottom tab 'Member' (Matches Stitch design)
  if (tab === 'Member') {
    return (
      <View style={s.header}>
        <View style={s.memberEmblemCircle}>
          <Text style={s.memberEmblemText}>ANC</Text>
        </View>

        <View style={s.headerCenterLeft}>
          <Text style={s.headerTitleMember}>African National Congress</Text>
        </View>

        <TouchableOpacity style={s.headerIconBtn} activeOpacity={0.7}>
          <Icon name="search" size={20} color={Colors.primary} />
        </TouchableOpacity>
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

function getScreenTitle(screen, stepText) {
  if (screen === 'send') {
    if (stepText === 'Step 2 of 3') return 'Step 2 of 3';
    if (stepText === 'STEP 3 OF 3') return 'ANC UNITY';
    return 'Send Money';
  }
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
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F9F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenterLeft: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.ink,
  },
  headerTitleStep2: {
    fontSize: 18,
    fontWeight: '900',
    color: '#006933',
  },
  headerTitleMember: {
    fontSize: 15,
    fontWeight: '900',
    color: '#006933',
    letterSpacing: 0.3,
  },
  stepSub: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.muted,
    marginTop: 1,
    letterSpacing: 0.5,
  },
  headerBrand: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  memberEmblemCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#006933',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.gold,
  },
  memberEmblemText: {
    color: Colors.gold,
    fontWeight: '900',
    fontSize: 9,
  },
});
