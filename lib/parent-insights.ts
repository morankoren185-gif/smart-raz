/**
 * תובנות הורה (MVP) — heuristics פשוטים על נתוני ההתקדמות הקיימים.
 * אין telemetry לרמזים/זמן תגובה — רק השלמות, רמות קושי, ופעילות אחרונה.
 */

import { humanLabelForLearningItem } from "@/lib/parent-learning-item-label";
import { recommendedDifficultyForSrsWorld } from "@/lib/progress/mission-recommended-difficulty";
import type { AppProgress } from "@/lib/progress/storage";
import type { LearningItemProgress } from "@/lib/progress/learning-items";
import type { DifficultyKey, WorldId } from "@/content/types";

const WORLD_ORDER: WorldId[] = ["english", "englishWords", "space", "hebrew", "math", "flags"];

const WORLD_LABEL_HE: Record<WorldId, string> = {
  english: "אנגלית",
  englishWords: "מילים באנגלית",
  space: "חלל וכוכבי לכת",
  hebrew: "עברית",
  math: "חשבון",
  flags: "דגלים ומדינות",
};

export type ParentInsightGameMeta = Readonly<{
  slug: string;
  world: WorldId;
  title: string;
  parentSummary?: string;
}>;

export type ParentInsightsDataConfidence = "sparse" | "moderate" | "rich";

export type ParentInsightsSnapshot = Readonly<{
  confidence: ParentInsightsDataConfidence;
  goingWellTitle: string;
  goingWellBody: string;
  strengthenTitle: string;
  strengthenBody: string;
  weeklyTitle: string;
  weeklyBody: string;
  engagementTitle: string;
  engagementBody: string;
}>;

type WorldMetrics = {
  world: WorldId;
  nDone: number;
  nTotal: number;
  ratio: number;
  difficulty: DifficultyKey;
  lastPlayedAt?: string;
};

function difficultyRank(d: DifficultyKey): number {
  switch (d) {
    case "gentle":
      return 1;
    case "steady":
      return 2;
    case "spark":
      return 3;
    default:
      return 0;
  }
}

/** ימים מאז פעילות אחרונה בעולם — null אם אין תאריך */
function staleDays(lastPlayedAt?: string): number {
  if (!lastPlayedAt) return 999;
  const t = Date.parse(lastPlayedAt);
  if (Number.isNaN(t)) return 999;
  return Math.max(0, (Date.now() - t) / (1000 * 60 * 60 * 24));
}

function worldMetrics(
  world: WorldId,
  progress: AppProgress,
  catalog: readonly ParentInsightGameMeta[],
): WorldMetrics {
  const games = catalog.filter((g) => g.world === world);
  const slugSet = new Set(games.map((g) => g.slug));
  const done = progress.worlds[world].completedGameSlugs.filter((s) => slugSet.has(s));
  const nTotal = games.length;
  const nDone = done.length;
  const ratio = nTotal > 0 ? nDone / nTotal : 0;
  return {
    world,
    nDone,
    nTotal,
    ratio,
    difficulty: progress.worlds[world].difficulty,
    lastPlayedAt: progress.worlds[world].lastPlayedAt,
  };
}

function completedSlugSet(progress: AppProgress): Set<string> {
  return new Set(Object.values(progress.worlds).flatMap((w) => w.completedGameSlugs));
}

function countCompletedInCatalog(progress: AppProgress, catalog: readonly ParentInsightGameMeta[]): number {
  const done = completedSlugSet(progress);
  let n = 0;
  for (const g of catalog) {
    if (done.has(g.slug)) n += 1;
  }
  return n;
}

function confidenceFrom(
  completedInCatalog: number,
  playMinutes: number,
  worldsTouched: number,
): ParentInsightsDataConfidence {
  /** עדיין כמעט אין השלמות במסלול */
  if (completedInCatalog === 0) return "sparse";
  /** מעט ניסיון: מעט משחקים ועולם אחד בלבד ועדיין מעט זמן באפליקציה */
  if (completedInCatalog <= 2 && worldsTouched <= 1 && playMinutes < 12) return "sparse";
  if (completedInCatalog >= 8 && worldsTouched >= 2) return "rich";
  if (completedInCatalog >= 4) return "moderate";
  return "moderate";
}

