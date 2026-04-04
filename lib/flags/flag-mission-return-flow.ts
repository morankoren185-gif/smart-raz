import { getFlagMissionById } from "@/content/flags/flag-missions";
import {
  isFlagMissionComplete,
  isFlagMissionStepDoneInContext,
} from "@/lib/progress/flags-missions-sync";
import type { AppProgress } from "@/lib/progress/storage";
import {
  MISSION_PLAY_LEVEL_QUERY,
  recommendedDifficultyForMissionStep,
  type MissionPlayLevelOverride,
} from "@/lib/progress/mission-recommended-difficulty";

/** קישור למשחק מתוך דף משימה — שומר mission + מזהה שלב לזרימת חזרה */
export function buildFlagMissionPlayHref(
  gameSlug: string,
  missionId: string,
  stepId: string,
  opts?: MissionPlayLevelOverride,
): string {
  const q = new URLSearchParams();
  q.set("flagsMission", missionId);
  q.set("flagsStep", stepId);
  if (opts?.playLevel) q.set(MISSION_PLAY_LEVEL_QUERY, opts.playLevel);
  return `/play/${encodeURIComponent(gameSlug)}?${q.toString()}`;
}

/** חזרה לדף משימה אחרי סיום משחק — query מינימלי ל-UX */
export function buildFlagMissionReturnHref(
  missionId: string,
  opts?: Readonly<{ returnFromStepId?: string; missionJustCompleted?: boolean }>,
): string {
  const base = `/world/flags/mission/${encodeURIComponent(missionId)}`;
  const q = new URLSearchParams();
  if (opts?.returnFromStepId) q.set("returnFromStep", opts.returnFromStepId);
  if (opts?.missionJustCompleted) q.set("flagsMissionDone", "1");
  const qs = q.toString();
  return qs ? `${base}?${qs}` : base;
}

export type MissionPlayEndFlow = Readonly<{
  primaryLabel: string;
  primaryHref: string;
  subline?: string;
}>;

/**
 * מסכי סיום משחק: כפתור ראשי חזרה למסלול המשימה / לשלב הבא.
 * מחזיר null כשאין הקשר משימה תקין.
 */
export function resolveFlagMissionPlayEndFlow(
  progress: AppProgress,
  ctx: Readonly<{
    missionId: string | undefined;
    stepId: string | undefined;
    gameSlug: string;
  }>,
): MissionPlayEndFlow | null {
  const missionId = ctx.missionId?.trim();
  if (!missionId) return null;
  const mission = getFlagMissionById(missionId);
  if (!mission) return null;

  const anchorStep =
    (ctx.stepId ? mission.steps.find((s) => s.id === ctx.stepId) : undefined) ??
    mission.steps.find((s) => s.gameSlug === ctx.gameSlug);
  if (!anchorStep) return null;

  const complete = isFlagMissionComplete(mission, progress);
  if (complete) {
    return {
      primaryLabel: "חוזרים למשימה",
      primaryHref: buildFlagMissionReturnHref(mission.id, {
        returnFromStepId: anchorStep.id,
        missionJustCompleted: true,
      }),
      subline: "סיימת את כל השלבים כאן — יש לך חותמת קטנה ומיוחדת!",
    };
  }

  const nextStep = mission.steps.find(
    (s) => !isFlagMissionStepDoneInContext(mission, s, progress),
  );
  if (nextStep) {
    const rec = recommendedDifficultyForMissionStep(progress, "flags", nextStep.gameSlug, new Date());
    return {
      primaryLabel: "לשלב הבא",
      primaryHref: buildFlagMissionPlayHref(nextStep.gameSlug, mission.id, nextStep.id, {
        playLevel: rec.level,
      }),
      subline: `השלב הבא: ״${nextStep.label}״`,
    };
  }

  return {
    primaryLabel: "חוזרים למשימה",
    primaryHref: buildFlagMissionReturnHref(mission.id, { returnFromStepId: anchorStep.id }),
    subline: "נמשיך מהמסך של המשימה.",
  };
}
