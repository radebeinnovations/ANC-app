import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import { Icon } from '../components/Icons';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';
import { isSupabaseConfigured, supabase } from '../services/supabase';

export default function SignInScreen({ finish, onSignIn, onAuthSuccess, onBackToWelcome }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [membershipNumber, setMembershipNumber] = useState('');
  const [branchName, setBranchName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const liveAuth = isSupabaseConfigured();

  async function submit() {
    setMessage('');
    if (!liveAuth) { onSignIn?.() || finish?.('Logged in successfully!'); return; }
    if (!email.trim() || !password) { setMessage('Enter your email address and password.'); return; }
    if (mode === 'signup' && (!fullName.trim() || !phoneNumber.trim())) { setMessage('Enter your full name and mobile number.'); return; }
    setLoading(true);
    try {
      if (mode === 'signup') {
        const emailRedirectTo = typeof window !== 'undefined' ? `${window.location.origin}/?verification=success` : undefined;
        const { data, error } = await supabase.auth.signUp({ email: email.trim().toLowerCase(), password, options: { emailRedirectTo, data: { full_name: fullName.trim(), phone_number: phoneNumber.trim(), membership_number: membershipNumber.trim().toUpperCase() || null, branch_name: branchName.trim() || null } } });
        if (error) throw error;
        if (data.session) onAuthSuccess?.(data.user);
        else setMessage('Account created. Check your email to confirm your account, then sign in.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
        if (error) throw error;
        onAuthSuccess?.(data.user);
      }
    } catch (error) {
      const detail = error?.message || '';
      setMessage(
        /failed to fetch|network request failed/i.test(detail)
          ? 'Cannot reach Supabase. Confirm the Project URL and publishable key come from the same ANC-app project, then restart Expo.'
          : detail || 'We could not sign you in.'
      );
    } finally { setLoading(false); }
  }

  return <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"><View style={s.topBar}><TouchableOpacity style={s.backBtn} onPress={() => onBackToWelcome?.()}><Icon name="arrow-back" size={20} color={Colors.ink}/></TouchableOpacity><Text style={s.topBarTitle}>ANC</Text><View style={{width:24}}/></View><View style={s.headingSection}><Text style={s.welcomeTitle}>{mode === 'signin' ? 'Welcome Back' : 'Join ANC Member'}</Text><Text style={s.welcomeSub}>{liveAuth ? (mode === 'signin' ? 'Sign in securely to access your member account and ANC chats.' : 'Create your secure ANC member profile.') : 'Local demonstration sign-in. Supabase has not been configured.'}</Text></View>{liveAuth ? <View style={s.segmentedContainer}><Tab active={mode === 'signin'} text="Sign in" onPress={() => {setMode('signin');setMessage('');}}/><Tab active={mode === 'signup'} text="Create account" onPress={() => {setMode('signup');setMessage('');}}/></View> : <TouchableOpacity style={s.demoHintChip} onPress={submit}><Icon name="lock" size={14} color={Colors.primary}/><Text style={s.demoHintText}>Demo mode — tap to continue.</Text></TouchableOpacity>}{message ? <View style={s.messagePill}><Icon name="info-outline" size={16} color={Colors.primary}/><Text style={s.messageText}>{message}</Text></View> : null}{mode === 'signup' ? <><Input label="Full name" icon="person" value={fullName} onChangeText={setFullName} placeholder="Name and surname" autoCapitalize="words"/><Input label="Mobile number" icon="phone" value={phoneNumber} onChangeText={setPhoneNumber} placeholder="e.g. 082 123 4567" keyboardType="phone-pad"/><Input label="Membership number (optional)" icon="badge" value={membershipNumber} onChangeText={setMembershipNumber} placeholder="ANC-1234567" autoCapitalize="characters"/><Input label="Ward / branch (optional)" icon="groups" value={branchName} onChangeText={setBranchName} placeholder="e.g. Ward 14 Branch" autoCapitalize="words"/></> : null}<Input label="Email address" icon="email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none"/><View style={s.fieldGroup}><Text style={s.fieldLabel}>Password</Text><View style={s.inputWrapper}><Icon name="lock" size={20} color={Colors.primary}/><TextInput style={s.input} value={password} onChangeText={setPassword} placeholder="Enter your password" secureTextEntry={!showPassword} placeholderTextColor="#97A39A"/><TouchableOpacity onPress={() => setShowPassword(!showPassword)}><Icon name={showPassword ? 'visibility' : 'visibility-off'} size={20} color={Colors.muted}/></TouchableOpacity></View></View><Button text={loading ? 'Please wait…' : mode === 'signin' ? 'Sign in  →' : 'Create account  →'} disabled={loading} onPress={submit}/>{liveAuth && mode === 'signin' ? <TouchableOpacity onPress={() => setMessage('Password recovery can be enabled in Supabase Auth settings.')} style={s.forgot}><Text style={s.forgotText}>Forgot password?</Text></TouchableOpacity> : null}<YamiFooter /></ScrollView>;
}

function Tab({active, text, onPress}) { return <TouchableOpacity style={[s.segmentedBtn, active && s.segmentedBtnOn]} onPress={onPress}><Text style={[s.segmentedText, active && s.segmentedTextOn]}>{text}</Text></TouchableOpacity> }
function Input({label, icon, ...props}) { return <View style={s.fieldGroup}><Text style={s.fieldLabel}>{label}</Text><View style={s.inputWrapper}><Icon name={icon} size={20} color={Colors.primary}/><TextInput style={s.input} placeholderTextColor="#97A39A" {...props}/></View></View> }

const s = StyleSheet.create({ content:{padding:16,paddingBottom:100,backgroundColor:Colors.background},topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:12,borderBottomWidth:1,borderBottomColor:Colors.line,marginBottom:16},backBtn:{padding:4},topBarTitle:{fontSize:18,fontWeight:'900',color:Colors.primary},headingSection:{marginBottom:20},welcomeTitle:{fontSize:28,fontWeight:'900',color:Colors.ink},welcomeSub:{fontSize:13,color:Colors.muted,marginTop:4,lineHeight:19},segmentedContainer:{flexDirection:'row',backgroundColor:Colors.surfaceContainer,borderRadius:12,padding:4,marginBottom:16,borderWidth:1,borderColor:Colors.surfaceBorder},segmentedBtn:{flex:1,paddingVertical:10,alignItems:'center',borderRadius:8},segmentedBtnOn:{backgroundColor:Colors.white},segmentedText:{fontSize:12,fontWeight:'700',color:Colors.muted},segmentedTextOn:{color:Colors.ink,fontWeight:'800'},demoHintChip:{flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:'#F0F9F2',borderRadius:10,padding:10,borderWidth:1,borderColor:'#C6EAD0',gap:6,marginBottom:16},demoHintText:{fontSize:12,color:Colors.ink,fontWeight:'700'},messagePill:{flexDirection:'row',alignItems:'center',backgroundColor:'#EFF7F0',borderRadius:10,padding:10,borderWidth:1,borderColor:'#C6EAD0',gap:7,marginBottom:14},messageText:{fontSize:12,color:Colors.ink,fontWeight:'600',flex:1},fieldGroup:{marginBottom:16},fieldLabel:{fontSize:12,fontWeight:'800',color:Colors.ink,marginBottom:6},inputWrapper:{flexDirection:'row',alignItems:'center',backgroundColor:Colors.white,borderRadius:12,borderWidth:1,borderColor:Colors.surfaceBorder,paddingHorizontal:12,paddingVertical:12,gap:10},input:{flex:1,fontSize:14,color:Colors.ink},forgot:{alignItems:'center',padding:16},forgotText:{fontSize:12,fontWeight:'800',color:Colors.primary} });
