import type { DifficultyKey, WorldId } from "@/content/types";
import { humanLabelForLearningItem } from "@/lib/parent-learning-item-label";
import type { AppProgress } from "@/lib/progress/storage";
import { isSrsWorld, srsTierForItem } from "@/lib/progress/learning-items";

/** שם query בכתובת `/play/...` כשפותחים מתוך משימה עם רמה מומלצת */
export const MISSION_PLAY_LEVEL_QUERY = "playLevel" as const;

export type MissionPlayLevelOverride = Readonly<{
  playLevel?: DifficultyKey;
}>;

export function parseMissionPlayLevelParam(value: string | null | undefined): DifficultyKey | undefined {
  const v = value?.trim();
  if (v === "gentle" || v === "steady" || v === "spark") return v;
  return undefined;
}

export function difficultyLabelHeShort(level: DifficultyKey): string {
  if (level === "gentle") return "עדינה";
  if (level === "steady") return "יציבה";
  return "ניצוצות";
}

export type MissionStepDifficultyRecommendation = {
  level: DifficultyKey;
  /** ניסוח רך להצגה ליד שלב במשימה */
  hintHe: string;
};

/**
 * לוגיקת ההמלצה המשותפת — ספירות tier (4=due, 3=unstable, 0=easy) ומספר פריטים במעקב.
 * בשימוש גם לשלב משימה וגם לאגרגציה לפי עולם (הורה).
 */
export function recommendationFromAggregatedSrs(
  base: DifficultyKey,
  dueVulnerable: number,
  unstable: number,
  easy: number,
  tracked: number,
): MissionStepDifficultyRecommendation {
  if (tracked === 0) {
    const level: DifficultyKey = base === "spark" ? "steady" : base;
    return {
      level,
      hintHe:
        base === "spark"
          ? "מומלץ להתחיל ברמה נעימה — ואז מתקדמים בקצב שמתאים לך"
          : "מומלץ להתחיל ברמה נעימה",
    };
  }

  const struggle = dueVulnerable * 2 + unstable;
  if (struggle >= 4 || unstable >= 2) {
    return {
      level: "gentle",
      hintHe: "מומלץ להתחיל ברמה נעימה — כדי להתיישב בביטחון",
    };
  }

  if (struggle >= 2 || dueVulnerable >= 1) {
    const level: DifficultyKey = base === "gentle" ? "gentle" : "steady";
    return {
      level,
      hintHe: "אפשר לנסות רמה מאוזנת — נשארים רגועים וברורים",
    };
  }

  if (easy >= 3 && dueVulnerable === 0 && unstable === 0 && tracked >= 4) {
    if (base === "gentle") {
      return {
        level: "steady",
        hintHe: "אפשר לנסות רמה קצת יותר מאתגרת — בלי לחץ",
      };
    }
    return {
      level: "spark",
      hintHe: "נראה שמוכנים לשלב הבא — אפשר לגלות את זה בכיף",
    };
  }

  return {
    level: base,
    hintHe: "נראה שמתאים להמשיך ברמה שנשמרה בעולם — אפשר לכוונן גם במהלך המשחק",
  };
}

/**
 * המלצת רמת תרגול לכל עולם SRS — לפי כל פריטי הלמידה המשויכים לעולם (דרך קטלוג המשחקים).
 * סופרים רק פריטים שנוגעו במשחק (הצלחות/טעויות); אין מספיק → אותה התנהגות שמרנית כמו במשימה.
 */
export function recommendedDifficultyForSrsWorld(
  progress: AppProgress,
  worldId: WorldId,
  now: Date = new Date(),
): MissionStepDifficultyRecommendation {
  const base = progress.worlds[worldId].difficulty;

  if (!isSrsWorld(worldId)) {
    return {
      level: base,
      hintHe: "מתאים לרמה שנשמרה בעולם.",
    };
  }

  const items = progress.learningItemsProgress?.items ?? {};
  let due = 0;
  let unstable = 0;
  let easy = 0;
  let tracked = 0;

  for (const [id, p] of Object.entries(items)) {
    const meta = humanLabelForLearningItem(id);
    if (meta.worldId !== worldId) continue;
    const touches = (p.timesCorrect ?? 0) + (p.timesWrong ?? 0);
    if (touches === 0) continue;
    tracked++;
    const tier = srsTierForItem(id, items, now);
    if (tier === 4) due++;
    else if (tier === 3) unstable++;
    else if (tier === 0) easy++;
  }

  return recommendationFromAggregatedSrs(base, due, unstable, easy, tracked);
}

/**
 * היוריסטיקה פשוטה לפי פריטי SRS של אותו משחק (`gameSlug:` ב-learningItems).
 * לא משנה את חישובי ה-SRS — רק קוראת מצב ומחזירה רמה מומלצת + טקסט.
 */
export function recommendedDifficultyForMissionStep(
  progress: AppProgress,
  worldId: WorldId,
  gameSlug: string,
  now: Date = new Date(),
): MissionStepDifficultyRecommendation {
  const base = progress.worlds[worldId].difficulty;

  if (!isSrsWorld(worldId)) {
    return {
      level: base,
      hintHe: "מתאים לרמה שנשמרה בעולם.",
    };
  }

  const items = progress.learningItemsProgress?.items ?? {};
  const prefix = `${gameSlug}:`;
  const relevantKeys = Object.keys(items).filter((k) => k.startsWith(prefix));

  let due = 0;
  let unstable = 0;
  let easy = 0;
  let tracked = 0;

  for (const id of relevantKeys) {
    tracked++;
    const tier = srsTierForItem(id, items, now);
    if (tier === 4) due++;
    else if (tier === 3) unstable++;
    else if (tier === 0) easy++;
  }

  return recommendationFromAggregatedSrs(base, due, unstable, easy, tracked);
}
