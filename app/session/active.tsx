import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { RatingButton } from '../../src/components/RatingButton';
import { Colors } from '../../src/theme/colors';

const AYAHS = [
  {
    num: 12,
    total: 30,
    arabic: 'إِنَّ الَّذِينَ يَخْشَوْنَ رَبَّهُم بِالْغَيْبِ لَهُم مَّغْفِرَةٌ وَأَجْرٌ كَبِيرٌ',
    translation: 'Indeed, those who fear their Lord unseen will have forgiveness and great reward.',
    surah: 'Surah Al-Mulk',
  },
  {
    num: 13,
    total: 30,
    arabic: 'وَأَسِرُّوا قَوْلَكُمْ أَوِ اجْهَرُوا بِهِ إِنَّهُ عَلِيمٌ بِذَاتِ الصُّدُورِ',
    translation: 'And conceal your speech or publicize it; indeed, He is Knowing of that within the breasts.',
    surah: 'Surah Al-Mulk',
  },
];

export default function ActiveSessionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const ayah = AYAHS[index % AYAHS.length];
  const progress = ayah.num / ayah.total;

  const handleRating = () => {
    if (index + 1 >= AYAHS.length) {
      router.replace('/session/summary');
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <MaterialIcons name="close" size={22} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.progressArea}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressCurrent}>AYAH {ayah.num}</Text>
            <Text style={styles.progressTotal}>{ayah.total} TOTAL</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <MaterialIcons name="more-vert" size={22} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* Surah label */}
      <View style={styles.surahMeta}>
        <Text style={styles.surahLabel}>{ayah.surah.toUpperCase()}</Text>
        <Text style={styles.flowLabel}>REVISION FLOW</Text>
      </View>

      {/* Main content */}
      <View style={styles.canvas}>
        {/* Faded ayah number */}
        <View style={styles.ayahNumRow}>
          <Text style={styles.ayahNumBig}>{ayah.num}</Text>
          <Text style={styles.ayahWord}>Ayah</Text>
        </View>

        {/* Arabic text */}
        <Text style={styles.arabicText}>{ayah.arabic}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Translation */}
        <Text style={styles.translation}>"{ayah.translation}"</Text>

        {/* Recall pill */}
        <View style={styles.recallPill}>
          <Text style={styles.recallText}>RECALL RATING REQUIRED</Text>
        </View>
      </View>

      {/* Rating footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <RatingButton rating="forgot" onPress={handleRating} />
        <RatingButton rating="glanced" onPress={handleRating} />
        <RatingButton rating="solid" onPress={handleRating} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: 'rgba(250,249,245,0.9)',
  },
  closeBtn: { padding: 8, borderRadius: 20 },
  moreBtn: { padding: 8 },
  progressArea: { flex: 1, gap: 6 },
  progressTrack: { height: 4, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primaryContainer, borderRadius: 2 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressCurrent: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 0.8 },
  progressTotal: { fontSize: 10, fontWeight: '700', color: Colors.outline, letterSpacing: 0.8 },

  surahMeta: { paddingHorizontal: 24, paddingBottom: 4 },
  surahLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 2, color: Colors.onSurfaceVariant },
  flowLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 1.5, color: Colors.outline, textTransform: 'uppercase' },

  canvas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 24,
  },
  ayahNumRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, opacity: 0.3 },
  ayahNumBig: { fontSize: 64, fontWeight: '300', color: Colors.onSurface, letterSpacing: -2, lineHeight: 68 },
  ayahWord: { fontSize: 18, fontWeight: '600', color: Colors.onSurface, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 },
  arabicText: {
    fontSize: 36,
    color: Colors.primary,
    textAlign: 'center',
    writingDirection: 'rtl',
    lineHeight: 58,
    letterSpacing: 1,
  },
  divider: { width: 40, height: 1, backgroundColor: 'rgba(192,201,187,0.35)' },
  translation: {
    fontSize: 17,
    fontStyle: 'italic',
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.82,
    maxWidth: 320,
  },
  recallPill: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
  },
  recallText: { fontSize: 10, fontWeight: '700', letterSpacing: 1.8, color: Colors.outline, textTransform: 'uppercase' },

  footer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(250,249,245,0.95)',
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(192,201,187,0.15)',
  },
});
