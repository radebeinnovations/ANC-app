import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';

export function Icon({ name, size = 20, color = '#006933', style }) {
  return <MaterialIcons name={name} size={size} color={color} style={style} />;
}
