import {
  ENGLISH_WORD_MISSIONS,
  type EnglishWordMission,
  type EnglishWordMissionStep,
} from "@/content/english-words/english-word-missions";

export type ForEnglishWordMissions = Readonly<{
  worlds: { englishWords: { completedGameSlugs: string[] } };
  englishWordsMissionProgress?: Readonly<{
    completedMissionIds: string[];
    completedSlugsByMissionId?: Readonly<Record<string, string[]>>;
  }>;
}>;

export function missionNeedsPerMissionSlugCompletion(
  mission: EnglishWordMission,
  catalog: readonly EnglishWordMission[] = ENGLISH_WORD_MISSIONS,
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

function slugSetForMission(mission: EnglishWordMission, progress: ForEnglishWordMissions): Set<string> {
  if (missionNeedsPerMissionSlugCompletion(mission)) {
    const list = progress.englishWordsMissionProgress?.completedSlugsByMissionId?.[mission.id] ?? [];
    return new Set(list);
  }
  return new Set(progress.worlds.englishWords.completedGameSlugs);
}

export function isEnglishWordMissionComplete(
  mission: EnglishWordMission,
  progress: ForEnglishWordMissions,
): boolean {
  const done = slugSetForMission(mission, progress);
  return mission.steps.every((s) => done.has(s.gameSlug));
}

export function computeCompletedEnglishWordMissionIds(progress: ForEnglishWordMissions): string[] {
  return ENGLISH_WORD_MISSIONS.filter((m) => isEnglishWordMissionComplete(m, progress)).map((m) => m.id);
}

export function isEnglishWordMissionUnlocked(
  mission: EnglishWordMission,
  progress: ForEnglishWordMissions,
): boolean {
  if (!mission.requiresCompletedMissionId) return true;
  const prev = ENGLISH_WORD_MISSIONS.find((x) => x.id === mission.requiresCompletedMissionId);
  return prev != null && isEnglishWordMissionComplete(prev, progress);
}

export function getSuggestedNextEnglishWordMission(
  progress: ForEnglishWordMissions,
): EnglishWordMission | undefined {
  const ordered = [...ENGLISH_WORD_MISSIONS].sort((a, b) => a.sortOrder - b.sortOrder);
  for (const m of ordered) {
    if (!isEnglishWordMissionUnlocked(m, progress)) continue;
    if (!isEnglishWordMissionComplete(m, progress)) return m;
  }
  return undefined;
}

export function isEnglishWordMissionStepDoneInContext(
  mission: EnglishWordMission,
  step: EnglishWordMissionStep,
  progress: ForEnglishWordMissions,
): boolean {
  const done = slugSetForMission(mission, progress);
  return done.has(step.gameSlug);
}
