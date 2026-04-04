import type { MatchingQuestion } from "@/lib/game-types/matching";
import type { MultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";
import type { DifficultyLevel } from "@/lib/game-types/shared";
import {
  ENGLISH_WORDS_MATCHING_GENTLE_ROUNDS,
  ENGLISH_WORDS_MATCHING_SPARK_ROUNDS,
  ENGLISH_WORDS_MATCHING_STEADY_ROUNDS,
  type EnglishWordsMatchingRound,
} from "./curated-catalog";
import {
  ENGLISH_WORDS_BY_LEVEL,
  displayHintForBuild,
  lettersSegmentForBuild,
  visualForEnglishWord,
} from "./lexicon";

const MC_SKILLS: MultipleChoiceQuestion["skills"] = [
  "early-reading",
  "vocabulary-receptive",
];
const LISTEN_SKILLS: MultipleChoiceQuestion["skills"] = [
  "listening-discrimination",
  "vocabulary-receptive",
];
const MATCH_SKILLS: MatchingQuestion["skills"] = ["vocabulary-receptive"];

function choiceKey(word: string): string {
  return `w_${word.replace(/\s+/g, "_").toLowerCase()}`;
}

/** מסיחים קבועים לפי סיבוב ברשימת הרמה — יציב בין הרצות */
function pickDistractorWords(
  word: string,
  pool: readonly string[],
  count: number,
): string[] {
  const idx = pool.indexOf(word);
  if (idx < 0) return [];
  const out: string[] = [];
  for (let step = 1; out.length < count && step < pool.length; step++) {
    const w = pool[(idx + step) % pool.length]!;
    if (w !== word && !out.includes(w)) out.push(w);
  }
  return out;
}

/** מסיחי spark: אחד דומה באורך המילה ואחד שונה — מעודד קריאה ולא ניחוש מהסיבוב */
function pickSparkMcDistractors(word: string, pool: readonly string[]): string[] {
  const others = pool.filter((w) => w !== word);
  if (others.length < 2) return pickDistractorWords(word, pool, 2);
  const byLenDelta = [...others].sort(
    (a, b) => Math.abs(a.length - word.length) - Math.abs(b.length - word.length),
  );
  const close = byLenDelta[0]!;
  const far = byLenDelta[byLenDelta.length - 1]!;
  if (close !== far) return [close, far];
  return [byLenDelta[0]!, byLenDelta[1]!];
}

function pickMcDistractorWords(
  level: DifficultyLevel,
  word: string,
  pool: readonly string[],
  count: number,
): string[] {
  if (level === "spark" && count === 2) return pickSparkMcDistractors(word, pool);
  return pickDistractorWords(word, pool, count);
}

function formatLetterOrder(letters: string[]): string {
  return letters.map((c) => c.toUpperCase()).join(" · ");
}

function shuffledOrder(
  letters: string[],
  salt: number,
): string[] {
  const arr = [...letters];
  let s = salt * 1103515245 + 12345;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [arr[i], arr[j]!] = [arr[j]!, arr[i]!];
  }
  return arr;
}

function buildWrongOrders(letters: string[], correct: string, need: number, baseSalt: number): string[] {
  const wrong: string[] = [];
  const seen = new Set<string>([correct]);
  for (let k = 0; wrong.length < need && k < 40; k++) {
    const cand = formatLetterOrder(shuffledOrder(letters, baseSalt + k + 1));
    if (!seen.has(cand)) {
      seen.add(cand);
      wrong.push(cand);
    }
  }
  while (wrong.length < need) {
    wrong.push(formatLetterOrder(shuffledOrder(letters, wrong.length + 999)));
  }
  return wrong;
}

export function buildWordToPictureBank(): Record<DifficultyLevel, MultipleChoiceQuestion[]> {
  const out: Record<DifficultyLevel, MultipleChoiceQuestion[]> = {
    gentle: [],
    steady: [],
    spark: [],
  };
  for (const level of ["gentle", "steady", "spark"] as const) {
    const pool = ENGLISH_WORDS_BY_LEVEL[level];
    pool.forEach((word, i) => {
      const distractors = pickMcDistractorWords(level, word, pool, 2);
      const choices: Record<string, { label: string; emoji?: string; imageSrc?: string; illustrationKey?: string; altHe?: string }> = {};
      for (const w of [word, ...distractors]) {
        const v = visualForEnglishWord(w);
        const hasAsset = Boolean(v.imageSrc);
        choices[choiceKey(w)] = {
          label: hasAsset ? "" : v.emoji,
          emoji: v.emoji,
          imageSrc: v.imageSrc,
          illustrationKey: v.illustrationKey,
          altHe: v.altHe,
        };
      }
      out[level].push({
        id: `ew-w2p-${level}-${i}`,
        type: "multiple-choice",
        world: "englishWords",
        level,
        instructions: `Read the word — pick the picture.\n${word}`,
        skills: MC_SKILLS,
        explanation: `המילה "${word}" מתאימה לתמונה.`,
        correctAnswer: choiceKey(word),
        distractors: distractors.map(choiceKey),
        choices,
        textDirection: "ltr",
        hint: { kind: "remove-distractor", maxSteps: 1 },
      });
    });
  }
  return out;
}

