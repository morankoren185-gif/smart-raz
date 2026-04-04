import type { GameDefinition } from "@/lib/game-types/registry";
import type { MultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";
import {
  FLAGS_MC_GENTLE_TEMPLATES,
  FLAGS_MC_SPARK_TEMPLATES,
  FLAGS_MC_STEADY_TEMPLATES,
  FLAG_EXTENDED_LABEL_HE,
  type FlagChoiceKey,
} from "./curated-catalog";
import { mcPromptVisualForFlagKey } from "./flag-prompt-visual";

/**
 * דגל (אימוג׳י אזורי) → שם מדינה בעברית.
 * gentle / steady נבנים מ־`curated-catalog` — מקור אמת אחד לכל משחקי הדגלים.
 */

const SKILL: MultipleChoiceQuestion["skills"] = ["general-knowledge"];

function choicesFromKeys(keys: string[]): Record<string, { label: string }> {
  const o: Record<string, { label: string }> = {};
  for (const k of keys) {
    o[k] = { label: FLAG_EXTENDED_LABEL_HE[k as FlagChoiceKey] };
  }
  return o;
}

const gentle: MultipleChoiceQuestion[] = FLAGS_MC_GENTLE_TEMPLATES.map((t, i) => {
  const keys = [t.correct, ...t.distractors];
  return {
    id: `flags-mc-g${i + 1}`,
    type: "multiple-choice",
    world: "flags",
    level: "gentle",
    instructions: t.instructions,
    skills: SKILL,
    explanation: t.explanation,
    correctAnswer: t.correct,
    distractors: [...t.distractors],
    choices: choicesFromKeys(keys),
    textDirection: "rtl",
    hint: { kind: "remove-distractor", maxSteps: 1 },
    promptVisual: mcPromptVisualForFlagKey(t.correct),
  };
});

const steady: MultipleChoiceQuestion[] = FLAGS_MC_STEADY_TEMPLATES.map((t, i) => {
  const keys = [t.correct, ...t.distractors];
  return {
    id: `flags-mc-s${i + 1}`,
    type: "multiple-choice",
    world: "flags",
    level: "steady",
    instructions: t.instructions,
    skills: SKILL,
    explanation: t.explanation,
    correctAnswer: t.correct,
    distractors: [...t.distractors],
    choices: choicesFromKeys(keys),
    textDirection: "rtl",
    hint: { kind: "remove-distractor", maxSteps: 1 },
    promptVisual: mcPromptVisualForFlagKey(t.correct),
  };
});

const spark: MultipleChoiceQuestion[] = FLAGS_MC_SPARK_TEMPLATES.map((t, i) => {
  const keys = [t.correct, ...t.distractors];
  return {
    id: `flags-mc-p${i + 1}`,
    type: "multiple-choice",
    world: "flags",
    level: "spark",
    instructions: t.instructions,
    skills: SKILL,
    explanation: t.explanation,
    correctAnswer: t.correct,
    distractors: [...t.distractors],
    choices: choicesFromKeys(keys),
    textDirection: "rtl",
    hint: { kind: "remove-distractor", maxSteps: 1 },
    promptVisual: mcPromptVisualForFlagKey(t.correct),
  };
});

export const flagsCountryChoiceDefinition: GameDefinition = {
  id: "flags-country-choice",
  slug: "flags-country-choice",
  world: "flags",
  title: "מנחשים מדינה",
  tagline: "רואים דגל — בוחרים שם",
  defaultSessionLevel: "gentle",
  supportedQuestionTypes: ["multiple-choice"],
  banksByLevel: { gentle, steady, spark },
  skills: SKILL,
  parentSummary: "זיהוי דגלים מוכרים והתאמה לשם המדינה — בלי לחץ של מבחן.",
};
