import { Ayah } from '../services/quranApi';

export type Rating = 'solid' | 'glanced' | 'forgot';

export interface SessionResult {
  surahId: number;
  ayahs: Ayah[];
  ratings: Rating[];
}

let lastSession: SessionResult | null = null;

export function saveSession(result: SessionResult): void {
  lastSession = result;
}

export function getLastSession(): SessionResult | null {
  return lastSession;
}

export function getWeakAyahs(result: SessionResult): Array<{ ayah: Ayah; originalIndex: number }> {
  return result.ayahs
    .map((ayah, i) => ({ ayah, originalIndex: i }))
    .filter((_, i) => result.ratings[i] === 'forgot' || result.ratings[i] === 'glanced');
}
