import type { GameModule } from "@/content/types";
import type { SkillId, WorldId } from "@/lib/game-types/shared";
import type { GameDefinition } from "@/lib/game-types/registry";
import { mapLegacyChoiceBanksToQuestionBanks } from "./legacyChoiceRound";

const STAR_COUNT_ID = "math-star-count";

/**
 * מיומנויות ברמת המשחק. שאלת "מה גדול יותר" נספרת תחת number-sense/comparison באותו רושם ארגוני.
 */
const GAME_SKILLS: SkillId[] = ["counting", "number-sense", "addition"];

/**
 * ממפה את סופרים כוכבים (לגאסי) ל־GameDefinition.
 */
export function mapStarCountToGameDefinition(source: GameModule): GameDefinition {
  if (source.id !== STAR_COUNT_ID) {
    throw new Error(
      `mapStarCountToGameDefinition: מצופה star-count (id=${STAR_COUNT_ID}), התקבל ${source.id}`,
    );
  }

  const world = source.worldId as WorldId;
  const banksByLevel = mapLegacyChoiceBanksToQuestionBanks(
    source.banks,
    world,
    GAME_SKILLS,
    source.learningGoal,
  );

  return {
    id: source.id,
    slug: source.slug,
    world,
    title: source.title,
    tagline: source.tagline,
    defaultSessionLevel: "gentle",
    supportedQuestionTypes: ["multiple-choice"],
    banksByLevel,
    skills: GAME_SKILLS,
    parentSummary: source.learningGoal,
  };
}
