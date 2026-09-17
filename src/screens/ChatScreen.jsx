import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Contacts from 'expo-contacts';
import { Colors } from '../theme/colors';
import { Icon } from '../components/Icons';
import { createDirectConversation, createGroupConversation, createOnlinePresenceChannel, createTypingChannel, getConversations, getMembersInContacts, getMessages, getPeopleYouMayKnow, sendMessage, subscribeToMessages } from '../services/chatService';

const DEMO_USER = { id: 'demo-member', full_name: 'Lerumo Thabo' };

export default function ChatScreen({ user, onRequireSignIn }) {
  const [conversations, setConversations] = useState([]);
  const [people, setPeople] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [composer, setComposer] = useState('');
  const [showPeople, setShowPeople] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typingNames, setTypingNames] = useState([]);
  const [onlineMemberIds, setOnlineMemberIds] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [contactStatus, setContactStatus] = useState('');
  const [findingContacts, setFindingContacts] = useState(false);
  const listRef = useRef(null);
  const typingRef = useRef(null);

  const currentUser = user ? { id: user.id, full_name: user.user_metadata?.full_name || user.email || 'ANC Member' } : DEMO_USER;
  useEffect(() => { load(); }, [currentUser.id]);
  useEffect(() => {
    if (!user) return undefined;
    const onlineChannel = createOnlinePresenceChannel(currentUser.id, currentUser.full_name, members => {
      setOnlineMemberIds(members.map(member => member.id));
    });
    return () => onlineChannel.close();
  }, [currentUser.id, currentUser.full_name, user]);
  useEffect(() => {
    if (!selected) return undefined;
    let unsubscribe = () => {};
    let typingChannel;
    getMessages(selected.id).then(setMessages).catch(() => setMessages([]));
    unsubscribe = subscribeToMessages(selected.id, () => {
      // Re-read through the profile relationship so live group messages retain
      // the sender's registered ANC name instead of only their UUID.
      getMessages(selected.id).then(setMessages).catch(() => {});
    });
    typingChannel = createTypingChannel(selected.id, currentUser.id, members => setTypingNames([...new Set(members.filter(member => member.typing && member.name !== currentUser.full_name).map(member => member.name))]));
    typingRef.current = typingChannel;
    return () => {
      typingChannel?.sendTyping?.(currentUser.full_name, false);
      unsubscribe();
      typingChannel?.close?.();
      setTypingNames([]);
    };
  }, [selected]);

  async function load() {
    setLoading(true);
    setLoadError('');
    try {
      const [chatList, suggested] = await Promise.all([getConversations(currentUser.id), getPeopleYouMayKnow(currentUser.id)]);
      setConversations(chatList); setPeople(suggested);
    } catch (error) {
      setLoadError(error?.message || 'Could not load ANC members.');
    } finally { setLoading(false); }
  }
  async function findPhoneContacts() {
    if (Platform.OS === 'web') {
      setContactStatus('Contact matching is available in the installed ANC Unity app on Android or iPhone.');
      return;
    }
    setFindingContacts(true);
    setContactStatus('');
    try {
      const permission = await Contacts.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        setContactStatus('Contact access was not granted. You can enable it later in your phone settings.');
        return;
      }
      const response = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] });
      const numbers = [...new Set((response.data || []).flatMap(contact => (contact.phoneNumbers || []).map(phone => normalizePhone(phone.number))).filter(Boolean))];
      if (!numbers.length) {
        setContactStatus('No phone numbers were found in your contacts.');
        return;
      }
      const matches = await getMembersInContacts(numbers.slice(0, 1000));
      setPeople(current => {
        const otherPeople = current.filter(person => !matches.some(match => match.id === person.id));
        return [...matches, ...otherPeople];
      });
      setContactStatus(matches.length ? `${matches.length} ANC ${matches.length === 1 ? 'member is' : 'members are'} in your contacts.` : 'No ANC members from your contacts have joined yet.');
    } catch (error) {
      setContactStatus(error?.message || 'We could not match your phone contacts. Please try again.');
    } finally {
      setFindingContacts(false);
    }
  }
  async function startDirect(person) {
    const conversation = await createDirectConversation(currentUser.id, person);
    setConversations(current => current.some(item => item.id === conversation.id) ? current : [conversation, ...current]);
    setShowPeople(false); setSelected(conversation);
  }
  async function createGroup() {
    if (!groupName.trim() || !selectedMembers.length) return;
    const group = await createGroupConversation(groupName.trim(), selectedMembers, currentUser.id);
    setConversations(current => [group, ...current]); setShowGroup(false); setGroupName(''); setSelectedMembers([]); setSelected(group);
  }
  async function submit() {
    const content = composer.trim(); if (!content || !selected) return;
    setComposer(''); typingRef.current?.sendTyping(currentUser.full_name, false);
    const message = await sendMessage(selected.id, content);
    setMessages(current => current.some(item => item.id === message.id) ? current : [...current, message]);
  }
  function updateComposer(value) { setComposer(value); typingRef.current?.sendTyping(currentUser.full_name, value.trim().length > 0); }
  function scrollToLatest() { setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 120); }
  function handleComposerKeyPress(event) {
    const nativeEvent = event?.nativeEvent || event;
    if (nativeEvent?.key === 'Enter' && !nativeEvent?.shiftKey) {
      event?.preventDefault?.();
      submit();
    }
  }

  if (!user) return <View style={{flex:1,alignItems:'center',justifyContent:'center',padding:32}}><View style={{width:64,height:64,borderRadius:32,backgroundColor:'#E3F3E7',alignItems:'center',justifyContent:'center',marginBottom:18}}><Icon name="lock" color={Colors.primary} size={28} /></View><Text style={{fontSize:24,fontWeight:'900',color:Colors.ink}}>Sign in to ANC Chat</Text><Text style={{fontSize:14,color:Colors.muted,textAlign:'center',lineHeight:21,marginTop:8,maxWidth:310}}>Chat is available to verified ANC member accounts. Sign in with one of the accounts you created to see other members.</Text><TouchableOpacity style={{backgroundColor:Colors.primary,borderRadius:9,paddingVertical:13,paddingHorizontal:40,marginTop:22}} onPress={onRequireSignIn}><Text style={{color:Colors.white,fontSize:15,fontWeight:'800'}}>Sign in</Text></TouchableOpacity></View>;

  const selectedOnline = selected?.type === 'direct' && onlineMemberIds.includes(selected.other_member_id);
  const groupOnlineCount = selected?.member_ids?.filter(id => onlineMemberIds.includes(id)).length;
  const selectedStatus = typingNames.length
    ? `${typingNames.join(', ')} ${typingNames.length === 1 ? 'is' : 'are'} typing…`
    : selected?.type === 'group'
      ? `${groupOnlineCount || 0} online · ${selected.member_count || 0} members`
      : selectedOnline ? 'Online now' : 'Offline';

  if (selected) return <KeyboardAvoidingView style={s.fill} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><View style={s.chatHeader}><TouchableOpacity onPress={() => setSelected(null)} style={s.back}><Icon name="arrow-back" size={22} /><View style={s.avatar}><Text style={s.avatarText}>{selected.initials}</Text></View><View><Text style={s.chatName}>{selected.name}</Text><Text style={[s.presence, !selectedOnline && selected.type === 'direct' && s.offlinePresence]}>{selectedStatus}</Text></View></TouchableOpacity></View><FlatList ref={listRef} style={{flex:1}} data={messages} keyExtractor={item => item.id} contentContainerStyle={s.messages} keyboardShouldPersistTaps="handled" onContentSizeChange={scrollToLatest} renderItem={({ item }) => { const isMine = item.sender_id === currentUser.id; return <View style={[s.bubble, isMine && s.bubbleMine]}>{!isMine && selected.type === 'group' ? <Text style={s.senderName}>{item.sender_name || 'ANC Member'}</Text> : null}<Text style={[s.bubbleText, isMine && s.bubbleTextMine]}>{item.content}</Text><Text style={[s.messageTime, isMine && s.messageTimeMine]}>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text></View>}} /><View style={s.composer}><TextInput value={composer} onChangeText={updateComposer} onFocus={scrollToLatest} onBlur={() => typingRef.current?.sendTyping(currentUser.full_name, false)} onKeyPress={handleComposerKeyPress} returnKeyType="send" placeholder="Message" placeholderTextColor={Colors.muted} style={s.composerInput} multiline /><TouchableOpacity accessibilityRole="button" accessibilityLabel="Send message" disabled={!composer.trim()} onPress={submit} style={[s.sendButton, !composer.trim() && s.sendDisabled]}><Icon name="send" color={Colors.white} size={20}/></TouchableOpacity></View></KeyboardAvoidingView>;
  return <View style={s.fill}>
    <View style={s.titleRow}><View><Text style={s.title}>Chats</Text><Text style={s.subTitle}>Connect with ANC members and your community.</Text></View><View style={{flexDirection:'row',gap:10}}><TouchableOpacity accessibilityRole="button" accessibilityLabel="Refresh members" onPress={load} style={s.newGroup}><Icon name="refresh" color={Colors.white} size={20}/></TouchableOpacity><TouchableOpacity accessibilityRole="button" accessibilityLabel="Create ANC group" onPress={() => setShowGroup(true)} style={s.newGroup}><Icon name="group-add" color={Colors.white} size={20}/></TouchableOpacity></View></View>
    {loading ? <ActivityIndicator color={Colors.primary} style={{marginTop: 32}}/> : <FlatList
      data={conversations}
      keyExtractor={item => item.id}
      contentContainerStyle={s.list}
      ListHeaderComponent={<>{loadError ? <Text style={{fontSize:12,color:'#9A3F00',backgroundColor:'#FFF2E6',padding:10,borderRadius:8,marginBottom:14}}>{loadError}</Text> : null}<TouchableOpacity accessibilityRole="button" accessibilityLabel="Find ANC members in my phone contacts" onPress={findPhoneContacts} disabled={findingContacts} style={[s.contactsButton, findingContacts && s.contactsButtonDisabled]}><Icon name="contacts" color={Colors.primary} size={19}/><Text style={s.contactsButtonText}>{findingContacts ? 'Checking your contacts…' : 'Find ANC members in my contacts'}</Text></TouchableOpacity>{contactStatus ? <Text style={s.contactStatus}>{contactStatus}</Text> : null}<View style={s.sectionRow}><Text style={s.section}>PEOPLE YOU MAY KNOW</Text><TouchableOpacity onPress={() => setShowPeople(true)}><Text style={s.seeAll}>See all</Text></TouchableOpacity></View><FlatList horizontal showsHorizontalScrollIndicator={false} data={people.slice(0, 5)} keyExtractor={item => item.id} contentContainerStyle={s.people} renderItem={({item}) => <TouchableOpacity onPress={() => startDirect(item)} style={s.person}><View style={s.personAvatar}><Text style={s.avatarText}>{item.initials}</Text>{onlineMemberIds.includes(item.id) ? <View style={s.onlineDot} /> : null}</View><Text numberOfLines={1} style={s.personName}>{item.full_name.split(' ')[0]}</Text><Text numberOfLines={1} style={[s.personBranch, onlineMemberIds.includes(item.id) && s.onlineText]}>{item.matched_contact ? 'In your contacts' : onlineMemberIds.includes(item.id) ? 'Online' : item.branch_name || 'ANC member'}</Text></TouchableOpacity>}/>{!people.length && !loadError ? <Text style={{fontSize:13,color:Colors.muted,marginBottom:8}}>No other registered ANC members were found yet. Create or sign in to another verified account, then tap refresh.</Text> : null}<Text style={[s.section, {marginTop: 22}]}>CONVERSATIONS</Text></>}
      renderItem={({item}) => <TouchableOpacity onPress={() => setSelected(item)} style={s.conversation}><View style={s.conversationAvatar}><Text style={s.avatarText}>{item.initials}</Text>{item.type === 'direct' && onlineMemberIds.includes(item.other_member_id) ? <View style={s.conversationOnlineDot} /> : null}</View><View style={{flex:1}}><View style={s.conversationTop}><Text style={s.conversationName}>{item.name}</Text><Text style={s.conversationDate}>{formatDate(item.last_message_at)}</Text></View><Text numberOfLines={1} style={s.lastMessage}>{item.last_message}</Text></View></TouchableOpacity>}
    />}
    <PeopleModal visible={showPeople} people={people} onlineIds={onlineMemberIds} onClose={() => setShowPeople(false)} onSelect={startDirect}/><GroupModal visible={showGroup} people={people} name={groupName} setName={setGroupName} selected={selectedMembers} setSelected={setSelectedMembers} onClose={() => setShowGroup(false)} onCreate={createGroup}/>
  </View>;
}

