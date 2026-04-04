import type { GameModule } from "@/content/types";
import type { SkillId, WorldId } from "@/lib/game-types/shared";
import type { GameDefinition } from "@/lib/game-types/registry";
import { mapLegacyChoiceBanksToQuestionBanks } from "./legacyChoiceRound";

const LETTER_ORBIT_ID = "he-letter-orbit";

/** מיומנויות ברמת המשחק — בלגאסי אין שיוך פר־שאלה; שאלות צלילית (סופית) עדיין באותה קבוצה */
const GAME_SKILLS: SkillId[] = ["letter-recognition", "phonemic-awareness", "early-reading"];

/**
 * ממפה את מסלול האותיות (לגאסי) ל־GameDefinition.
 */
export function mapLetterOrbitToGameDefinition(source: GameModule): GameDefinition {
  if (source.id !== LETTER_ORBIT_ID) {
    throw new Error(
      `mapLetterOrbitToGameDefinition: מצופה letter-orbit (id=${LETTER_ORBIT_ID}), התקבל ${source.id}`,
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
