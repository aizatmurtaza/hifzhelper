import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../../src/components/TopAppBar';
import { Colors } from '../../src/theme/colors';

type Status = 'solid' | 'improving' | 'slipping';

const SURAHS = [
  {
    num: '002',
    name: 'Al-Baqarah',
    status: 'solid' as Status,
    lastSession: 'Oct 24',
    retention: '98% Retention',
    health: 95,
    healthLabel: 'Excellent',
    healthColor: Colors.primary,
  },
  {
    num: '003',
    name: 'Al-Imran',
    status: 'improving' as Status,
    lastSession: 'Yesterday',
    retention: '82% Retention',
    health: 70,
    healthLabel: 'Recovering',
    healthColor: Colors.secondary,
  },
  {
    num: '004',
    name: 'An-Nisa',
    status: 'slipping' as Status,
    lastSession: 'Oct 12',
    retention: '54% Retention',
    health: 54,
    healthLabel: 'Critical',
    healthColor: Colors.tertiary,
  },
];

const statusBadge: Record<Status, { bg: string; text: string; label: string }> = {
  solid: { bg: Colors.primary, text: Colors.onPrimary, label: 'SOLID' },
  improving: { bg: Colors.secondaryContainer, text: Colors.onSecondaryContainer, label: 'IMPROVING' },
  slipping: { bg: Colors.tertiaryContainer, text: Colors.onTertiary, label: 'SLIPPING' },
};

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const TOP_BAR_HEIGHT = insets.top + 56;

  return (
    <View style={styles.root}>
      <TopAppBar showSearch />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: TOP_BAR_HEIGHT + 16, paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>Library</Text>
          <Text style={styles.subheading}>3 Active Surahs being tracked for retention.</Text>
        </View>

        {SURAHS.map((s) => {
          const badge = statusBadge[s.status];
          return (
            <TouchableOpacity
              key={s.num}
              style={styles.card}
              onPress={() => router.push(`/surah/${s.num}`)}
              activeOpacity={0.85}
            >
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.surahNum}>SURAH {s.num}</Text>
                  <Text style={styles.surahName}>{s.name}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
                </View>
              </View>
              <View style={styles.cardMeta}>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Last Session</Text>
                  <Text style={styles.metaValue}>{s.lastSession}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Freshness</Text>
                  <Text style={styles.metaValue}>{s.retention}</Text>
                </View>
              </View>
              <View style={styles.healthSection}>
                <View style={styles.healthHeader}>
                  <Text style={styles.healthLabel}>HEALTH INDICATOR</Text>
                  <Text style={[styles.healthStatus, { color: s.healthColor }]}>{s.healthLabel}</Text>
                </View>
                <View style={styles.healthTrack}>
                  <View style={[styles.healthFill, { width: `${s.health}%` as any, backgroundColor: s.healthColor }]} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Wisdom Quote */}
        <View style={styles.wisdomCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.wisdomTitle}>Review Wisdom</Text>
            <Text style={styles.wisdomText}>
              "Commit yourselves to this Qur'an, for by Him in Whose Hand is my soul, it leaves you more easily than camels do that are tied by their legs."
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 90 }]}
        activeOpacity={0.85}
      >
        <MaterialIcons name="add" size={28} color={Colors.onPrimary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  scroll: { paddingHorizontal: 20, gap: 16 },

  header: { gap: 4, marginBottom: 8 },
  heading: { fontSize: 38, fontWeight: '900', letterSpacing: -1.5, color: Colors.onSurface },
  subheading: { fontSize: 14, color: Colors.onSurfaceVariant, opacity: 0.75 },

  card: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(192,201,187,0.2)',
    gap: 24,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  surahNum: { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: Colors.primary, opacity: 0.6, textTransform: 'uppercase', marginBottom: 2 },
  surahName: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },

  cardMeta: { gap: 10 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metaLabel: { fontSize: 13, color: Colors.onSurfaceVariant },
  metaValue: { fontSize: 13, fontWeight: '600', fontStyle: 'italic' },

  healthSection: { gap: 6 },
  healthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  healthLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.5 },
  healthStatus: { fontSize: 9, fontWeight: '700' },
  healthTrack: { height: 5, backgroundColor: Colors.surfaceContainerHighest, borderRadius: 3, overflow: 'hidden' },
  healthFill: { height: '100%', borderRadius: 3 },

  wisdomCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 14,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(192,201,187,0.12)',
    marginTop: 4,
  },
  wisdomTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  wisdomText: { fontSize: 13, fontStyle: 'italic', color: Colors.onSurfaceVariant, lineHeight: 20 },

  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});