function pickStrength(metrics: WorldMetrics[]): WorldMetrics | null {
  const withCatalog = metrics.filter((m) => m.nTotal > 0);
  const withWins = withCatalog.filter((m) => m.nDone > 0);
  if (withWins.length === 0) return null;
  return [...withWins].sort((a, b) => {
    if (b.ratio !== a.ratio) return b.ratio - a.ratio;
    if (b.nDone !== a.nDone) return b.nDone - a.nDone;
    if (difficultyRank(b.difficulty) !== difficultyRank(a.difficulty)) {
      return difficultyRank(b.difficulty) - difficultyRank(a.difficulty);
    }
    return staleDays(a.lastPlayedAt) - staleDays(b.lastPlayedAt);
  })[0]!;
}

function pickStrengthen(metrics: WorldMetrics[]): WorldMetrics | null {
  const withCatalog = metrics.filter((m) => m.nTotal > 0);
  if (withCatalog.length === 0) return null;

  const incomplete = withCatalog.filter((m) => m.nDone < m.nTotal);
  if (incomplete.length === 0) {
    /** הכול הושלם — נבחר עולם שכבר מוכר אבל כבר לא היה בו ביקור מזמן */
    return [...withCatalog].sort((a, b) => staleDays(a.lastPlayedAt) - staleDays(b.lastPlayedAt))[0] ?? null;
  }

  return [...incomplete].sort((a, b) => {
    if (a.ratio !== b.ratio) return a.ratio - b.ratio;
    if (a.nDone !== b.nDone) return a.nDone - b.nDone;
    return staleDays(b.lastPlayedAt) - staleDays(a.lastPlayedAt);
  })[0]!;
}

function firstIncompleteGame(
  world: WorldId,
  catalog: readonly ParentInsightGameMeta[],
  done: Set<string>,
): ParentInsightGameMeta | undefined {
  return catalog.find((g) => g.world === world && !done.has(g.slug));
}

function engagementAdjective(
  playMinutes: number,
  stars: number,
  completedInCatalog: number,
  worldsTouched: number,
): string {
  if (playMinutes >= 25 || completedInCatalog >= 5) return "נראית עקבית ונעימה";
  if (stars >= 8 || completedInCatalog >= 3) return "מתפתחת יפה";
  if (worldsTouched >= 2) return "מתחילה לגעת בכמה תחומים";
  return "בהתחלה — וזה ממש בסדר";
}

