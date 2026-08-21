import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

export function Icon({ name, size = 20, color = '#006933', style }) {
  return <MaterialIcons name={name} size={size} color={color} style={style} />;
}

export function MastercardLogo({ width = 36, height = 24 }) {
  return (
    <View style={{ width, height, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <View
        style={{
          width: height * 0.9,
          height: height * 0.9,
          borderRadius: (height * 0.9) / 2,
          backgroundColor: '#EB001B',
          position: 'absolute',
          left: 0,
        }}
      />
      <View
        style={{
          width: height * 0.9,
          height: height * 0.9,
          borderRadius: (height * 0.9) / 2,
          backgroundColor: '#F79E1B',
          position: 'absolute',
          right: 0,
          opacity: 0.95,
        }}
      />
    </View>
  );
}

export function SendMoneySvgIcon({ size = 24, color = '#006933' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 9.5C4.8 13 4.8 19 7 22.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18.5 9.5C14 7.8 9.5 10.5 9.5 16C9.5 21.5 14 24.2 18.5 22.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M13.5 16H25" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M21 12L25 16L21 20" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ReceiveMoneySvgIcon({ size = 24, color = '#006933' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.5 5H18.5L23.5 10V26C23.5 27.1 22.6 28 21.5 28H10.5C9.4 28 8.5 27.1 8.5 26V6C8.5 5.45 8.95 5 9.5 5Z" stroke={color} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M18 5V10.5H23.5" stroke={color} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M16 13V21" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M18.2 15H14.5C13.5 15 13.5 16.5 14.5 16.5H17.5C18.5 16.5 18.5 19 17.5 19H13.8" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
