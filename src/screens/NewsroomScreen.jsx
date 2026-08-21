import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from '../components/Icons';
import YamiFooter from '../components/YamiFooter';
import { Colors } from '../theme/colors';

const ARTICLES = [
  {
    id: '1',
    tag: 'ANC STATEMENT',
    date: '12 August 2026',
    title: 'Building Stronger Local Government',
    snippet: 'Our commitment to service delivery and community empowerment remains steadfast as we approach the upcoming municipal elections.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHR1a7BGP_bULWHfBqmlTZgAdHLDUGaQ9n42EuYpuscyM7zEqqysnBEFBchrBndc5olw-z7m9zHt8J2f1KlBsIEJcbViTOgrDKxoOMDSxwyhbm6Celjx0pd0-OYh-6kDsXNsIIzcF7FU30QbvhS_w9U5M0GZjAah-V1bZR0ig9UAONPSann0NLQ6JAl8wcx2iBNtAuzSB1IZwBp7qqfHtgzBTb68fJZD2IlcmApjWzMBVXT3-_Ba0X',
    featured: true,
  },
  {
    id: '2',
    tag: 'NATIONAL COMMITTEE',
    date: '08 August 2026',
    title: 'National Working Committee Outlines Key Priorities for Upcoming Quarter',
    snippet: 'The committee has detailed a comprehensive approach to addressing municipal service delivery and expanding community engagement across all regions.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKP63Fo4xzQB73s09RdUZdVj8PBAguxzD9v7PdRtZUIi-KcvD5jkk-Hn7cr8Yg2aRvDgmFJhx1rU5GVJ0Si7IkNc7fOAGMpPatRyTgShHz2O8RWDyOOlH7aD5M1oTU2daPShpRNjCOGaTGT1mUWib7bhclB-QkA_WQA5GyaRsES47RU29XXq_WYVhW_5FthqacZ2PUOWZBK82gyAvZ2wheardxqFjgU71U6WC9jEPiTru0obm9udev',
    featured: false,
  },
  {
    id: '3',
    tag: 'YOUTH INITIATIVE',
    date: '02 August 2026',
    title: 'ANC Youth League Digital Skills Initiative Launched in Gauteng',
    snippet: 'Connecting young members with modern technology training hubs and local enterprise development opportunities.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHtomXsNt6ZfeyvGZOeE5XMikoE5zxU6RquvkfvLhr4T0JYKXccFIuYI8r2T8-9ZZlaqqwWNNziIBcMoWa6jD-ILIRWc02WFG9hRmYaM5BbCiDBXKNUaGsyOhxcgb2bbd-Rzx6m0FPLxfh6dQLM5XA30dGG_LKc4u72FFmXlnnxQsZ_gmIR0jV8GlW5p6QYUO-h6qfrqHZGSfWJY6mootTuO2zTIRBZjmzjM-J9VHYQU1WxM4WEO0i',
    featured: false,
  },
  {
    id: '4',
    tag: 'DEVELOPMENT',
    date: '28 July 2026',
    title: 'Renewable Energy & Infrastructure Support in Municipal Wards',
    snippet: 'Progress report on solar micro-grid installations and clean energy access across targeted rural communities.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP7zlfBNbg5jSucUfG5tPD3BtnVuTQAY2I1kjxSuVqrYNxWqB2lpmvbct4HtE9rdYUrNvLmyCoODdPJBfEqJlKcTv1n486W4ZiNoD2hMMB6ygx62xZumjQQcA9Q5uBGXVyeqgizdBJTJZhYHK0e2jGRtVRt-uNnljNFVUKXpdgq2Cyhy3xUtsvwfSISYHxtEhER8JSmDx9fJe9hVTzN3FqNWNa4aOez8vY3D9vx2YwUd9oJmGKaKmb',
    featured: false,
  },
];

