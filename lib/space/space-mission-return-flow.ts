import { getSpaceMissionById } from "@/content/space/space-missions";
import {
  isSpaceMissionComplete,
  isSpaceMissionStepDoneInContext,
} from "@/lib/progress/space-missions-sync";
import type { AppProgress } from "@/lib/progress/storage";
import {
  MISSION_PLAY_LEVEL_QUERY,
  recommendedDifficultyForMissionStep,
  type MissionPlayLevelOverride,
} from "@/lib/progress/mission-recommended-difficulty";
import type { MissionPlayEndFlow } from "@/lib/flags/flag-mission-return-flow";

export function buildSpaceMissionPlayHref(
  gameSlug: string,
  missionId: string,
  stepId: string,
  opts?: MissionPlayLevelOverride,
): string {
  const q = new URLSearchParams();
  q.set("spaceMission", missionId);
  q.set("spaceStep", stepId);
  if (opts?.playLevel) q.set(MISSION_PLAY_LEVEL_QUERY, opts.playLevel);
  return `/play/${encodeURIComponent(gameSlug)}?${q.toString()}`;
}

export function buildSpaceMissionReturnHref(
  missionId: string,
  opts?: Readonly<{ returnFromStepId?: string; missionJustCompleted?: boolean }>,
): string {
  const base = `/world/space/mission/${encodeURIComponent(missionId)}`;
  const q = new URLSearchParams();
  if (opts?.returnFromStepId) q.set("returnFromStep", opts.returnFromStepId);
  if (opts?.missionJustCompleted) q.set("spaceMissionDone", "1");
  const qs = q.toString();
  return qs ? `${base}?${qs}` : base;
}

export function resolveSpaceMissionPlayEndFlow(
  progress: AppProgress,
  ctx: Readonly<{
    missionId: string | undefined;
    stepId: string | undefined;
    gameSlug: string;
  }>,
): MissionPlayEndFlow | null {
  const missionId = ctx.missionId?.trim();
  if (!missionId) return null;
  const mission = getSpaceMissionById(missionId);
  if (!mission) return null;

  const anchorStep =
    (ctx.stepId ? mission.steps.find((s) => s.id === ctx.stepId) : undefined) ??
    mission.steps.find((s) => s.gameSlug === ctx.gameSlug);
  if (!anchorStep) return null;

  const spaceCtx: Parameters<typeof isSpaceMissionComplete>[1] = {
    worlds: { space: progress.worlds.space },
    spaceMissionProgress: progress.spaceMissionProgress,
  };

  const complete = isSpaceMissionComplete(mission, spaceCtx);
  if (complete) {
    return {
      primaryLabel: "חוזרים למשימה",
      primaryHref: buildSpaceMissionReturnHref(mission.id, {
        returnFromStepId: anchorStep.id,
        missionJustCompleted: true,
      }),
      subline: "סיימת את כל השלבים כאן — יש לך חותמת קטנה!",
    };
  }

  const nextStep = mission.steps.find(
    (s) => !isSpaceMissionStepDoneInContext(mission, s, spaceCtx),
  );
  if (nextStep) {
    const rec = recommendedDifficultyForMissionStep(progress, "space", nextStep.gameSlug, new Date());
    return {
      primaryLabel: "לשלב הבא",
      primaryHref: buildSpaceMissionPlayHref(nextStep.gameSlug, mission.id, nextStep.id, {
        playLevel: rec.level,
      }),
      subline: `השלב הבא: ״${nextStep.label}״`,
    };
  }

  return {
    primaryLabel: "חוזרים למשימה",
    primaryHref: buildSpaceMissionReturnHref(mission.id, { returnFromStepId: anchorStep.id }),
    subline: "נמשיך מהמסך של המשימה.",
  };
}
