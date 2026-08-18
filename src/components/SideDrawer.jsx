import React from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Icon } from './Icons';

const AVATAR_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP7zlfBNbg5jSucUfG5tPD3BtnVuTQAY2I1kjxSuVqrYNxWqB2lpmvbct4HtE9rdYUrNvLmyCoODdPJBfEqJlKcTv1n486W4ZiNoD2hMMB6ygx62xZumjQQcA9Q5uBGXVyeqgizdBJTJZhYHK0e2jGRtVRt-uNnljNFVUKXpdgq2Cyhy3xUtsvwfSISYHxtEhER8JSmDx9fJe9hVTzN3FqNWNa4aOez8vY3D9vx2YwUd9oJmGKaKmb';

export default function SideDrawer({ visible, onClose, onNavigate, onSignOut }) {
  if (!visible) return null;

  const menuItems = [
    { id: 'home', title: 'Home Dashboard', icon: 'home' },
    { id: 'profile', title: 'Digital Member Card', icon: 'badge' },
    { id: 'money', title: 'Wallet & Payments', icon: 'account-balance-wallet' },
    { id: 'send', title: 'Send Money', icon: 'send' },
    { id: 'services', title: 'Buy Airtime / Data', icon: 'phone-android' },
    { id: 'branch', title: 'My Branch & Region', icon: 'groups' },
    { id: 'notifications', title: 'Notifications', icon: 'notifications' },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <TouchableOpacity style={s.scrim} activeOpacity={1} onPress={onClose} />

        <View style={s.drawerContainer}>
          {/* Header Banner */}
          <View style={s.drawerHeader}>
            <View style={s.brandRow}>
              <Text style={s.brandTitle}>ANC UNITY</Text>
              <TouchableOpacity onPress={onClose} style={s.closeBtn} activeOpacity={0.7}>
                <Icon name="close" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>

            <View style={s.profileRow}>
              <Image source={{ uri: AVATAR_IMG_URL }} style={s.avatar} />
              <View style={{ marginLeft: 12 }}>
                <Text style={s.profileName}>Lerumo Thabo</Text>
                <Text style={s.profileMeta}>ANC-1234567 • ACTIVE</Text>
              </View>
            </View>
          </View>

          {/* Menu Items List */}
          <View style={s.menuList}>
            {menuItems.map(item => (
              <TouchableOpacity
                key={item.id}
                style={s.menuItem}
                activeOpacity={0.7}
                onPress={() => {
                  onClose();
                  onNavigate(item.id);
                }}
              >
                <View style={s.itemIconBox}>
                  <Icon name={item.icon} size={20} color={Colors.primary} />
                </View>
                <Text style={s.itemText}>{item.title}</Text>
                <Icon name="chevron-right" size={18} color="#9E9E9E" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer Sign Out */}
          <View style={s.drawerFooter}>
            <TouchableOpacity
              style={s.signOutBtn}
              activeOpacity={0.7}
              onPress={() => {
                onClose();
                if (onSignOut) onSignOut();
              }}
            >
              <Icon name="logout" size={18} color={Colors.error} />
              <Text style={s.signOutText}>Sign Out</Text>
            </TouchableOpacity>
            <Text style={s.versionText}>ANC Unity App v1.0.0 • Powered by YAMI</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    flexDirection: 'row',
    zIndex: 9999,
    elevation: 9999,
  },
  scrim: {
    flex: 1,
  },
  drawerContainer: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: Colors.white,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 20,
    justifyContent: 'space-between',
  },
  drawerHeader: {
    backgroundColor: Colors.primary,
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandTitle: {
    color: '#FECC00',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FECC00',
  },
  profileName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  profileMeta: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  menuList: {
    paddingVertical: 12,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  itemIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.ink,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#FFF0F0',
    marginBottom: 12,
  },
  signOutText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.muted,
    fontWeight: '600',
  },
});