export function buildParentInsights(
  progress: AppProgress,
  catalog: readonly ParentInsightGameMeta[],
): ParentInsightsSnapshot {
  if (catalog.length === 0) {
    return {
      confidence: "sparse",
      goingWellTitle: "הולך טוב",
      goingWellBody:
        "כשתהיה פעילות במסלול, כאן יופיעו תובנות קצרות וברורות — בלי עומס ובלי שיפוט.",
      strengthenTitle: "כדאי לחזק בעדינות",
      strengthenBody: "משחק קצר ובנחת הוא תמיד צעד טוב להתחלה.",
      weeklyTitle: "המלצה לשבוע",
      weeklyBody: "שגרה נעימה של סיבובים קצרים — כמה פעמים בשבוע — בדרך כלל עובדת מצוין.",
      engagementTitle: "מעורבות בקצרה",
      engagementBody: `יש בערך ${progress.playMinutesApprox} דקות פעילות (הערכה) ו־${progress.stars} כוכבים שנצברו.`,
    };
  }

  const metrics = WORLD_ORDER.map((w) => worldMetrics(w, progress, catalog));
  const worldsTouched = metrics.filter((m) => m.nDone > 0 || Boolean(m.lastPlayedAt)).length;
  const completedInCatalog = countCompletedInCatalog(progress, catalog);
  const confidence = confidenceFrom(completedInCatalog, progress.playMinutesApprox, worldsTouched);

  const strength = pickStrength(metrics);
  const strengthen = pickStrengthen(metrics);
  const done = completedSlugSet(progress);

  let goingWellTitle = "הולך טוב";
  let goingWellBody =
    "עדיין מוקדם מדי לסיכום חד — כל סיבוב קצר ומעודד עושה עבודה טובה.";

  if (strength && strength.nDone > 0) {
    const label = WORLD_LABEL_HE[strength.world];
    goingWellBody = `נראה שיש ביטחון יחסי ב${label} — כבר יש התקדמות (${strength.nDone} מתוך ${strength.nTotal} משחקים במסלול). אפשר להמשיך באותו קצב רגוע.`;
    if (difficultyRank(strength.difficulty) >= 2) {
      goingWellBody += " הרמה כבר קצת אתגרית — זה סימן טוב לניסיון.";
    }
  }

  let strengthenTitle = "כדאי לחזק בעדינות";
  let strengthenBody =
    "כדאי לגוון בין אנגלית, עברית וחשבון — משחק קצר בכל תחום מחזק ביטחון בלי להעמיס.";

  if (strengthen) {
    const label = WORLD_LABEL_HE[strengthen.world];
    if (strengthen.nDone < strengthen.nTotal) {
      strengthenBody = `כדאי לתת עוד כמה סיבובים רגועים ב${label} — עדיין יש מקום להיכרות ולהצלחות קטנות (${strengthen.nDone} מתוך ${strengthen.nTotal} משחקים הושלמו).`;
    } else {
      strengthenBody = `ההתקדמות יפה בכל העולמות. אם רוצים חידוד — אפשר לחזור ביקור עדין ב${label} אחרי הפסקה, או לשחק שוב על אותו חומר בקצב נעים.`;
    }
  }

  let weeklyTitle = "המלצה לשבוע";
  let weeklyBody = "השבוע מומלץ לשמור על שגרה נעימה: משחק קצר כמה פעמים, בלי לחץ — עדיף חזרות קצרות מאשר \"מאמץ גדול\" פעם אחת.";

  if (strengthen && strengthen.nDone < strengthen.nTotal) {
    const game = firstIncompleteGame(strengthen.world, catalog, done);
    if (game?.parentSummary) {
      weeklyBody = `השבוע כדאי לחזק בקצב נעים את ${WORLD_LABEL_HE[strengthen.world]} — למשל עם משחק שמתמקד ב: ${game.parentSummary}`;
    } else if (game) {
      weeklyBody = `השבוע אפשר להקדיש כמה סיבובים קצרים ל־«${game.title}» ב${WORLD_LABEL_HE[strengthen.world]} — קצת חזרה עדינה עוזרת לביטחון.`;
    }
  } else if (strength && difficultyRank(strength.difficulty) === 1 && completedInCatalog >= 4) {
    weeklyBody =
      "נראה שהבסיס יציב — אפשר לאתגר קצת יותר בעדינות (דרך המשחקים הקיימים), או פשוט להמשיך ליהנות מאותו קצב אם זה מתאים לילד.";
  }

  if (confidence === "sparse") {
    goingWellTitle = "הולך טוב";
    goingWellBody =
      "עדיין בתחילת הדרך — זה בדיוק השלב שבו כל ביקור קצר בונה הרגל טוב.";
    strengthenTitle = "כדאי לחזק בעדינות";
    strengthenBody =
      "כדאי לגוון בין שלושת העולמות — גם אם זה דקה־שתיים בכל אחד. חוויה רגועה חשובה מהניקוד.";
    weeklyTitle = "המלצה לשבוע";
    weeklyBody =
      "השבוע מספיק לשמור על קצב נוח: פעמיים־שלוש משחק קצר, בהתאם למצב הרוח — בלי שאיפה ל\"לסיים הכול\".";
  }

  const engagementTitle = "מעורבות בקצרה";
  const engagementAdj = engagementAdjective(
    progress.playMinutesApprox,
    progress.stars,
    completedInCatalog,
    worldsTouched,
  );
  const recentAny = metrics.some((m) => staleDays(m.lastPlayedAt) <= 7);
  const engagementBody = [
    `בערך ${progress.playMinutesApprox} דקות של פעילות באפליקציה (בהערכה),`,
    `${completedInCatalog} משחקים מהמסלול הושלמו לפחות פעם אחת,`,
    `ו־${progress.stars} כוכבים נצברו —`,
    engagementAdj + ".",
    recentAny ? " נראית פעילות גם בימים האחרונים." : " אם כבר כמה ימים בלי ביקור — חזרה עדינה תמיד אפשרית.",
  ].join(" ");

  return {
    confidence,
    goingWellTitle,
    goingWellBody,
    strengthenTitle,
    strengthenBody,
    weeklyTitle,
    weeklyBody,
    engagementTitle,
    engagementBody,
  };
}

