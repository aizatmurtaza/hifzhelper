export interface Ayah {
  num: number;
  arabic: string;
  translation: string;
}

const cache = new Map<number, Ayah[]>();

export async function fetchSurahAyahs(surahId: number): Promise<Ayah[]> {
  if (cache.has(surahId)) return cache.get(surahId)!;

  const res = await fetch(
    `https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,en.sahih`
  );
  if (!res.ok) throw new Error(`Failed to fetch surah ${surahId}: ${res.status}`);

  const json = await res.json();
  const arabicAyahs: any[] = json.data[0].ayahs;
  const englishAyahs: any[] = json.data[1].ayahs;

  const ayahs: Ayah[] = arabicAyahs.map((a, i) => ({
    num: a.numberInSurah,
    arabic: a.text,
    translation: englishAyahs[i].text,
  }));

  cache.set(surahId, ayahs);
  return ayahs;
}
