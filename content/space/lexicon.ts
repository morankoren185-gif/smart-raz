import type { DifficultyLevel } from "@/lib/game-types/shared";
import type { VisualTileExtras } from "@/lib/game-types/visual-tile";
import {
  SPACE_CATALOG_GENTLE_PLANET_ORDER,
  SPACE_CATALOG_STEADY_PLANET_ORDER,
} from "./curated-catalog";

/** מזהה יציב באנגלית — כפי שמוצג לילד */
export type PlanetId =
  | "Mercury"
  | "Venus"
  | "Earth"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Uranus"
  | "Neptune";

/** כוכבי לכת לפי רמה — MVP מדורג (gentle/steady מיושרים ל־`curated-catalog`) */
export const PLANETS_BY_LEVEL: Readonly<Record<DifficultyLevel, readonly PlanetId[]>> = {
  gentle: [...SPACE_CATALOG_GENTLE_PLANET_ORDER],
  steady: [...SPACE_CATALOG_STEADY_PLANET_ORDER],
  spark: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
} as const;

/** סדר כוכבי הלכת מהשמש — מקור אמת לתרגול סדר */
export const SOLAR_PLANETS_FROM_SUN: readonly PlanetId[] = [
  "Mercury",
  "Venus",
  "Earth",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
] as const;

/** מספר ממוספר מהשמש 1..8 */
export function positionFromSun(planet: PlanetId): number {
  const i = SOLAR_PLANETS_FROM_SUN.indexOf(planet);
  return i >= 0 ? i + 1 : 0;
}

export type PlanetVisualSpec = Readonly<
  {
    emoji: string;
  } & VisualTileExtras
>;

/** קבצי SVG ב־public/illustrations/space/ — שמות lowercase לפי כוכב */
const IMG = (name: string) => `/illustrations/space/${name}.svg` as const;

/**
 * ייצוג חזותי לכל כוכב — תמיד emoji; imageSrc לאיור מקומי; כשל טעינה handled ב־IllustrationWithEmojiFallback.
 * altHe לעזרה קוגניטיבית ונגישות.
 */
export const PLANET_VISUALS: Readonly<Record<PlanetId, PlanetVisualSpec>> = {
  Mercury: { emoji: "⚪", imageSrc: IMG("mercury"), altHe: "חמה", illustrationKey: "planet/mercury" },
  Venus: { emoji: "🌕", imageSrc: IMG("venus"), altHe: "נוגה", illustrationKey: "planet/venus" },
  Earth: { emoji: "🌍", imageSrc: IMG("earth"), altHe: "כדור הארץ", illustrationKey: "planet/earth" },
  Mars: { emoji: "🔴", imageSrc: IMG("mars"), altHe: "מאדים", illustrationKey: "planet/mars" },
  Jupiter: { emoji: "🟠", imageSrc: IMG("jupiter"), altHe: "צדק", illustrationKey: "planet/jupiter" },
  Saturn: { emoji: "🪐", imageSrc: IMG("saturn"), altHe: "שבתאי", illustrationKey: "planet/saturn" },
  Uranus: { emoji: "💠", imageSrc: IMG("uranus"), altHe: "אורנוס", illustrationKey: "planet/uranus" },
  Neptune: { emoji: "💙", imageSrc: IMG("neptune"), altHe: "נפטון", illustrationKey: "planet/neptune" },
};

export function visualForPlanet(planet: string): PlanetVisualSpec {
  const hit = PLANET_VISUALS[planet as PlanetId];
  if (hit) return hit;
  /** ללא imageSrc — רק emoji עד שיוגדר נכס; מניעת 404 */
  return { emoji: "✨", altHe: planet, illustrationKey: `planet/${planet.toLowerCase()}` };
}
