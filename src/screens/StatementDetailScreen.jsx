import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import { Icon } from '../components/Icons';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';

const STATEMENT_HERO_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHR1a7BGP_bULWHfBqmlTZgAdHLDUGaQ9n42EuYpuscyM7zEqqysnBEFBchrBndc5olw-z7m9zHt8J2f1KlBsIEJcbViTOgrDKxoOMDSxwyhbm6Celjx0pd0-OYh-6kDsXNsIIzcF7FU30QbvhS_w9U5M0GZjAah-V1bZR0ig9UAONPSann0NLQ6JAl8wcx2iBNtAuzSB1IZwBp7qqfHtgzBTb68fJZD2IlcmApjWzMBVXT3-_Ba0X';

export default function StatementDetailScreen({ finish }) {
  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Back Navigation Bar */}
      <TouchableOpacity style={s.backRow} onPress={finish} activeOpacity={0.7}>
        <Icon name="arrow-back" size={20} color={Colors.primary} />
        <Text style={s.backText}>Back to Updates</Text>
      </TouchableOpacity>

      {/* Hero Header Card with Image Scrim Overlay */}
      <View style={s.heroCardContainer}>
        <Image source={{ uri: STATEMENT_HERO_IMG }} style={s.heroImage} resizeMode="cover" />
        <View style={s.heroScrimOverlay} />

        <View style={s.heroContentBox}>
          <View style={s.badgeRow}>
            <View style={s.goldBadge}>
              <Text style={s.goldBadgeText}>ANC STATEMENT</Text>
            </View>
            <Text style={s.dateText}>12 August 2026</Text>
          </View>

          <Text style={s.heroTitle}>Building Stronger Local Government</Text>
          <Text style={s.issuerText}>Issued by the ANC National Executive Committee</Text>
        </View>
      </View>

      {/* Main Statement Content Body */}
      <View style={s.bodyCard}>
        <Text style={s.leadParagraph}>
          Our commitment to service delivery and community empowerment remains steadfast as we approach the upcoming municipal elections. Across all 9 provinces, local structures are mobilizing resources to accelerate grassroots development.
        </Text>

        <Text style={s.subHeading}>Key Priorities for the Upcoming Quarter</Text>

        <View style={s.priorityItem}>
          <View style={s.priorityIconCircle}>
            <Icon name="build" size={16} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.priorityTitle}>Infrastructure & Service Delivery</Text>
            <Text style={s.priorityBody}>
              Accelerating clean water access, electrical grid maintenance, and local road repairs in under-serviced municipal wards.
            </Text>
          </View>
        </View>

        <View style={s.priorityItem}>
          <View style={s.priorityIconCircle}>
            <Icon name="groups" size={16} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.priorityTitle}>Community Youth Empowerment</Text>
            <Text style={s.priorityBody}>
              Expanding digital skills centers, local enterprise grants, and youth apprenticeship programs through local branch networks.
            </Text>
          </View>
        </View>

        <View style={s.priorityItem}>
          <View style={s.priorityIconCircle}>
            <Icon name="verified-user" size={16} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.priorityTitle}>Accountable Governance</Text>
            <Text style={s.priorityBody}>
              Implementing transparent municipal performance tracking and monthly open ward public reporting sessions.
            </Text>
          </View>
        </View>

        <View style={s.quoteBox}>
          <Text style={s.quoteText}>
            "Local government is the heartbeat of our movement. When we empower our branches and communities, we build a stronger nation for all."
          </Text>
          <Text style={s.quoteAuthor}>— ANC Office of the Secretary General</Text>
        </View>

        {/* Action Button */}
        <View style={{ marginTop: 24 }}>
          <Button text="Return to Main Menu" onPress={finish} />
        </View>
      </View>

      <YamiFooter />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 100, backgroundColor: '#F9F9F9' },

  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, paddingTop: 4 },
  backText: { color: Colors.primary, fontSize: 14, fontWeight: '700', fontFamily: 'Inter' },

  /* HERO CARD */
  heroCardContainer: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroScrimOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  heroContentBox: { flex: 1, justifyContent: 'flex-end', padding: 20 },

  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  goldBadge: { backgroundColor: '#E5B800', borderRadius: 4, paddingVertical: 4, paddingHorizontal: 8 },
  goldBadgeText: { fontSize: 11, fontWeight: '800', color: '#241A00', letterSpacing: 0.5, fontFamily: 'Inter' },
  dateText: { fontSize: 12, color: 'rgba(255, 255, 255, 0.85)', fontFamily: 'Inter' },

  heroTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', lineHeight: 28, fontFamily: 'Hanken Grotesk', marginBottom: 4 },
  issuerText: { fontSize: 12, color: 'rgba(255, 255, 255, 0.75)', fontFamily: 'Inter' },

  /* BODY CARD */
  bodyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    marginBottom: 20,
  },
  leadParagraph: { fontSize: 15, color: '#1A1C1C', lineHeight: 22, fontWeight: '500', marginBottom: 20, fontFamily: 'Inter' },
  subHeading: { fontSize: 18, fontWeight: '800', color: '#1A1C1C', marginBottom: 16, fontFamily: 'Hanken Grotesk' },

  priorityItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  priorityIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0, 105, 51, 0.1)', alignItems: 'center', justifyContent: 'center' },
  priorityTitle: { fontSize: 15, fontWeight: '700', color: '#1A1C1C', marginBottom: 2, fontFamily: 'Hanken Grotesk' },
  priorityBody: { fontSize: 13, color: '#4A5568', lineHeight: 18, fontFamily: 'Inter' },

  quoteBox: {
    backgroundColor: '#F0F9F2',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    padding: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  quoteText: { fontSize: 14, fontStyle: 'italic', color: '#006933', lineHeight: 20, fontFamily: 'Inter' },
  quoteAuthor: { fontSize: 12, fontWeight: '700', color: '#006933', marginTop: 8, fontFamily: 'Inter' },
});
