import type { WorldId } from "@/content/types";
import { MAP_COUNTRY_UNLOCK_STARS } from "@/lib/progress/progression-tuning";

/**
 * תחנות במפת המסע (MVP) — מדינות שנפתחות לפי סך כוכבים.
 * ספי פתיחה: `MAP_COUNTRY_UNLOCK_STARS` ב־`lib/progress/progression-tuning.ts`.
 * קורדינטות מנורמלות 0–1 על מיכל המפה (למיקום יחסי).
 */
export type MapCountryNodeSpec = Readonly<{
  id: string;
  labelHe: string;
  emoji: string;
  /** סף כוכבים כולל (כמו ב־progress.stars) לפתיחה */
  starsRequired: number;
  /** עולם למשחקים — לרוב דגלים ב-MVP */
  worldId: WorldId;
  position: Readonly<{ x: number; y: number }>;
}>;

export const MAP_WORLD_COUNTRIES: MapCountryNodeSpec[] = [
  {
    id: "map-israel",
    labelHe: "ישראל",
    emoji: "🇮🇱",
    starsRequired: MAP_COUNTRY_UNLOCK_STARS["map-israel"]!,
    worldId: "flags",
    position: { x: 0.58, y: 0.52 },
  },
  {
    id: "map-france",
    labelHe: "צרפת",
    emoji: "🇫🇷",
    starsRequired: MAP_COUNTRY_UNLOCK_STARS["map-france"]!,
    worldId: "flags",
    position: { x: 0.48, y: 0.36 },
  },
  {
    id: "map-japan",
    labelHe: "יפן",
    emoji: "🇯🇵",
    starsRequired: MAP_COUNTRY_UNLOCK_STARS["map-japan"]!,
    worldId: "flags",
    position: { x: 0.84, y: 0.4 },
  },
  {
    id: "map-brazil",
    labelHe: "ברזיל",
    emoji: "🇧🇷",
    starsRequired: MAP_COUNTRY_UNLOCK_STARS["map-brazil"]!,
    worldId: "flags",
    position: { x: 0.34, y: 0.66 },
  },
];

export function getCountrySpecById(countryId: string): MapCountryNodeSpec | undefined {
  return MAP_WORLD_COUNTRIES.find((c) => c.id === countryId);
}
