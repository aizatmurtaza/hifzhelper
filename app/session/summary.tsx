import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../../src/components/TopAppBar';
import { Colors } from '../../src/theme/colors';

type AyahRating = 'solid' | 'glanced' | 'forgot';

interface AyahSummaryRow {
  num: number;
  transliteration: string;
  rating: AyahRating;
}

const AYAH_ROWS: AyahSummaryRow[] = [
  { num: 1, transliteration: 'Tabarakalladhi biyadihi...', rating: 'solid' },
  { num: 2, transliteration: 'Alladhi khalaqal mawta...', rating: 'glanced' },
  { num: 3, transliteration: 'Alladhi khalaqa sab\'a...', rating: 'solid' },
  { num: 4, transliteration: 'Thummar ji\'il basara...', rating: 'forgot' },
  { num: 5, transliteration: 'Wa laqad zayyannas sama\'...', rating: 'solid' },
];

const ratingConfig: Record<AyahRating, { bg: string; text: string; label: string; borderColor?: string }> = {
  solid: { bg: 'rgba(27,94,32,0.1)', text: Colors.primaryContainer, label: 'SOLID' },
  glanced: { bg: Colors.secondaryContainer, text: Colors.onSecondaryContainer, label: 'GLANCED', borderColor: Colors.secondaryContainer },
  forgot: { bg: Colors.tertiaryContainer, text: '#ffffff', label: 'FORGOT', borderColor: Colors.tertiaryContainer },
};

export default function SessionSummaryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const TOP_BAR_HEIGHT = insets.top + 56;

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
            <Text style={styles.surahTitle}>Surah Al-Mulk</Text>
          </View>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreNum}>80</Text>
            <Text style={styles.scorePct}>%</Text>
            <View style={styles.scoreLabel}>
              <Text style={styles.scoreLabelText}>MASTERY SCORE</Text>
            </View>
          </View>
        </View>

        {/* Bento Stats */}
        <View style={styles.bentoRow}>
          <View style={[styles.bentoCard, { backgroundColor: Colors.primaryContainer }]}>
            <MaterialIcons name="check-circle" size={20} color={Colors.onPrimaryContainer} />
            <View>
              <Text style={styles.bentoCount}>24</Text>
              <Text style={[styles.bentoLabel, { color: Colors.onPrimaryContainer }]}>SOLID</Text>
            </View>
          </View>
          <View style={[styles.bentoCard, { backgroundColor: Colors.secondaryContainer }]}>
            <MaterialIcons name="visibility" size={20} color={Colors.onSecondaryContainer} />
            <View>
              <Text style={[styles.bentoCount, { color: Colors.onSecondaryContainer }]}>4</Text>
              <Text style={[styles.bentoLabel, { color: Colors.onSecondaryContainer }]}>GLANCED</Text>
            </View>
          </View>
          <View style={[styles.bentoCard, { backgroundColor: Colors.tertiaryContainer }]}>
            <MaterialIcons name="error" size={20} color={Colors.onTertiaryContainer} />
            <View>
              <Text style={[styles.bentoCount, { color: Colors.onTertiaryContainer }]}>2</Text>
              <Text style={[styles.bentoLabel, { color: Colors.onTertiaryContainer }]}>FORGOT</Text>
            </View>
          </View>
        </View>

        {/* Verse-by-Verse */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Verse-by-Verse Review</Text>
            <Text style={styles.listCount}>30 Ayahs Total</Text>
          </View>
          <View style={styles.listCard}>
            {AYAH_ROWS.map((row) => {
              const rc = ratingConfig[row.rating];
              const isGlanced = row.rating === 'glanced';
              const isForgot = row.rating === 'forgot';
              return (
                <View
                  key={row.num}
                  style={[
                    styles.ayahRow,
                    isGlanced && styles.glancedRow,
                    isForgot && styles.forgotRow,
                  ]}
                >
                  <View style={styles.ayahLeft}>
                    <View style={[
                      styles.ayahNumBox,
                      isGlanced && { backgroundColor: 'rgba(255,156,51,0.2)' },
                      isForgot && { backgroundColor: 'rgba(166,11,18,0.2)' },
                    ]}>
                      <Text style={[
                        styles.ayahNumText,
                        isGlanced && { color: Colors.onSecondaryContainer },
                        isForgot && { color: Colors.onTertiaryContainer },
                      ]}>{row.num}</Text>
                    </View>
                    <View>
                      <Text style={styles.ayahTitle}>Ayah {row.num}</Text>
                      <Text style={styles.ayahTranslit}>{row.transliteration}</Text>
                    </View>
                  </View>
                  <View style={[styles.ratingBadge, { backgroundColor: rc.bg }]}>
                    <Text style={[styles.ratingText, { color: rc.text }]}>{rc.label}</Text>
                  </View>
                </View>
              );
            })}
            <View style={styles.ellipsisRow}>
              <Text style={styles.ellipsisText}>... Continued for Ayahs 6 - 30 ...</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => router.replace('/session/active')}
            activeOpacity={0.85}
          >
            <MaterialIcons name="refresh" size={18} color="#ffffff" />
            <Text style={styles.retryBtnText}>Retry Weak Ayahs (6)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.restartBtn}
            onPress={() => router.replace('/session/active')}
            activeOpacity={0.85}
          >
            <MaterialIcons name="restart-alt" size={18} color={Colors.onSurface} />
            <Text style={styles.restartBtnText}>Start Full Surah Over</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  scroll: { paddingHorizontal: 18, gap: 24 },

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
  glancedRow: { backgroundColor: 'rgba(255,156,51,0.06)', borderLeftWidth: 4, borderLeftColor: Colors.secondaryContainer },
  forgotRow: { backgroundColor: 'rgba(166,11,18,0.06)', borderLeftWidth: 4, borderLeftColor: Colors.tertiaryContainer },
  ayahLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  ayahNumBox: { width: 30, height: 30, borderRadius: 6, backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center' },
  ayahNumText: { fontSize: 12, fontWeight: '700', color: Colors.onSurface },
  ayahTitle: { fontSize: 13, fontWeight: '600', color: Colors.onSurface },
  ayahTranslit: { fontSize: 10, color: Colors.outline, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 1 },
  ratingBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  ratingText: { fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  ellipsisRow: { padding: 18, alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(192,201,187,0.1)' },
  ellipsisText: { fontSize: 12, color: Colors.outline },

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
});
