import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TopAppBar } from '../../src/components/TopAppBar';
import { Colors } from '../../src/theme/colors';
import { getSurah } from '../../src/data/surahList';

export default function SurahDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const TOP_BAR_HEIGHT = insets.top + 56;

  const surah = getSurah(Number(id));

  if (!surah) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={styles.errorText}>Surah not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <TopAppBar
        showBack
        onBack={() => router.back()}
        title={surah.name}
        showMenu={false}
      />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: TOP_BAR_HEIGHT + 16, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroRow}>
          <View>
            <Text style={styles.ayahsLabel}>AYAHS</Text>
            <Text style={styles.ayahsCount}>{surah.ayahCount}</Text>
          </View>
          <View style={styles.heroRight}>
            <View style={styles.infoCard}>
              <View style={styles.infoIconWrap}>
                <MaterialIcons name="menu-book" size={20} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.infoEyebrow}>REVELATION</Text>
                <Text style={styles.infoValue}>{surah.revelation}</Text>
              </View>
            </View>
            <View style={styles.arabicNameCard}>
              <Text style={styles.arabicName}>{surah.arabicName}</Text>
              <Text style={styles.surahNumLabel}>SURAH {String(surah.id).padStart(3, '0')}</Text>
            </View>
          </View>
        </View>

        {/* Info row */}
        <View style={styles.infoRow}>
          <View style={styles.infoChip}>
            <MaterialIcons name="format-list-numbered" size={14} color={Colors.primary} />
            <Text style={styles.infoChipText}>{surah.ayahCount} ayahs</Text>
          </View>
          <View style={styles.infoChip}>
            <MaterialIcons name="location-on" size={14} color={Colors.secondary} />
            <Text style={[styles.infoChipText, { color: Colors.secondary }]}>{surah.revelation}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descCard}>
          <Text style={styles.descTitle}>About this session</Text>
          <Text style={styles.descText}>
            You will be shown each ayah of {surah.name} one at a time — both in Arabic and with its English translation.
            After reading each ayah, rate your recall as <Text style={styles.bold}>Solid</Text>, <Text style={styles.boldOrange}>Glanced</Text>, or <Text style={styles.boldRed}>Forgot</Text>.
            A summary of your performance will be shown at the end.
          </Text>
        </View>
      </ScrollView>

      {/* Start Session Button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => router.push(`/session/active?surahId=${surah.id}`)}
          activeOpacity={0.85}
        >
          <MaterialIcons name="play-arrow" size={22} color={Colors.onPrimary} />
          <Text style={styles.startBtnText}>Start Session — {surah.ayahCount} Ayahs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  center: { alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 20, gap: 20 },

  errorText: { fontSize: 16, color: Colors.onSurfaceVariant },
  backLink: { marginTop: 12 },
  backLinkText: { fontSize: 15, color: Colors.primary, fontWeight: '600' },

  heroRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 20 },
  ayahsLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: Colors.onSurfaceVariant, textTransform: 'uppercase', marginBottom: 2 },
  ayahsCount: { fontSize: 80, fontWeight: '900', color: Colors.primaryContainer, letterSpacing: -4, lineHeight: 84 },
  heroRight: { flex: 1, gap: 10, paddingTop: 12 },

  infoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, padding: 14, gap: 10 },
  infoIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryFixed, alignItems: 'center', justifyContent: 'center' },
  infoEyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.onSurfaceVariant },
  infoValue: { fontSize: 16, fontWeight: '700', color: Colors.primary },

  arabicNameCard: { backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, padding: 14, alignItems: 'flex-end' },
  arabicName: { fontSize: 28, color: Colors.primary, fontWeight: '600' },
  surahNumLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 2, color: Colors.outline, marginTop: 4 },

  infoRow: { flexDirection: 'row', gap: 10 },
  infoChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surfaceContainerLow, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  infoChipText: { fontSize: 13, fontWeight: '600', color: Colors.primary },

  descCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 14,
    padding: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(192,201,187,0.15)',
  },
  descTitle: { fontSize: 15, fontWeight: '700', color: Colors.onSurface },
  descText: { fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 22 },
  bold: { fontWeight: '700', color: Colors.primary },
  boldOrange: { fontWeight: '700', color: Colors.secondary },
  boldRed: { fontWeight: '700', color: Colors.tertiary },

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
