import type { GameDefinition } from "@/lib/game-types/registry";
import type { MultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";
import { isMultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";
import type { DifficultyKey } from "@/content/types";
import type { PlayableMultipleChoiceRound } from "@/lib/game-engine/playableRound";
import type { MultipleChoicePlayableGame } from "./multipleChoicePlayableGame";

const BANK_LEVELS: DifficultyKey[] = ["gentle", "steady", "spark"];

export function isEntireGameDefinitionMultipleChoice(def: GameDefinition): boolean {
  for (const level of BANK_LEVELS) {
    const bank = def.banksByLevel[level];
    if (!bank?.length) return false;
    for (const q of bank) {
      if (!isMultipleChoiceQuestion(q)) return false;
    }
  }
  return true;
}

/** שאלת MC → צורת סיבוב למנוע הערבוב (בלי עובר דרך GameModule). */
export function mcQuestionToPlayableRound(q: MultipleChoiceQuestion): PlayableMultipleChoiceRound {
  const choices = Object.entries(q.choices).map(([id, presentation]) => ({
    id,
    label: presentation.label,
    emoji: presentation.emoji,
    imageSrc: presentation.imageSrc,
    illustrationKey: presentation.illustrationKey,
    altHe: presentation.altHe,
  }));
  const mapCountry =
    q.presentationSubtype === "map-country" && q.mapCountry ? { ...q.mapCountry } : undefined;

  return {
    id: q.id,
    prompt: q.instructions,
    direction: q.textDirection,
    correctChoiceId: q.correctAnswer,
    choices,
    mapCountry,
    promptVisual: q.promptVisual,
  };
}

export function mapGameDefinitionToMultipleChoicePlayableGame(
  def: GameDefinition,
): MultipleChoicePlayableGame {
  if (!isEntireGameDefinitionMultipleChoice(def)) {
    throw new Error(
      `mapGameDefinitionToMultipleChoicePlayableGame: GameDefinition ${def.id} אינו כולו multiple-choice`,
    );
  }

  return {
    id: def.id,
    slug: def.slug,
    worldId: def.world,
    title: def.title,
    banks: {
      gentle: def.banksByLevel.gentle as MultipleChoiceQuestion[],
      steady: def.banksByLevel.steady as MultipleChoiceQuestion[],
      spark: def.banksByLevel.spark as MultipleChoiceQuestion[],
    },
  };
}
