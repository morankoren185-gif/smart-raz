import { shuffleArray } from "@/lib/game-engine/shuffle";
import type { MatchingQuestion } from "@/lib/game-types/matching";
import {
  orderMatchingBankForSrs,
  type LearningItemProgress,
} from "@/lib/progress/learning-items";

export type MatchingPlayableCard = {
  cardId: string;
  pairId: string;
  label: string;
  emoji?: string;
  imageSrc?: string;
  illustrationKey?: string;
  altHe?: string;
};

/** בונה שני כרטיסיות לכל זוג — לפני ערבוב תצוגה */
export function buildMatchingPlayableCards(question: MatchingQuestion): MatchingPlayableCard[] {
  const out: MatchingPlayableCard[] = [];
  for (const p of question.pairs) {
    out.push({
      cardId: `${p.pairId}-a`,
      pairId: p.pairId,
      label: p.sideA.label,
      emoji: p.sideA.emoji,
      imageSrc: p.sideA.imageSrc,
      illustrationKey: p.sideA.illustrationKey,
      altHe: p.sideA.altHe,
    });
    out.push({
      cardId: `${p.pairId}-b`,
      pairId: p.pairId,
      label: p.sideB.label,
      emoji: p.sideB.emoji,
      imageSrc: p.sideB.imageSrc,
      illustrationKey: p.sideB.illustrationKey,
      altHe: p.sideB.altHe,
    });
  }
  return out;
}

export type PrepareMatchingPuzzleOptions = {
  gameSlug: string;
  learningItems?: Record<string, LearningItemProgress>;
  now?: Date;
  random?: () => number;
};

/** בוחר פאזל אחד מבנק ומערבב כרטיסים */
export function prepareMatchingPuzzleFromBank(
  bank: MatchingQuestion[],
  srs?: PrepareMatchingPuzzleOptions,
): {
  question: MatchingQuestion;
  cards: MatchingPlayableCard[];
} | undefined {
  if (bank.length === 0) return undefined;
  const random = srs?.random ?? Math.random;
  const now = srs?.now ?? new Date();
  const orderedSource =
    srs?.gameSlug != null && srs.learningItems != null
      ? orderMatchingBankForSrs(bank, srs.gameSlug, srs.learningItems, now, random)
      : shuffleArray(bank, random);
  const question = orderedSource[0]!;
  const cards = shuffleArray(buildMatchingPlayableCards(question), random);
  return { question, cards };
}
