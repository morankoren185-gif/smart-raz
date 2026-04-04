/**
 * תרגום itemId טכני (SRS) לתיאור קצר וברור להורה — ללא שינוי במנוע המשחק.
 */

import { getGameDefinitionBySlug } from "@/content/game-definitions";
import type { WorldId } from "@/content/types";
import type { GameDefinition } from "@/lib/game-types/registry";
import { isMatchingQuestion } from "@/lib/game-types/matching";
import { isMultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";
import type { DifficultyLevel } from "@/lib/game-types/shared";

const LEVELS: DifficultyLevel[] = ["gentle", "steady", "spark"];

export type LearningItemHumanLabel = Readonly<{
  itemId: string;
  slug: string;
  /** תווית קצרה — מדינה, מילה, כוכב לכת וכו׳ */
  itemLabel: string;
  worldId: WorldId | undefined;
  gameTitle: string | undefined;
  /** תיאור עדין של סוג הפעילות */
  practiceKind: string;
}>;

function practiceKindFromGame(def: GameDefinition | undefined): string {
  if (!def) return "תרגול במשחק";
  if (def.supportedQuestionTypes.includes("matching")) return "התאמות (זיווג)";
  if (def.slug.includes("listen")) return "הקשבה ובחירה";
  if (def.slug.includes("build")) return "בניית מילה";
  return "בחירה מתוך אפשרויות";
}

function findMcQuestion(def: GameDefinition, questionId: string) {
  for (const lv of LEVELS) {
    const bank = def.banksByLevel[lv];
    if (!Array.isArray(bank)) continue;
    for (const q of bank) {
      if (isMultipleChoiceQuestion(q) && q.id === questionId) return q;
    }
  }
  return undefined;
}

function findMatchingPair(def: GameDefinition, pairId: string) {
  for (const lv of LEVELS) {
    const bank = def.banksByLevel[lv];
    if (!Array.isArray(bank)) continue;
    for (const q of bank) {
      if (!isMatchingQuestion(q)) continue;
      const pair = q.pairs.find((p) => p.pairId === pairId);
      if (pair) return pair;
    }
  }
  return undefined;
}

function parseItemId(itemId: string): { slug: string; pairId?: string; questionId?: string } {
  const pairMarker = ":pair:";
  const pi = itemId.indexOf(pairMarker);
  if (pi >= 0) {
    return { slug: itemId.slice(0, pi), pairId: itemId.slice(pi + pairMarker.length) };
  }
  const colon = itemId.indexOf(":");
  if (colon < 0) return { slug: itemId };
  return { slug: itemId.slice(0, colon), questionId: itemId.slice(colon + 1) };
}

export function humanLabelForLearningItem(itemId: string): LearningItemHumanLabel {
  const { slug, pairId, questionId } = parseItemId(itemId);
  const def = getGameDefinitionBySlug(slug);
  const worldId = def?.world;
  const gameTitle = def?.title;
  const practiceKind = practiceKindFromGame(def);

  if (def && pairId) {
    const pair = findMatchingPair(def, pairId);
    if (pair) {
      const itemLabel = (pair.sideB.label ?? pair.sideA.label).trim() || pairId;
      return { itemId, slug, itemLabel, worldId, gameTitle, practiceKind };
    }
  }

  if (def && questionId) {
    const q = findMcQuestion(def, questionId);
    if (q) {
      const choice = q.choices[q.correctAnswer];
      const itemLabel = choice?.label?.trim() || questionId;
      return { itemId, slug, itemLabel, worldId, gameTitle, practiceKind };
    }
  }

  const fallback = (questionId ?? pairId ?? slug).trim() || itemId;
  return {
    itemId,
    slug,
    itemLabel: fallback,
    worldId,
    gameTitle,
    practiceKind,
  };
}
