import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../components/Icons';
import { Colors } from '../theme/colors';

const QR_MOCK_IMG = 'https://images.unsplash.com/photo-1595079672139-cee256a7364d?w=500&auto=format&fit=crop&q=80';

export default function ReceiveMoneyScreen({ finish, setNotice }) {
  const handleCopy = (text, label) => {
    if (setNotice) setNotice(`${label} copied to clipboard!`);
  };

  const handleShare = () => {
    if (setNotice) setNotice('Payment link copied for sharing!');
  };

  const handleDownload = () => {
    if (setNotice) setNotice('QR code saved to your device gallery!');
  };

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* QR Code & Member Card Container */}
      <View style={s.qrCardContainer}>
        <View style={s.phoneFrameBox}>
          <Image source={{ uri: QR_MOCK_IMG }} style={s.phoneImg} />
          
          {/* Mock QR overlay box */}
          <View style={s.qrOverlayBadge}>
            <View style={s.qrHeaderGreenBar}>
              <Text style={s.qrHeaderTitle}>Receive Money</Text>
            </View>
            <View style={s.qrSquareBox}>
              {/* Decorative QR grid representation */}
              <View style={s.qrMatrixGrid}>
                <View style={s.qrCornerSquare} />
                <View style={s.qrCornerSquare} />
                <View style={[s.qrCornerSquare, { marginTop: 'auto' }]} />
                <Icon name="qr-code-2" size={80} color="#1A1C1C" />
              </View>
            </View>
          </View>
        </View>

        {/* Member Details */}
        <Text style={s.memberNameBold}>LERUMO THABO</Text>
        <View style={s.ancIdBadgePill}>
          <View style={s.greenDot} />
          <Text style={s.ancIdBadgeText}>ANC-1234567</Text>
        </View>

        <Text style={s.instructionText}>
          Scan to send money directly to this member's account.
        </Text>
      </View>

      {/* Copy Details Section */}
      <View style={s.detailsCardBox}>
        {/* ANC ID Row */}
        <View style={s.detailRowItem}>
          <View style={s.detailIconCircle}>
            <Icon name="badge" size={20} color="#4A5568" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.detailLabelSub}>ANC ID</Text>
            <Text style={s.detailValBold}>ANC-1234567</Text>
          </View>
          <TouchableOpacity
            style={s.copyIconBtn}
            onPress={() => handleCopy('ANC-1234567', 'ANC ID')}
            activeOpacity={0.7}
          >
            <Icon name="content-copy" size={20} color="#008542" />
          </TouchableOpacity>
        </View>

        {/* Mobile Row */}
        <View style={[s.detailRowItem, { borderBottomWidth: 0 }]}>
          <View style={s.detailIconCircle}>
            <Icon name="smartphone" size={20} color="#4A5568" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.detailLabelSub}>MOBILE</Text>
            <Text style={s.detailValBold}>+27 82 123 4567</Text>
          </View>
          <TouchableOpacity
            style={s.copyIconBtn}
            onPress={() => handleCopy('+27 82 123 4567', 'Mobile number')}
            activeOpacity={0.7}
          >
            <Icon name="content-copy" size={20} color="#008542" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity style={s.shareGreenBtn} onPress={handleShare} activeOpacity={0.8}>
        <Icon name="share" size={18} color={Colors.white} />
        <Text style={s.shareGreenBtnText}>Share Payment Link</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.downloadOutlineBtn} onPress={handleDownload} activeOpacity={0.8}>
        <Icon name="file-download" size={18} color="#1A1C1C" />
        <Text style={s.downloadOutlineBtnText}>Download QR Code</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 90, backgroundColor: Colors.background },

  /* QR CODE CARD */
  qrCardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  phoneFrameBox: {
    width: 220,
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    position: 'relative',
    backgroundColor: '#F5F8F6',
  },
  phoneImg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.2 },
  qrOverlayBadge: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  qrHeaderGreenBar: {
    backgroundColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  qrHeaderTitle: { color: Colors.white, fontSize: 11, fontWeight: '800', fontFamily: 'Inter' },
  qrSquareBox: {
    width: 140,
    height: 140,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  qrMatrixGrid: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },

  memberNameBold: { fontSize: 20, fontWeight: '900', color: '#1A1C1C', letterSpacing: 0.5, fontFamily: 'Hanken Grotesk' },
  ancIdBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F3F0',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginTop: 6,
  },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#008542' },
  ancIdBadgeText: { fontSize: 12, fontWeight: '800', color: '#4A5568', fontFamily: 'Inter' },
  instructionText: { fontSize: 13, color: '#4A5568', textAlign: 'center', marginTop: 12, lineHeight: 18, fontFamily: 'Inter' },

  /* DETAILS BOX */
  detailsCardBox: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    overflow: 'hidden',
  },
  detailRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F0',
  },
  detailIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F3F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabelSub: { fontSize: 10, fontWeight: '900', color: '#6E7A6E', letterSpacing: 0.8, fontFamily: 'Inter' },
  detailValBold: { fontSize: 15, fontWeight: '800', color: '#1A1C1C', marginTop: 1, fontFamily: 'Inter' },
  copyIconBtn: { padding: 8 },

  /* ACTION BUTTONS */
  shareGreenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  shareGreenBtnText: { color: Colors.white, fontSize: 15, fontWeight: '800', fontFamily: 'Inter' },

  downloadOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  downloadOutlineBtnText: { color: '#1A1C1C', fontSize: 15, fontWeight: '800', fontFamily: 'Inter' },
});
