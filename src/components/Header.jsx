import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Icon } from './Icons';

export default function Header({ screen, tab, onBack, onOpenMenu, onOpenNotifications, unreadCount = 1, stepText }) {
  if (screen !== 'main' && screen !== 'welcome') {
    return (
      <View style={s.header}>
        <TouchableOpacity style={s.headerBackBtn} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrow-back" size={20} color={Colors.primary} />
        </TouchableOpacity>

        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>{getScreenTitle(screen, stepText)}</Text>
          {stepText ? <Text style={s.stepSub}>{stepText}</Text> : null}
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
    position: 'relative',
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
  },
  headerCenterLeft: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.primary,
  },
  headerTitleMember: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.primary,
  },
  memberEmblemCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#006933',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.gold,
  },
  memberEmblemText: {
    color: Colors.gold,
    fontWeight: '900',
    fontSize: 11,
  },
  stepSub: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.muted,
    letterSpacing: 1,
    marginTop: 1,
  },
  headerBrand: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 0.8,
  },
  badgeDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
});
