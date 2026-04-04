import type { DifficultyKey, WorldId } from "@/content/types";
import type { MultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";

/**
 * קלט ממוקד למסך multiple-choice — ללא GameModule/ChoiceRound כחוזה ראשי.
 * הבנקים הם MultipleChoiceQuestion ישירות מ־GameDefinition.
 */
export type MultipleChoicePlayableGame = {
  id: string;
  slug: string;
  worldId: WorldId;
  title: string;
  banks: Record<DifficultyKey, MultipleChoiceQuestion[]>;
};
