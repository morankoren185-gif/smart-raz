"use client";

import { getEnglishWordMissionById } from "@/content/english-words/english-word-missions";
import { getFlagMissionById } from "@/content/flags/flag-missions";
import { getSpaceMissionById } from "@/content/space/space-missions";
import type { DifficultyKey, WorldId } from "@/content/types";
import { computeCompletedEnglishWordMissionIds } from "@/lib/progress/english-words-missions-sync";
import { computeCompletedFlagMissionIds } from "@/lib/progress/flags-missions-sync";
import { computeCompletedSpaceMissionIds } from "@/lib/progress/space-missions-sync";
import { getUnlockedCountryIdsForStars } from "@/lib/progress/map-progress";
import {
  applyLearningOutcomeToItems,
  mergeLearningItemsProgressState,
  type LearningItemsProgressState,
} from "@/lib/progress/learning-items";
import { useCallback, useSyncExternalStore } from "react";

export const PROGRESS_STORAGE_KEY = "smart-raz-progress-v1";
export const PROGRESS_EVENT = "smart-raz-progress";

const KEY = PROGRESS_STORAGE_KEY;

export type WorldProgress = {
  difficulty: DifficultyKey;
  /** משחקים שהושלמו לפחות פעם אחת (slug) */
  completedGameSlugs: string[];
  lastPlayedAt?: string;
};

/** התקדמות במפת המסע — מסונכרן עם stars בכל שמירה */
export type MapProgressState = {
  unlockedCountryIds: string[];
};

/** השלמות משימות בעולם הדגלים — מסונכרן אוטומטית מול סיום משחקים */
export type FlagsMissionProgressState = {
  completedMissionIds: string[];
  /**
   * slugs שהושלמו בהקפת משימה — נדרש למסלולים שחוזרים על משחקים ממשימות מוקדמות יותר.
   * מפתח = `missionId` מתוך הקטלוג.
   */
  completedSlugsByMissionId?: Record<string, string[]>;
};

/** אותו צורה כמו flags — מסלול משימות englishWords */
export type EnglishWordsMissionProgressState = FlagsMissionProgressState;

/** מסלול משימות space — אותה צורה כמו flags */
export type SpaceMissionProgressState = FlagsMissionProgressState;

export type AppProgress = {
  stars: number;
  /** זמן משוער במשחקים (דקות, מצטבר) */
  playMinutesApprox: number;
  worlds: Record<WorldId, WorldProgress>;
  mapProgress?: MapProgressState;
  flagsMissionProgress?: FlagsMissionProgressState;
  englishWordsMissionProgress?: EnglishWordsMissionProgressState;
  spaceMissionProgress?: SpaceMissionProgressState;
  /** התקדמות SRS לפריטי למידה (מילים, דגלים, חלל וכו׳) — לא נשבר גם בלי שדה ב־localStorage ישן */
  learningItemsProgress?: LearningItemsProgressState;
  updatedAt: string;
};

const defaultWorld = (): WorldProgress => ({
  difficulty: "gentle",
  completedGameSlugs: [],
});

function mapProgressFromStars(stars: number): MapProgressState {
  return { unlockedCountryIds: getUnlockedCountryIdsForStars(stars) };
}

function withSyncedMapProgress(p: AppProgress): AppProgress {
  return { ...p, mapProgress: mapProgressFromStars(p.stars) };
}