export function buildPictureToWordBank(): Record<DifficultyLevel, MultipleChoiceQuestion[]> {
  const out: Record<DifficultyLevel, MultipleChoiceQuestion[]> = {
    gentle: [],
    steady: [],
    spark: [],
  };
  for (const level of ["gentle", "steady", "spark"] as const) {
    const pool = ENGLISH_WORDS_BY_LEVEL[level];
    pool.forEach((word, i) => {
      const distractors = pickMcDistractorWords(level, word, pool, 2);
      const v = visualForEnglishWord(word);
      const choices: Record<string, { label: string; emoji?: string; imageSrc?: string; illustrationKey?: string; altHe?: string }> = {};
      for (const w of [word, ...distractors]) {
        choices[choiceKey(w)] = { label: w };
      }
      out[level].push({
        id: `ew-p2w-${level}-${i}`,
        type: "multiple-choice",
        world: "englishWords",
        level,
        instructions: "Pick the matching word.",
        promptVisual: {
          emoji: v.emoji,
          imageSrc: v.imageSrc,
          illustrationKey: v.illustrationKey,
          altHe: v.altHe,
        },
        skills: MC_SKILLS,
        explanation: `התמונה/האימוג׳י מתאימים למילה "${word}".`,
        correctAnswer: choiceKey(word),
        distractors: distractors.map(choiceKey),
        choices,
        textDirection: "ltr",
        hint: { kind: "remove-distractor", maxSteps: 1 },
      });
    });
  }
  return out;
}

export function buildListenChooseBank(): Record<DifficultyLevel, MultipleChoiceQuestion[]> {
  const out: Record<DifficultyLevel, MultipleChoiceQuestion[]> = {
    gentle: [],
    steady: [],
    spark: [],
  };
  for (const level of ["gentle", "steady", "spark"] as const) {
    const pool = ENGLISH_WORDS_BY_LEVEL[level];
    pool.forEach((word, i) => {
      const distractors = pickMcDistractorWords(level, word, pool, 2);
      const choices: Record<string, { label: string }> = {};
      for (const w of [word, ...distractors]) {
        choices[choiceKey(w)] = { label: w };
      }
      out[level].push({
        id: `ew-listen-${level}-${i}`,
        type: "multiple-choice",
        world: "englishWords",
        level,
        instructions: `Listen 🔊 — then tap the word.\n${word}`,
        skills: LISTEN_SKILLS,
        explanation: `הקשבה למילה "${word}".`,
        correctAnswer: choiceKey(word),
        distractors: distractors.map(choiceKey),
        choices,
        textDirection: "ltr",
        hint: { kind: "read-aloud", maxSteps: 1 },
      });
    });
  }
  return out;
}

export function buildWordOrderBank(): Record<DifficultyLevel, MultipleChoiceQuestion[]> {
  const out: Record<DifficultyLevel, MultipleChoiceQuestion[]> = {
    gentle: [],
    steady: [],
    spark: [],
  };
  for (const level of ["gentle", "steady", "spark"] as const) {
    const pool = ENGLISH_WORDS_BY_LEVEL[level];
    pool.forEach((word, i) => {
      const seg = lettersSegmentForBuild(word, level);
      const letters = seg.split("");
      const correct = formatLetterOrder(letters);
      const wrongLabels = buildWrongOrders(letters, correct, 2, i + level.length);
      const optKeys = [`ord_${i}_a`, `ord_${i}_b`, `ord_${i}_c`];
      const permKeys = [correct, ...wrongLabels];
      const rot = i % 3;
      const orderedKeys = permKeys.map((_, j) => permKeys[(j + rot) % 3]!);
      const choices: Record<string, { label: string }> = {};
      orderedKeys.forEach((label, j) => {
        choices[optKeys[j]!] = { label };
      });
      const correctKey = optKeys[orderedKeys.indexOf(correct)]!;
      const distractorKeys = optKeys.filter((k) => k !== correctKey);
      const hintWord = displayHintForBuild(word, seg);
      out[level].push({
        id: `ew-build-${level}-${i}`,
        type: "multiple-choice",
        world: "englishWords",
        level,
        instructions: `Put the letters in order.\n${hintWord}`,
        skills: MC_SKILLS,
        explanation: `סדר האותיות של ${hintWord}.`,
        correctAnswer: correctKey,
        distractors: distractorKeys,
        choices,
        textDirection: "ltr",
        hint: { kind: "remove-distractor", maxSteps: 1 },
      });
    });
  }
  return out;
}

function englishWordMatchingFromCatalog(
  rounds: readonly EnglishWordsMatchingRound[],
  level: DifficultyLevel,
  idPrefix: string,
): MatchingQuestion[] {
  return rounds.map((round, i) => ({
    id: `${idPrefix}${i + 1}`,
    type: "matching",
    world: "englishWords",
    level,
    instructions: round.instructions,
    skills: MATCH_SKILLS,
    explanation: round.explanation,
    textDirection: "ltr",
    pairs: round.pairs.map(({ pairId, word }) => ({
      pairId,
      sideA: { label: "", ...visualForEnglishWord(word) },
      sideB: { label: word },
    })),
  }));
}

export function buildEmojiWordMatchingBank(): Record<DifficultyLevel, MatchingQuestion[]> {
  const gentle = englishWordMatchingFromCatalog(ENGLISH_WORDS_MATCHING_GENTLE_ROUNDS, "gentle", "ew-match-g");
  const steady = englishWordMatchingFromCatalog(ENGLISH_WORDS_MATCHING_STEADY_ROUNDS, "steady", "ew-match-s");
  const spark = englishWordMatchingFromCatalog(ENGLISH_WORDS_MATCHING_SPARK_ROUNDS, "spark", "ew-match-p");

  return { gentle, steady, spark };
}
