import type { GameDefinition } from "@/lib/game-types/registry";
import type { MatchingQuestion } from "@/lib/game-types/matching";
import {
  FLAGS_MATCHING_GENTLE_ROUNDS,
  FLAGS_MATCHING_SPARK_ROUNDS,
  FLAGS_MATCHING_STEADY_ROUNDS,
  FLAG_CHOICE_EMOJI,
  FLAG_EXTENDED_LABEL_HE,
} from "./curated-catalog";
import { flagImageSrcForChoiceKey } from "./flag-image-src";

/**
 * התאמת דגל (אימוג׳י) לשם המדינה בעברית.
 * gentle / steady מקורם ב־`curated-catalog`.
 */

const SKILL: MatchingQuestion["skills"] = ["general-knowledge"];

const gentle: MatchingQuestion[] = FLAGS_MATCHING_GENTLE_ROUNDS.map((round, idx) => ({
  id: `flags-match-g${idx + 1}`,
  type: "matching",
  world: "flags",
  level: "gentle",
  instructions: round.instructions,
  skills: SKILL,
  explanation: round.explanation,
  textDirection: "rtl",
  pairs: round.pairs.map((p) => ({
    pairId: p.pairId,
    sideA: {
      label: "",
      emoji: FLAG_CHOICE_EMOJI[p.key],
      imageSrc: flagImageSrcForChoiceKey(p.key),
      altHe: `דגל ${FLAG_EXTENDED_LABEL_HE[p.key]}`,
    },
    sideB: { label: FLAG_EXTENDED_LABEL_HE[p.key] },
  })),
}));

const steady: MatchingQuestion[] = FLAGS_MATCHING_STEADY_ROUNDS.map((round, idx) => ({
  id: `flags-match-s${idx + 1}`,
  type: "matching",
  world: "flags",
  level: "steady",
  instructions: round.instructions,
  skills: SKILL,
  explanation: round.explanation,
  textDirection: "rtl",
  pairs: round.pairs.map((p) => ({
    pairId: p.pairId,
    sideA: {
      label: "",
      emoji: FLAG_CHOICE_EMOJI[p.key],
      imageSrc: flagImageSrcForChoiceKey(p.key),
      altHe: `דגל ${FLAG_EXTENDED_LABEL_HE[p.key]}`,
    },
    sideB: { label: FLAG_EXTENDED_LABEL_HE[p.key] },
  })),
}));

const spark: MatchingQuestion[] = FLAGS_MATCHING_SPARK_ROUNDS.map((round, idx) => ({
  id: `flags-match-p${idx + 1}`,
  type: "matching",
  world: "flags",
  level: "spark",
  instructions: round.instructions,
  skills: SKILL,
  explanation: round.explanation,
  textDirection: "rtl",
  pairs: round.pairs.map((p) => ({
    pairId: p.pairId,
    sideA: {
      label: "",
      emoji: FLAG_CHOICE_EMOJI[p.key],
      imageSrc: flagImageSrcForChoiceKey(p.key),
      altHe: `דגל ${FLAG_EXTENDED_LABEL_HE[p.key]}`,
    },
    sideB: { label: FLAG_EXTENDED_LABEL_HE[p.key] },
  })),
}));

export const flagsFlagMatchingDefinition: GameDefinition = {
  id: "flags-flag-matching",
  slug: "flags-flag-matching",
  world: "flags",
  title: "דגל ומדינה",
  tagline: "מחברים דגל לשם הנכון",
  defaultSessionLevel: "gentle",
  supportedQuestionTypes: ["matching"],
  banksByLevel: { gentle, steady, spark },
  skills: SKILL,
  parentSummary: "התאמה חזותית בין דגל לשם — זיכרון וזיהוי בלי הצפת מידע.",
};
