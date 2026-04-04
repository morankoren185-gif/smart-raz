import type { DifficultyLevel } from "@/lib/game-types/shared";
import type { VisualTileExtras } from "@/lib/game-types/visual-tile";
import {
  ENGLISH_WORDS_GENTLE_ORDER,
  ENGLISH_WORDS_SPARK_ORDERED,
  ENGLISH_WORDS_STEADY_ORDERED,
} from "./curated-catalog";

/** מילים לפי רמת קושי — עולם English Words */
export const ENGLISH_WORDS_BY_LEVEL: Readonly<Record<DifficultyLevel, readonly string[]>> = {
  gentle: [...ENGLISH_WORDS_GENTLE_ORDER],
  steady: [...ENGLISH_WORDS_STEADY_ORDERED],
  spark: [...ENGLISH_WORDS_SPARK_ORDERED],
} as const;

/**
 * מודל תוכן חזותי למילה — מרכז אימוג׳י, תיאור נגישות, ושדות לנכס עתידי.
 * `imageSrc` — נתיב יחסי ב־public (או URL) כשיהיו איורים; בלי נכס עדיין משתמשים ב־emoji בלבד.
 */
export type EnglishWordVisualSpec = Readonly<
  {
    emoji: string;
  } & VisualTileExtras
>;

/** נתיב יחסי ל־`public/illustrations/english-words/*.svg` */
export const ENGLISH_WORDS_ILLUSTRATION_BASE = "/illustrations/english-words" as const;

export function englishWordIllustrationSrc(fileSlug: string): string {
  return `${ENGLISH_WORDS_ILLUSTRATION_BASE}/${fileSlug}.svg`;
}

export const ENGLISH_WORD_VISUALS: Readonly<Record<string, EnglishWordVisualSpec>> = {
  cat: {
    emoji: "🐱",
    altHe: "חתול",
    illustrationKey: "word/cat",
    imageSrc: englishWordIllustrationSrc("cat"),
  },
  dog: {
    emoji: "🐶",
    altHe: "כלב",
    illustrationKey: "word/dog",
    imageSrc: englishWordIllustrationSrc("dog"),
  },
  sun: {
    emoji: "☀️",
    altHe: "שמש",
    illustrationKey: "word/sun",
    imageSrc: englishWordIllustrationSrc("sun"),
  },
  car: {
    emoji: "🚗",
    altHe: "מכונית",
    illustrationKey: "word/car",
    imageSrc: englishWordIllustrationSrc("car"),
  },
  mom: { emoji: "👩", altHe: "אמא", illustrationKey: "word/mom" },
  dad: { emoji: "👨", altHe: "אבא", illustrationKey: "word/dad" },
  hat: { emoji: "🎩", altHe: "כובע", illustrationKey: "word/hat" },
  fish: { emoji: "🐟", altHe: "דג", illustrationKey: "word/fish" },
  apple: {
    emoji: "🍎",
    altHe: "תפוח",
    illustrationKey: "word/apple",
    imageSrc: englishWordIllustrationSrc("apple"),
  },
  tree: {
    emoji: "🌳",
    altHe: "עץ",
    illustrationKey: "word/tree",
    imageSrc: englishWordIllustrationSrc("tree"),
  },
  house: { emoji: "🏠", altHe: "בית", illustrationKey: "word/house" },
  water: { emoji: "💧", altHe: "מים", illustrationKey: "word/water" },
  book: { emoji: "📚", altHe: "ספר", illustrationKey: "word/book" },
  chair: { emoji: "🪑", altHe: "כיסא", illustrationKey: "word/chair" },
  green: { emoji: "🟢", altHe: "ירוק", illustrationKey: "word/green" },
  happy: { emoji: "😊", altHe: "שמח", illustrationKey: "word/happy" },
  pencil: { emoji: "✏️", altHe: "עפרון", illustrationKey: "word/pencil" },
  window: { emoji: "🪟", altHe: "חלון", illustrationKey: "word/window" },
  rabbit: { emoji: "🐰", altHe: "ארנב", illustrationKey: "word/rabbit" },
  banana: { emoji: "🍌", altHe: "בננה", illustrationKey: "word/banana" },
  elephant: { emoji: "🐘", altHe: "פיל", illustrationKey: "word/elephant" },
  purple: { emoji: "🟣", altHe: "סגול", illustrationKey: "word/purple" },
  airplane: { emoji: "✈️", altHe: "מטוס", illustrationKey: "word/airplane" },
};

/** תאימות לאחור — מפת emoji בלבד (נגזר מהוויזואל המלא) */
export const WORD_EMOJI: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(
    Object.entries(ENGLISH_WORD_VISUALS).map(([key, v]) => [key, v.emoji]),
  ),
);

export function visualForEnglishWord(word: string): EnglishWordVisualSpec {
  const key = word.toLowerCase();
  const hit = ENGLISH_WORD_VISUALS[key];
  if (hit) return hit;
  return { emoji: "⭐", altHe: word, illustrationKey: `word/custom/${encodeURIComponent(key)}` };
}

export function emojiForWord(word: string): string {
  return visualForEnglishWord(word).emoji;
}

/** אותיות לשאלות "בנה את המילה" — במילים ארוכות לוקחים קידומת קצרה כדי לא להעמיס */
export function lettersSegmentForBuild(word: string, level: DifficultyLevel): string {
  const w = word.toLowerCase();
  if (w.length <= 6) return w;
  if (level === "spark") return w.slice(0, 6);
  return w.slice(0, 5);
}

export function displayHintForBuild(fullWord: string, segment: string): string {
  return segment === fullWord.toLowerCase()
    ? fullWord
    : `${segment} (${fullWord})`;
}
