import type { GameModule } from "@/content/types";
import type { SkillId, WorldId } from "@/lib/game-types/shared";
import type { GameDefinition } from "@/lib/game-types/registry";
import { mapLegacyChoiceBanksToQuestionBanks } from "./legacyChoiceRound";

const WORD_SHUTTLE_ID = "en-word-shuttle";

const GAME_SKILLS: SkillId[] = ["vocabulary-receptive"];

/**
 * ממפה את מודול הלגאסי של מעבורת המילים ל־GameDefinition החדש.
 */
export function mapWordShuttleToGameDefinition(source: GameModule): GameDefinition {
  if (source.id !== WORD_SHUTTLE_ID) {
    throw new Error(
      `mapWordShuttleToGameDefinition: מצופה מודול word-shuttle (id=${WORD_SHUTTLE_ID}), התקבל ${source.id}`,
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
