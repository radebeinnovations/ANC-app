import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Icon } from './Icons';

export default function Nav({ active, onChange }) {
  const tabs = [
    { name: 'Home', icon: 'home' },
    { name: 'Money', icon: 'account-balance-wallet' },
    { name: 'Participate', icon: 'groups' },
    { name: 'Updates', icon: 'newspaper' },
    { name: 'Member', icon: 'badge' },
  ];

  return (
    <View style={s.nav}>
      {tabs.map(item => {
        const isActive = active === item.name;
        return (
          <TouchableOpacity key={item.name} style={s.navButton} onPress={() => onChange(item.name)} activeOpacity={0.7}>
            <View style={[s.iconBox, isActive && s.iconBoxOn]}>
              <Icon name={item.icon} size={20} color={isActive ? Colors.primary : '#778279'} />
            </View>
            <Text style={[s.navText, isActive && s.navTextOn]}>{item.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  nav: {
    height: 66,
    borderTopWidth: 1,
    borderColor: Colors.surfaceBorder,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 6,
    paddingBottom: 6,
  },
  navButton: { alignItems: 'center', width: '20%' },
  iconBox: {
    width: 44,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxOn: { backgroundColor: '#E3F3E7' },
  navText: { fontSize: 10, color: '#778279', marginTop: 2, fontWeight: '500' },
  navTextOn: { color: Colors.primary, fontWeight: '800' },
});
