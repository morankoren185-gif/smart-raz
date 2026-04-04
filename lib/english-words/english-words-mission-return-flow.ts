import { getEnglishWordMissionById } from "@/content/english-words/english-word-missions";
import {
  isEnglishWordMissionComplete,
  isEnglishWordMissionStepDoneInContext,
} from "@/lib/progress/english-words-missions-sync";
import type { AppProgress } from "@/lib/progress/storage";
import {
  MISSION_PLAY_LEVEL_QUERY,
  recommendedDifficultyForMissionStep,
  type MissionPlayLevelOverride,
} from "@/lib/progress/mission-recommended-difficulty";
import type { MissionPlayEndFlow } from "@/lib/flags/flag-mission-return-flow";

export function buildEnglishWordMissionPlayHref(
  gameSlug: string,
  missionId: string,
  stepId: string,
  opts?: MissionPlayLevelOverride,
): string {
  const q = new URLSearchParams();
  q.set("wordMission", missionId);
  q.set("wordStep", stepId);
  if (opts?.playLevel) q.set(MISSION_PLAY_LEVEL_QUERY, opts.playLevel);
  return `/play/${encodeURIComponent(gameSlug)}?${q.toString()}`;
}

export function buildEnglishWordMissionReturnHref(
  missionId: string,
  opts?: Readonly<{ returnFromStepId?: string; missionJustCompleted?: boolean }>,
): string {
  const base = `/world/englishWords/mission/${encodeURIComponent(missionId)}`;
  const q = new URLSearchParams();
  if (opts?.returnFromStepId) q.set("returnFromStep", opts.returnFromStepId);
  if (opts?.missionJustCompleted) q.set("wordMissionDone", "1");
  const qs = q.toString();
  return qs ? `${base}?${qs}` : base;
}

export function resolveEnglishWordMissionPlayEndFlow(
  progress: AppProgress,
  ctx: Readonly<{
    missionId: string | undefined;
    stepId: string | undefined;
    gameSlug: string;
  }>,
): MissionPlayEndFlow | null {
  const missionId = ctx.missionId?.trim();
  if (!missionId) return null;
  const mission = getEnglishWordMissionById(missionId);
  if (!mission) return null;

  const anchorStep =
    (ctx.stepId ? mission.steps.find((s) => s.id === ctx.stepId) : undefined) ??
    mission.steps.find((s) => s.gameSlug === ctx.gameSlug);
  if (!anchorStep) return null;

  const ewProgress: Parameters<typeof isEnglishWordMissionComplete>[1] = {
    worlds: { englishWords: progress.worlds.englishWords },
    englishWordsMissionProgress: progress.englishWordsMissionProgress,
  };

  const complete = isEnglishWordMissionComplete(mission, ewProgress);
  if (complete) {
    return {
      primaryLabel: "חוזרים למשימה",
      primaryHref: buildEnglishWordMissionReturnHref(mission.id, {
        returnFromStepId: anchorStep.id,
        missionJustCompleted: true,
      }),
      subline: "סיימת את כל השלבים כאן — יש לך חותמת קטנה למעלה!",
    };
  }

  const nextStep = mission.steps.find(
    (s) => !isEnglishWordMissionStepDoneInContext(mission, s, ewProgress),
  );
  if (nextStep) {
    const rec = recommendedDifficultyForMissionStep(progress, "englishWords", nextStep.gameSlug, new Date());
    return {
      primaryLabel: "לשלב הבא",
      primaryHref: buildEnglishWordMissionPlayHref(nextStep.gameSlug, mission.id, nextStep.id, {
        playLevel: rec.level,
      }),
      subline: `השלב הבא: ״${nextStep.label}״`,
    };
  }

  return {
    primaryLabel: "חוזרים למשימה",
    primaryHref: buildEnglishWordMissionReturnHref(mission.id, { returnFromStepId: anchorStep.id }),
    subline: "נמשיך מהמסך של המשימה.",
  };
}
