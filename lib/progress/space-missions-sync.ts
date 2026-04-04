import {
  SPACE_MISSIONS,
  type SpaceMission,
  type SpaceMissionStep,
} from "@/content/space/space-missions";

export type ForSpaceMissions = Readonly<{
  worlds: { space: { completedGameSlugs: string[] } };
  spaceMissionProgress?: Readonly<{
    completedMissionIds: string[];
    completedSlugsByMissionId?: Readonly<Record<string, string[]>>;
  }>;
}>;

export function spaceMissionNeedsPerMissionSlugCompletion(
  mission: SpaceMission,
  catalog: readonly SpaceMission[] = SPACE_MISSIONS,
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

function slugSetForMission(mission: SpaceMission, progress: ForSpaceMissions): Set<string> {
  if (spaceMissionNeedsPerMissionSlugCompletion(mission)) {
    const list = progress.spaceMissionProgress?.completedSlugsByMissionId?.[mission.id] ?? [];
    return new Set(list);
  }
  return new Set(progress.worlds.space.completedGameSlugs);
}

export function isSpaceMissionComplete(mission: SpaceMission, progress: ForSpaceMissions): boolean {
  const done = slugSetForMission(mission, progress);
  return mission.steps.every((s) => done.has(s.gameSlug));
}

export function computeCompletedSpaceMissionIds(progress: ForSpaceMissions): string[] {
  return SPACE_MISSIONS.filter((m) => isSpaceMissionComplete(m, progress)).map((m) => m.id);
}

export function isSpaceMissionUnlocked(mission: SpaceMission, progress: ForSpaceMissions): boolean {
  if (!mission.requiresCompletedMissionId) return true;
  const prev = SPACE_MISSIONS.find((x) => x.id === mission.requiresCompletedMissionId);
  return prev != null && isSpaceMissionComplete(prev, progress);
}

export function getSuggestedNextSpaceMission(progress: ForSpaceMissions): SpaceMission | undefined {
  const ordered = [...SPACE_MISSIONS].sort((a, b) => a.sortOrder - b.sortOrder);
  for (const m of ordered) {
    if (!isSpaceMissionUnlocked(m, progress)) continue;
    if (!isSpaceMissionComplete(m, progress)) return m;
  }
  return undefined;
}

export function isSpaceMissionStepDoneInContext(
  mission: SpaceMission,
  step: SpaceMissionStep,
  progress: ForSpaceMissions,
): boolean {
  const done = slugSetForMission(mission, progress);
  return done.has(step.gameSlug);
}
