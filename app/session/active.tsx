import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { RatingButton } from '../../src/components/RatingButton';
import { Colors } from '../../src/theme/colors';
import { fetchSurahAyahs, Ayah } from '../../src/services/quranApi';
import { getSurah } from '../../src/data/surahList';
import { saveSession, getLastSession, getWeakAyahs, Rating } from '../../src/store/sessionStore';

export default function ActiveSessionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { surahId, retryWeak } = useLocalSearchParams<{ surahId: string; retryWeak?: string }>();

  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [bismillah, setBismillah] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const surahIdNum = Number(surahId);
  const surah = getSurah(surahIdNum);

  const AT_TAWBAH = 9;
  const AL_FATIHA = 1;

  // Normalize Arabic text: strip diacritics and normalize alef variants so
  // we can reliably detect the Bismillah prefix regardless of edition.
  function normArabic(s: string): string {
    return s
      .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0640]/g, '')
      .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627');
  }

  const BISMILLAH_NORM = 'بسم الله الرحمن الرحيم';
  const DIACRITIC_RE = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0640]/;

  // If arabic starts with the Bismillah, returns the split; otherwise null.
  function extractBismillah(arabic: string): { bismillah: string; rest: string } | null {
    if (!normArabic(arabic).startsWith(BISMILLAH_NORM)) return null;
    let origIdx = 0;
    let normCount = 0;
    while (normCount < BISMILLAH_NORM.length && origIdx < arabic.length) {
      if (!DIACRITIC_RE.test(arabic[origIdx])) normCount++;
      origIdx++;
    }
    while (origIdx < arabic.length && arabic[origIdx] === ' ') origIdx++;
    return { bismillah: arabic.slice(0, origIdx).trim(), rest: arabic.slice(origIdx) };
  }

  // Apply Bismillah separation to a list of ayahs and return { bismillah, ayahs }.
  function separateBismillah(list: Ayah[], isFatiha: boolean): { bismillah: string | null; ayahs: Ayah[] } {
    if (list.length === 0) return { bismillah: null, ayahs: list };
    if (isFatiha) {
      // Verse 1 of Al-Fatiha IS the Bismillah — exclude it from the verse flow.
      const first = list[0];
      if (normArabic(first.arabic) === BISMILLAH_NORM) {
        return { bismillah: first.arabic, ayahs: list.slice(1) };
      }
      return { bismillah: null, ayahs: list };
    }
    // For all other surahs: strip the Bismillah prefix from verse 1's text.
    const first = list[0];
    const extracted = extractBismillah(first.arabic);
    if (extracted) {
      return {
        bismillah: extracted.bismillah,
        ayahs: [{ ...first, arabic: extracted.rest }, ...list.slice(1)],
      };
    }
    return { bismillah: null, ayahs: list };
  }

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        if (retryWeak === 'true') {
          const last = getLastSession();
          if (last && last.surahId === surahIdNum) {
            const weak = getWeakAyahs(last);
            const weakAyahs = weak.map((w) => w.ayah);
            if (surahIdNum !== AT_TAWBAH) {
              const { bismillah: bism, ayahs: cleaned } = separateBismillah(weakAyahs, surahIdNum === AL_FATIHA);
              setBismillah(bism);
              setAyahs(cleaned);
            } else {
              setBismillah(null);
              setAyahs(weakAyahs);
            }
            setRatings([]);
            setIndex(0);
            setLoading(false);
            return;
          }
        }

        const fetched = await fetchSurahAyahs(surahIdNum);

        if (surahIdNum !== AT_TAWBAH) {
          const { bismillah: bism, ayahs: cleaned } = separateBismillah(fetched, surahIdNum === AL_FATIHA);
          setBismillah(bism);
          setAyahs(cleaned);
        } else {
          setBismillah(null);
          setAyahs(fetched);
        }

        setRatings([]);
        setIndex(0);
      } catch (e: any) {
        setError(e.message ?? 'Failed to load ayahs. Check your connection.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [surahIdNum, retryWeak]);

  const handleRating = (rating: Rating) => {
    const newRatings = [...ratings, rating];

    if (index + 1 >= ayahs.length) {
      saveSession({ surahId: surahIdNum, ayahs, ratings: newRatings });
      router.replace(`/session/summary?surahId=${surahIdNum}`);
    } else {
      setRatings(newRatings);
      setIndex(index + 1);
    }
  };

  if (loading) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading {surah?.name ?? 'surah'}…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.root, styles.center]}>
        <MaterialIcons name="wifi-off" size={40} color={Colors.outline} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => {
            setError(null);
            setLoading(true);
            fetchSurahAyahs(surahIdNum)
              .then((fetched) => { setAyahs(fetched); setLoading(false); })
              .catch((e) => { setError(e.message); setLoading(false); });
          }}
        >
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (ayahs.length === 0) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={styles.errorText}>No ayahs to practice.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const ayah = ayahs[index];
  const total = ayahs.length;
  const progress = (index + 1) / total;

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
            <Text style={styles.progressTotal}>{index + 1} / {total}</Text>
          </View>
        </View>
      </View>

      {/* Surah label */}
      <View style={styles.surahMeta}>
        <Text style={styles.surahLabel}>{surah ? surah.name.toUpperCase() : `SURAH ${surahId}`}</Text>
        <Text style={styles.flowLabel}>REVISION FLOW</Text>
      </View>

      {/* Bismillah header */}
      {bismillah && (
        <View style={styles.bismillahHeader}>
          <Text style={styles.bismillahHeaderText}>{bismillah}</Text>
        </View>
      )}

      {/* Main content */}
      <View style={styles.canvas}>
        <View style={styles.ayahNumRow}>
          <Text style={styles.ayahNumBig}>{ayah.num}</Text>
          <Text style={styles.ayahWord}>Ayah</Text>
        </View>

        <Text style={styles.arabicText}>{ayah.arabic}</Text>

        <View style={styles.divider} />

        <Text style={styles.translation}>"{ayah.translation}"</Text>

        <View style={styles.recallPill}>
          <Text style={styles.recallText}>RECALL RATING REQUIRED</Text>
        </View>
      </View>

      {/* Rating footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <RatingButton rating="forgot" onPress={() => handleRating('forgot')} />
        <RatingButton rating="glanced" onPress={() => handleRating('glanced')} />
        <RatingButton rating="solid" onPress={() => handleRating('solid')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  center: { alignItems: 'center', justifyContent: 'center', gap: 16 },

  loadingText: { fontSize: 15, color: Colors.onSurfaceVariant, marginTop: 8 },
  errorText: { fontSize: 15, color: Colors.onSurfaceVariant, textAlign: 'center', paddingHorizontal: 32 },
  retryBtn: { backgroundColor: Colors.primary, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 12 },
  retryBtnText: { color: Colors.onPrimary, fontWeight: '700', fontSize: 15 },
  backLink: { marginTop: 4 },
  backLinkText: { fontSize: 14, color: Colors.outline },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: 'rgba(250,249,245,0.9)',
  },
  closeBtn: { padding: 8, borderRadius: 20 },
  progressArea: { flex: 1, gap: 6 },
  progressTrack: { height: 4, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primaryContainer, borderRadius: 2 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressCurrent: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 0.8 },
  progressTotal: { fontSize: 10, fontWeight: '700', color: Colors.outline, letterSpacing: 0.8 },

  surahMeta: { paddingHorizontal: 24, paddingBottom: 4 },
  bismillahHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(192,201,187,0.2)',
  },
  bismillahHeaderText: {
    fontSize: 22,
    color: Colors.primary,
    textAlign: 'center',
    writingDirection: 'rtl',
    letterSpacing: 1,
    opacity: 0.75,
  },
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
    fontFamily: 'AmiriQuran_400Regular',
    fontSize: 36,
    color: Colors.primary,
    textAlign: 'center',
    writingDirection: 'rtl',
    lineHeight: 64,
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