export default function NewsroomScreen({ finish, open }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['All', 'Statements', 'Committee', 'Youth'];

  const filteredArticles = ARTICLES.filter(item => {
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Statements' && item.tag.includes('STATEMENT')) ||
      (activeFilter === 'Committee' && item.tag.includes('COMMITTEE')) ||
      (activeFilter === 'Youth' && item.tag.includes('YOUTH'));
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.snippet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Contextual Back Navigation */}
      <TouchableOpacity style={s.backRow} onPress={() => finish()} activeOpacity={0.7}>
        <Icon name="arrow-back" size={20} color={Colors.primary} />
        <Text style={s.backText}>Back to Dashboard</Text>
      </TouchableOpacity>

      {/* Title & Eyebrow */}
      <Text style={s.eyebrow}>OFFICIAL PRESS & NEWSROOM</Text>
      <Text style={s.h1}>Latest from the ANC</Text>

      {/* Search Input Box */}
      <View style={s.searchBar}>
        <Icon name="search" size={20} color="#4A5568" />
        <TextInput
          style={s.searchInput}
          placeholder="Search statements and updates..."
          placeholderTextColor="#A0AEC0"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Badges Carousel */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[s.filterPill, activeFilter === filter && s.filterPillActive]}
            onPress={() => setActiveFilter(filter)}
            activeOpacity={0.8}
          >
            <Text style={[s.filterPillText, activeFilter === filter && s.filterPillTextActive]}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Feed List of Statements */}
      <View style={s.articlesList}>
        {filteredArticles.map(item => (
          <TouchableOpacity
            key={item.id}
            style={s.articleCard}
            onPress={() => open('statement_detail')}
            activeOpacity={0.85}
          >
            <Image source={{ uri: item.image }} style={s.articleImage} resizeMode="cover" />

            <View style={s.articleBody}>
              <View style={s.articleMetaRow}>
                <View style={s.goldTag}>
                  <Text style={s.goldTagText}>{item.tag}</Text>
                </View>
                <Text style={s.articleDate}>{item.date}</Text>
              </View>

              <Text style={s.articleTitle}>{item.title}</Text>
              <Text style={s.articleSnippet}>{item.snippet}</Text>

              <View style={s.readRow}>
                <Text style={s.readText}>Read Full Statement</Text>
                <Icon name="arrow-forward" size={16} color={Colors.primary} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <YamiFooter />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 100, backgroundColor: '#F9F9F9' },

  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12, paddingTop: 4 },
  backText: { color: Colors.primary, fontSize: 14, fontWeight: '700', fontFamily: 'Inter' },

  eyebrow: { fontSize: 11, fontWeight: '900', color: Colors.primary, letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'Inter' },
  h1: { fontSize: 26, fontWeight: '800', color: '#1A1C1C', marginTop: 2, marginBottom: 14, fontFamily: 'Hanken Grotesk' },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1C1C', fontFamily: 'Inter' },

  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  filterPill: {
    backgroundColor: '#EEEEEE',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  filterPillActive: { backgroundColor: Colors.primary },
  filterPillText: { fontSize: 13, fontWeight: '700', color: '#4A5568', fontFamily: 'Inter' },
  filterPillTextActive: { color: '#FFFFFF' },

  articlesList: { gap: 16, marginBottom: 24 },
  articleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  articleImage: { width: '100%', height: 180 },
  articleBody: { padding: 16 },
  articleMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  goldTag: { backgroundColor: '#E5B800', borderRadius: 4, paddingVertical: 3, paddingHorizontal: 8 },
  goldTagText: { fontSize: 10, fontWeight: '800', color: '#241A00', letterSpacing: 0.5, fontFamily: 'Inter' },
  articleDate: { fontSize: 12, color: '#4A5568', fontFamily: 'Inter' },
  articleTitle: { fontSize: 18, fontWeight: '700', color: '#1A1C1C', marginBottom: 6, lineHeight: 22, fontFamily: 'Hanken Grotesk' },
  articleSnippet: { fontSize: 13, color: '#4A5568', lineHeight: 18, marginBottom: 12, fontFamily: 'Inter' },
  readRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  readText: { fontSize: 13, fontWeight: '700', color: Colors.primary, fontFamily: 'Inter' },
});
