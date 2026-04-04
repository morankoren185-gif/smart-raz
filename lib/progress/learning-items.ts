import type { WorldId } from "@/content/types";
import { shuffleArray } from "@/lib/game-engine/shuffle";
import type { PlayableMultipleChoiceRound } from "@/lib/game-engine/playableRound";
import type { MatchingQuestion } from "@/lib/game-types/matching";

/** פריט למידה יחיד (מילה / דגל / כוכב וכו׳) — שכבת SRS מקומית */
export type LearningItemProgress = {
  itemId: string;
  timesCorrect: number;
  timesWrong: number;
  lastSeenAt?: string;
  nextReviewAt?: string;
};

export type LearningItemsProgressState = {
  items: Record<string, LearningItemProgress>;
};

const SRS_WORLDS: ReadonlySet<WorldId> = new Set(["englishWords", "flags", "space"]);

export function isSrsWorld(worldId: WorldId): boolean {
  return SRS_WORLDS.has(worldId);
}

export function baseIdFromRoundId(roundId: string): string {
  const idx = roundId.indexOf("::");
  return idx === -1 ? roundId : roundId.slice(0, idx);
}

export function learningItemKeyMc(gameSlug: string, roundId: string): string {
  return `${gameSlug}:${baseIdFromRoundId(roundId)}`;
}

export function learningItemKeyMatchingPair(gameSlug: string, pairId: string): string {
  return `${gameSlug}:pair:${pairId}`;
}

export function addCalendarDaysUtc(from: Date, days: number): Date {
  const d = new Date(from.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

/** מחשב nextReviewAt אחרי עדכון מונים (המונה כבר כולל את המענה הנוכחי) */
export function computeNextReviewAt(
  correct: boolean,
  timesCorrect: number,
  timesWrong: number,
  now: Date,
): string {
  if (!correct) {
    return addCalendarDaysUtc(now, 1).toISOString();
  }
  if (timesCorrect === 1) {
    return addCalendarDaysUtc(now, 2).toISOString();
  }
  if (timesCorrect < 4) {
    return addCalendarDaysUtc(now, 4).toISOString();
  }
  return addCalendarDaysUtc(now, 7).toISOString();
}

export function applyLearningOutcomeToItems(
  items: Record<string, LearningItemProgress>,
  itemId: string,
  correct: boolean,
  now: Date,
): Record<string, LearningItemProgress> {
  const prev = items[itemId];
  const timesCorrect = (prev?.timesCorrect ?? 0) + (correct ? 1 : 0);
  const timesWrong = (prev?.timesWrong ?? 0) + (correct ? 0 : 1);
  const lastSeenAt = now.toISOString();
  const nextReviewAt = computeNextReviewAt(correct, timesCorrect, timesWrong, now);
  return {
    ...items,
    [itemId]: {
      itemId,
      timesCorrect,
      timesWrong,
      lastSeenAt,
      nextReviewAt,
    },
  };
}

/**
 * טiers לסידור בנק: גבוה יוצא קודם אחרי הידוק [4,3,1,2,0]
 * 4 - הגיע זמן חזרה
 * 3 - מתקשים (הרבה טעויות יחסית)
 * 1 - חדש / כמעט ללא היסטוריה
 * 2 - רגיל
 * 0 - קל (הרבה הצלחות, כמעט בלי טעויות)
 */
export function srsTierForItem(
  itemId: string,
  items: Record<string, LearningItemProgress>,
  now: Date,
): number {
  const p = items[itemId];
  const nowMs = now.getTime();
  if (p?.nextReviewAt) {
    const due = new Date(p.nextReviewAt).getTime();
    if (!Number.isNaN(due) && due <= nowMs) return 4;
  }
  const total = (p?.timesCorrect ?? 0) + (p?.timesWrong ?? 0);
  if (!p || total === 0) return 1;
  const ratioWrong = (p.timesWrong ?? 0) / Math.max(1, total);
  if ((p.timesWrong ?? 0) >= 2 && ratioWrong >= 0.35) return 3;
  if ((p.timesCorrect ?? 0) >= 5 && (p.timesWrong ?? 0) === 0) return 0;
  return 2;
}

export function orderMcTemplatesForSrs(
  templates: PlayableMultipleChoiceRound[],
  gameSlug: string,
  items: Record<string, LearningItemProgress>,
  now: Date,
  random: () => number = Math.random,
): PlayableMultipleChoiceRound[] {
  const buckets: PlayableMultipleChoiceRound[][] = [[], [], [], [], []];
  for (const t of templates) {
    const id = learningItemKeyMc(gameSlug, t.id);
    const tier = srsTierForItem(id, items, now);
    buckets[tier]!.push(t);
  }
  const order = [4, 3, 1, 2, 0];
  const out: PlayableMultipleChoiceRound[] = [];
  for (const ti of order) {
    out.push(...shuffleArray(buckets[ti] ?? [], random));
  }
  return out;
}

function maxPairTierForQuestion(
  q: MatchingQuestion,
  gameSlug: string,
  items: Record<string, LearningItemProgress>,
  now: Date,
): number {
  let maxT = 0;
  for (const p of q.pairs) {
    const id = learningItemKeyMatchingPair(gameSlug, p.pairId);
    maxT = Math.max(maxT, srsTierForItem(id, items, now));
  }
  return maxT;
}

export function orderMatchingBankForSrs(
  bank: MatchingQuestion[],
  gameSlug: string,
  items: Record<string, LearningItemProgress>,
  now: Date,
  random: () => number = Math.random,
): MatchingQuestion[] {
  const buckets: MatchingQuestion[][] = [[], [], [], [], []];
  for (const q of bank) {
    const tier = maxPairTierForQuestion(q, gameSlug, items, now);
    buckets[tier]!.push(q);
  }
  const order = [4, 3, 1, 2, 0];
  const out: MatchingQuestion[] = [];
  for (const ti of order) {
    out.push(...shuffleArray(buckets[ti] ?? [], random));
  }
  return out;
}

export function mergeLearningItemsProgressState(
  previous: LearningItemsProgressState | undefined,
  patch: LearningItemsProgressState | undefined,
): LearningItemsProgressState | undefined {
  if (!previous && !patch) return undefined;
  const a = previous?.items ?? {};
  const b = patch?.items ?? {};
  if (Object.keys(a).length === 0 && Object.keys(b).length === 0) return undefined;
  return { items: { ...a, ...b } };
}
