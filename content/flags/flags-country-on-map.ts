import type { GameDefinition } from "@/lib/game-types/registry";
import type { MultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";
import {
  FLAGS_GENTLE_MAP_SHAPE_BY_KEY,
  FLAGS_MAP_GENTLE_TEMPLATES,
  FLAGS_MAP_SPARK_TEMPLATES,
  FLAGS_MAP_STEADY_TEMPLATES,
  FLAG_EXTENDED_LABEL_HE,
  type FlagChoiceKey,
} from "./curated-catalog";

const SKILL: MultipleChoiceQuestion["skills"] = ["general-knowledge"];

function mapChoicesFromKeys(keys: string[]): Record<string, { label: string }> {
  const o: Record<string, { label: string }> = {};
  for (const k of keys) {
    o[k] = { label: FLAG_EXTENDED_LABEL_HE[k as FlagChoiceKey] };
  }
  return o;
}

const gentle: MultipleChoiceQuestion[] = FLAGS_MAP_GENTLE_TEMPLATES.map((t, i) => {
  const keys = [t.correct, ...t.distractors];
  return {
    id: `flags-map-g${i + 1}`,
    type: "multiple-choice",
    world: "flags",
    level: "gentle",
    presentationSubtype: "map-country" as const,
    mapCountry: FLAGS_GENTLE_MAP_SHAPE_BY_KEY[t.correct],
    instructions: t.instructions,
    skills: SKILL,
    explanation: t.explanation,
    correctAnswer: t.correct,
    distractors: [...t.distractors],
    choices: mapChoicesFromKeys(keys),
    textDirection: "rtl",
    hint: { kind: "remove-distractor", maxSteps: 1 },
  };
});

const steady: MultipleChoiceQuestion[] = FLAGS_MAP_STEADY_TEMPLATES.map((t, i) => {
  const keys = [t.correct, ...t.distractors];
  return {
    id: `flags-map-s${i + 1}`,
    type: "multiple-choice",
    world: "flags",
    level: "steady",
    presentationSubtype: "map-country" as const,
    mapCountry: t.mapCountry,
    instructions: t.instructions,
    skills: SKILL,
    explanation: t.explanation,
    correctAnswer: t.correct,
    distractors: [...t.distractors],
    choices: mapChoicesFromKeys(keys),
    textDirection: "rtl",
    hint: { kind: "remove-distractor", maxSteps: 1 },
  };
});

const spark: MultipleChoiceQuestion[] = FLAGS_MAP_SPARK_TEMPLATES.map((t, i) => {
  const keys = [t.correct, ...t.distractors];
  return {
    id: `flags-map-p${i + 1}`,
    type: "multiple-choice",
    world: "flags",
    level: "spark",
    presentationSubtype: "map-country" as const,
    mapCountry: t.mapCountry,
    instructions: t.instructions,
    skills: SKILL,
    explanation: t.explanation,
    correctAnswer: t.correct,
    distractors: [...t.distractors],
    choices: mapChoicesFromKeys(keys),
    textDirection: "rtl",
    hint: { kind: "remove-distractor", maxSteps: 1 },
  };
});

export const flagsCountryOnMapDefinition: GameDefinition = {
  id: "flags-country-on-map",
  slug: "flags-country-on-map",
  world: "flags",
  title: "מדינה על המפה",
  tagline: "רואים מפה — בוחרים מדינה",
  defaultSessionLevel: "gentle",
  supportedQuestionTypes: ["multiple-choice"],
  banksByLevel: { gentle, steady, spark },
  skills: SKILL,
  parentSummary: "זיהוי מדינה לפי מיקום על מפת אזור פשוטה — בלי לחץ של מבחן גיאוגרפיה.",
};