export function mergeFlagsMissionProgressState(
  previous: FlagsMissionProgressState | undefined,
  patch: FlagsMissionProgressState | undefined,
): FlagsMissionProgressState {
  const a = previous ?? { completedMissionIds: [] };
  if (!patch) {
    return {
      completedMissionIds: [...(a.completedMissionIds ?? [])],
      ...(a.completedSlugsByMissionId && Object.keys(a.completedSlugsByMissionId).length > 0
        ? { completedSlugsByMissionId: { ...a.completedSlugsByMissionId } }
        : {}),
    };
  }
  const ids = [...new Set([...(a.completedMissionIds ?? []), ...(patch.completedMissionIds ?? [])])];
  const mapA = a.completedSlugsByMissionId ?? {};
  const mapB = patch.completedSlugsByMissionId ?? {};
  const keys = new Set([...Object.keys(mapA), ...Object.keys(mapB)]);
  const mergedSlugs: Record<string, string[]> = {};
  for (const k of keys) {
    mergedSlugs[k] = [...new Set([...(mapA[k] ?? []), ...(mapB[k] ?? [])])];
  }
  return {
    completedMissionIds: ids,
    ...(Object.keys(mergedSlugs).length > 0 ? { completedSlugsByMissionId: mergedSlugs } : {}),
  };
}

function withSyncedFlagsMissions(p: AppProgress): AppProgress {
  const computed = computeCompletedFlagMissionIds(p);
  const slugMap = p.flagsMissionProgress?.completedSlugsByMissionId;
  return {
    ...p,
    flagsMissionProgress: {
      /** מקור אמת: ייתכן מצב ישן עם ids מיותרים — לא מאחדים עם ערך קודם */
      completedMissionIds: computed,
      ...(slugMap && Object.keys(slugMap).length > 0 ? { completedSlugsByMissionId: { ...slugMap } } : {}),
    },
  };
}

function withSyncedEnglishWordsMissions(p: AppProgress): AppProgress {
  const computed = computeCompletedEnglishWordMissionIds({
    worlds: { englishWords: p.worlds.englishWords },
    englishWordsMissionProgress: p.englishWordsMissionProgress,
  });
  const slugMap = p.englishWordsMissionProgress?.completedSlugsByMissionId;
  return {
    ...p,
    englishWordsMissionProgress: {
      completedMissionIds: computed,
      ...(slugMap && Object.keys(slugMap).length > 0 ? { completedSlugsByMissionId: { ...slugMap } } : {}),
    },
  };
}

function withSyncedSpaceMissions(p: AppProgress): AppProgress {
  const computed = computeCompletedSpaceMissionIds({
    worlds: { space: p.worlds.space },
    spaceMissionProgress: p.spaceMissionProgress,
  });
  const slugMap = p.spaceMissionProgress?.completedSlugsByMissionId;
  return {
    ...p,
    spaceMissionProgress: {
      completedMissionIds: computed,
      ...(slugMap && Object.keys(slugMap).length > 0 ? { completedSlugsByMissionId: { ...slugMap } } : {}),
    },
  };
}

function withSyncedAuxiliaryProgress(p: AppProgress): AppProgress {
  return withSyncedSpaceMissions(
    withSyncedEnglishWordsMissions(withSyncedFlagsMissions(withSyncedMapProgress(p))),
  );
}

export function defaultProgress(): AppProgress {
  return withSyncedAuxiliaryProgress({
    stars: 0,
    playMinutesApprox: 0,
    worlds: {
      english: defaultWorld(),
      hebrew: defaultWorld(),
      math: defaultWorld(),
      flags: defaultWorld(),
      englishWords: defaultWorld(),
      space: defaultWorld(),
    },
    updatedAt: new Date().toISOString(),
  });
}

