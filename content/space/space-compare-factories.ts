import type { MultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";
import type { DifficultyLevel } from "@/lib/game-types/shared";
import type { SpaceCompareMcCuratedSpec } from "./curated-catalog";
import {
  SPACE_COMPARE_MC_CURATED_GENTLE,
  SPACE_COMPARE_MC_CURATED_SPARK,
  SPACE_COMPARE_MC_CURATED_STEADY,
} from "./curated-catalog";
import type { PlanetId } from "./lexicon";
import { PLANETS_BY_LEVEL, SOLAR_PLANETS_FROM_SUN, positionFromSun } from "./lexicon";

const MC_SKILLS: MultipleChoiceQuestion["skills"] = ["general-knowledge"];

function choiceKeyPlanet(planet: PlanetId): string {
  return `cmp_${planet.replace(/\s+/g, "_").toLowerCase()}`;
}

type CompareMode = "closer" | "farther" | "earlier" | "later";

function compareCorrect(mode: CompareMode, a: PlanetId, b: PlanetId): PlanetId {
  const ia = SOLAR_PLANETS_FROM_SUN.indexOf(a);
  const ib = SOLAR_PLANETS_FROM_SUN.indexOf(b);
  const inner = ia < ib ? a : b;
  const outer = ia < ib ? b : a;
  if (mode === "closer" || mode === "earlier") return inner;
  return outer;
}

function instructionText(mode: CompareMode, a: PlanetId, b: PlanetId): string {
  switch (mode) {
    case "closer":
      return `Which planet is closer to the Sun: ${a} or ${b}?`;
    case "farther":
      return `Which planet is farther from the Sun: ${a} or ${b}?`;
    case "earlier":
      return `Which comes earlier from the Sun: ${a} or ${b}?`;
    case "later":
      return `Which comes later from the Sun: ${a} or ${b}?`;
  }
}

/** מסיח שלישי ל"קרוב יותר בין שני כוכבים" — רחוק יותר משניהם או פנימי אם אין כזה */
function extraDistractorCloser(a: PlanetId, b: PlanetId): PlanetId | undefined {
  const ia = SOLAR_PLANETS_FROM_SUN.indexOf(a);
  const ib = SOLAR_PLANETS_FROM_SUN.indexOf(b);
  const hi = Math.max(ia, ib);
  const lo = Math.min(ia, ib);
  for (let k = hi + 1; k < SOLAR_PLANETS_FROM_SUN.length; k++) {
    const p = SOLAR_PLANETS_FROM_SUN[k]!;
    if (p !== a && p !== b) return p;
  }
  for (let k = lo - 1; k >= 0; k--) {
    const p = SOLAR_PLANETS_FROM_SUN[k]!;
    if (p !== a && p !== b) return p;
  }
  return undefined;
}

/** מסיח שלישי ל"רחוק יותר בין שני כוכבים" */
function extraDistractorFarther(a: PlanetId, b: PlanetId): PlanetId | undefined {
  const ia = SOLAR_PLANETS_FROM_SUN.indexOf(a);
  const ib = SOLAR_PLANETS_FROM_SUN.indexOf(b);
  const lo = Math.min(ia, ib);
  const hi = Math.max(ia, ib);
  for (let k = lo - 1; k >= 0; k--) {
    const p = SOLAR_PLANETS_FROM_SUN[k]!;
    if (p !== a && p !== b) return p;
  }
  for (let k = hi + 1; k < SOLAR_PLANETS_FROM_SUN.length; k++) {
    const p = SOLAR_PLANETS_FROM_SUN[k]!;
    if (p !== a && p !== b) return p;
  }
  return undefined;
}

function extraForMode(
  mode: CompareMode,
  a: PlanetId,
  b: PlanetId,
): PlanetId | undefined {
  if (mode === "closer" || mode === "earlier") return extraDistractorCloser(a, b);
  return extraDistractorFarther(a, b);
}

function fourthDistractor(used: Set<PlanetId>): PlanetId | undefined {
  for (const p of SOLAR_PLANETS_FROM_SUN) {
    if (!used.has(p)) return p;
  }
  return undefined;
}

function buildChoices(
  correct: PlanetId,
  wrongPlanets: PlanetId[],
): Record<string, { label: string }> {
  const choices: Record<string, { label: string }> = {};
  for (const p of [correct, ...wrongPlanets]) {
    choices[choiceKeyPlanet(p)] = { label: p };
  }
  return choices;
}

function hydrateCompareMcFromCatalog(
  spec: SpaceCompareMcCuratedSpec,
  level: "gentle" | "steady" | "spark",
): MultipleChoiceQuestion {
  const correct = spec.correctPlanet as PlanetId;
  const distractors = spec.distractorPlanets as PlanetId[];
  return {
    id: spec.id,
    type: "multiple-choice",
    world: "space",
    level,
    instructions: spec.instructions,
    promptVisual: {
      emoji: "☀️",
      altHe: spec.promptAltHe,
    },
    skills: MC_SKILLS,
    explanation: spec.explanation,
    correctAnswer: choiceKeyPlanet(correct),
    distractors: distractors.map(choiceKeyPlanet),
    choices: buildChoices(correct, distractors),
    textDirection: "ltr",
    hint: { kind: "remove-distractor", maxSteps: 1 },
  };
}

function pairsForLevel(level: DifficultyLevel): [PlanetId, PlanetId][] {
  const pool = PLANETS_BY_LEVEL[level];
  const minGap = level === "gentle" ? 2 : 1;
  const out: [PlanetId, PlanetId][] = [];
  for (let i = 0; i < pool.length; i++) {
    for (let j = i + 1; j < pool.length; j++) {
      const a = pool[i]!;
      const b = pool[j]!;
      const ia = SOLAR_PLANETS_FROM_SUN.indexOf(a);
      const ib = SOLAR_PLANETS_FROM_SUN.indexOf(b);
      if (Math.abs(ia - ib) >= minGap) out.push([a, b]);
    }
  }
  return out;
}

function modesForLevel(level: DifficultyLevel): CompareMode[] {
  if (level === "gentle") return ["closer", "farther"];
  if (level === "steady") return ["closer", "farther", "earlier", "later"];
  return ["closer", "farther", "earlier", "later"];
}

/**
 * השוואת מרחק/סדר בין שני כוכבים — רק MC; מסיחים כוללים את השני בזוג ומסיחים חיצוניים ברורים.
 */
export function buildPlanetCompareBank(): Record<DifficultyLevel, MultipleChoiceQuestion[]> {
  const out: Record<DifficultyLevel, MultipleChoiceQuestion[]> = {
    gentle: [],
    steady: [],
    spark: [],
  };

  for (const level of ["gentle", "steady", "spark"] as const) {
    const pairs = pairsForLevel(level);
    const modes = modesForLevel(level);
    const wrongCount = level === "gentle" ? 2 : 3;
    let qIdx = 0;

    for (const [pa, pb] of pairs) {
      const inner =
        SOLAR_PLANETS_FROM_SUN.indexOf(pa) < SOLAR_PLANETS_FROM_SUN.indexOf(pb) ? pa : pb;
      const outer = inner === pa ? pb : pa;

      for (const mode of modes) {
        const correct = compareCorrect(mode, inner, outer);
        const other = correct === inner ? outer : inner;
        const ex1 = extraForMode(mode, inner, outer);
        if (!ex1 || ex1 === correct || ex1 === other) continue;

        const wrongPlanets: PlanetId[] = [other, ex1];
        if (wrongCount === 3) {
          const used = new Set<PlanetId>([correct, other, ex1]);
          const ex2 = fourthDistractor(used);
          if (!ex2 || ex2 === correct) continue;
          wrongPlanets.push(ex2);
        }

        if (wrongPlanets.filter((p) => p === correct).length > 0) continue;

        out[level].push({
          id: `space-cmp-${level}-${qIdx++}`,
          type: "multiple-choice",
          world: "space",
          level,
          instructions: instructionText(mode, inner, outer),
          promptVisual: {
            emoji: "☀️",
            altHe: "השמש — משווים שני כוכבים",
          },
          skills: MC_SKILLS,
          explanation: `תשובה: ${correct} (מקום ${positionFromSun(correct)} מהשמש).`,
          correctAnswer: choiceKeyPlanet(correct),
          distractors: wrongPlanets.map(choiceKeyPlanet),
          choices: buildChoices(correct, wrongPlanets),
          textDirection: "ltr",
          hint: { kind: "remove-distractor", maxSteps: 1 },
        });
      }
    }
  }

  out.gentle = SPACE_COMPARE_MC_CURATED_GENTLE.map((s) => hydrateCompareMcFromCatalog(s, "gentle"));
  out.steady = SPACE_COMPARE_MC_CURATED_STEADY.map((s) => hydrateCompareMcFromCatalog(s, "steady"));
  out.spark = SPACE_COMPARE_MC_CURATED_SPARK.map((s) => hydrateCompareMcFromCatalog(s, "spark"));

  return out;
}
