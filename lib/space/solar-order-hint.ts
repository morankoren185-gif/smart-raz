import type { QuestionPromptVisual } from "@/lib/game-types/multiple-choice";
import {
  SOLAR_PLANETS_FROM_SUN,
  positionFromSun,
  visualForPlanet,
  type PlanetId,
} from "@/content/space/lexicon";

export type SolarOrderHintItem = Readonly<{
  planet: PlanetId;
  position: number;
  visual: ReturnType<typeof visualForPlanet>;
}>;

export function getSolarOrderHintItems(): SolarOrderHintItem[] {
  return SOLAR_PLANETS_FROM_SUN.map((planet) => ({
    planet,
    position: positionFromSun(planet),
    visual: visualForPlanet(planet),
  }));
}

function planetIdFromIllustrationKey(key: string | undefined): PlanetId | undefined {
  if (!key?.startsWith("planet/")) return undefined;
  const raw = key.slice("planet/".length);
  const cap = (raw.charAt(0).toUpperCase() + raw.slice(1)) as PlanetId;
  return (SOLAR_PLANETS_FROM_SUN as readonly string[]).includes(cap) ? cap : undefined;
}

/**
 * הדגשה עדינה במשחק order MC — מפת illustrationKey של כוכב ההנחיה,
 * או מספר סדרי מהנחיה (1st…8th) כשהרמז הוא השמש בלבד.
 */
export function inferOrderMcHighlightPlanet(
  prompt: string,
  promptVisual?: QuestionPromptVisual | null,
): PlanetId | undefined {
  const fromKey = planetIdFromIllustrationKey(promptVisual?.illustrationKey);
  if (fromKey) return fromKey;
  const m = prompt.match(/\b(\d+)(?:st|nd|rd|th)\b/i);
  if (m) {
    const n = parseInt(m[1]!, 10);
    if (n >= 1 && n <= 8) return SOLAR_PLANETS_FROM_SUN[n - 1]!;
  }
  return undefined;
}