function PeopleModal({visible, people, onlineIds, onClose, onSelect}) { return <Modal visible={visible} animationType="slide" onRequestClose={onClose}><View style={s.modal}><View style={s.modalHeader}><Text style={s.modalTitle}>People you may know</Text><TouchableOpacity onPress={onClose}><Icon name="close" size={24}/></TouchableOpacity></View><FlatList data={people} keyExtractor={item => item.id} renderItem={({item}) => <TouchableOpacity style={s.personRow} onPress={() => onSelect(item)}><View style={s.conversationAvatar}><Text style={s.avatarText}>{item.initials}</Text>{onlineIds.includes(item.id) ? <View style={s.conversationOnlineDot} /> : null}</View><View style={{flex:1}}><Text style={s.conversationName}>{item.full_name}</Text><Text style={[s.lastMessage, onlineIds.includes(item.id) && s.onlineText]}>{onlineIds.includes(item.id) ? 'Online now' : item.branch_name || 'ANC member'}</Text></View><Icon name="chat" size={20} color={Colors.primary}/></TouchableOpacity>}/></View></Modal> }
function GroupModal({visible, people, name, setName, selected, setSelected, onClose, onCreate}) { return <Modal visible={visible} animationType="slide" onRequestClose={onClose}><View style={s.modal}><View style={s.modalHeader}><Text style={s.modalTitle}>Create ANC group</Text><TouchableOpacity onPress={onClose}><Icon name="close" size={24}/></TouchableOpacity></View><TextInput value={name} onChangeText={setName} placeholder="Group name" placeholderTextColor={Colors.muted} style={s.groupInput}/><Text style={s.section}>ADD MEMBERS</Text><FlatList data={people} keyExtractor={item => item.id} renderItem={({item}) => { const active = selected.includes(item.id); return <TouchableOpacity style={s.personRow} onPress={() => setSelected(active ? selected.filter(id => id !== item.id) : [...selected, item.id])}><View style={s.conversationAvatar}><Text style={s.avatarText}>{item.initials}</Text></View><Text style={[s.conversationName, {flex:1}]}>{item.full_name}</Text><Icon name={active ? 'check-circle' : 'radio-button-unchecked'} color={active ? Colors.primary : Colors.muted} size={22}/></TouchableOpacity>}}/><TouchableOpacity disabled={!name.trim() || !selected.length} onPress={onCreate} style={[s.create, (!name.trim() || !selected.length) && s.createDisabled]}><Text style={s.createText}>Create group</Text></TouchableOpacity></View></Modal> }
function formatDate(value) { if (!value) return ''; const date = new Date(value); return date.toDateString() === new Date().toDateString() ? date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : date.toLocaleDateString([], {month:'short', day:'numeric'}); }
function normalizePhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (/^0\d{9}$/.test(digits)) return `27${digits.slice(1)}`;
  if (/^27\d{9}$/.test(digits)) return digits;
  return digits.length >= 7 ? digits : '';
}

