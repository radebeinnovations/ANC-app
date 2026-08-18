import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../components/Icons';
import { Colors } from '../theme/colors';

const HERO_BG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBN3H6Yd862DnxiZW2i8O8QgGc57wxohqEr3xBreEmMt0v6JnU-VjcsxluSl_bfMbwH2RMcBeBk1a8JI64uNW2CXnn9s4fDlQHmSBEqN8tRIHR1d-101dU1nW1o7F4ygPloyPnRNUeqpq2cCOxlqlXebEf5ee3nN61gw-Q39c3vdjB73ctwEwbzlfhWBfJDlOc6t0OBx_Reea4wX4f0LEZycmny-cJhSHrF4apeZJkNd-cbqwJR0y6o';

export default function WelcomeScreen({ open, onGetStarted, onSignInClick }) {
  const handleSignIn = () => {
    if (onSignInClick) onSignInClick();
    else if (open) open('signin');
  };

  const handleJoin = () => {
    if (onGetStarted) onGetStarted();
    else if (open) open('membership');
  };

  const handleGuest = () => {
    if (open) open('home');
    else if (onGetStarted) onGetStarted();
  };

  return (
    <ImageBackground source={{ uri: HERO_BG_URL }} style={s.container} resizeMode="cover">
      {/* Light Overlay Scrim for text readability - pointerEvents="none" ensures buttons receive click events! */}
      <View style={s.scrimOverlay} pointerEvents="none" />

      {/* Top Header / Brand Anchor */}
      <View style={s.headerBar}>
        <View style={s.logoBadge}>
          <Icon name="flag" size={20} color={Colors.white} />
        </View>
        <Text style={s.brandTitle}>ANC MEMBER</Text>
      </View>

      {/* Bottom Main Content */}
      <View style={s.bottomContent}>
        <Text style={s.headlineText}>
          Your ANC.{'\n'}
          Your Community.{'\n'}
          Your Voice.
        </Text>

        <View style={s.yamiTag}>
          <Text style={s.yamiTagText}>
            Powered by <Text style={s.yamiGoldText}>YAMI</Text>
          </Text>
        </View>

        <Text style={s.paragraphText}>
          Stay connected with your branch, community, events, services and official ANC updates.
        </Text>

        {/* Action Buttons */}
        <View style={s.btnStack}>
          <TouchableOpacity style={s.signInBtn} onPress={handleSignIn} activeOpacity={0.8}>
            <Text style={s.signInBtnText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.joinBtn} onPress={handleJoin} activeOpacity={0.8}>
            <Text style={s.joinBtnText}>Join the ANC</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.guestLink} onPress={handleGuest} activeOpacity={0.7}>
            <Text style={s.guestLinkText}>Explore as Guest</Text>
            <Icon name="arrow-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'space-between', padding: 20, paddingBottom: 40 },
  scrimOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(247, 249, 246, 0.72)' },

  headerBar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 40, zIndex: 10 },
  logoBadge: { width: 38, height: 38, borderRadius: 10, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  brandTitle: { fontSize: 18, fontWeight: '900', color: Colors.primary, letterSpacing: 0.5 },

  bottomContent: { zIndex: 10, marginTop: 'auto' },
  headlineText: { fontSize: 36, fontWeight: '900', color: Colors.ink, lineHeight: 42, marginBottom: 10 },

  yamiTag: { backgroundColor: 'rgba(0,0,0,0.5)', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 12 },
  yamiTagText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  yamiGoldText: { color: Colors.gold, fontWeight: '900' },

  paragraphText: { fontSize: 14, color: Colors.muted, lineHeight: 20, marginBottom: 24, maxWidth: 320 },

  btnStack: { gap: 12 },
  signInBtn: { backgroundColor: Colors.primary, borderRadius: 28, paddingVertical: 16, alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  signInBtnText: { color: Colors.white, fontWeight: '900', fontSize: 15 },

  joinBtn: { backgroundColor: Colors.white, borderRadius: 28, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder },
  joinBtnText: { color: Colors.ink, fontWeight: '900', fontSize: 15 },

  guestLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 6, paddingVertical: 8 },
  guestLinkText: { color: Colors.primary, fontWeight: '900', fontSize: 14 },
});