function mergeParsed(parsed: Partial<AppProgress> | null | undefined): AppProgress {
  const base = defaultProgress();
  if (!parsed) return base;
  const {
    flagsMissionProgress: parsedFlags,
    englishWordsMissionProgress: parsedEwMissions,
    spaceMissionProgress: parsedSpaceMissions,
    learningItemsProgress: parsedLearningItems,
    worlds: parsedWorlds,
    stars: parsedStars,
    ...parsedRest
  } = parsed;
  const mergedLearning = mergeLearningItemsProgressState(
    base.learningItemsProgress,
    parsedLearningItems,
  );
  const merged: AppProgress = {
    ...base,
    ...parsedRest,
    stars: typeof parsedStars === "number" ? Math.max(0, parsedStars) : base.stars,
    worlds: {
      ...base.worlds,
      ...parsedWorlds,
      english: { ...base.worlds.english, ...parsedWorlds?.english },
      hebrew: { ...base.worlds.hebrew, ...parsedWorlds?.hebrew },
      math: { ...base.worlds.math, ...parsedWorlds?.math },
      flags: { ...base.worlds.flags, ...parsedWorlds?.flags },
      englishWords: { ...base.worlds.englishWords, ...parsedWorlds?.englishWords },
      space: { ...base.worlds.space, ...parsedWorlds?.space },
    },
    flagsMissionProgress: mergeFlagsMissionProgressState(base.flagsMissionProgress, parsedFlags),
    englishWordsMissionProgress: mergeFlagsMissionProgressState(
      base.englishWordsMissionProgress,
      parsedEwMissions,
    ),
    spaceMissionProgress: mergeFlagsMissionProgressState(base.spaceMissionProgress, parsedSpaceMissions),
    ...(mergedLearning != null ? { learningItemsProgress: mergedLearning } : {}),
  };
  return withSyncedAuxiliaryProgress(merged);
}

/** מטמון ל-stable snapshot עבור useSyncExternalStore */
let cachedRaw: string | null = "<init>";
let cachedSnapshot: AppProgress = defaultProgress();

function readFromStorage(): AppProgress {
  if (typeof window === "undefined") return defaultProgress();
  const raw = window.localStorage.getItem(KEY);
  if (raw === cachedRaw) return cachedSnapshot;
  cachedRaw = raw;
  if (!raw) {
    cachedSnapshot = defaultProgress();
    return cachedSnapshot;
  }
  try {
    cachedSnapshot = mergeParsed(JSON.parse(raw) as AppProgress);
  } catch {
    cachedSnapshot = defaultProgress();
  }
  return cachedSnapshot;
}

function emitProgressChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function subscribeProgress(onChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) {
      cachedRaw = "<invalidated>";
      onChange();
    }
  };
  const onLocal = () => {
    cachedRaw = "<invalidated>";
    onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(PROGRESS_EVENT, onLocal);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(PROGRESS_EVENT, onLocal);
  };
}

export function getServerProgressSnapshot(): AppProgress {
  return defaultProgress();
}

export function loadProgress(): AppProgress {
  return readFromStorage();
}

export function saveProgress(next: AppProgress): void {
  if (typeof window === "undefined") return;
  const payload = withSyncedAuxiliaryProgress({ ...next, updatedAt: new Date().toISOString() });
  const serialized = JSON.stringify(payload);
  window.localStorage.setItem(KEY, serialized);
  cachedRaw = serialized;
  cachedSnapshot = payload;
  emitProgressChange();
}

export function useAppProgress(): AppProgress {
  return useSyncExternalStore(subscribeProgress, loadProgress, getServerProgressSnapshot);
}

export function useProgressRefresh(): () => void {
  return useCallback(() => {
    cachedRaw = "<invalidated>";
    emitProgressChange();
  }, []);
}

export type { LearningItemProgress, LearningItemsProgressState } from "@/lib/progress/learning-items";

export function recordLearningItemOutcome(itemId: string, correct: boolean): void {
  if (typeof window === "undefined") return;
  const p = loadProgress();
  const items = applyLearningOutcomeToItems(p.learningItemsProgress?.items ?? {}, itemId, correct, new Date());
  saveProgress({ ...p, learningItemsProgress: { items } });
}

export function addStars(amount: number): AppProgress {
  const p = loadProgress();
  const next = { ...p, stars: Math.max(0, p.stars + amount) };
  saveProgress(next);
  return next;
}

export function addPlayMinutes(minutes: number): AppProgress {
  const p = loadProgress();
  const next = {
    ...p,
    playMinutesApprox: Math.max(0, p.playMinutesApprox + minutes),
  };
  saveProgress(next);
  return next;
}

