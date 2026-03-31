import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../../src/components/TopAppBar';
import { Colors } from '../../src/theme/colors';
import { SURAH_LIST, SurahMeta } from '../../src/data/surahList';

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const TOP_BAR_HEIGHT = insets.top + 56;

  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return SURAH_LIST;
    const q = query.toLowerCase();
    return SURAH_LIST.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.arabicName.includes(q) ||
        String(s.id).includes(q)
    );
  }, [query]);

  const renderItem = ({ item: s }: { item: SurahMeta }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`/surah/${s.id}`)}
      activeOpacity={0.75}
    >
      <View style={styles.rowNum}>
        <Text style={styles.numText}>{String(s.id).padStart(3, '0')}</Text>
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.nameEn}>{s.name}</Text>
        <View style={styles.rowMeta}>
          <Text style={styles.nameAr}>{s.arabicName}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.metaText}>{s.ayahCount} Ayahs</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.metaText}>{s.revelation}</Text>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={20} color={Colors.outline} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <TopAppBar />
      <FlatList
        data={filtered}
        keyExtractor={(s) => String(s.id)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          { paddingTop: TOP_BAR_HEIGHT + 16, paddingBottom: insets.bottom + 110 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.heading}>Library</Text>
            <Text style={styles.subheading}>114 Surahs — tap any to begin a session.</Text>
            <View style={styles.searchBar}>
              <MaterialIcons name="search" size={18} color={Colors.outline} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name or number…"
                placeholderTextColor={Colors.outline}
                value={query}
                onChangeText={setQuery}
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
            </View>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  list: { paddingHorizontal: 20 },

  header: { gap: 12, marginBottom: 16 },
  heading: { fontSize: 38, fontWeight: '900', letterSpacing: -1.5, color: Colors.onSurface },
  subheading: { fontSize: 14, color: Colors.onSurfaceVariant, opacity: 0.75, marginTop: -4 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(192,201,187,0.2)',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.onSurface,
    padding: 0,
  },

  separator: {
    height: 1,
    backgroundColor: 'rgba(192,201,187,0.12)',
    marginLeft: 68,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  rowNum: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  rowBody: { flex: 1, gap: 3 },
  nameEn: { fontSize: 16, fontWeight: '700', color: Colors.onSurface, letterSpacing: -0.2 },
  rowMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  nameAr: { fontFamily: 'AmiriQuran_400Regular', fontSize: 14, color: Colors.primary, opacity: 0.8 },
  dot: { fontSize: 12, color: Colors.outline },
  metaText: { fontSize: 12, color: Colors.onSurfaceVariant },
});
