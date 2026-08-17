import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';

export default function NotificationsScreen() {
  const notifications = [
    {
      id: '1',
      tag: 'MEMBERSHIP NOTICE',
      title: 'August Contribution Reminder',
      body: 'Your monthly membership contribution of R250.00 is due by 31 August 2026.',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: '2',
      tag: 'COMMUNITY EVENT',
      title: 'Ward 62 Community Meeting',
      body: 'Join your local branch meeting at Orlando East Community Hall on 24 August at 10:00.',
      time: 'Yesterday',
      unread: true,
    },
    {
      id: '3',
      tag: 'PAYMENT SUCCESSFUL',
      title: 'R100.00 Airtime Purchase',
      body: 'Your airtime purchase of R100.00 for 082 555 0105 was processed successfully.',
      time: '3 days ago',
      unread: false,
    },
  ];

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.eyebrow}>STAY INFORMED</Text>
      <Text style={s.h1}>Notifications</Text>

      <View style={{ marginTop: 6 }}>
        {notifications.map(item => (
          <View key={item.id} style={[s.notificationCard, item.unread && s.notificationCardUnread]}>
            <View style={s.row}>
              <Text style={s.tag}>{item.tag}</Text>
              <Text style={s.time}>{item.time}</Text>
            </View>
            <Text style={s.cardTitle}>{item.title}</Text>
            <Text style={s.body}>{item.body}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 20, paddingBottom: 100 },
  eyebrow: { color: Colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  h1: { fontSize: 26, fontWeight: '900', color: Colors.ink, marginTop: 2, marginBottom: 12 },
  notificationCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  notificationCardUnread: {
    backgroundColor: '#F0F9F2',
    borderColor: Colors.primary,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { color: Colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  time: { color: Colors.muted, fontSize: 11 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: Colors.ink, marginVertical: 4 },
  body: { fontSize: 13, color: Colors.muted, lineHeight: 18 },
});
