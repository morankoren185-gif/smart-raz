import type { MatchingQuestion, MatchingPairSpec } from "@/lib/game-types/matching";
import type { MultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";
import type { DifficultyLevel } from "@/lib/game-types/shared";
import type { PlanetId } from "./lexicon";
import type { SpaceOrderMcCuratedSpec } from "./curated-catalog";
import {
  SPACE_ORDER_MATCHING_GENTLE_ROUNDS,
  SPACE_ORDER_MATCHING_STEADY_ROUNDS,
  SPACE_ORDER_MC_CURATED_GENTLE,
  SPACE_ORDER_MC_CURATED_SPARK,
  SPACE_ORDER_MC_CURATED_STEADY,
} from "./curated-catalog";
import { PLANETS_BY_LEVEL, SOLAR_PLANETS_FROM_SUN, positionFromSun, visualForPlanet } from "./lexicon";

const MC_SKILLS: MultipleChoiceQuestion["skills"] = ["general-knowledge"];
const MATCH_SKILLS: MatchingQuestion["skills"] = ["general-knowledge"];

function choiceKeyPlanet(planet: PlanetId): string {
  return `ord_${planet.replace(/\s+/g, "_").toLowerCase()}`;
}

/** מילוי תשובות שגויות מתוך בריכה מורחבת (כולל כוכב נכון שלא ברמת התרגול) */
function extendedChoicePool(level: DifficultyLevel, correct: PlanetId): PlanetId[] {
  return [...new Set<PlanetId>([...PLANETS_BY_LEVEL[level], correct])];
}

function pickWrongPlanets(correct: PlanetId, pool: readonly PlanetId[], count: number): PlanetId[] {
  const wrong = pool.filter((p) => p !== correct);
  const out: PlanetId[] = [];
  for (let i = 0; i < wrong.length && out.length < count; i++) {
    out.push(wrong[i]!);
  }
  return out;
}

function ordinalEn(n: number): string {
  if (n >= 11 && n <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

function buildMcPlanetChoices(
  correct: PlanetId,
  distractors: PlanetId[],
): Record<string, { label: string }> {
  const choices: Record<string, { label: string }> = {};
  for (const p of [correct, ...distractors]) {
    choices[choiceKeyPlanet(p)] = { label: p };
  }
  return choices;
}

function hydrateOrderMcFromCatalog(
  spec: SpaceOrderMcCuratedSpec,
  level: "gentle" | "steady" | "spark",
): MultipleChoiceQuestion {
  const correct = spec.correctPlanet as PlanetId;
  const distractors = spec.distractorPlanets as PlanetId[];
  const promptVisual =
    spec.prompt.kind === "planet"
      ? (() => {
          const va = visualForPlanet(spec.prompt.planet as PlanetId);
          return {
            emoji: va.emoji,
            imageSrc: va.imageSrc,
            illustrationKey: va.illustrationKey,
            altHe: va.altHe,
          };
        })()
      : { emoji: "☀️", altHe: spec.prompt.altHe };

  return {
    id: spec.id,
    type: "multiple-choice",
    world: "space",
    level,
    instructions: spec.instructions,
    promptVisual,
    skills: MC_SKILLS,
    explanation: spec.explanation,
    correctAnswer: choiceKeyPlanet(correct),
    distractors: distractors.map(choiceKeyPlanet),
    choices: buildMcPlanetChoices(correct, distractors),
    textDirection: "ltr",
    hint: { kind: "remove-distractor", maxSteps: 1 },
  };
}

/**
 * שאלות multiple-choice על סדר מערכת השמש — רק כשהנכון ניתן להציג בתוך בריכת בחירה הגיונית.
 */
export function buildPlanetOrderMcBank(): Record<DifficultyLevel, MultipleChoiceQuestion[]> {
  const out: Record<DifficultyLevel, MultipleChoiceQuestion[]> = {
    gentle: [],
    steady: [],
    spark: [],
  };

  for (const level of ["gentle", "steady", "spark"] as const) {
    const distractorCount = level === "gentle" ? 2 : 3;
    let qIdx = 0;

    const poolPractice = PLANETS_BY_LEVEL[level];

    for (const anchor of poolPractice) {
      const idx = SOLAR_PLANETS_FROM_SUN.indexOf(anchor);
      if (idx < 0) continue;

      if (idx < SOLAR_PLANETS_FROM_SUN.length - 1) {
        const correct = SOLAR_PLANETS_FROM_SUN[idx + 1]!;
        const choicePool = extendedChoicePool(level, correct);
        if (choicePool.includes(correct)) {
          const wrong = pickWrongPlanets(correct, choicePool, distractorCount);
          if (wrong.length === distractorCount) {
            const va = visualForPlanet(anchor);
            out[level].push({
              id: `space-ord-mc-${level}-${qIdx++}`,
              type: "multiple-choice",
              world: "space",
              level,
              instructions: `Who comes right after ${anchor}?\n(count from the Sun)`,
              promptVisual: {
                emoji: va.emoji,
                imageSrc: va.imageSrc,
                illustrationKey: va.illustrationKey,
                altHe: va.altHe,
              },
              skills: MC_SKILLS,
              explanation: `אחרי ${anchor} מגיע ${correct} (מיקום ${positionFromSun(correct)} מהשמש).`,
              correctAnswer: choiceKeyPlanet(correct),
              distractors: wrong.map(choiceKeyPlanet),
              choices: buildMcPlanetChoices(correct, wrong),
              textDirection: "ltr",
              hint: { kind: "remove-distractor", maxSteps: 1 },
            });
          }
        }
      }

      if (idx > 0) {
        const correct = SOLAR_PLANETS_FROM_SUN[idx - 1]!;
        const choicePool = extendedChoicePool(level, correct);
        if (choicePool.includes(correct)) {
          const wrong = pickWrongPlanets(correct, choicePool, distractorCount);
          if (wrong.length === distractorCount) {
            const va = visualForPlanet(anchor);
            out[level].push({
              id: `space-ord-mc-${level}-${qIdx++}`,
              type: "multiple-choice",
              world: "space",
              level,
              instructions: `Who comes right before ${anchor}?\n(count from the Sun)`,
              promptVisual: {
                emoji: va.emoji,
                imageSrc: va.imageSrc,
                illustrationKey: va.illustrationKey,
                altHe: va.altHe,
              },
              skills: MC_SKILLS,
              explanation: `לפני ${anchor} נמצא ${correct} (מיקום ${positionFromSun(correct)} מהשמש).`,
              correctAnswer: choiceKeyPlanet(correct),
              distractors: wrong.map(choiceKeyPlanet),
              choices: buildMcPlanetChoices(correct, wrong),
              textDirection: "ltr",
              hint: { kind: "remove-distractor", maxSteps: 1 },
            });
          }
        }
      }

      const pos = positionFromSun(anchor);
      if (pos > 0) {
        const choicePool = extendedChoicePool(level, anchor);
        const wrong = pickWrongPlanets(anchor, choicePool, distractorCount);
        if (wrong.length === distractorCount) {
          out[level].push({
            id: `space-ord-mc-${level}-${qIdx++}`,
            type: "multiple-choice",
            world: "space",
            level,
            instructions: `Which planet is ${ordinalEn(pos)} from the Sun?`,
            promptVisual: {
              emoji: "☀️",
              altHe: "השמש — סופרים מהמרכז החם",
            },
            skills: MC_SKILLS,
            explanation: `הכוכב במקום ${pos} מהשמש הוא ${anchor}.`,
            correctAnswer: choiceKeyPlanet(anchor),
            distractors: wrong.map(choiceKeyPlanet),
            choices: buildMcPlanetChoices(anchor, wrong),
            textDirection: "ltr",
            hint: { kind: "remove-distractor", maxSteps: 1 },
          });
        }
      }
    }
  }

  out.gentle = SPACE_ORDER_MC_CURATED_GENTLE.map((s) => hydrateOrderMcFromCatalog(s, "gentle"));
  out.steady = SPACE_ORDER_MC_CURATED_STEADY.map((s) => hydrateOrderMcFromCatalog(s, "steady"));
  out.spark = SPACE_ORDER_MC_CURATED_SPARK.map((s) => hydrateOrderMcFromCatalog(s, "spark"));

  return out;
}

function positionTileLabel(n: number): string {
  return `#${n}`;
}

function pairPlanetToSlot(planet: PlanetId, pairId: string): MatchingPairSpec {
  const v = visualForPlanet(planet);
  const n = positionFromSun(planet);
  return {
    pairId,
    sideA: {
      label: "",
      emoji: v.emoji,
      imageSrc: v.imageSrc,
      illustrationKey: v.illustrationKey,
      altHe: v.altHe,
    },
    sideB: {
      label: positionTileLabel(n),
      emoji: "🔢",
      altHe: `מקום ${n} מהשמש`,
    },
  };
}

/** התאמת כוכב (תמונה) ↔ מספר מיקום מהשמש */
export function buildPlanetOrderMatchingBank(): Record<DifficultyLevel, MatchingQuestion[]> {
  const gentle: MatchingQuestion[] = SPACE_ORDER_MATCHING_GENTLE_ROUNDS.map((r) => ({
    id: r.id,
    type: "matching",
    world: "space",
    level: "gentle",
    instructions: r.instructions,
    skills: MATCH_SKILLS,
    explanation: r.explanation,
    textDirection: "ltr",
    pairs: r.pairs.map((p) => pairPlanetToSlot(p.planet as PlanetId, p.pairId)),
  }));

  const steady: MatchingQuestion[] = SPACE_ORDER_MATCHING_STEADY_ROUNDS.map((r) => ({
    id: r.id,
    type: "matching",
    world: "space",
    level: "steady",
    instructions: r.instructions,
    skills: MATCH_SKILLS,
    explanation: r.explanation,
    textDirection: "ltr",
    pairs: r.pairs.map((p) => pairPlanetToSlot(p.planet as PlanetId, p.pairId)),
  }));

  const spark: MatchingQuestion[] = [
    {
      id: "space-ord-match-p1",
      type: "matching",
      world: "space",
      level: "spark",
      instructions: "Inner worlds — match to Sun order (1–4)",
      skills: MATCH_SKILLS,
      explanation: "חמה עד מאדים.",
      textDirection: "ltr",
      pairs: [
        pairPlanetToSlot("Mercury", "so-p-1"),
        pairPlanetToSlot("Venus", "so-p-2"),
        pairPlanetToSlot("Earth", "so-p-3"),
        pairPlanetToSlot("Mars", "so-p-4"),
      ],
    },
    {
      id: "space-ord-match-p2",
      type: "matching",
      world: "space",
      level: "spark",
      instructions: "Outer giants — same idea (#5–#8)",
      skills: MATCH_SKILLS,
      explanation: "צדק עד נפטון.",
      textDirection: "ltr",
      pairs: [
        pairPlanetToSlot("Jupiter", "so-p-5"),
        pairPlanetToSlot("Saturn", "so-p-6"),
        pairPlanetToSlot("Uranus", "so-p-7"),
        pairPlanetToSlot("Neptune", "so-p-8"),
      ],
    },
  ];

  return { gentle, steady, spark };
}
