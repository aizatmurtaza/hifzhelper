import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../../src/components/TopAppBar';
import { Colors } from '../../src/theme/colors';
import { SURAH_LIST, SurahMeta } from '../../src/data/surahList';
import { getLastSession } from '../../src/store/sessionStore';

const SURAHS_DUE = [
  { num: 18, name: 'Al-Kahf', ayahs: 110, lastSession: '4h ago' },
  { num: 67, name: 'Al-Mulk', ayahs: 30, lastSession: 'Yesterday' },
  { num: 36, name: 'Ya-Sin', ayahs: 83, lastSession: '2 days ago' },
];

const WEAK_AYAHS = [
  { surah: 'Al-Baqarah', ayah: 'Ayah 255' },
  { surah: 'An-Nisa', ayah: 'Ayah 43' },
  { surah: 'Al-Kahf', ayah: 'Ayah 10' },
  { surah: 'Yusuf', ayah: 'Ayah 21' },
];

const QUICK_START_IDS = [1, 112, 113, 114, 67, 36, 55, 18];
const QUICK_START = QUICK_START_IDS.map(id => SURAH_LIST.find(s => s.id === id)!);

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const TOP_BAR_HEIGHT = insets.top + 56;

  const isFirstTime = getLastSession() === null;
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SURAH_LIST.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.arabicName.includes(q) ||
        String(s.id).includes(q)
    ).slice(0, 6);
  }, [query]);

  if (isFirstTime) {
    return (
      <View style={styles.root}>
        <TopAppBar />
        <ScrollView
          contentContainerStyle={[
            styles.firstTimeScroll,
            { paddingTop: TOP_BAR_HEIGHT + 24, paddingBottom: insets.bottom + 90 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Decorative header */}
          <View style={styles.firstTimeHeader}>
            <Text style={styles.bismillah}>بِسْمِ اللَّهِ</Text>
            <Text style={styles.greeting}>Assalamu Alaykum</Text>
            <Text style={styles.greetingSub}>Which surah would you like to revise today?</Text>
          </View>

          {/* Search */}
          <View style={styles.searchBarLarge}>
            <MaterialIcons name="search" size={22} color={Colors.outline} />
            <TextInput
              style={styles.searchInputLarge}
              placeholder="Search by name or number…"
              placeholderTextColor={Colors.outline}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>

          {/* Search results */}
          {filtered.length > 0 && (
            <View style={styles.resultsList}>
              {filtered.map((s: SurahMeta) => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.resultItem}
                  onPress={() => router.push(`/surah/${s.id}`)}
                  activeOpacity={0.75}
                >
                  <View style={styles.resultNum}>
                    <Text style={styles.resultNumText}>{String(s.id).padStart(3, '0')}</Text>
                  </View>
                  <View style={styles.resultBody}>
                    <Text style={styles.resultName}>{s.name}</Text>
                    <View style={styles.resultMetaRow}>
                      <Text style={styles.resultArabic}>{s.arabicName}</Text>
                      <Text style={styles.resultDot}>·</Text>
                      <Text style={styles.resultMeta}>{s.ayahCount} Ayahs</Text>
                      <Text style={styles.resultDot}>·</Text>
                      <Text style={styles.resultMeta}>{s.revelation}</Text>
                    </View>
                  </View>
                  <MaterialIcons name="arrow-forward" size={18} color={Colors.primary} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Quick-start chips (shown when search is empty) */}
          {!query.trim() && (
            <View style={styles.quickStartSection}>
              <Text style={styles.quickStartLabel}>Popular surahs to begin</Text>
              <View style={styles.chipRow}>
                {QUICK_START.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={styles.chip}
                    onPress={() => router.push(`/surah/${s.id}`)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.chipNum}>{s.id}</Text>
                    <Text style={styles.chipText}>{s.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Browse all link */}
          <TouchableOpacity
            style={styles.browseLink}
            onPress={() => router.push('/(tabs)/library')}
            activeOpacity={0.7}
          >
            <Text style={styles.browseLinkText}>Browse all 114 surahs</Text>
            <MaterialIcons name="arrow-forward" size={14} color={Colors.primary} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <TopAppBar showSearch />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: TOP_BAR_HEIGHT + 16, paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's Focus */}
        <View style={styles.focusRow}>
          <View style={styles.focusLeft}>
            <Text style={styles.focusEyebrow}>TODAY'S FOCUS</Text>
            <Text style={styles.focusHeading}>The Path of{'\n'}Consistency</Text>
          </View>
          <View style={styles.streakCard}>
            <View style={styles.streakHeader}>
              <Text style={styles.streakLabel}>Current Streak</Text>
              <MaterialIcons name="local-fire-department" size={20} color={Colors.secondary} />
            </View>
            <View style={styles.streakNumber}>
              <Text style={styles.streakCount}>14</Text>
              <Text style={styles.streakUnit}>days</Text>
            </View>
          </View>
        </View>

        {/* Bento: Daily Mastery + Retention */}
        <View style={styles.bentoRow}>
          <View style={styles.masteryCard}>
            <View>
              <Text style={styles.masteryTitle}>Daily Mastery</Text>
              <Text style={styles.masterySubtitle}>Target: 75 Ayahs</Text>
            </View>
            <View style={styles.masteryScore}>
              <Text style={styles.masteryCount}>50</Text>
              <Text style={styles.masteryOf}>/ 75</Text>
            </View>
          </View>
          <View style={styles.retentionCard}>
            <View>
              <Text style={styles.retentionTitle}>Retention Score</Text>
              <Text style={styles.retentionSub}>Based on recent reviews</Text>
            </View>
            <View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: '84%' }]} />
              </View>
              <Text style={styles.retentionPct}>84%</Text>
            </View>
            <TouchableOpacity style={styles.insightsBtn}>
              <Text style={styles.insightsBtnText}>View Insights</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Due Today */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Due Today</Text>
            <Text style={styles.sectionMeta}>3 SURAHS</Text>
          </View>
          {SURAHS_DUE.map((s) => (
            <TouchableOpacity
              key={s.num}
              style={styles.surahCard}
              onPress={() => router.push(`/surah/${s.num}`)}
              activeOpacity={0.8}
            >
              <View style={styles.surahLeft}>
                <View style={styles.surahNum}>
                  <Text style={styles.surahNumText}>{s.num}</Text>
                </View>
                <View>
                  <Text style={styles.surahName}>{s.name}</Text>
                  <View style={styles.surahMeta}>
                    <MaterialIcons name="description" size={12} color={Colors.onSurfaceVariant} />
                    <Text style={styles.surahMetaText}>{s.ayahs} Ayahs</Text>
                    <Text style={styles.surahMetaDot}>•</Text>
                    <MaterialIcons name="schedule" size={12} color={Colors.onSurfaceVariant} />
                    <Text style={styles.surahMetaText}>Last: {s.lastSession}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => router.push('/session/active')}
              >
                <Text style={styles.startBtnText}>START</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Critical Review */}
        <View style={styles.criticalCard}>
          <View style={styles.criticalHeader}>
            <View style={styles.criticalTitleRow}>
              <MaterialIcons name="warning" size={20} color={Colors.onTertiaryContainer} />
              <Text style={styles.criticalTitle}>Critical Review</Text>
            </View>
            <Text style={styles.criticalBody}>
              You have 12 weak ayahs from your recent sessions marked as 'Forgot' or 'Glanced'. Address these to maintain your retention.
            </Text>
          </View>
          <TouchableOpacity style={styles.quickReviewBtn}>
            <Text style={styles.quickReviewText}>QUICK REVIEW</Text>
          </TouchableOpacity>
          <View style={styles.weakGrid}>
            {WEAK_AYAHS.map((w, i) => (
              <View key={i} style={styles.weakCard}>
                <Text style={styles.weakSurah}>{w.surah}</Text>
                <Text style={styles.weakAyah}>{w.ayah}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  scroll: { paddingHorizontal: 20, gap: 24 },

  // ── First-time state ──────────────────────────────────────────────────────
  firstTimeScroll: { paddingHorizontal: 24, gap: 28 },

  firstTimeHeader: { alignItems: 'center', gap: 10, paddingTop: 8 },
  bismillah: {
    fontSize: 40,
    color: Colors.primary,
    opacity: 0.18,
    marginBottom: 4,
    letterSpacing: 2,
  },
  greeting: {
    fontSize: 30,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  greetingSub: {
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },

  searchBarLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: Colors.primaryFixed,
  },
  searchInputLarge: {
    flex: 1,
    fontSize: 16,
    color: Colors.onSurface,
    padding: 0,
    fontWeight: '500',
  },

  resultsList: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(192,201,187,0.2)',
    marginTop: -8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(192,201,187,0.15)',
  },
  resultNum: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: Colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultNumText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  resultBody: { flex: 1, gap: 3 },
  resultName: { fontSize: 16, fontWeight: '700', color: Colors.onSurface, letterSpacing: -0.2 },
  resultMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  resultArabic: { fontSize: 13, color: Colors.primary, opacity: 0.8 },
  resultDot: { fontSize: 12, color: Colors.outline },
  resultMeta: { fontSize: 12, color: Colors.onSurfaceVariant },

  quickStartSection: { gap: 14 },
  quickStartLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(192,201,187,0.25)',
  },
  chipNum: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    opacity: 0.7,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurface,
  },

  browseLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  browseLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },

  // ── Returning user state (unchanged) ─────────────────────────────────────
  focusRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-end' },
  focusLeft: { flex: 1 },
  focusEyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 2, color: Colors.secondary, textTransform: 'uppercase', marginBottom: 6 },
  focusHeading: { fontSize: 34, fontWeight: '900', color: Colors.primary, letterSpacing: -1, lineHeight: 36 },
  streakCard: { width: 130, backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, padding: 16, justifyContent: 'space-between', minHeight: 100 },
  streakHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streakLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1, color: Colors.onSurfaceVariant, textTransform: 'uppercase' },
  streakNumber: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginTop: 10 },
  streakCount: { fontSize: 44, fontWeight: '900', color: Colors.primary, letterSpacing: -2, lineHeight: 48 },
  streakUnit: { fontSize: 14, color: Colors.onSurfaceVariant, marginBottom: 6 },

  bentoRow: { flexDirection: 'row', gap: 12, height: 200 },
  masteryCard: { flex: 2, backgroundColor: Colors.primary, borderRadius: 14, padding: 20, justifyContent: 'space-between' },
  masteryTitle: { fontSize: 17, fontWeight: '700', color: Colors.onPrimary },
  masterySubtitle: { fontSize: 12, color: Colors.primaryFixedDim, marginTop: 2 },
  masteryScore: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  masteryCount: { fontSize: 64, fontWeight: '900', color: Colors.onPrimary, letterSpacing: -3, lineHeight: 68 },
  masteryOf: { fontSize: 20, color: Colors.primaryFixed, opacity: 0.7, marginBottom: 8 },
  retentionCard: { flex: 1, backgroundColor: Colors.surfaceContainerHighest, borderRadius: 14, padding: 16, justifyContent: 'space-between' },
  retentionTitle: { fontSize: 14, fontWeight: '700', color: Colors.onSurface },
  retentionSub: { fontSize: 10, color: Colors.onSurfaceVariant, marginTop: 2 },
  progressTrack: { height: 6, backgroundColor: Colors.surfaceDim, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },
  retentionPct: { fontSize: 13, fontWeight: '700', color: Colors.primary, marginTop: 4 },
  insightsBtn: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  insightsBtnText: { fontSize: 12, fontWeight: '700', color: Colors.primary },

  section: { gap: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: Colors.onSurface, letterSpacing: -0.5 },
  sectionMeta: { fontSize: 10, fontWeight: '800', color: Colors.onSurfaceVariant, letterSpacing: 1.5, textTransform: 'uppercase' },
  surahCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surfaceContainer, borderRadius: 14, padding: 16 },
  surahLeft: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 },
  surahNum: { width: 44, height: 44, backgroundColor: Colors.primary, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  surahNumText: { color: Colors.onPrimary, fontWeight: '700', fontSize: 15 },
  surahName: { fontSize: 16, fontWeight: '700', color: Colors.onSurface },
  surahMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  surahMetaText: { fontSize: 11, color: Colors.onSurfaceVariant },
  surahMetaDot: { color: Colors.onSurfaceVariant },
  startBtn: { backgroundColor: Colors.primary, paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20 },
  startBtnText: { color: Colors.onPrimary, fontWeight: '700', fontSize: 11, letterSpacing: 0.5 },

  criticalCard: { backgroundColor: Colors.tertiaryContainer, borderRadius: 14, padding: 22, gap: 16 },
  criticalHeader: { gap: 8 },
  criticalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  criticalTitle: { fontSize: 18, fontWeight: '700', color: Colors.onPrimary },
  criticalBody: { fontSize: 13, color: Colors.onTertiaryContainer, lineHeight: 18, opacity: 0.85 },
  quickReviewBtn: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  quickReviewText: { fontSize: 13, fontWeight: '900', color: Colors.tertiaryContainer, letterSpacing: 1 },
  weakGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  weakCard: { backgroundColor: 'rgba(0,0,0,0.12)', borderRadius: 8, padding: 12, width: '47%' },
  weakSurah: { fontSize: 10, fontWeight: '700', opacity: 0.65, textTransform: 'uppercase', color: Colors.onPrimary, marginBottom: 2 },
  weakAyah: { fontSize: 15, fontWeight: '700', color: Colors.onPrimary },
});
