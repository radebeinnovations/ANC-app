import React, { useState } from 'react';
import { Linking, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import Field from '../components/Field';
import { Icon } from '../components/Icons';
import List from '../components/List';
import { Colors } from '../theme/colors';

export default function BranchScreen() {
  const [isRsvp, setIsRsvp] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(142);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueType, setIssueType] = useState('Service Delivery');
  const [issueDesc, setIssueDesc] = useState('');
  const [issueSubmitted, setIssueSubmitted] = useState(false);

  const toggleRsvp = () => {
    if (isRsvp) {
      setIsRsvp(false);
      setRsvpCount(prev => prev - 1);
    } else {
      setIsRsvp(true);
      setRsvpCount(prev => prev + 1);
    }
  };

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`).catch(() => {});
  };

  const handleWhatsApp = (phone) => {
    Linking.openURL(`https://wa.me/27821124490`).catch(() => {});
  };

  const handleDirections = () => {
    Linking.openURL(`https://maps.google.com/?q=Orlando+East+Community+Hall+Soweto`).catch(() => {});
  };

  const handleSendIssue = () => {
    setIssueSubmitted(true);
    setTimeout(() => {
      setIssueSubmitted(false);
      setShowIssueModal(false);
      setIssueDesc('');
    }, 2000);
  };

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.eyebrow}>YOUR LOCAL STRUCTURE</Text>
      <Text style={s.h1}>My Branch</Text>

      {/* Member Branch Verification Card */}
      <View style={s.memberCard}>
        <View style={s.memberCardHeader}>
          <View style={s.memberBadgeGreen}>
            <Icon name="verified" size={14} color={Colors.primary} />
            <Text style={s.memberBadgeText}>ACTIVE WARD MEMBER</Text>
          </View>
          <Text style={s.memberNoText}>ANC-892104</Text>
        </View>

        <Text style={s.branchNameTitle}>ORLANDO EAST BRANCH</Text>
        <Text style={s.branchLocSub}>Ward 62 · Greater Johannesburg Region · Gauteng</Text>

        <View style={s.memberStatusDivider} />

        <View style={s.quorumStatusRow}>
          <Icon name="how-to-vote" size={18} color={Colors.primary} />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={s.quorumTitle}>BGM Quorum Status</Text>
            <Text style={s.quorumSub}>Eligible to attend & vote in Branch General Meetings</Text>
          </View>
        </View>
      </View>

      {/* Branch Announcement Notice */}
      <View style={s.noticeCard}>
        <View style={s.noticeHeaderRow}>
          <Icon name="campaign" size={20} color="#6E5700" />
          <Text style={s.noticeTitle}>BRANCH ANNOUNCEMENT</Text>
        </View>
        <Text style={s.noticeText}>
          📌 Special Branch General Meeting (BGM) convened for this Saturday. Please ensure your membership fees are up to date to participate in candidate list nominations.
        </Text>
      </View>

      {/* Upcoming BGM Meeting Event Card */}
      <Text style={s.sectionTitle}>Upcoming Branch Event</Text>
      <View style={s.eventCard}>
        <View style={s.eventDateBox}>
          <Text style={s.eventDateDay}>30</Text>
          <Text style={s.eventDateMonth}>AUG</Text>
        </View>

        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={s.eventBadgeLabel}>MANDATORY BGM</Text>
          <Text style={s.eventTitleText}>Monthly Branch General Meeting</Text>
          <View style={s.eventMetaRow}>
            <Icon name="schedule" size={14} color={Colors.muted} />
            <Text style={s.eventMetaText}>Sat 30 Aug 2026 @ 14:00</Text>
          </View>
          <View style={s.eventMetaRow}>
            <Icon name="location-on" size={14} color={Colors.muted} />
            <Text style={s.eventMetaText}>Orlando East Community Hall</Text>
          </View>

          <TouchableOpacity style={[s.rsvpBtn, isRsvp && s.rsvpBtnActive]} onPress={toggleRsvp} activeOpacity={0.8}>
            <Icon name={isRsvp ? "check-circle" : "event-available"} size={16} color={isRsvp ? Colors.white : Colors.primary} />
            <Text style={[s.rsvpBtnText, isRsvp && s.rsvpBtnTextActive]}>
              {isRsvp ? `✓ Attending (${rsvpCount} Members)` : `RSVP - I Will Attend (${rsvpCount})`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Ward Actions */}
      <Text style={s.sectionTitle}>Ward Member Tools</Text>
      <TouchableOpacity style={s.issueActionCard} onPress={() => setShowIssueModal(true)} activeOpacity={0.85}>
        <View style={s.issueIconCircle}>
          <Icon name="report-problem" size={22} color="#D97706" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.issueCardTitle}>Log Ward Service Issue</Text>
          <Text style={s.issueCardSub}>Report water, electricity, or community service delivery issues directly to your Branch Executive.</Text>
        </View>
        <Icon name="chevron-right" size={20} color={Colors.muted} />
      </TouchableOpacity>

      {/* Branch Executive Committee Contacts */}
      <Text style={s.sectionTitle}>Branch Executive Committee (BEC)</Text>
      <View style={s.becStack}>
        <View style={s.becRow}>
          <View style={s.becAvatarCircle}>
            <Text style={s.becAvatarText}>ND</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.becRoleText}>Branch Secretary</Text>
            <Text style={s.becNameText}>Nomsa Dlamini</Text>
            <Text style={s.becPhoneText}>082 112 4490</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <TouchableOpacity style={s.contactIconBtn} onPress={() => handleCall('0821124490')}>
              <Icon name="call" size={16} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={s.contactIconBtn} onPress={() => handleWhatsApp('0821124490')}>
              <Icon name="chat" size={16} color="#008542" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.becRow}>
          <View style={s.becAvatarCircle}>
            <Text style={s.becAvatarText}>ST</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.becRoleText}>Branch Chairperson</Text>
            <Text style={s.becNameText}>Sibusiso Thwala</Text>
            <Text style={s.becPhoneText}>083 451 9802</Text>
          </View>
          <TouchableOpacity style={s.contactIconBtn} onPress={() => handleCall('0834519802')}>
            <Icon name="call" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={s.becRow}>
          <View style={s.becAvatarCircle}>
            <Text style={s.becAvatarText}>KM</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.becRoleText}>Branch Treasurer</Text>
            <Text style={s.becNameText}>Kagiso Maluleke</Text>
            <Text style={s.becPhoneText}>072 901 3321</Text>
          </View>
          <TouchableOpacity style={s.contactIconBtn} onPress={() => handleCall('0729013321')}>
            <Icon name="call" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Branch Venue Map & Location */}
      <Text style={s.sectionTitle}>Branch Meeting Location</Text>
      <View style={s.mapCard}>
        <View style={s.mapHeaderRow}>
          <Icon name="place" size={20} color={Colors.primary} />
          <Text style={s.mapVenueTitle}>Orlando East Community Hall</Text>
        </View>
        <Text style={s.mapAddressText}>1482 Mofolo Street, Orlando East, Soweto, 1804</Text>
        <Text style={s.mapOfficeHours}>Office Hours: Mon - Fri: 08:30 - 16:30</Text>

        <TouchableOpacity style={s.outlineBtn} onPress={handleDirections} activeOpacity={0.8}>
          <Icon name="directions" size={18} color={Colors.primary} />
          <Text style={s.outlineBtnText}>Get Directions on Maps</Text>
        </TouchableOpacity>
      </View>

      {/* LOG WARD SERVICE ISSUE MODAL */}
      <Modal visible={showIssueModal} animationType="slide" transparent>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Log Local Ward Issue</Text>
              <TouchableOpacity onPress={() => setShowIssueModal(false)}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.muted }}>✕</Text>
              </TouchableOpacity>
            </View>

            {issueSubmitted ? (
              <View style={s.issueSubmittedBox}>
                <Icon name="check-circle" size={40} color="#008542" />
                <Text style={s.issueSubmittedTitle}>Issue Logged Successfully!</Text>
                <Text style={s.issueSubmittedSub}>Your local Branch Executive team has been notified.</Text>
              </View>
            ) : (
              <>
                <Text style={s.modalSub}>Report service delivery problems or community issues directly to your Ward 62 Branch Committee.</Text>

                <Field label="ISSUE CATEGORY" value={issueType} onChangeText={setIssueType} placeholder="e.g. Water Outage, Electricity, Road Works" />

                <Text style={s.fieldLabel}>DESCRIPTION OF ISSUE</Text>
                <TextInput
                  style={s.textArea}
                  value={issueDesc}
                  onChangeText={setIssueDesc}
                  multiline
                  numberOfLines={4}
                  placeholder="Describe the issue, location address, and urgency..."
                  placeholderTextColor={Colors.muted}
                />

                <Button text="Submit Ward Issue" onPress={handleSendIssue} disabled={!issueDesc.trim()} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 20, paddingBottom: 110, backgroundColor: Colors.background },
  eyebrow: { color: Colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2, fontFamily: 'Inter' },
  h1: { fontSize: 26, fontWeight: '900', color: Colors.ink, marginTop: 2, marginBottom: 14, fontFamily: 'Hanken Grotesk' },

  memberCard: {
    backgroundColor: '#006933',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  memberCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  memberBadgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FECC00',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  memberBadgeText: { fontSize: 10, fontWeight: '900', color: '#1A1C1C', letterSpacing: 0.5, fontFamily: 'Inter' },
  memberNoText: { fontSize: 12, fontWeight: '800', color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'monospace' },
  branchNameTitle: { fontSize: 20, fontWeight: '900', color: Colors.white, marginTop: 12, fontFamily: 'Hanken Grotesk' },
  branchLocSub: { fontSize: 12, color: 'rgba(255, 255, 255, 0.85)', marginTop: 2, fontFamily: 'Inter' },
  memberStatusDivider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)', marginVertical: 12 },
  quorumStatusRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.12)', padding: 10, borderRadius: 10 },
  quorumTitle: { fontSize: 12, fontWeight: '800', color: Colors.white, fontFamily: 'Inter' },
  quorumSub: { fontSize: 11, color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'Inter' },

  noticeCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    padding: 14,
    marginBottom: 20,
  },
  noticeHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  noticeTitle: { fontSize: 11, fontWeight: '900', color: '#6E5700', letterSpacing: 0.8, fontFamily: 'Inter' },
  noticeText: { fontSize: 12, color: '#92400E', lineHeight: 17, fontFamily: 'Inter' },

  sectionTitle: { fontSize: 17, fontWeight: '900', color: Colors.ink, marginTop: 14, marginBottom: 10, fontFamily: 'Hanken Grotesk' },

  eventCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 16,
  },
  eventDateBox: {
    width: 54,
    height: 60,
    backgroundColor: '#F0F9F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 105, 51, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventDateDay: { fontSize: 20, fontWeight: '900', color: Colors.primary, fontFamily: 'Hanken Grotesk' },
  eventDateMonth: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 0.5, fontFamily: 'Inter' },
  eventBadgeLabel: { fontSize: 9, fontWeight: '900', color: Colors.primary, letterSpacing: 0.8, fontFamily: 'Inter' },
  eventTitleText: { fontSize: 14, fontWeight: '800', color: Colors.ink, marginVertical: 2, fontFamily: 'Inter' },
  eventMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  eventMetaText: { fontSize: 11, color: Colors.muted, fontFamily: 'Inter' },

  rsvpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  rsvpBtnActive: { backgroundColor: Colors.primary },
  rsvpBtnText: { fontSize: 12, fontWeight: '800', color: Colors.primary, fontFamily: 'Inter' },
  rsvpBtnTextActive: { color: Colors.white },

  issueActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 16,
  },
  issueIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center' },
  issueCardTitle: { fontSize: 14, fontWeight: '800', color: Colors.ink, fontFamily: 'Inter' },
  issueCardSub: { fontSize: 11, color: Colors.muted, marginTop: 2, lineHeight: 15, fontFamily: 'Inter' },

  becStack: { backgroundColor: Colors.white, borderRadius: 14, borderWidth: 1, borderColor: Colors.surfaceBorder, paddingHorizontal: 14, marginBottom: 16 },
  becRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder },
  becAvatarCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  becAvatarText: { fontSize: 12, fontWeight: '800', color: Colors.ink, fontFamily: 'Inter' },
  becRoleText: { fontSize: 10, fontWeight: '800', color: Colors.muted, letterSpacing: 0.5, fontFamily: 'Inter' },
  becNameText: { fontSize: 13, fontWeight: '800', color: Colors.ink, fontFamily: 'Inter' },
  becPhoneText: { fontSize: 11, color: Colors.muted, marginTop: 1, fontFamily: 'Inter' },
  contactIconBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },

  mapCard: { backgroundColor: Colors.white, borderRadius: 14, borderWidth: 1, borderColor: Colors.surfaceBorder, padding: 16, marginBottom: 20 },
  mapHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  mapVenueTitle: { fontSize: 15, fontWeight: '800', color: Colors.ink, fontFamily: 'Inter' },
  mapAddressText: { fontSize: 12, color: Colors.muted, marginTop: 2, fontFamily: 'Inter' },
  mapOfficeHours: { fontSize: 11, color: Colors.primary, fontWeight: '700', marginTop: 4, fontFamily: 'Inter' },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 10, padding: 12, marginTop: 14 },
  outlineBtnText: { color: Colors.primary, fontWeight: '800', fontSize: 13, fontFamily: 'Inter' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: Colors.ink, fontFamily: 'Hanken Grotesk' },
  modalSub: { fontSize: 12, color: Colors.muted, marginBottom: 14, fontFamily: 'Inter' },
  fieldLabel: { fontSize: 10, fontWeight: '800', color: Colors.muted, letterSpacing: 0.8, marginBottom: 6, marginTop: 10, fontFamily: 'Inter' },
  textArea: { backgroundColor: Colors.white, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: Colors.surfaceBorder, fontSize: 13, color: Colors.ink, minHeight: 90, textAlignVertical: 'top', marginBottom: 16, fontFamily: 'Inter' },

  issueSubmittedBox: { alignItems: 'center', paddingVertical: 24 },
  issueSubmittedTitle: { fontSize: 18, fontWeight: '900', color: Colors.ink, marginTop: 10, fontFamily: 'Hanken Grotesk' },
  issueSubmittedSub: { fontSize: 12, color: Colors.muted, marginTop: 4, textAlign: 'center', fontFamily: 'Inter' },
});