const s = StyleSheet.create({ fill:{flex:1,backgroundColor:Colors.background}, titleRow:{padding:20,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}, title:{fontSize:30,fontWeight:'900',color:Colors.ink,fontFamily:'Hanken Grotesk'}, subTitle:{fontSize:13,color:Colors.muted,marginTop:3}, newGroup:{width:44,height:44,borderRadius:22,backgroundColor:Colors.primary,alignItems:'center',justifyContent:'center'}, list:{paddingHorizontal:20,paddingBottom:25}, contactsButton:{minHeight:44,borderRadius:9,borderWidth:1,borderColor:'#B9E6C6',backgroundColor:'#EFFAF2',alignItems:'center',justifyContent:'center',flexDirection:'row',gap:8,marginBottom:12,paddingHorizontal:12},contactsButtonDisabled:{opacity:.65},contactsButtonText:{fontSize:13,fontWeight:'800',color:Colors.primary},contactStatus:{fontSize:12,color:Colors.muted,lineHeight:17,marginTop:-5,marginBottom:14}, sectionRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}, section:{fontSize:10,fontWeight:'800',letterSpacing:1,color:Colors.muted,marginBottom:10},seeAll:{color:Colors.primary,fontWeight:'700',fontSize:12,marginBottom:10}, people:{gap:14,paddingBottom:6}, person:{width:76,alignItems:'center'}, personAvatar:{width:54,height:54,borderRadius:27,backgroundColor:Colors.gold,alignItems:'center',justifyContent:'center',marginBottom:6,position:'relative'}, avatar:{width:36,height:36,borderRadius:18,backgroundColor:Colors.gold,alignItems:'center',justifyContent:'center',marginRight:9}, conversationAvatar:{width:48,height:48,borderRadius:24,backgroundColor:'#E3F3E7',alignItems:'center',justifyContent:'center',marginRight:12,position:'relative'}, onlineDot:{position:'absolute',right:0,bottom:4,width:13,height:13,borderRadius:7,backgroundColor:'#22C55E',borderWidth:2,borderColor:Colors.background}, conversationOnlineDot:{position:'absolute',right:10,bottom:0,width:13,height:13,borderRadius:7,backgroundColor:'#22C55E',borderWidth:2,borderColor:Colors.background}, avatarText:{fontWeight:'900',color:Colors.primary,fontSize:14},personName:{fontSize:12,fontWeight:'700',color:Colors.ink,width:'100%',textAlign:'center'},personBranch:{fontSize:9,color:Colors.muted,width:'100%',textAlign:'center',marginTop:2},onlineText:{color:Colors.primary,fontWeight:'700'},conversation:{flexDirection:'row',alignItems:'center',paddingVertical:14,borderBottomWidth:1,borderBottomColor:Colors.surfaceBorder},conversationTop:{flexDirection:'row',justifyContent:'space-between',gap:8},conversationName:{fontSize:15,fontWeight:'800',color:Colors.ink},conversationDate:{fontSize:10,color:Colors.muted},lastMessage:{fontSize:12,color:Colors.muted,marginTop:4},chatHeader:{height:62,backgroundColor:Colors.white,borderBottomWidth:1,borderBottomColor:Colors.surfaceBorder,justifyContent:'center',paddingHorizontal:15},back:{flexDirection:'row',alignItems:'center'},chatName:{fontSize:15,fontWeight:'800',color:Colors.ink},presence:{fontSize:11,color:Colors.primary,marginTop:1},offlinePresence:{color:Colors.muted},messages:{padding:16,gap:8},bubble:{alignSelf:'flex-start',maxWidth:'80%',backgroundColor:Colors.white,borderWidth:1,borderColor:Colors.surfaceBorder,borderRadius:14,borderBottomLeftRadius:3,padding:11},bubbleMine:{alignSelf:'flex-end',backgroundColor:Colors.primary,borderColor:Colors.primary,borderBottomLeftRadius:14,borderBottomRightRadius:3},senderName:{fontSize:11,fontWeight:'800',color:Colors.primary,marginBottom:4},bubbleText:{fontSize:14,color:Colors.ink,lineHeight:19},bubbleTextMine:{color:Colors.white},messageTime:{fontSize:9,color:Colors.muted,alignSelf:'flex-end',marginTop:4},messageTimeMine:{color:'rgba(255,255,255,.75)'},composer:{backgroundColor:Colors.white,borderTopWidth:1,borderColor:Colors.surfaceBorder,padding:10,flexDirection:'row',alignItems:'flex-end',gap:8},composerInput:{flex:1,minHeight:48,maxHeight:100,borderRadius:24,backgroundColor:Colors.surfaceContainerLow,paddingHorizontal:15,paddingVertical:11,color:Colors.ink,fontSize:16},sendButton:{width:42,height:42,borderRadius:21,backgroundColor:Colors.primary,alignItems:'center',justifyContent:'center'},sendDisabled:{backgroundColor:'#AAB5AD'},modal:{flex:1,backgroundColor:Colors.background,paddingTop:55,paddingHorizontal:20},modalHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:22},modalTitle:{fontSize:24,fontWeight:'900',color:Colors.ink},personRow:{flexDirection:'row',alignItems:'center',paddingVertical:14,borderBottomWidth:1,borderBottomColor:Colors.surfaceBorder},groupInput:{height:48,borderWidth:1,borderColor:Colors.surfaceBorder,borderRadius:8,backgroundColor:Colors.white,paddingHorizontal:14,color:Colors.ink,marginBottom:22},create:{height:50,backgroundColor:Colors.primary,borderRadius:8,alignItems:'center',justifyContent:'center',marginVertical:14},createDisabled:{backgroundColor:'#AAB5AD'},createText:{color:Colors.white,fontWeight:'800',fontSize:15} });