const MS_DAY = 86_400_000;

/** עולמות שבהם מוצגת המלצת «איך להתחיל השבוע» — תואם עולמות SRS */
const PARENT_WEEKLY_LEVEL_WORLDS: readonly WorldId[] = ["englishWords", "flags", "space"];

export type ParentWeeklyPracticeLine = Readonly<{
  worldId: WorldId;
  /** שורה אחת רכה להורה — בלי מונחים טכניים */
  lineHe: string;
}>;

export type ParentWeeklyPracticeLevels = Readonly<{
  title: string;
  lines: readonly ParentWeeklyPracticeLine[];
  /** שורת אווירה אופציונלית — קצרה */
  footnote: string | null;
}>;

function parentWeeklyLineHe(worldId: WorldId, level: DifficultyKey): string {
  const label = WORLD_LABEL_HE[worldId];
  if (level === "gentle") {
    return `ב${label} השבוע כדאי להתחיל ברמה נעימה — בקצב בטוח ורגוע.`;
  }
  if (level === "steady") {
    return `ב${label} אפשר השבוע ברמה מאוזנת — צעד־צעד, בלי לחץ.`;
  }
  return `ב${label} אפשר כבר לנסות רמה קצת יותר מאתגרת — עדיין ברוגע.`;
}

/**
 * המלצות רמת פתיחה לשבוע (הורה) — לפי אותה לוגיקה כמו במשימות, מקובצת לפי עולם.
 */
export function buildParentWeeklyPracticeLevels(
  progress: AppProgress,
  now: Date = new Date(),
): ParentWeeklyPracticeLevels {
  const lines: ParentWeeklyPracticeLine[] = PARENT_WEEKLY_LEVEL_WORLDS.map((worldId) => {
    const rec = recommendedDifficultyForSrsWorld(progress, worldId, now);
    return { worldId, lineHe: parentWeeklyLineHe(worldId, rec.level) };
  });
  return {
    title: "באיזו רמה כדאי להתחיל השבוע",
    lines,
    footnote: "לפי החזרות והצלחות האחרונות במכשיר — אפשר לכוונן גם תוך כדי משחק.",
  };
}

export type ParentSrsDataConfidence = "sparse" | "moderate";

export type ParentSrsSnapshot = Readonly<{
  confidence: ParentSrsDataConfidence;
  dueNowCount: number;
  dueThisWeekCount: number;
  dueNowByWorld: Partial<Record<WorldId, number>>;
  thisWeekByWorld: Partial<Record<WorldId, number>>;
  waitingWeekTitle: string;
  waitingWeekBody: string;
  strengthenFocusTitle: string;
  strengthenFocusBody: string;
  stabilizingTitle: string;
  stabilizingBody: string;
  worldsSummaryLine: string | null;
  detailBullets: readonly string[];
}>;

function parseReviewAtMs(iso?: string): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : t;
}

function itemWasTouched(p: LearningItemProgress): boolean {
  return (p.timesCorrect ?? 0) + (p.timesWrong ?? 0) > 0;
}

/** פריט שלא נרדף בבירור לעומת ההצלחות — או צבר כמה טעויות מוקדם */
export function isUnstableLearningItem(p: LearningItemProgress): boolean {
  const c = p.timesCorrect ?? 0;
  const w = p.timesWrong ?? 0;
  if (w > c) return true;
  if (w >= 2 && c <= 1) return true;
  return false;
}

/** לפחות שתי הצלחות, אין עודף טעויות, ויש מרווח חזרה נוח קדימה */
export function isStabilizingLearningItem(p: LearningItemProgress, nowMs: number): boolean {
  const c = p.timesCorrect ?? 0;
  const w = p.timesWrong ?? 0;
  const next = parseReviewAtMs(p.nextReviewAt);
  if (c < 2 || next === null) return false;
  if (w > c) return false;
  return next - nowMs > 2 * MS_DAY;
}

export function isDueForReview(p: LearningItemProgress, nowMs: number): boolean {
  const next = parseReviewAtMs(p.nextReviewAt);
  if (next === null || !itemWasTouched(p)) return false;
  return next <= nowMs;
}

