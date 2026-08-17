import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';

export default function Header({ screen, onBack, onOpenNotifications, unreadCount = 1 }) {
  return (
    <View style={s.header}>
      <View style={s.headerSide}>
        {screen !== 'main' && screen !== 'welcome' ? (
          <TouchableOpacity style={s.headerBackBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={s.headerBackIcon}>‹</Text>
            <Text style={s.headerBackText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={s.headerIconBtn} activeOpacity={0.7}>
            <Text style={s.headerIcon}>☰</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={s.headerBrand}>ANC UNITY</Text>

      <View style={[s.headerSide, { alignItems: 'flex-end' }]}>
        <TouchableOpacity style={s.headerIconBtn} onPress={onOpenNotifications} activeOpacity={0.7}>
          <Text style={s.bellIcon}>🔔</Text>
          {unreadCount > 0 && (
            <View style={s.badgeDot} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
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
  headerBrand: { fontSize: 19, color: Colors.primary, fontWeight: '900', letterSpacing: 1 },
  headerSide: { width: 80, justifyContent: 'center' },
  headerIconBtn: { padding: 6, position: 'relative' },
  headerIcon: { fontSize: 22, color: Colors.primary, textAlign: 'center' },
  bellIcon: { fontSize: 20, textAlign: 'center' },
  headerBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignSelf: 'flex-start',
  },
  headerBackIcon: { color: Colors.primary, fontSize: 18, fontWeight: '800', marginRight: 3, marginTop: -1 },
  headerBackText: { color: Colors.primary, fontWeight: '700', fontSize: 12 },
  badgeDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.error,
    borderRadius: 5,
    width: 8,
    height: 8,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
});
