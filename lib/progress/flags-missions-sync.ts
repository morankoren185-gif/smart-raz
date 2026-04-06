import {
  ALL_FLAG_MISSIONS,
  type FlagMission,
  type FlagMissionStep,
} from "@/content/flags/flag-missions";

/** מינימום נדרש לחישובי משימות — ניתן להעביר AppProgress מלא */
export type ForFlagMissions = Readonly<{
  worlds: { flags: { completedGameSlugs: string[] } };
  flagsMissionProgress?: Readonly<{
    completedMissionIds: string[];
    completedSlugsByMissionId?: Readonly<Record<string, string[]>>;
  }>;
}>;

/**
 * משימה שצריכה מעקב slug בהקפת המסלול — כשיש משימה קודמת (sortOrder נמוך יותר)
 * שחולקת איתה אותו gameSlug. נגזר מהקטלוג בלבד.
 */
export function missionNeedsPerMissionSlugCompletion(
  mission: FlagMission,
  catalog: readonly FlagMission[] = ALL_FLAG_MISSIONS,
): boolean {
  const mySlugs = new Set(mission.steps.map((s) => s.gameSlug));
  for (const other of catalog) {
    if (other.id === mission.id) continue;
    if (other.sortOrder >= mission.sortOrder) continue;
    for (const s of other.steps) {
      if (mySlugs.has(s.gameSlug)) return true;
    }
  }
  return false;
}

function slugSetForMission(mission: FlagMission, progress: ForFlagMissions): Set<string> {
  if (missionNeedsPerMissionSlugCompletion(mission)) {
    const list = progress.flagsMissionProgress?.completedSlugsByMissionId?.[mission.id] ?? [];
    return new Set(list);
  }
  return new Set(progress.worlds.flags.completedGameSlugs);
}

/** משימה הושלמה: כל שלבי ה-slug רשומים במקור המתאים (גלובלי או לפי משימה) */
export function isFlagMissionComplete(mission: FlagMission, progress: ForFlagMissions): boolean {
  const done = slugSetForMission(mission, progress);
  return mission.steps.every((s) => done.has(s.gameSlug));
}

export function computeCompletedFlagMissionIds(progress: ForFlagMissions): string[] {
  return ALL_FLAG_MISSIONS.filter((m) => isFlagMissionComplete(m, progress)).map((m) => m.id);
}

/** מסעות יבשת שהושלמו — לתצוגת אוסף ב־hub */
export function getCompletedFlagRegionMissions(
  progress: ForFlagMissions,
): readonly FlagMission[] {
  return ALL_FLAG_MISSIONS.filter(
    (m) => m.regionId != null && isFlagMissionComplete(m, progress),
  ).sort((a, b) => a.sortOrder - b.sortOrder);
}

/** פתיחה לפי השלמת המשימה הקודמת במסלול (ממצב המשחקים, לא רק מהשדה השמור) */
export function isFlagMissionUnlocked(mission: FlagMission, progress: ForFlagMissions): boolean {
  if (!mission.requiresCompletedMissionId) return true;
  const prev = ALL_FLAG_MISSIONS.find((x) => x.id === mission.requiresCompletedMissionId);
  return prev != null && isFlagMissionComplete(prev, progress);
}

/** המשימה הראשונה שלא הושלמה וכבר פתוחה — לתג "הבא בתור" */
export function getSuggestedNextFlagMission(progress: ForFlagMissions): FlagMission | undefined {
  const ordered = [...ALL_FLAG_MISSIONS].sort((a, b) => a.sortOrder - b.sortOrder);
  for (const m of ordered) {
    if (!isFlagMissionUnlocked(m, progress)) continue;
    if (!isFlagMissionComplete(m, progress)) return m;
  }
  return undefined;
}

/** האם שלב סוים בוצע בהקשר של המשימה (או גלובלי כשאין צורך במסלול ייעודי) */
export function isFlagMissionStepDoneInContext(
  mission: FlagMission,
  step: FlagMissionStep,
  progress: ForFlagMissions,
): boolean {
  const done = slugSetForMission(mission, progress);
  return done.has(step.gameSlug);
}
