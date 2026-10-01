import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../components/Icons';
import { Colors } from '../theme/colors';

const HERO_BG = require('../assets/welcome-community-hero.png');
const ANC_LOGO = require('../assets/anc-logo.png');

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
    <ImageBackground source={HERO_BG} style={s.container} resizeMode="cover">
      {/* Light Overlay Scrim for text readability - pointerEvents="none" ensures buttons receive click events! */}
      <View style={s.scrimOverlay} pointerEvents="none" />

      {/* Centred ANC brand anchor */}
      <View style={s.heroBrand} accessibilityRole="image" accessibilityLabel="African National Congress logo">
        <View style={s.logoHalo}>
          <View style={s.heroLogoPlate}>
            <Image source={ANC_LOGO} style={s.heroLogo} resizeMode="contain" />
          </View>
        </View>
        <View style={s.goldRule} />
        <Text style={s.brandTitle}>AFRICAN NATIONAL CONGRESS</Text>
        <Text style={s.sloganText}>A Better Life for All</Text>
      </View>

      {/* Bottom Main Content */}
      <View style={s.bottomContent}>
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
  scrimOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(247, 249, 246, 0.34)' },

  heroBrand: { position: 'absolute', top: '13%', left: 0, right: 0, alignItems: 'center', zIndex: 10 },
  logoHalo: { width: 288, height: 288, borderRadius: 144, backgroundColor: 'rgba(254,204,0,0.92)', alignItems: 'center', justifyContent: 'center', padding: 7, shadowColor: '#12351f', shadowOpacity: 0.28, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 9 },
  heroLogoPlate: { width: '100%', height: '100%', borderRadius: 140, backgroundColor: 'rgba(255,255,255,0.98)', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: Colors.primary },
  heroLogo: { width: 238, height: 238 },
  goldRule: { width: 46, height: 4, borderRadius: 2, backgroundColor: Colors.gold, marginTop: 15, marginBottom: 9 },
  brandTitle: { fontSize: 17, fontWeight: '900', color: Colors.primary, letterSpacing: 0.9, textAlign: 'center', textShadowColor: 'rgba(255,255,255,0.85)', textShadowRadius: 2 },
  sloganText: { marginTop: 4, fontSize: 16, fontWeight: '800', color: Colors.ink, textAlign: 'center', textShadowColor: 'rgba(255,255,255,0.85)', textShadowRadius: 2 },

  bottomContent: { zIndex: 10, marginTop: 'auto' },
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
