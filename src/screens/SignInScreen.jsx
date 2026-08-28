import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import { Icon } from '../components/Icons';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';

export default function SignInScreen({ finish, onSignIn, onBackToWelcome }) {
  const [loginType, setLoginType] = useState('membership'); // 'membership' | 'phone'
  const [identifier, setIdentifier] = useState('ANC-1234567');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = () => {
    setErrorMessage('');
    const trimmedId = identifier.trim();
    const trimmedPass = password.trim();

    if (!trimmedId) {
      setErrorMessage(
        loginType === 'membership'
          ? 'Please enter your Membership Number (e.g. ANC-1234567).'
          : 'Please enter your Phone Number (e.g. 0821234567).'
      );
      return;
    }

    if (!trimmedPass) {
      setErrorMessage('Please enter your password.');
      return;
    }

    // Authenticate with valid locked-in credentials
    if (onSignIn) {
      onSignIn();
    } else {
      finish('Logged in successfully!');
    }
  };

  const fillDemoCredentials = () => {
    setErrorMessage('');
    if (loginType === 'membership') {
      setIdentifier('ANC-1234567');
    } else {
      setIdentifier('0821234567');
    }
    setPassword('123456');
  };

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Top Header Bar */}
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={() => onBackToWelcome ? onBackToWelcome() : finish('Back to Welcome')}>
          <Icon name="arrow-back" size={20} color={Colors.ink} />
        </TouchableOpacity>
        <Text style={s.topBarTitle}>ANC</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Heading Section */}
      <View style={s.headingSection}>
        <Text style={s.welcomeTitle}>Welcome Back</Text>
        <Text style={s.welcomeSub}>Sign in to your ANC Member account.</Text>
      </View>

      {/* Segmented Control Pill Bar */}
      <View style={s.segmentedContainer}>
        <TouchableOpacity
          style={[s.segmentedBtn, loginType === 'membership' && s.segmentedBtnOn]}
          onPress={() => {
            setLoginType('membership');
            setIdentifier('ANC-1234567');
            setErrorMessage('');
          }}
          activeOpacity={0.8}
        >
          <Text style={[s.segmentedText, loginType === 'membership' && s.segmentedTextOn]}>
            Membership Number
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.segmentedBtn, loginType === 'phone' && s.segmentedBtnOn]}
          onPress={() => {
            setLoginType('phone');
            setIdentifier('0821234567');
            setErrorMessage('');
          }}
          activeOpacity={0.8}
        >
          <Text style={[s.segmentedText, loginType === 'phone' && s.segmentedTextOn]}>
            Phone Number
          </Text>
        </TouchableOpacity>
      </View>

      {/* Locked-in Credentials Hint Chip */}
      <TouchableOpacity style={s.demoHintChip} onPress={fillDemoCredentials} activeOpacity={0.8}>
        <Icon name="lock" size={14} color={Colors.primary} />
        <Text style={s.demoHintText}>
          Locked Credentials: <Text style={s.demoHintBold}>{loginType === 'membership' ? 'ANC-1234567' : '0821234567'}</Text> | Password: <Text style={s.demoHintBold}>123456</Text>
        </Text>
      </TouchableOpacity>

      {/* Error Message Pill */}
      {errorMessage ? (
        <View style={s.errorPill}>
          <Icon name="error-outline" size={16} color={Colors.error} />
          <Text style={s.errorPillText}>{errorMessage}</Text>
        </View>
      ) : null}

      {/* Dynamic Identifier Input Field */}
      <View style={s.fieldGroup}>
        <Text style={s.fieldLabel}>
          {loginType === 'membership' ? 'Membership Number' : 'Phone Number'}
        </Text>
        <View style={s.inputWrapper}>
          <Icon
            name={loginType === 'membership' ? 'badge' : 'smartphone'}
            size={20}
            color={Colors.primary}
          />
          <TextInput
            style={s.input}
            value={identifier}
            onChangeText={setIdentifier}
            placeholder={loginType === 'membership' ? 'e.g. ANC-1234567' : 'e.g. 082 123 4567'}
            keyboardType={loginType === 'phone' ? 'phone-pad' : 'default'}
            placeholderTextColor="#97A39A"
          />
          <Icon name="vpn-key" size={18} color={Colors.muted} />
        </View>
      </View>

      {/* Password Input Field */}
      <View style={s.fieldGroup}>
        <Text style={s.fieldLabel}>Password</Text>
        <View style={s.inputWrapper}>
          <Icon name="lock" size={20} color={Colors.primary} />
          <TextInput
            style={s.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            placeholderTextColor="#97A39A"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={20} color={Colors.muted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Remember Me & Forgot Password */}
      <View style={s.rememberRow}>
        <TouchableOpacity style={s.checkboxRow} onPress={() => setRememberMe(!rememberMe)}>
          <Icon
            name={rememberMe ? 'check-box' : 'check-box-outline-blank'}
            size={20}
            color={Colors.primary}
          />
          <Text style={s.rememberText}>Remember me</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setErrorMessage('Password recovery is not connected in this local demo. Use the displayed demo credentials.')}>
          <Text style={s.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={s.actionsGroup}>
        <Button text="Sign In  →" onPress={handleSignIn} />

        <TouchableOpacity style={s.biometricBtn} onPress={handleSignIn} activeOpacity={0.8}>
          <Icon name="fingerprint" size={22} color={Colors.primary} />
          <Text style={s.biometricText}>Biometric Login</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Links */}
      <View style={s.footerContainer}>
        <Text style={s.newMemberText}>
          New to ANC Member?{' '}
          <Text style={s.joinLinkText} onPress={() => setErrorMessage('ANC registration is not connected in this local demo. You can continue as a guest.')}>
            Join the ANC
          </Text>
        </Text>

        <TouchableOpacity style={s.guestLink} onPress={handleSignIn}>
          <Text style={s.guestText}>Continue as Guest</Text>
          <Icon name="chevron-right" size={18} color={Colors.muted} />
        </TouchableOpacity>
      </View>

      <YamiFooter />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 100, backgroundColor: Colors.background },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.line, marginBottom: 16 },
  backBtn: { padding: 4 },
  topBarTitle: { fontSize: 18, fontWeight: '900', color: Colors.primary },

  headingSection: { marginBottom: 20 },
  welcomeTitle: { fontSize: 28, fontWeight: '900', color: Colors.ink },
  welcomeSub: { fontSize: 13, color: Colors.muted, marginTop: 4 },

  segmentedContainer: { flexDirection: 'row', backgroundColor: Colors.surfaceContainer, borderRadius: 12, padding: 4, marginBottom: 14, borderWidth: 1, borderColor: Colors.surfaceBorder },
  segmentedBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  segmentedBtnOn: { backgroundColor: Colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 1 },
  segmentedText: { fontSize: 12, fontWeight: '700', color: Colors.muted },
  segmentedTextOn: { color: Colors.ink, fontWeight: '800' },

  demoHintChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9F2',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#C6EAD0',
    gap: 6,
    marginBottom: 16,
  },
  demoHintText: { fontSize: 11, color: Colors.ink, fontWeight: '600' },
  demoHintBold: { fontWeight: '900', color: Colors.primary },

  errorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#FFCACA',
    gap: 6,
    marginBottom: 14,
  },
  errorPillText: { fontSize: 12, color: Colors.error, fontWeight: '700' },

  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 12, fontWeight: '800', color: Colors.ink, marginBottom: 6 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, borderWidth: 1, borderColor: Colors.surfaceBorder, paddingHorizontal: 12, paddingVertical: 12, gap: 10 },
  input: { flex: 1, fontSize: 14, color: Colors.ink },

  rememberRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rememberText: { fontSize: 12, fontWeight: '700', color: Colors.muted },
  forgotText: { fontSize: 12, fontWeight: '800', color: Colors.primary },

  actionsGroup: { gap: 12, marginBottom: 24 },
  biometricBtn: { borderWidth: 1, borderStyle: 'dashed', borderColor: Colors.primary, borderRadius: 12, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.white },
  biometricText: { fontSize: 14, fontWeight: '800', color: Colors.ink },

  footerContainer: { alignItems: 'center', gap: 12, paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.line },
  newMemberText: { fontSize: 13, color: Colors.muted },
  joinLinkText: { color: Colors.primary, fontWeight: '800' },
  guestLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  guestText: { fontSize: 12, fontWeight: '700', color: Colors.muted },
});
