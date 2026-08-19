import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import { Icon } from '../components/Icons';
import List from '../components/List';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';

function SAFlagBadge() {
  return (
    <View style={s.saFlagWrapper}>
      <Text style={{ fontSize: 18 }}>🇿🇦</Text>
    </View>
  );
}

function DiamondMeshBackground() {
  const rows = Array.from({ length: 12 });
  const cols = Array.from({ length: 16 });

  return (
    <View style={s.diamondMeshWrapper}>
      {/* Web Linear Gradient for exact pixel-perfect diamond pattern */}
      <View style={s.webDiamondGradientOverlay} />

      {/* Cross-platform Vector Diamond Grid */}
      <View style={s.vectorDiamondGrid}>
        {rows.map((_, rIdx) => (
          <View key={rIdx} style={s.diamondRow}>
            {cols.map((_, cIdx) => (
              <View
                key={cIdx}
                style={[
                  s.diamondCell,
                  (rIdx + cIdx) % 2 === 0 ? s.diamondCellDark : s.diamondCellLight,
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

export default function ProfileScreen({ cards = [], onOpenCards, setStepText }) {
  const [activeTab, setActiveTab] = useState('CARD'); // 'CARD' | 'DETAILS'
  const [showQRModal, setShowQRModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // Explicitly clear stepText header subtitle on Member Card screen
  React.useEffect(() => {
    if (setStepText) setStepText('');
  }, [setStepText]);

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* DIGITAL MEMBERSHIP CARD (Exact Stitch Design Match with Diamond Mesh Background) */}
      <View style={s.memberCardContainer}>
        {/* Diamond Mesh Pattern Overlay */}
        <DiamondMeshBackground />

        {/* Top Gold Accent Line */}
        <View style={s.topGoldBar} />

        {/* Card Header Row */}
        <View style={s.cardHeaderRow}>
          <View style={s.emblemSquare}>
            <View style={s.emblemInnerCircle}>
              <Text style={s.emblemText}>ANC</Text>
            </View>
          </View>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={s.cardHeading}>AFRICAN NATIONAL CONGRESS</Text>
            <Text style={s.cardSubHeading}>DIGITAL MEMBERSHIP</Text>
          </View>

          <SAFlagBadge />
        </View>

        {/* Member Name */}
        <Text style={s.memberName}>LERUMO THABO</Text>

        {/* Member Badge & ID Row */}
        <View style={s.badgeIdRow}>
          <View style={s.memberRoleBadge}>
            <Text style={s.memberRoleText}>MEMBER</Text>
          </View>
          <Text style={s.memberIdNumber}>ANC–1234567</Text>
        </View>

        {/* Card Details Grid (Province & Photo Thumbnail) */}
        <View style={s.cardDetailsGrid}>
          <View>
            <Text style={s.gridDetailLabel}>PROVINCE</Text>
            <Text style={s.gridDetailVal}>GAUTENG</Text>
          </View>

          <View style={s.photoThumbnailBox}>
            <Icon name="person" size={24} color={Colors.muted} />
          </View>
        </View>
      </View>

      {/* SEGMENTED TAB CONTROL (CARD | DETAILS - Exact Stitch Match) */}
      <View style={s.segmentedContainer}>
        <TouchableOpacity
          style={[s.segmentedBtn, activeTab === 'CARD' && s.segmentedBtnActive]}
          onPress={() => setActiveTab('CARD')}
          activeOpacity={0.8}
        >
          <Text style={[s.segmentedText, activeTab === 'CARD' && s.segmentedTextActive]}>
            CARD
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.segmentedBtn, activeTab === 'DETAILS' && s.segmentedBtnActive]}
          onPress={() => setActiveTab('DETAILS')}
          activeOpacity={0.8}
        >
          <Text style={[s.segmentedText, activeTab === 'DETAILS' && s.segmentedTextActive]}>
            DETAILS
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB 1: CARD (3 Quick Action Cards Row - Exact Stitch Match) */}
      {activeTab === 'CARD' ? (
        <View style={s.actionCardsRow}>
          {/* Action Card 1: Share */}
          <TouchableOpacity style={s.actionCard} onPress={() => setShowQRModal(true)} activeOpacity={0.8}>
            <View style={s.actionIconBox}>
              <Icon name="share" size={24} color={Colors.primary} />
            </View>
            <Text style={s.actionCardText}>Share</Text>
          </TouchableOpacity>

          {/* Action Card 2: QR Code */}
          <TouchableOpacity style={s.actionCard} onPress={() => setShowQRModal(true)} activeOpacity={0.8}>
            <View style={s.actionIconBox}>
              <Icon name="qr-code-2" size={24} color={Colors.primary} />
            </View>
            <Text style={s.actionCardText}>QR Code</Text>
          </TouchableOpacity>

          {/* Action Card 3: Verify */}
          <TouchableOpacity style={s.actionCard} onPress={() => setShowVerifyModal(true)} activeOpacity={0.8}>
            <View style={s.actionIconBox}>
              <Icon name="verified-user" size={24} color={Colors.primary} />
            </View>
            <Text style={s.actionCardText}>Verify</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* TAB 2: DETAILS (Member Details List) */
        <View style={s.detailsContainer}>
          <Text style={s.detailsSectionHeader}>Member Account Details</Text>
          <List badge="MOB" title="082 555 0105" sub="Verified Mobile Number" />
          <List badge="EML" title="lerumo.thabo@anc-unity.org.za" sub="Verified Email Address" />
          <List badge="LOC" title="Soweto, Gauteng" sub="Home Branch (Ward 62)" />
          <List badge="CRD" title="Saved Payment Cards" sub={`${cards.length} linked cards`} onPress={onOpenCards} />
          <List badge="SET" title="App Settings & Security" sub="Biometrics & PIN lock" />
        </View>
      )}

      <YamiFooter />

      {/* QR CODE MODAL */}
      <Modal visible={showQRModal} animationType="slide" transparent>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Verification QR Code</Text>
              <TouchableOpacity onPress={() => setShowQRModal(false)}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.muted }}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={s.modalSub}>Present this code at official ANC events for instant check-in.</Text>

            <View style={s.modalQRBox}>
              <Icon name="qr-code-2" size={140} color={Colors.primary} />
            </View>

            <Text style={s.modalMemberInfo}>Lerumo Thabo • ANC–1234567</Text>
            <Button text="Close" onPress={() => setShowQRModal(false)} />
          </View>
        </View>
      </Modal>

      {/* VERIFY STATUS MODAL */}
      <Modal visible={showVerifyModal} animationType="slide" transparent>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Membership Status</Text>
              <TouchableOpacity onPress={() => setShowVerifyModal(false)}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.muted }}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={s.verifyBadgeBox}>
              <Icon name="verified-user" size={48} color={Colors.primary} />
              <Text style={s.verifyStatusText}>ACTIVE MEMBER</Text>
              <Text style={s.verifySubText}>Standing: Good • Paid up until Dec 2026</Text>
            </View>

            <Button text="Done" onPress={() => setShowVerifyModal(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 100, backgroundColor: Colors.background },

  /* GREEN DIGITAL MEMBERSHIP CARD */
  memberCardContainer: {
    backgroundColor: '#1E7E44',
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 16,
  },
  topGoldBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: Colors.gold, zIndex: 10 },

  diamondMeshWrapper: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 1,
  },
  webDiamondGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1E7E44',
    backgroundImage: `
      repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.08) 0px, rgba(0, 0, 0, 0.08) 12px, transparent 12px, transparent 24px),
      repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.08) 0px, rgba(0, 0, 0, 0.08) 12px, transparent 12px, transparent 24px)
    `,
    zIndex: 2,
  },
  vectorDiamondGrid: {
    width: 450,
    height: 350,
    top: -50,
    left: -50,
    transform: [{ rotate: '45deg' }],
    flexDirection: 'column',
    position: 'absolute',
  },
  diamondRow: {
    flexDirection: 'row',
    flex: 1,
  },
  diamondCell: {
    width: 28,
    height: 28,
  },
  diamondCellDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  diamondCellLight: {
    backgroundColor: 'transparent',
  },

  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, zIndex: 5 },
  emblemSquare: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemInnerCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#006933',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  emblemText: { color: Colors.gold, fontWeight: '900', fontSize: 10 },

  cardHeading: { fontSize: 13, fontWeight: '900', color: Colors.white, letterSpacing: 0.5 },
  cardSubHeading: { fontSize: 10, color: '#6EE7B7', fontWeight: '800', letterSpacing: 0.8, marginTop: 2 },

  saFlagWrapper: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },

  memberName: { fontSize: 22, fontWeight: '900', color: Colors.white, letterSpacing: 0.8, marginTop: 6, zIndex: 5 },

  badgeIdRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8, zIndex: 5 },
  memberRoleBadge: { backgroundColor: '#055928', borderRadius: 4, paddingVertical: 4, paddingHorizontal: 10 },
  memberRoleText: { color: Colors.white, fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },
  memberIdNumber: { fontSize: 15, color: Colors.white, fontWeight: '800', letterSpacing: 1 },

  cardDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 14,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    zIndex: 5,
  },
  gridDetailLabel: { fontSize: 9, color: '#6EE7B7', fontWeight: '800', letterSpacing: 1 },
  gridDetailVal: { fontSize: 15, fontWeight: '900', color: Colors.white, marginTop: 2 },

  photoThumbnailBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* SEGMENTED TAB CONTROL */
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F4F1',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E6E1',
  },
  segmentedBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentedBtnActive: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentedText: { fontSize: 13, fontWeight: '800', color: '#6E7970', letterSpacing: 0.5 },
  segmentedTextActive: { color: Colors.primary },

  /* 3 ACTION CARDS ROW */
  actionCardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F9F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionCardText: { fontSize: 12, fontWeight: '800', color: Colors.ink },

  detailsContainer: { marginBottom: 20 },
  detailsSectionHeader: { fontSize: 15, fontWeight: '800', color: Colors.ink, marginBottom: 10 },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.55)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '900', color: Colors.ink },
  modalSub: { fontSize: 12, color: Colors.muted, marginTop: 4, marginBottom: 14 },
  modalQRBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  modalMemberInfo: { fontSize: 14, fontWeight: '800', color: Colors.ink, textAlign: 'center', marginBottom: 20 },

  verifyBadgeBox: { alignItems: 'center', paddingVertical: 20, gap: 10, marginBottom: 14 },
  verifyStatusText: { fontSize: 18, fontWeight: '900', color: Colors.primary },
  verifySubText: { fontSize: 12, color: Colors.muted, fontWeight: '600' },
});
