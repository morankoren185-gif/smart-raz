import type { GameModule } from "@/content/types";
import { getGameBySlug } from "@/content";
import { getGameDefinitionBySlug } from "@/content/game-definitions";
import type { MultipleChoicePlayableGame } from "./multipleChoicePlayableGame";
import type { MatchingPlayableGame } from "./matchingPlayableGame";
import {
  isEntireGameDefinitionMultipleChoice,
  mapGameDefinitionToMultipleChoicePlayableGame,
} from "./mapGameDefinitionToMultipleChoicePlayableGame";
import {
  isEntireGameDefinitionMatching,
  mapGameDefinitionToMatchingPlayableGame,
} from "./mapGameDefinitionToMatchingPlayableGame";

export type ResolvedPlaySession =
  | { kind: "multiple-choice-playable"; playable: MultipleChoicePlayableGame }
  | { kind: "matching-playable"; playable: MatchingPlayableGame }
  | { kind: "legacy-module"; module: GameModule };

/**
 * סדר עדיפויות: multiple-choice מלא → matching מלא → מודול לגאסי.
 */
export function resolvePlaySessionForSlug(slug: string): ResolvedPlaySession | undefined {
  const definition = getGameDefinitionBySlug(slug);
  if (definition && isEntireGameDefinitionMultipleChoice(definition)) {
    return {
      kind: "multiple-choice-playable",
      playable: mapGameDefinitionToMultipleChoicePlayableGame(definition),
    };
  }
  if (definition && isEntireGameDefinitionMatching(definition)) {
    return {
      kind: "matching-playable",
      playable: mapGameDefinitionToMatchingPlayableGame(definition),
    };
  }
  const legacyGame = getGameBySlug(slug);
  if (!legacyGame) return undefined;
  return { kind: "legacy-module", module: legacyGame };
}
