/**
 * אזור למדינה — תשתית קלה לחבילות אזוריות (אירופה, אסיה וכו׳) בלי מנוע מסע חדש.
 */

import type { FlagChoiceKey } from "./curated-catalog";

export type FlagRegionId =
  | "europe"
  | "middleEast"
  | "southAmerica"
  | "northAmerica"
  | "asia"
  | "africa"
  | "oceania"
  | "northAtlantic";

/** מיפוי מלא של מפתחי הדגלים באוצר */
export const FLAG_COUNTRY_REGION: Readonly<Record<FlagChoiceKey, FlagRegionId>> = {
  jp: "asia",
  il: "middleEast",
  br: "southAmerica",
  ca: "northAmerica",
  fr: "europe",
  au: "oceania",
  it: "europe",
  eg: "middleEast",
  cl: "southAmerica",
  gb: "europe",
  us: "northAmerica",
  uk: "europe",
  ie: "europe",
  de: "europe",
  es: "europe",
  gr: "europe",
  mx: "northAmerica",
  ar: "southAmerica",
  za: "africa",
  cn: "asia",
  in: "asia",
  sa: "middleEast",
  jo: "middleEast",
  tr: "middleEast",
  ae: "middleEast",
};

/** כל מפתחות הדגל ששייכים לאזור */
export function getFlagKeysInRegion(regionId: FlagRegionId): readonly FlagChoiceKey[] {
  const keys: FlagChoiceKey[] = [];
  for (const [key, r] of Object.entries(FLAG_COUNTRY_REGION) as [FlagChoiceKey, FlagRegionId][]) {
    if (r === regionId) keys.push(key);
  }
  return keys;
}
