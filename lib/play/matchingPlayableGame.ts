import type { DifficultyKey, WorldId } from "@/content/types";
import type { MatchingQuestion } from "@/lib/game-types/matching";

/** קלט למסך התאמת זוגות — בנקי שאלות מסוג matching בלבד */
export type MatchingPlayableGame = {
  id: string;
  slug: string;
  worldId: WorldId;
  title: string;
  banks: Record<DifficultyKey, MatchingQuestion[]>;
};