export function isDueWithinDays(p: LearningItemProgress, nowMs: number, days: number): boolean {
  const next = parseReviewAtMs(p.nextReviewAt);
  if (next === null || !itemWasTouched(p)) return false;
  return next <= nowMs + days * MS_DAY;
}

function unstableSortScore(p: LearningItemProgress, nowMs: number): number {
  const c = p.timesCorrect ?? 0;
  const w = p.timesWrong ?? 0;
  const next = parseReviewAtMs(p.nextReviewAt);
  const dueBoost = next !== null && next <= nowMs ? 4 : 0;
  return (w - c) * 10 + w * 2 + dueBoost;
}

function uniqueLabels(labels: string[], max: number): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const x of labels) {
    const t = x.trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
    if (out.length >= max) break;
  }
  return out;
}

/**
 * תובנות SRS מקומיות להורה — לפי nextReviewAt ומוני הצלחה/טעות בלבד.
 */
export function buildParentSrsInsights(
  progress: AppProgress,
  now: Date = new Date(),
): ParentSrsSnapshot {
  const nowMs = now.getTime();
  const items = progress.learningItemsProgress?.items ?? {};
  const touched = Object.values(items).filter(itemWasTouched);
  const dueNowByWorld: Partial<Record<WorldId, number>> = {};
  const thisWeekByWorld: Partial<Record<WorldId, number>> = {};
  let dueNowCount = 0;
  let dueThisWeekCount = 0;

  const labeled: { p: LearningItemProgress; label: string; world: WorldId | undefined }[] = [];

  for (const [itemId, p] of Object.entries(items)) {
    if (!itemWasTouched(p)) continue;
    const meta = humanLabelForLearningItem(itemId);
    labeled.push({ p, label: meta.itemLabel, world: meta.worldId });
    const next = parseReviewAtMs(p.nextReviewAt);
    if (next === null) continue;
    if (next <= nowMs) {
      dueNowCount += 1;
      dueThisWeekCount += 1;
      if (meta.worldId) dueNowByWorld[meta.worldId] = (dueNowByWorld[meta.worldId] ?? 0) + 1;
      if (meta.worldId) thisWeekByWorld[meta.worldId] = (thisWeekByWorld[meta.worldId] ?? 0) + 1;
    } else if (next <= nowMs + 7 * MS_DAY) {
      dueThisWeekCount += 1;
      if (meta.worldId) thisWeekByWorld[meta.worldId] = (thisWeekByWorld[meta.worldId] ?? 0) + 1;
    }
  }

  const unstableLabeled = labeled.filter(({ p }) => isUnstableLearningItem(p));
  unstableLabeled.sort((a, b) => unstableSortScore(b.p, nowMs) - unstableSortScore(a.p, nowMs));
  const topUnstable = unstableLabeled.slice(0, 5);

  const stabilizingLabeled = labeled.filter(({ p }) => isStabilizingLearningItem(p, nowMs));
  stabilizingLabeled.sort(
    (a, b) => (b.p.timesCorrect ?? 0) - (a.p.timesCorrect ?? 0) || (a.p.timesWrong ?? 0) - (b.p.timesWrong ?? 0),
  );
  const topStable = stabilizingLabeled.slice(0, 4);

  const worldsEntries = Object.entries(thisWeekByWorld) as [WorldId, number][];
  worldsEntries.sort((a, b) => b[1] - a[1]);
  let worldsSummaryLine: string | null = null;
  if (dueThisWeekCount >= 3 && worldsEntries.length > 0) {
    const [topW, n] = worldsEntries[0]!;
    const share = n / dueThisWeekCount;
    if (share >= 0.45) {
      worldsSummaryLine = `השבוע רוב החזרות הקרובות נוטות להתרכז ב${WORLD_LABEL_HE[topW]}.`;
    } else if (worldsEntries.length >= 2 && worldsEntries[0]![1] + worldsEntries[1]![1] >= dueThisWeekCount * 0.7) {
      worldsSummaryLine = `החזרות נפתחות בעיקר ב${WORLD_LABEL_HE[worldsEntries[0]![0]]} וגם ב${WORLD_LABEL_HE[worldsEntries[1]![0]]}.`;
    }
  }

  const confidence: ParentSrsDataConfidence =
    touched.length < 2 || (touched.length < 4 && dueThisWeekCount === 0 && unstableLabeled.length === 0)
      ? "sparse"
      : "moderate";

  const waitingWeekTitle = "מחכים לחזרה השבוע";
  let waitingWeekBody: string;
  if (touched.length === 0) {
    waitingWeekBody =
      "עדיין אין מספיק סיבובים שנרשמו בחזרות — אחרי כמה משחקים קצרים יתעדכן כאן סיכום עדין.";
  } else if (dueThisWeekCount === 0) {
    waitingWeekBody =
      "כרגע אין הרבה חזרות שממתינות לשבוע הקרוב — אפשר להמשיך ברוגע כשמתאים.";
  } else {
    const parts: string[] = [];
    if (dueNowCount > 0) {
      parts.push(`יש ${dueNowCount} נקודות שכדאי לחזור אליהן כבר עכשיו`);
    }
    const later = dueThisWeekCount - dueNowCount;
    if (later > 0) {
      parts.push(`ועוד בערך ${later} נקודות נוספות עד סוף השבוע (לפי התזמון המקומי)`);
    } else if (dueNowCount === 0) {
      parts.push(`בערך ${dueThisWeekCount} נקודות מתוכננות לחזרה בשבוע הקרוב`);
    }
    waitingWeekBody = parts.join(" — ") + ".";
    const worldBits = Object.entries(dueNowByWorld) as [WorldId, number][];
    worldBits.sort((a, b) => b[1] - a[1]);
    if (worldBits.length === 1) {
      waitingWeekBody += ` רוב אלה ב${WORLD_LABEL_HE[worldBits[0]![0]]}.`;
    } else if (worldBits.length >= 2) {
      waitingWeekBody += ` בין השאר ב${WORLD_LABEL_HE[worldBits[0]![0]]} וב${WORLD_LABEL_HE[worldBits[1]![0]]}.`;
    }
  }

  const strengthenFocusTitle = "כדאי לחזק";
  let strengthenFocusBody: string;
  if (topUnstable.length === 0) {
    strengthenFocusBody =
      "לא בולט כרגע תחום אחד שנדחף מעצמו — כמה חזרות קצרות ונעימות תמיד עוזרות.";
  } else {
    const byWorld = new Map<WorldId, number>();
    for (const x of topUnstable) {
      if (!x.world) continue;
      byWorld.set(x.world, (byWorld.get(x.world) ?? 0) + 1);
    }
    const hint =
      byWorld.size === 1 && topUnstable.length >= 2
        ? ` נראה שהדגש הרך הוא ב${WORLD_LABEL_HE[[...byWorld.keys()][0]!]}.`
        : "";
    const names = topUnstable.map((x) => x.label);
    strengthenFocusBody = `נראה שכדאי להקדיש השבוע עוד קצת תשומת לב רגועה ל: ${names.slice(0, 4).join(" · ")}.${topUnstable.length > 4 ? " ועוד קצת." : ""}${hint}`;
  }

  const stabilizingTitle = "כבר מתייצב";
  let stabilizingBody: string;
  if (topStable.length === 0) {
    stabilizingBody = "עוד מוקדם לסיכום \"תיציבות\" — ברגע שייצברו עוד הצלחות חוזרות יתעדכן כאן.";
  } else {
    const names = uniqueLabels(
      topStable.map((x) => x.label),
      4,
    );
    const worldHint =
      topStable.length >= 2 &&
      topStable.every((x) => x.world && x.world === topStable[0]?.world) &&
      topStable[0]?.world
        ? ` בתחום ${WORLD_LABEL_HE[topStable[0].world]}.`
        : "";
    stabilizingBody =
      names.length > 0
        ? `${names.join(" · ")} — כבר מתחילים לחזור בביטחון רך יותר.${worldHint}`
        : "נראים סימנים טובים של חזרות — עוד קצת ניסיון ויתחדד כאן.";
  }

  const detailBullets = uniqueLabels(
    [...topUnstable.map((x) => x.label), ...topStable.map((x) => x.label)],
    5,
  );

  return {
    confidence,
    dueNowCount,
    dueThisWeekCount,
    dueNowByWorld,
    thisWeekByWorld,
    waitingWeekTitle,
    waitingWeekBody,
    strengthenFocusTitle,
    strengthenFocusBody,
    stabilizingTitle,
    stabilizingBody,
    worldsSummaryLine,
    detailBullets,
  };
}
