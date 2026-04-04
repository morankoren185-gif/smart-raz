import type { GameDefinition } from "@/lib/game-types/registry";
import type { WorldId } from "@/lib/game-types/shared";
import {
  mapLetterOrbitToGameDefinition,
  mapStarCountToGameDefinition,
  mapWordShuttleToGameDefinition,
} from "@/lib/game-types";
import { englishEmojiPairsDefinition } from "./english/emoji-pairs";
import { hebrewLetterWordPairsDefinition } from "./hebrew/letter-word-pairs";
import { mathNumberQuantityPairsDefinition } from "./math/number-quantity-pairs";
import { flagsCountryChoiceDefinition } from "./flags/flag-country-choice";
import { flagsFlagMatchingDefinition } from "./flags/flag-country-matching";
import { flagsCountryOnMapDefinition } from "./flags/flags-country-on-map";
import { ENGLISH_WORDS_GAME_DEFINITIONS } from "./english-words/english-words-games";
import { SPACE_GAME_DEFINITIONS } from "./space/space-games";
import { ALL_GAMES } from "./index";
import type { GameModule } from "./types";

/**
 * Registry מרוכז ל־GameDefinition.
 *
 * מקור אמת לרשימת משחקי הלגאסי: `ALL_GAMES` ב־`content/index.ts`.
 * מפת ה-adapters לפי `id` (יציב פחות מ־slug לשינוי תצוגה) — כל adapter כבר מאמת id פנימית.
 */

type LegacyToDefinition = (module: GameModule) => GameDefinition;

const LEGACY_ID_TO_ADAPTER: Record<string, LegacyToDefinition> = {
  "en-word-shuttle": mapWordShuttleToGameDefinition,
  "he-letter-orbit": mapLetterOrbitToGameDefinition,
  "math-star-count": mapStarCountToGameDefinition,
};

function toGameDefinition(legacy: GameModule): GameDefinition {
  const adapter = LEGACY_ID_TO_ADAPTER[legacy.id];
  if (!adapter) {
    throw new Error(
      `game-definitions: חסר adapter ל־GameModule id="${legacy.id}". עדכן את LEGACY_ID_TO_ADAPTER או הסר את המשחק מ־ALL_GAMES.`,
    );
  }
  return adapter(legacy);
}

/** משחקי data-native (למשל matching) — ללא GameModule בלגאסי */
const NATIVE_GAME_DEFINITIONS: GameDefinition[] = [
  englishEmojiPairsDefinition,
  hebrewLetterWordPairsDefinition,
  mathNumberQuantityPairsDefinition,
  flagsCountryChoiceDefinition,
  flagsFlagMatchingDefinition,
  flagsCountryOnMapDefinition,
  ...ENGLISH_WORDS_GAME_DEFINITIONS,
  ...SPACE_GAME_DEFINITIONS,
];

export const ALL_GAME_DEFINITIONS: GameDefinition[] = [
  ...ALL_GAMES.map(toGameDefinition),
  ...NATIVE_GAME_DEFINITIONS,
];

export const GAME_DEFINITION_BY_SLUG: Readonly<Record<string, GameDefinition>> = Object.freeze(
  Object.fromEntries(ALL_GAME_DEFINITIONS.map((g) => [g.slug, g])),
);

export const GAME_DEFINITION_BY_ID: Readonly<Record<string, GameDefinition>> = Object.freeze(
  Object.fromEntries(ALL_GAME_DEFINITIONS.map((g) => [g.id, g])),
);

/** חיפוש ראשי: מתאים לנתיב `/play/[slug]` */
export function getGameDefinitionBySlug(slug: string): GameDefinition | undefined {
  return GAME_DEFINITION_BY_SLUG[slug];
}

export function getGameDefinitionById(id: string): GameDefinition | undefined {
  return GAME_DEFINITION_BY_ID[id];
}

export function getGameDefinitionsForWorld(world: WorldId): GameDefinition[] {
  return ALL_GAME_DEFINITIONS.filter((g) => g.world === world);
}
