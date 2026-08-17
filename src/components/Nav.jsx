import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';

export default function Nav({ active, onChange }) {
  const tabs = [
    ['Home', '⌂'],
    ['Money', '▣'],
    ['Participate', '♟'],
    ['Updates', '♢'],
    ['Member', '🪪'],
  ];

  return (
    <View style={s.nav}>
      {tabs.map(([name, icon]) => {
        const isActive = active === name;
        return (
          <TouchableOpacity key={name} style={s.navButton} onPress={() => onChange(name)} activeOpacity={0.7}>
            <Text style={[s.navIcon, isActive && s.navActive]}>{icon}</Text>
            <Text style={[s.navText, isActive && s.navTextOn]}>{name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  nav: {
    height: 70,
    borderTopWidth: 1,
    borderColor: Colors.surfaceBorder,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 6,
    paddingBottom: 4,
  },
  navButton: { alignItems: 'center', width: '20%' },
  navIcon: { color: '#778279', fontSize: 18, height: 28, width: 40, textAlign: 'center', paddingTop: 3 },
  navActive: { backgroundColor: '#E3F3E7', color: Colors.primary, borderRadius: 14 },
  navText: { fontSize: 10, color: '#778279', marginTop: 2, fontWeight: '500' },
  navTextOn: { color: Colors.primary, fontWeight: '800' },
});
