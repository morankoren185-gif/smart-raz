import type { GameDefinition } from "@/lib/game-types/registry";
import type { MatchingQuestion } from "@/lib/game-types/matching";
import { isMatchingQuestion } from "@/lib/game-types/matching";
import type { DifficultyKey } from "@/content/types";
import type { MatchingPlayableGame } from "./matchingPlayableGame";

const BANK_LEVELS: DifficultyKey[] = ["gentle", "steady", "spark"];

export function isEntireGameDefinitionMatching(def: GameDefinition): boolean {
  for (const level of BANK_LEVELS) {
    const bank = def.banksByLevel[level];
    if (!bank?.length) return false;
    for (const q of bank) {
      if (!isMatchingQuestion(q)) return false;
    }
  }
  return true;
}

export function mapGameDefinitionToMatchingPlayableGame(def: GameDefinition): MatchingPlayableGame {
  if (!isEntireGameDefinitionMatching(def)) {
    throw new Error(
      `mapGameDefinitionToMatchingPlayableGame: GameDefinition ${def.id} אינו כולו matching`,
    );
  }

  return {
    id: def.id,
    slug: def.slug,
    worldId: def.world,
    title: def.title,
    banks: {
      gentle: def.banksByLevel.gentle as MatchingQuestion[],
      steady: def.banksByLevel.steady as MatchingQuestion[],
      spark: def.banksByLevel.spark as MatchingQuestion[],
    },
  };
}
