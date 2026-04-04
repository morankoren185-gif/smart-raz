import type { MapCountryNodeSpec } from "@/content/map-world";
import { MAP_WORLD_COUNTRIES } from "@/content/map-world";

/** מחשב אילו תחנות פתוחות לפי סך הכוכבים (מקור אמת לוגי) */
export function getUnlockedCountryIdsForStars(totalStars: number): string[] {
  return MAP_WORLD_COUNTRIES.filter((c) => totalStars >= c.starsRequired).map((c) => c.id);
}

export function isCountryUnlockedByStars(country: MapCountryNodeSpec, totalStars: number): boolean {
  return totalStars >= country.starsRequired;
}

/** כמה כוכבים חסרים לפתיחת תחנה (0 אם כבר פתוחה) */
export function starsMissingToUnlock(country: MapCountryNodeSpec, totalStars: number): number {
  return Math.max(0, country.starsRequired - totalStars);
}
