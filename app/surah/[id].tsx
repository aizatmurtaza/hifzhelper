import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../../src/components/TopAppBar';
import { StatBento } from '../../src/components/StatBento';
import { Colors } from '../../src/theme/colors';

type AyahStatus = 'solid' | 'glanced' | 'forgot';

interface AyahRow {
  num: string;
  arabic: string;
  status: AyahStatus;
  label: string;
}

const AYAHS: AyahRow[] = [
  { num: '01', arabic: 'تَبَٰرَكَ ٱلَّذِى بِيَدِهِ...', status: 'solid', label: 'STATUS: MASTERED' },
  { num: '02', arabic: 'ٱلَّذِى خَلَقَ ٱلْمَوْتَ...', status: 'glanced', label: 'NEEDS POLISH' },
  { num: '03', arabic: 'ٱلَّذِى خَلَقَ سَبْعَ...', status: 'forgot', label: 'REVIEW REQUIRED' },
  { num: '04', arabic: 'ثُمَّ ٱرْجِعِ ٱلْبَصَرَ...', status: 'solid', label: 'STATUS: MASTERED' },
  { num: '30', arabic: 'قُلْ أَرَءَيْتُمْ إِنْ أَصْبَحَ...', status: 'solid', label: 'STATUS: MASTERED' },
];

const statusIcon: Record<AyahStatus, { bg: string; icon: keyof typeof MaterialIcons.glyphMap; color: string }> = {
  solid: { bg: Colors.primary, icon: 'check', color: Colors.onPrimary },
  glanced: { bg: Colors.secondaryContainer, icon: 'priority-high', color: Colors.onSecondaryContainer },
  forgot: { bg: Colors.tertiaryContainer, icon: 'close', color: Colors.onTertiaryContainer },
};

export default function SurahDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const TOP_BAR_HEIGHT = insets.top + 56;

  return (
    <View style={styles.root}>
      <TopAppBar
        showBack
        onBack={() => router.back()}
        title="Surah Al-Mulk"
        showMenu
      />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: TOP_BAR_HEIGHT + 16, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroRow}>
          <View>
            <Text style={styles.ayahsLabel}>AYAHS</Text>
            <Text style={styles.ayahsCount}>30</Text>
          </View>
          <View style={styles.heroRight}>
            <View style={styles.healthCard}>
              <View style={styles.healthIconWrap}>
                <MaterialIcons name="trending-up" size={20} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.healthEyebrow}>OVERALL HEALTH</Text>
                <Text style={styles.healthValue}>Improving</Text>
              </View>
            </View>
            <Text style={styles.lastRevised}>
              Last revised <Text style={styles.lastRevisedBold}>2 days ago</Text>
            </Text>
          </View>
        </View>

        {/* Stat grid */}
        <View style={styles.statRow}>
          <StatBento variant="solid" count={18} />
          <StatBento variant="glanced" count={8} />
          <StatBento variant="forgot" count={4} />
        </View>

        {/* Ayah Breakdown */}
        <View style={styles.breakdownSection}>
          <View style={styles.breakdownHeader}>
            <View style={styles.dividerLine} />
            <Text style={styles.breakdownTitle}>Ayah Breakdown</Text>
          </View>

          {AYAHS.map((ayah, i) => {
            const s = statusIcon[ayah.status];
            const isLast = i === AYAHS.length - 1;
            return (
              <React.Fragment key={ayah.num}>
                {i === 4 && (
                  <View style={styles.ellipsisRow}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                  </View>
                )}
                <View style={styles.ayahRow}>
                  <View style={styles.ayahLeft}>
                    <Text style={styles.ayahNum}>{ayah.num}</Text>
                    <View>
                      <Text style={styles.arabicText}>{ayah.arabic}</Text>
                      <Text style={styles.ayahStatus}>{ayah.label}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusCircle, { backgroundColor: s.bg }]}>
                    <MaterialIcons name={s.icon} size={16} color={s.color} />
                  </View>
                </View>
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>

      {/* Start Session Button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => router.push('/session/active')}
          activeOpacity={0.85}
        >
          <MaterialIcons name="play-arrow" size={22} color={Colors.onPrimary} />
          <Text style={styles.startBtnText}>Start Session</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  scroll: { paddingHorizontal: 20, gap: 24 },

  heroRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 20 },
  ayahsLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: Colors.onSurfaceVariant, textTransform: 'uppercase', marginBottom: 2 },
  ayahsCount: { fontSize: 80, fontWeight: '900', color: Colors.primaryContainer, letterSpacing: -4, lineHeight: 84 },
  heroRight: { flex: 1, gap: 10, paddingTop: 12 },
  healthCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, padding: 14, gap: 10 },
  healthIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryFixed, alignItems: 'center', justifyContent: 'center' },
  healthEyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.onSurfaceVariant },
  healthValue: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  lastRevised: { fontSize: 12, color: Colors.onSurfaceVariant, paddingHorizontal: 2 },
  lastRevisedBold: { fontWeight: '700', color: Colors.onSurface },

  statRow: { flexDirection: 'row', gap: 10 },

  breakdownSection: { gap: 12 },
  breakdownHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  dividerLine: { width: 28, height: 1, backgroundColor: 'rgba(192,201,187,0.3)' },
  breakdownTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 2.5, textTransform: 'uppercase', color: Colors.onSurfaceVariant },

  ayahRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 14,
    padding: 16,
  },
  ayahLeft: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 },
  ayahNum: { fontSize: 11, fontWeight: '700', color: '#aaa', fontVariant: ['tabular-nums'], width: 20 },
  arabicText: { fontSize: 18, color: Colors.primary, textAlign: 'right', writingDirection: 'rtl' },
  ayahStatus: { fontSize: 9, fontWeight: '600', color: Colors.onSurfaceVariant, opacity: 0.65, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 3 },
  statusCircle: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  ellipsisRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 14 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.outlineVariant },

  bottomBar: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: Colors.surface },
  startBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  startBtnText: { color: Colors.onPrimary, fontSize: 17, fontWeight: '700', letterSpacing: -0.3 },
});
