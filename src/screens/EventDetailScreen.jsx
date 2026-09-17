import React, { useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import { Icon } from '../components/Icons';
import { rsvpToEvent } from '../services/eventsService';
import { Colors } from '../theme/colors';

const toRadians = value => value * Math.PI / 180;
const distanceInKm = (from, to) => {
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);
  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(deltaLon / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function EventDetailScreen({ event }) {
  const [distance, setDistance] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [loadingDistance, setLoadingDistance] = useState(false);
  const [notice, setNotice] = useState('');
  const [rsvped, setRsvped] = useState(event?.rsvp_response === 'going');

  if (!event) return <View style={s.center}><Text style={s.empty}>This event is no longer available.</Text></View>;

  const address = [event.venue, event.location].filter(Boolean).join(', ') || 'ANC event venue';
  const date = event.starts_at ? new Date(event.starts_at) : null;
  const schedule = date ? `${date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} · ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Date and time to be confirmed';

  async function resolveRoute({ openMaps = false } = {}) {
    setLoadingDistance(true); setNotice('');
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') throw new Error('Location permission was not granted. You can still open directions without sharing your location.');
      const currentPosition = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const destination = coordinates || (await Location.geocodeAsync(address))[0];
      if (!destination) throw new Error('We could not find this venue on the map. Check the event address.');
      const nextOrigin = { latitude: currentPosition.coords.latitude, longitude: currentPosition.coords.longitude };
      setOrigin(nextOrigin); setCoordinates(destination);
      setDistance(distanceInKm(nextOrigin, destination));
      if (openMaps) openDirections(nextOrigin, destination);
    } catch (error) { setNotice(error?.message || 'Distance could not be calculated.'); }
    finally { setLoadingDistance(false); }
  }

  function openDirections(nextOrigin = origin, destination = coordinates) {
    const destinationParam = destination ? `${destination.latitude},${destination.longitude}` : address;
    const originParam = nextOrigin ? `&origin=${encodeURIComponent(`${nextOrigin.latitude},${nextOrigin.longitude}`)}` : '';
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationParam)}${originParam}&travelmode=driving`).catch(() => setNotice('Maps could not be opened on this device.'));
  }

  async function rsvp() {
    try { await rsvpToEvent(event.id, 'going'); setRsvped(true); setNotice('You are going — the organiser has your RSVP.'); }
    catch (error) { setNotice(error?.message || 'We could not save your RSVP.'); }
  }

  return <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={s.tagRow}><Icon name={event.audience === 'national' ? 'public' : 'groups'} size={16} color={Colors.primary}/><Text style={s.tag}>{event.audience === 'national' ? 'ANC NATIONAL EVENT' : 'BRANCH EVENT'}</Text></View>
    <Text style={s.title}>{event.title}</Text>
    <Text style={s.description}>{event.description || 'Join fellow ANC members at this community event.'}</Text>
    <View style={s.card}>
      <DetailRow icon="schedule" label="Date and time" value={schedule}/>
      <DetailRow icon="location-on" label="Venue" value={address}/>
      {distance !== null ? <DetailRow icon="near-me" label="Your distance" value={`${distance < 1 ? Math.round(distance * 1000) + ' m' : distance.toFixed(1) + ' km'} away`}/> : null}
    </View>
    <TouchableOpacity onPress={rsvp} style={[s.primaryButton, rsvped && s.rsvpDone]}><Icon name={rsvped ? 'check-circle' : 'event-available'} size={19} color={Colors.white}/><Text style={s.primaryText}>{rsvped ? 'You are going' : 'RSVP — I will attend'}</Text></TouchableOpacity>
    <TouchableOpacity disabled={loadingDistance} onPress={() => resolveRoute()} style={s.outlineButton}>{loadingDistance ? <ActivityIndicator color={Colors.primary}/> : <Icon name="my-location" size={19} color={Colors.primary}/>}<Text style={s.outlineText}>{loadingDistance ? 'Getting your location…' : distance !== null ? 'Refresh my distance' : 'Show distance from me'}</Text></TouchableOpacity>
    <TouchableOpacity disabled={loadingDistance} onPress={() => coordinates && origin ? openDirections() : resolveRoute({ openMaps: true })} style={s.outlineButton}><Icon name="directions" size={19} color={Colors.primary}/><Text style={s.outlineText}>Get directions on Maps</Text></TouchableOpacity>
    <Text style={s.privacy}>Your location is used only after you tap a location button. It is not stored or shared with the organiser.</Text>
    {notice ? <Text style={s.notice}>{notice}</Text> : null}
  </ScrollView>;
}

function DetailRow({ icon, label, value }) { return <View style={s.detailRow}><View style={s.iconBox}><Icon name={icon} size={19} color={Colors.primary}/></View><View style={{ flex: 1 }}><Text style={s.detailLabel}>{label}</Text><Text style={s.detailValue}>{value}</Text></View></View>; }

const s = StyleSheet.create({
  content:{ padding:20, paddingBottom:110, backgroundColor:Colors.background }, center:{flex:1,alignItems:'center',justifyContent:'center'}, empty:{color:Colors.muted,fontSize:15}, tagRow:{flexDirection:'row',alignItems:'center',gap:6,marginTop:4}, tag:{fontSize:11,fontWeight:'900',letterSpacing:1,color:Colors.primary}, title:{fontSize:28,fontWeight:'900',color:Colors.ink,marginTop:10,lineHeight:34}, description:{fontSize:15,lineHeight:22,color:Colors.muted,marginTop:9}, card:{backgroundColor:Colors.white,borderRadius:16,borderWidth:1,borderColor:'#E1EAE2',padding:16,marginTop:22}, detailRow:{flexDirection:'row',gap:12,paddingVertical:11,borderBottomWidth:1,borderBottomColor:'#EEF2EE'}, iconBox:{width:38,height:38,borderRadius:19,backgroundColor:'#E9F5EC',alignItems:'center',justifyContent:'center'}, detailLabel:{fontSize:11,fontWeight:'800',textTransform:'uppercase',letterSpacing:.6,color:Colors.muted}, detailValue:{fontSize:15,fontWeight:'700',lineHeight:21,color:Colors.ink,marginTop:3}, primaryButton:{minHeight:52,marginTop:18,borderRadius:11,backgroundColor:Colors.primary,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:9}, rsvpDone:{backgroundColor:'#16894D'}, primaryText:{fontSize:15,fontWeight:'900',color:Colors.white}, outlineButton:{minHeight:52,borderRadius:11,borderWidth:1.5,borderColor:Colors.primary,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:9,marginTop:12}, outlineText:{fontSize:15,fontWeight:'900',color:Colors.primary}, privacy:{fontSize:12,lineHeight:18,color:Colors.muted,textAlign:'center',marginTop:16,paddingHorizontal:12}, notice:{backgroundColor:'#E8F6EB',color:Colors.primary,fontSize:13,fontWeight:'700',lineHeight:19,padding:12,borderRadius:9,marginTop:16}
});
