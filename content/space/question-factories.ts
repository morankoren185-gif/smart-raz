import type { MatchingQuestion } from "@/lib/game-types/matching";
import type { MultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";
import type { DifficultyLevel } from "@/lib/game-types/shared";
import type { PlanetId } from "./lexicon";
import { PLANETS_BY_LEVEL, visualForPlanet } from "./lexicon";

const MC_SKILLS: MultipleChoiceQuestion["skills"] = ["general-knowledge"];
const MATCH_SKILLS: MatchingQuestion["skills"] = ["general-knowledge"];

function choiceKey(planet: string): string {
  return `p_${planet.replace(/\s+/g, "_").toLowerCase()}`;
}

function pickDistractors(planet: PlanetId, pool: readonly PlanetId[], count: number): PlanetId[] {
  const idx = pool.indexOf(planet);
  if (idx < 0) return [];
  const out: PlanetId[] = [];
  for (let step = 1; out.length < count && step < pool.length; step++) {
    const p = pool[(idx + step) % pool.length]!;
    if (p !== planet && !out.includes(p)) out.push(p);
  }
  return out;
}

/** כוכב → שם (אנגלית) — רמז חזותי כמו picture-to-word */
export function buildPlanetToNameBank(): Record<DifficultyLevel, MultipleChoiceQuestion[]> {
  const out: Record<DifficultyLevel, MultipleChoiceQuestion[]> = {
    gentle: [],
    steady: [],
    spark: [],
  };
  for (const level of ["gentle", "steady", "spark"] as const) {
    const pool = PLANETS_BY_LEVEL[level];
    const distractorCount = level === "gentle" ? 2 : level === "steady" ? 3 : 3;
    pool.forEach((planet, i) => {
      const v = visualForPlanet(planet);
      const distractors = pickDistractors(planet, pool, distractorCount);
      const choices: Record<string, { label: string }> = {};
      for (const p of [planet, ...distractors]) {
        choices[choiceKey(p)] = { label: p };
      }
      out[level].push({
        id: `space-p2n-${level}-${i}`,
        type: "multiple-choice",
        world: "space",
        level,
        instructions: "Pick the planet name.",
        promptVisual: {
          emoji: v.emoji,
          imageSrc: v.imageSrc,
          illustrationKey: v.illustrationKey,
          altHe: v.altHe,
        },
        skills: MC_SKILLS,
        explanation: `זיהוי שם כוכב הלכת ${planet} — ${v.altHe}.`,
        correctAnswer: choiceKey(planet),
        distractors: distractors.map(choiceKey),
        choices,
        textDirection: "ltr",
        hint: { kind: "remove-distractor", maxSteps: 1 },
      });
    });
  }
  return out;
}

/** שם → כוכב — בחירת אימוג׳י / איור כמו word-to-picture */
export function buildNameToPlanetBank(): Record<DifficultyLevel, MultipleChoiceQuestion[]> {
  const out: Record<DifficultyLevel, MultipleChoiceQuestion[]> = {
    gentle: [],
    steady: [],
    spark: [],
  };
  for (const level of ["gentle", "steady", "spark"] as const) {
    const pool = PLANETS_BY_LEVEL[level];
    const distractorCount = level === "gentle" ? 2 : 3;
    pool.forEach((planet, i) => {
      const distractors = pickDistractors(planet, pool, distractorCount);
      const choices: Record<
        string,
        { label: string; emoji?: string; imageSrc?: string; illustrationKey?: string; altHe?: string }
      > = {};
      for (const p of [planet, ...distractors]) {
        const v = visualForPlanet(p);
        const hasAsset = Boolean(v.imageSrc);
        choices[choiceKey(p)] = {
          label: hasAsset ? "" : v.emoji,
          emoji: v.emoji,
          imageSrc: v.imageSrc,
          illustrationKey: v.illustrationKey,
          altHe: v.altHe,
        };
      }
      out[level].push({
        id: `space-n2p-${level}-${i}`,
        type: "multiple-choice",
        world: "space",
        level,
        instructions: `Read the name — pick the planet.\n${planet}`,
        skills: MC_SKILLS,
        explanation: `התאמת ייצוג חזותי לשם ${planet}.`,
        correctAnswer: choiceKey(planet),
        distractors: distractors.map(choiceKey),
        choices,
        textDirection: "ltr",
        hint: { kind: "remove-distractor", maxSteps: 1 },
      });
    });
  }
  return out;
}

export function buildPlanetMatchingBank(): Record<DifficultyLevel, MatchingQuestion[]> {
  const gentle: MatchingQuestion[] = [
    {
      id: "space-match-g1",
      type: "matching",
      world: "space",
      level: "gentle",
      instructions: "Match each planet picture to its name — nice and easy!",
      skills: MATCH_SKILLS,
      explanation: "שני זוגות מוכרים.",
      textDirection: "ltr",
      pairs: [
        { pairId: "sp-g1", sideA: { label: "", ...visualForPlanet("Earth") }, sideB: { label: "Earth" } },
        { pairId: "sp-g2", sideA: { label: "", ...visualForPlanet("Mars") }, sideB: { label: "Mars" } },
      ],
    },
    {
      id: "space-match-g2",
      type: "matching",
      world: "space",
      level: "gentle",
      instructions: "Two more friendly pairs",
      skills: MATCH_SKILLS,
      explanation: "צדק ושבתאי.",
      textDirection: "ltr",
      pairs: [
        {
          pairId: "sp-g3",
          sideA: { label: "", ...visualForPlanet("Jupiter") },
          sideB: { label: "Jupiter" },
        },
        {
          pairId: "sp-g4",
          sideA: { label: "", ...visualForPlanet("Saturn") },
          sideB: { label: "Saturn" },
        },
      ],
    },
  ];

  const steady: MatchingQuestion[] = [
    {
      id: "space-match-s1",
      type: "matching",
      world: "space",
      level: "steady",
      instructions: "Match planet to name — steady orbit",
      skills: MATCH_SKILLS,
      explanation: "נוגה, נפטון ועוד.",
      textDirection: "ltr",
      pairs: [
        { pairId: "sp-s1", sideA: { label: "", ...visualForPlanet("Venus") }, sideB: { label: "Venus" } },
        {
          pairId: "sp-s2",
          sideA: { label: "", ...visualForPlanet("Neptune") },
          sideB: { label: "Neptune" },
        },
        { pairId: "sp-s3", sideA: { label: "", ...visualForPlanet("Earth") }, sideB: { label: "Earth" } },
      ],
    },
    {
      id: "space-match-s2",
      type: "matching",
      world: "space",
      level: "steady",
      instructions: "Four pairs — you’ve got this",
      skills: MATCH_SKILLS,
      explanation: "ערבוב רך בתוך אותה רמה.",
      textDirection: "ltr",
      pairs: [
        { pairId: "sp-s4", sideA: { label: "", ...visualForPlanet("Mars") }, sideB: { label: "Mars" } },
        {
          pairId: "sp-s5",
          sideA: { label: "", ...visualForPlanet("Jupiter") },
          sideB: { label: "Jupiter" },
        },
        { pairId: "sp-s6", sideA: { label: "", ...visualForPlanet("Saturn") }, sideB: { label: "Saturn" } },
        {
          pairId: "sp-s7",
          sideA: { label: "", ...visualForPlanet("Earth") },
          sideB: { label: "Earth" },
        },
      ],
    },
  ];

  const spark: MatchingQuestion[] = [
    {
      id: "space-match-p1",
      type: "matching",
      world: "space",
      level: "spark",
      instructions: "Spark mode — match every giant and ice world",
      skills: MATCH_SKILLS,
      explanation: "חמה, נוגה, מאדים, אורנוס.",
      textDirection: "ltr",
      pairs: [
        {
          pairId: "sp-p1",
          sideA: { label: "", ...visualForPlanet("Mercury") },
          sideB: { label: "Mercury" },
        },
        { pairId: "sp-p2", sideA: { label: "", ...visualForPlanet("Venus") }, sideB: { label: "Venus" } },
        { pairId: "sp-p3", sideA: { label: "", ...visualForPlanet("Mars") }, sideB: { label: "Mars" } },
        {
          pairId: "sp-p4",
          sideA: { label: "", ...visualForPlanet("Uranus") },
          sideB: { label: "Uranus" },
        },
      ],
    },
    {
      id: "space-match-p2",
      type: "matching",
      world: "space",
      level: "spark",
      instructions: "Five pairs — full solar crew",
      skills: MATCH_SKILLS,
      explanation: "כל שמונת כוכבי הלכת.",
      textDirection: "ltr",
      pairs: [
        { pairId: "sp-p5", sideA: { label: "", ...visualForPlanet("Earth") }, sideB: { label: "Earth" } },
        {
          pairId: "sp-p6",
          sideA: { label: "", ...visualForPlanet("Jupiter") },
          sideB: { label: "Jupiter" },
        },
        {
          pairId: "sp-p7",
          sideA: { label: "", ...visualForPlanet("Saturn") },
          sideB: { label: "Saturn" },
        },
        {
          pairId: "sp-p8",
          sideA: { label: "", ...visualForPlanet("Neptune") },
          sideB: { label: "Neptune" },
        },
        {
          pairId: "sp-p9",
          sideA: { label: "", ...visualForPlanet("Mercury") },
          sideB: { label: "Mercury" },
        },
      ],
    },
  ];

  return { gentle, steady, spark };
}
