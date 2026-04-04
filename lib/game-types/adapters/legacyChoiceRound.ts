import type { ChoiceRound, DifficultyKey } from "@/content/types";
import type { DifficultyLevel, HintSpec, SkillId, WorldId } from "@/lib/game-types/shared";
import type { MultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";
import type { Question } from "@/lib/game-types/registry";

/** רמז ברירת־מחדל למשחקי בחירה בלגאסי — זהה לשאר adapters (לא מגיע מהתוכן הישן). */
export const DEFAULT_LEGACY_MC_HINT: HintSpec = {
  kind: "remove-distractor",
  maxSteps: 2,
};

const BANK_LEVELS = ["gentle", "steady", "spark"] as const satisfies readonly DifficultyKey[];

/**
 * ממפה סיבוב בחירה יחיד ל־MultipleChoiceQuestion (חוזה חדש).
 * explanation: בלגאסי אין לכל שאלה הסבר נפרד — משתמשים ב־learningGoal של המשחק כברירת מחדל.
 */
export function mapLegacyChoiceRoundToMultipleChoice(
  round: ChoiceRound,
  world: WorldId,
  level: DifficultyLevel,
  skills: SkillId[],
  explanationFallback: string,
  hint: HintSpec = DEFAULT_LEGACY_MC_HINT,
): MultipleChoiceQuestion {
  const distractors = round.choices.filter((c) => c.id !== round.correctChoiceId).map((c) => c.id);
  const choices: MultipleChoiceQuestion["choices"] = {};
  for (const c of round.choices) {
    choices[c.id] = { label: c.label, emoji: c.emoji };
  }

  return {
    id: round.id,
    type: "multiple-choice",
    world,
    level,
    instructions: round.prompt,
    skills,
    hint,
    explanation: explanationFallback,
    correctAnswer: round.correctChoiceId,
    distractors,
    choices,
    textDirection: round.direction,
  };
}

/** ממפה את שלושת בנקי הקושי של GameModule ל־banksByLevel בחוזה החדש. */
export function mapLegacyChoiceBanksToQuestionBanks(
  banks: Record<DifficultyKey, ChoiceRound[]>,
  world: WorldId,
  skills: SkillId[],
  explanationFallback: string,
  hint: HintSpec = DEFAULT_LEGACY_MC_HINT,
): Record<DifficultyKey, Question[]> {
  const out = {} as Record<DifficultyKey, Question[]>;
  for (const level of BANK_LEVELS) {
    out[level] = banks[level].map((r) =>
      mapLegacyChoiceRoundToMultipleChoice(r, world, level, skills, explanationFallback, hint),
    );
  }
  return out;
}
