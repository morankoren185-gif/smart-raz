"use client";

import { SpaceMissionStampBadge } from "@/components/world/SpaceMissionStampBadge";
import { getSpaceMissionById } from "@/content/space/space-missions";
import { getGameDefinitionBySlug } from "@/content/game-definitions";
import { buildSpaceMissionPlayHref } from "@/lib/space/space-mission-return-flow";
import { getStampDisplayForSpaceMission } from "@/lib/space/space-mission-stamp-display";
import {
  isSpaceMissionComplete,
  isSpaceMissionStepDoneInContext,
  isSpaceMissionUnlocked,
} from "@/lib/progress/space-missions-sync";
import {
  difficultyLabelHeShort,
  recommendedDifficultyForMissionStep,
} from "@/lib/progress/mission-recommended-difficulty";
import { useProgressContext } from "@/components/providers/ProgressAndTimeProvider";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";

function SpaceMissionPageContent() {
  const params = useParams();
  const search = useSearchParams();
  const missionId = params.missionId as string;
  const mission = getSpaceMissionById(missionId);
  const { progress } = useProgressContext();

  const spaceCtx = useMemo(
    () => ({
      worlds: { space: progress.worlds.space },
      spaceMissionProgress: progress.spaceMissionProgress,
    }),
    [progress.spaceMissionProgress, progress.worlds.space],
  );

  const returnFromStepId = search.get("returnFromStep");
  const missionDoneCelebration = search.get("spaceMissionDone") === "1";

  const nextOpenStep = useMemo(() => {
    if (!mission) return undefined;
    return mission.steps.find((s) => !isSpaceMissionStepDoneInContext(mission, s, spaceCtx));
  }, [mission, spaceCtx]);

  const stepRecByStepId = useMemo(() => {
    const map = new Map<string, ReturnType<typeof recommendedDifficultyForMissionStep>>();
    if (!mission) return map;
    for (const s of mission.steps) {
      map.set(s.id, recommendedDifficultyForMissionStep(progress, "space", s.gameSlug));
    }
    return map;
  }, [mission, progress]);

  useEffect(() => {
    if (!returnFromStepId) return;
    const el = document.getElementById(`space-mission-step-${returnFromStepId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [returnFromStepId]);

  if (!mission) {
    return (
      <div className="min-h-dvh bg-slate-950 p-6 text-center text-white">
        <p>לא מצאנו משימה כזו.</p>
        <Link href="/world/space" className="mt-4 inline-block text-violet-300 underline">
          חזרה למסע בחלל
        </Link>
      </div>
    );
  }

  const unlocked = isSpaceMissionUnlocked(mission, spaceCtx);
  const done = isSpaceMissionComplete(mission, spaceCtx);
  const stampDisplay = getStampDisplayForSpaceMission(mission);

  return (
    <div className="relative min-h-dvh bg-[radial-gradient(ellipse_at_top,_#1e1b4b_0%,_#0f172a_55%,_#020617_100%)] text-white">
      <header className="border-b border-white/10 px-4 py-4 sm:px-8">
        <Link
          href="/world/space"
          className="inline-flex min-h-11 items-center rounded-xl border border-white/20 px-3 text-sm font-medium hover:bg-white/10"
        >
          ← חזרה למסע
        </Link>
        {done ? (
          <div
            className={[
              "mt-4 flex flex-wrap items-center gap-3 rounded-2xl border px-3 py-3",
              missionDoneCelebration
                ? "border-amber-300/55 bg-gradient-to-l from-amber-500/20 to-violet-900/25 shadow-lg shadow-slate-950/40"
                : "border-white/12 bg-white/5",
            ].join(" ")}
          >
            <SpaceMissionStampBadge mission={mission} size="lg" />
            <div className="min-w-0 text-right">
              <p className="text-xs font-medium text-violet-100/90">החותמת שלך</p>
              <p className="text-sm font-semibold text-white">{stampDisplay.labelHe}</p>
            </div>
          </div>
        ) : null}
        {missionDoneCelebration && done ? (
          <p className="mt-3 rounded-2xl border border-amber-300/35 bg-amber-400/10 px-4 py-3 text-sm font-medium text-amber-50">
            איזה כיף — סיימת את כל השלבים כאן! החותמת מופיעה למעלה.
          </p>
        ) : null}
        <div className={`flex flex-wrap items-center gap-3 ${done ? "mt-3" : "mt-4"}`}>
          <div>
            <h1 className="text-2xl font-bold">{mission.title}</h1>
            <p className="text-sm text-violet-100/85">{mission.region}</p>
          </div>
        </div>
        <p className="mt-3 text-base text-white/85">{mission.description}</p>
        {done ? (
          <p className="mt-2 rounded-2xl border border-emerald-400/40 bg-emerald-950/30 px-4 py-2 text-sm font-medium text-emerald-100">
            כל הכבוד — סיימת את המשימה. אפשר לחזור על שלב או להמשיך במסע.
          </p>
        ) : null}
        {!unlocked ? (
          <p className="mt-3 text-sm text-amber-100">המשימה עדיין נעולה — קודם מסיימים את הקודמת.</p>
        ) : null}
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-4 py-8 sm:px-6">
        {returnFromStepId && unlocked && !done ? (
          <p
            className="rounded-2xl border border-violet-400/35 bg-violet-950/35 px-4 py-3 text-center text-sm leading-relaxed text-violet-50"
            role="status"
          >
            יפה — סיימת שלב.{" "}
            {nextOpenStep ? "השלב הבא מסומן למטה." : "כיף לראות אותך מתקדם."}
          </p>
        ) : null}

        <h2 className="text-lg font-bold">השלבים</h2>
        <ol className="space-y-4">
          {mission.steps.map((step, idx) => {
            const gameMeta = getGameDefinitionBySlug(step.gameSlug);
            const stepDoneInMission = isSpaceMissionStepDoneInContext(mission, step, spaceCtx);
            const isNext = !done && nextOpenStep?.id === step.id && unlocked;
            const justDoneHere = returnFromStepId === step.id && stepDoneInMission;
            const rec = stepRecByStepId.get(step.id)!;

            return (
              <li
                id={`space-mission-step-${step.id}`}
                key={step.id}
                className={[
                  "rounded-3xl border p-4 backdrop-blur transition-colors",
                  isNext
                    ? "border-amber-400/55 bg-amber-500/10 ring-2 ring-amber-300/35"
                    : justDoneHere
                      ? "border-emerald-400/45 bg-emerald-950/20"
                      : "border-white/15 bg-white/10",
                ].join(" ")}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-sm font-medium text-white/70">
                    שלב {idx + 1} · {step.label}
                  </p>
                  {isNext ? (
                    <span className="shrink-0 rounded-full bg-amber-400/90 px-3 py-1 text-xs font-bold text-slate-900">
                      הבא בתור
                    </span>
                  ) : null}
                </div>
                {gameMeta ? <p className="mt-1 text-sm text-white/80">{gameMeta.title}</p> : null}
                <p className="mt-2 text-xs leading-relaxed text-white/75">
                  <span className="font-medium text-violet-100/95">
                    רמה מומלצת להיום: {difficultyLabelHeShort(rec.level)}
                  </span>
                  {" — "}
                  {rec.hintHe}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {unlocked ? (
                    <Link
                      href={buildSpaceMissionPlayHref(step.gameSlug, mission.id, step.id, {
                        playLevel: rec.level,
                      })}
                      className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-amber-400 px-5 text-base font-bold text-slate-900 shadow-md hover:bg-amber-300"
                    >
                      {stepDoneInMission ? "שוב בשמחה" : "מתחילים"}
                    </Link>
                  ) : (
                    <span className="text-sm text-white/50">נסו אחרי שתפתחו את המשימה</span>
                  )}
                  {stepDoneInMission ? (
                    <span className="text-sm font-medium text-emerald-200">בוצע במסלול הזה</span>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}

export default function SpaceMissionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-[radial-gradient(ellipse_at_top,_#1e1b4b_0%,_#0f172a_55%,_#020617_100%)] text-white">
          <div className="p-6 text-center text-white/80">טוענים את המשימה...</div>
        </div>
      }
    >
      <SpaceMissionPageContent />
    </Suspense>
  );
}
