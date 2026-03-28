import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TopAppBar } from '../../src/components/TopAppBar';
import { Colors } from '../../src/theme/colors';
import { getLastSession, Rating } from '../../src/store/sessionStore';
import { getSurah } from '../../src/data/surahList';

const ratingConfig: Record<Rating, { bg: string; text: string; label: string; rowBg?: string; borderColor?: string }> = {
  solid:   { bg: 'rgba(27,94,32,0.12)',  text: Colors.primary,                label: 'SOLID' },
  glanced: { bg: Colors.secondaryContainer, text: Colors.onSecondaryContainer, label: 'GLANCED', rowBg: 'rgba(255,156,51,0.06)', borderColor: Colors.secondaryContainer },
  forgot:  { bg: Colors.tertiaryContainer,  text: Colors.onTertiaryContainer,  label: 'FORGOT',  rowBg: 'rgba(166,11,18,0.06)',  borderColor: Colors.tertiaryContainer },
};

export default function SessionSummaryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { surahId } = useLocalSearchParams<{ surahId: string }>();
  const TOP_BAR_HEIGHT = insets.top + 56;

  const session = getLastSession();
  const surah = getSurah(Number(surahId));

  if (!session) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={styles.noSessionText}>No session data found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const solid   = session.ratings.filter((r) => r === 'solid').length;
  const glanced = session.ratings.filter((r) => r === 'glanced').length;
  const forgot  = session.ratings.filter((r) => r === 'forgot').length;
  const total   = session.ratings.length;
  const mastery = Math.round((solid / total) * 100);
  const weakCount = glanced + forgot;

  const surahName = surah?.name ?? `Surah ${surahId}`;

  return (
    <View style={styles.root}>
      <TopAppBar />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: TOP_BAR_HEIGHT + 16, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Score Header */}
        <View style={styles.scoreHeader}>
          <View>
            <Text style={styles.eyebrow}>SESSION SUMMARY</Text>
            <Text style={styles.surahTitle}>{surahName}</Text>
          </View>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreNum}>{mastery}</Text>
            <Text style={styles.scorePct}>%</Text>
            <View style={styles.scoreLabel}>
              <Text style={styles.scoreLabelText}>MASTERY{'\n'}SCORE</Text>
            </View>
          </View>
        </View>

        {/* Bento Stats */}
        <View style={styles.bentoRow}>
          <View style={[styles.bentoCard, { backgroundColor: Colors.primaryContainer }]}>
            <MaterialIcons name="check-circle" size={20} color={Colors.onPrimaryContainer} />
            <View>
              <Text style={styles.bentoCount}>{solid}</Text>
              <Text style={[styles.bentoLabel, { color: Colors.onPrimaryContainer }]}>SOLID</Text>
            </View>
          </View>
          <View style={[styles.bentoCard, { backgroundColor: Colors.secondaryContainer }]}>
            <MaterialIcons name="visibility" size={20} color={Colors.onSecondaryContainer} />
            <View>
              <Text style={[styles.bentoCount, { color: Colors.onSecondaryContainer }]}>{glanced}</Text>
              <Text style={[styles.bentoLabel, { color: Colors.onSecondaryContainer }]}>GLANCED</Text>
            </View>
          </View>
          <View style={[styles.bentoCard, { backgroundColor: Colors.tertiaryContainer }]}>
            <MaterialIcons name="error" size={20} color={Colors.onTertiaryContainer} />
            <View>
              <Text style={[styles.bentoCount, { color: Colors.onTertiaryContainer }]}>{forgot}</Text>
              <Text style={[styles.bentoLabel, { color: Colors.onTertiaryContainer }]}>FORGOT</Text>
            </View>
          </View>
        </View>

        {/* Verse-by-Verse */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Verse-by-Verse Review</Text>
            <Text style={styles.listCount}>{total} Ayahs</Text>
          </View>
          <View style={styles.listCard}>
            {session.ayahs.map((ayah, i) => {
              const rating = session.ratings[i];
              const rc = ratingConfig[rating];
              return (
                <View
                  key={ayah.num}
                  style={[
                    styles.ayahRow,
                    rc.rowBg ? { backgroundColor: rc.rowBg, borderLeftWidth: 4, borderLeftColor: rc.borderColor } : null,
                  ]}
                >
                  <View style={styles.ayahLeft}>
                    <View style={[
                      styles.ayahNumBox,
                      rating === 'glanced' && { backgroundColor: 'rgba(255,156,51,0.2)' },
                      rating === 'forgot'  && { backgroundColor: 'rgba(166,11,18,0.2)' },
                    ]}>
                      <Text style={[
                        styles.ayahNumText,
                        rating === 'glanced' && { color: Colors.onSecondaryContainer },
                        rating === 'forgot'  && { color: Colors.onTertiaryContainer },
                      ]}>{ayah.num}</Text>
                    </View>
                    <View style={styles.ayahTextWrap}>
                      <Text style={styles.ayahTitle}>Ayah {ayah.num}</Text>
                      <Text style={styles.ayahArabic} numberOfLines={1}>{ayah.arabic}</Text>
                    </View>
                  </View>
                  <View style={[styles.ratingBadge, { backgroundColor: rc.bg }]}>
                    <Text style={[styles.ratingText, { color: rc.text }]}>{rc.label}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {weakCount > 0 && (
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => router.replace(`/session/active?surahId=${surahId}&retryWeak=true`)}
              activeOpacity={0.85}
            >
              <MaterialIcons name="refresh" size={18} color="#ffffff" />
              <Text style={styles.retryBtnText}>Retry Weak Ayahs ({weakCount})</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.restartBtn}
            onPress={() => router.replace(`/session/active?surahId=${surahId}`)}
            activeOpacity={0.85}
          >
            <MaterialIcons name="restart-alt" size={18} color={Colors.onSurface} />
            <Text style={styles.restartBtnText}>Start Full Surah Over</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.libraryBtn}
            onPress={() => router.replace('/(tabs)/library')}
            activeOpacity={0.85}
          >
            <MaterialIcons name="menu-book" size={18} color={Colors.primary} />
            <Text style={styles.libraryBtnText}>Back to Library</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  center: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  scroll: { paddingHorizontal: 18, gap: 24 },

  noSessionText: { fontSize: 15, color: Colors.onSurfaceVariant },
  backLink: { marginTop: 4 },
  backLinkText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },

  scoreHeader: { gap: 16 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: Colors.secondary, textTransform: 'uppercase', marginBottom: 4 },
  surahTitle: { fontSize: 32, fontWeight: '900', color: Colors.primaryContainer, letterSpacing: -1 },
  scoreRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  scoreNum: { fontSize: 64, fontWeight: '900', color: Colors.primaryContainer, letterSpacing: -3, lineHeight: 68 },
  scorePct: { fontSize: 22, fontWeight: '700', color: Colors.outline, marginBottom: 8 },
  scoreLabel: { marginLeft: 16, paddingLeft: 16, borderLeftWidth: 1, borderLeftColor: 'rgba(192,201,187,0.35)', justifyContent: 'center', marginBottom: 10 },
  scoreLabelText: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: Colors.outline, textTransform: 'uppercase' },

  bentoRow: { flexDirection: 'row', gap: 10 },
  bentoCard: { flex: 1, borderRadius: 14, padding: 18, height: 110, justifyContent: 'space-between' },
  bentoCount: { fontSize: 32, fontWeight: '700', color: '#ffffff', lineHeight: 36 },
  bentoLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.85, marginTop: 2 },

  listSection: { gap: 12 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 2 },
  listTitle: { fontSize: 17, fontWeight: '700', color: Colors.onSurface },
  listCount: { fontSize: 12, fontWeight: '600', color: Colors.outline },

  listCard: { backgroundColor: Colors.surfaceContainer, borderRadius: 14, overflow: 'hidden' },
  ayahRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(192,201,187,0.08)',
  },
  ayahLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  ayahNumBox: { width: 30, height: 30, borderRadius: 6, backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center' },
  ayahNumText: { fontSize: 12, fontWeight: '700', color: Colors.onSurface },
  ayahTextWrap: { flex: 1, gap: 2 },
  ayahTitle: { fontSize: 13, fontWeight: '600', color: Colors.onSurface },
  ayahArabic: { fontSize: 12, color: Colors.primary, opacity: 0.7 },
  ratingBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 8 },
  ratingText: { fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },

  actions: { gap: 10 },
  retryBtn: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  retryBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  restartBtn: {
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  restartBtnText: { color: Colors.onSurface, fontWeight: '700', fontSize: 15 },
  libraryBtn: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(192,201,187,0.2)',
  },
  libraryBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 15 },
});