export function recordWorldDifficulty(worldId: WorldId, d: DifficultyKey): AppProgress {
  const p = loadProgress();
  const next = {
    ...p,
    worlds: {
      ...p.worlds,
      [worldId]: { ...p.worlds[worldId], difficulty: d, lastPlayedAt: new Date().toISOString() },
    },
  };
  saveProgress(next);
  return next;
}

export type MarkGameCompletedOptions = Readonly<{
  /** כשמסיימים משחק מתוך מסלול משימת flags — רושמים גם להקפת המשימה */
  flagsMissionId?: string;
  englishWordsMissionId?: string;
  spaceMissionId?: string;
}>;

export function markGameCompleted(
  worldId: WorldId,
  gameSlug: string,
  options?: MarkGameCompletedOptions,
): AppProgress {
  const p = loadProgress();
  const w = p.worlds[worldId];
  const set = new Set(w.completedGameSlugs);
  set.add(gameSlug);

  let flagsMissionProgress = p.flagsMissionProgress;
  if (worldId === "flags" && options?.flagsMissionId) {
    const mission = getFlagMissionById(options.flagsMissionId);
    const slugBelongs =
      mission != null && mission.steps.some((s) => s.gameSlug === gameSlug);
    if (slugBelongs) {
      const prev = p.flagsMissionProgress ?? { completedMissionIds: [] };
      const map = { ...(prev.completedSlugsByMissionId ?? {}) };
      const slugSet = new Set(map[options.flagsMissionId] ?? []);
      slugSet.add(gameSlug);
      map[options.flagsMissionId] = [...slugSet];
      flagsMissionProgress = { ...prev, completedSlugsByMissionId: map };
    }
  }

  let englishWordsMissionProgress = p.englishWordsMissionProgress;
  if (worldId === "englishWords" && options?.englishWordsMissionId) {
    const mission = getEnglishWordMissionById(options.englishWordsMissionId);
    const slugBelongs =
      mission != null && mission.steps.some((s) => s.gameSlug === gameSlug);
    if (slugBelongs) {
      const prev = p.englishWordsMissionProgress ?? { completedMissionIds: [] };
      const map = { ...(prev.completedSlugsByMissionId ?? {}) };
      const slugSet = new Set(map[options.englishWordsMissionId] ?? []);
      slugSet.add(gameSlug);
      map[options.englishWordsMissionId] = [...slugSet];
      englishWordsMissionProgress = { ...prev, completedSlugsByMissionId: map };
    }
  }

  let spaceMissionProgress = p.spaceMissionProgress;
  if (worldId === "space" && options?.spaceMissionId) {
    const mission = getSpaceMissionById(options.spaceMissionId);
    const slugBelongs =
      mission != null && mission.steps.some((s) => s.gameSlug === gameSlug);
    if (slugBelongs) {
      const prev = p.spaceMissionProgress ?? { completedMissionIds: [] };
      const map = { ...(prev.completedSlugsByMissionId ?? {}) };
      const slugSet = new Set(map[options.spaceMissionId] ?? []);
      slugSet.add(gameSlug);
      map[options.spaceMissionId] = [...slugSet];
      spaceMissionProgress = { ...prev, completedSlugsByMissionId: map };
    }
  }

  const next: AppProgress = {
    ...p,
    worlds: {
      ...p.worlds,
      [worldId]: {
        ...w,
        completedGameSlugs: [...set],
        lastPlayedAt: new Date().toISOString(),
      },
    },
    ...(flagsMissionProgress != null ? { flagsMissionProgress } : {}),
    ...(englishWordsMissionProgress != null ? { englishWordsMissionProgress } : {}),
    ...(spaceMissionProgress != null ? { spaceMissionProgress } : {}),
  };
  saveProgress(next);
  return next;
}
