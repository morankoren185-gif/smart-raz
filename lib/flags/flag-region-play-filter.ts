import type { FlagChoiceKey } from "@/content/flags/curated-catalog";
import { FLAG_EXTENDED_LABEL_HE } from "@/content/flags/curated-catalog";
import type { FlagRegionId } from "@/content/flags/flag-regions";
import { getFlagKeysInRegion } from "@/content/flags/flag-regions";
import type { MatchingQuestion } from "@/lib/game-types/matching";
import type { MultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";

export const FLAG_REGION_QUERY_PARAM = "flagRegion";

const REGION_IDS: readonly FlagRegionId[] = [
  "europe",
  "middleEast",
  "southAmerica",
  "northAmerica",
  "asia",
  "africa",
  "oceania",
  "northAtlantic",
];

export function parseFlagRegionQueryParam(value: string | null | undefined): FlagRegionId | undefined {
  const v = value?.trim().toLowerCase();
  if (!v) return undefined;
  return REGION_IDS.includes(v as FlagRegionId) ? (v as FlagRegionId) : undefined;
}

function allowedKeysSet(regionId: FlagRegionId): ReadonlySet<FlagChoiceKey> {
  return new Set(getFlagKeysInRegion(regionId));
}

function correctAnswerInRegion(correctAnswer: string, allowed: ReadonlySet<FlagChoiceKey>): boolean {
  if (!(correctAnswer in FLAG_EXTENDED_LABEL_HE)) return false;
  return allowed.has(correctAnswer as FlagChoiceKey);
}

/** מזהה קובץ מספריית flag-icons מנתיב CDN */
export function parseFlagIconFileKeyFromSrc(imageSrc: string | undefined): string | null {
  if (!imageSrc) return null;
  const m = imageSrc.match(/\/([a-z]{2})\.svg(?:\?|$)/i);
  return m ? m[1]!.toLowerCase() : null;
}

/** uk ו־gb חולקים קובץ gb */
export function flagFileIdMatchesChoiceKey(fileId: string, key: FlagChoiceKey): boolean {
  const f = fileId.toLowerCase();
  if (f === "gb") return key === "gb" || key === "uk";
  return f === key;
}

function imageSrcMatchesRegion(imageSrc: string | undefined, allowed: ReadonlySet<FlagChoiceKey>): boolean {
  const fileId = parseFlagIconFileKeyFromSrc(imageSrc);
  if (!fileId) return false;
  for (const k of allowed) {
    if (flagFileIdMatchesChoiceKey(fileId, k)) return true;
  }
  return false;
}

/** פילטר שאלות MC/map — לפי תשובה נכונה; אם אין התאמות — מחזיר את המקור */
export function filterFlagMultipleChoiceBank(
  bank: readonly MultipleChoiceQuestion[],
  regionId: FlagRegionId,
): MultipleChoiceQuestion[] {
  const allowed = allowedKeysSet(regionId);
  const filtered = bank.filter((q) => correctAnswerInRegion(q.correctAnswer, allowed));
  return filtered.length > 0 ? [...filtered] : [...bank];
}

/** פילטר סיבובי התאמה — רק סיבובים שהזוגות כולם מהאזור */
export function filterFlagMatchingBank(
  bank: readonly MatchingQuestion[],
  regionId: FlagRegionId,
): MatchingQuestion[] {
  const allowed = allowedKeysSet(regionId);
  const filtered = bank.filter(
    (q) => q.pairs.length > 0 && q.pairs.every((p) => imageSrcMatchesRegion(p.sideA.imageSrc, allowed)),
  );
  return filtered.length > 0 ? [...filtered] : [...bank];
}
