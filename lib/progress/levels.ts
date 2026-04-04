/**
 * דרגות לפי כוכבים — מקור אמת: ערך stars בהתקדמות (localStorage).
 * ספי כוכבים: `@/lib/progress/progression-tuning` (STAR_LEVEL_STARS_REQUIRED_ASC).
 */

import { STAR_LEVEL_STARS_REQUIRED_ASC } from "@/lib/progress/progression-tuning";

export type StarLevelDefinition = Readonly<{
  id: string;
  label: string;
  /** מינימום כוכבים כדי להגיע לדרגה זו */
  starsRequired: number;
}>;

const [s1, s2, s3, s4, s5] = STAR_LEVEL_STARS_REQUIRED_ASC;

export const STAR_LEVELS: readonly StarLevelDefinition[] = [
  { id: "star-l1", label: "טייס מתחיל", starsRequired: s1 },
  { id: "star-l2", label: "חוקר צעיר", starsRequired: s2 },
  { id: "star-l3", label: "מגלה ארצות", starsRequired: s3 },
  { id: "star-l4", label: "קפטן חלל", starsRequired: s4 },
  { id: "star-l5", label: "אלוף הידע", starsRequired: s5 },
] as const;

/** לצורך השוואת עליית דרגה (אותו סדר כמו STAR_LEVELS) */
export const STAR_LEVEL_IDS_IN_ORDER: readonly string[] = STAR_LEVELS.map((L) => L.id);

export function getLevelForStars(stars: number): StarLevelDefinition {
  const s = Math.max(0, stars);
  let current = STAR_LEVELS[0]!;
  for (const L of STAR_LEVELS) {
    if (s >= L.starsRequired) current = L;
  }
  return current;
}

/** הדרגה הבאה אם קיימת (סף כוכבים גבוה יותר מהנוכחי) */
export function getNextLevel(stars: number): StarLevelDefinition | null {
  const s = Math.max(0, stars);
  return STAR_LEVELS.find((L) => L.starsRequired > s) ?? null;
}

export type NextLevelInfo = Readonly<{
  next: StarLevelDefinition;
  /** כמה כוכבים חסרים להגיע לסף הדרגה הבאה */
  starsNeeded: number;
}>;

export function getNextLevelInfo(stars: number): NextLevelInfo | null {
  const next = getNextLevel(stars);
  if (!next) return null;
  const s = Math.max(0, stars);
  return { next, starsNeeded: Math.max(0, next.starsRequired - s) };
}

export type LevelProgressSnapshot = Readonly<{
  current: StarLevelDefinition;
  next: StarLevelDefinition | null;
  /** 0–1 — התקדמות בין הדרגה הנוכחית לבאה; אם אין באה = 1 */
  barFraction: number;
  /** כוכבים עד הדרגה הבאה (0 אם פסגה) */
  starsToNext: number;
  isMaxLevel: boolean;
}>;

export function getLevelProgress(stars: number): LevelProgressSnapshot {
  const s = Math.max(0, stars);
  const current = getLevelForStars(s);
  const next = getNextLevel(s);
  if (!next) {
    return {
      current,
      next: null,
      barFraction: 1,
      starsToNext: 0,
      isMaxLevel: true,
    };
  }
  const span = next.starsRequired - current.starsRequired;
  const into = s - current.starsRequired;
  const barFraction = span > 0 ? Math.min(1, Math.max(0, into / span)) : 0;
  return {
    current,
    next,
    barFraction,
    starsToNext: Math.max(0, next.starsRequired - s),
    isMaxLevel: false,
  };
}

/** מפתח localStorage לזיהוי עליית דרגה בין ביקורים בבית */
export const LAST_SEEN_LEVEL_ID_KEY = "smart-raz-last-seen-level-id";
