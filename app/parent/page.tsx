"use client";

import { ParentGate } from "@/components/parent/ParentGate";
import { useProgressContext } from "@/components/providers/ProgressAndTimeProvider";
import { ALL_GAMES } from "@/content";
import { ALL_GAME_DEFINITIONS } from "@/content/game-definitions";
import type { WorldId } from "@/content/types";
import { WORLDS } from "@/content/worlds";
import { buildParentInsights, buildParentSrsInsights, buildParentWeeklyPracticeLevels } from "@/lib/parent-insights";
import { isParentGateUnlocked } from "@/lib/parent-gate";
import Link from "next/link";
import { startTransition, useLayoutEffect, useMemo, useState } from "react";

const worldLabel: Record<WorldId, string> = {
  english: "אנגלית",
  englishWords: "מילים באנגלית",
  space: "חלל וכוכבי לכת",
  hebrew: "עברית",
  math: "חשבון",
  flags: "דגלים ומדינות",
};

function difficultyHe(d: string): string {
  switch (d) {
    case "gentle":
      return "עדינה";
    case "steady":
      return "יציבה";
    case "spark":
      return "ניצוצות";
    default:
      return d;
  }
}

export default function ParentPage() {
  const [allowParentDashboard, setAllowParentDashboard] = useState(false);

  useLayoutEffect(() => {
    const allowed = isParentGateUnlocked();
    startTransition(() => {
      setAllowParentDashboard(allowed);
    });
  }, []);

  const { progress } = useProgressContext();

  const insightCatalog = useMemo(
    () =>
      ALL_GAME_DEFINITIONS.map((g) => ({
        slug: g.slug,
        world: g.world,
        title: g.title,
        parentSummary: g.parentSummary,
      })),
    [],
  );

  const insights = useMemo(
    () => buildParentInsights(progress, insightCatalog),
    [progress, insightCatalog],
  );

  const srs = useMemo(() => buildParentSrsInsights(progress), [progress]);

  const weeklyLevels = useMemo(() => buildParentWeeklyPracticeLevels(progress), [progress]);

  const completedSet = useMemo(
    () => new Set(Object.values(progress.worlds).flatMap((w) => w.completedGameSlugs)),
    [progress.worlds],
  );

  const highlights = useMemo(
    () => ALL_GAMES.filter((g) => completedSet.has(g.slug)),
    [completedSet],
  );
  const notTried = useMemo(
    () => ALL_GAMES.filter((g) => !completedSet.has(g.slug)),
    [completedSet],
  );

  const completedInApp = useMemo(
    () => insightCatalog.filter((g) => completedSet.has(g.slug)).length,
    [insightCatalog, completedSet],
  );

  if (!allowParentDashboard) {
    return <ParentGate onPassed={() => setAllowParentDashboard(true)} />;
  }

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100" dir="rtl">
      <header className="border-b border-white/10 bg-slate-900/80 px-4 py-5 backdrop-blur sm:px-10">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">אזור הורה</h1>
            <p className="mt-1 text-sm text-slate-400">
              תובנות קצרות, שפה רגועה, ועזרים להמשך — בלי ציון ומספרים מאיימים.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-amber-100 hover:bg-white/5"
          >
            חזרה לאפליקציה
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-3xl gap-6 px-4 py-8 sm:px-10">
        <section className="grid gap-4 md:grid-cols-3" aria-label="תובנות קצרות">
          <article className="rounded-2xl border border-emerald-500/25 bg-emerald-950/20 p-5 shadow-inner">
            <h2 className="text-base font-bold text-emerald-100">{insights.goingWellTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-100/90">{insights.goingWellBody}</p>
          </article>
          <article className="rounded-2xl border border-amber-500/25 bg-amber-950/15 p-5 shadow-inner">
            <h2 className="text-base font-bold text-amber-100">{insights.strengthenTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-100/90">{insights.strengthenBody}</p>
          </article>
          <article className="rounded-2xl border border-sky-500/25 bg-slate-900/50 p-5 shadow-inner">
            <h2 className="text-base font-bold text-sky-100">{insights.weeklyTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-100/90">{insights.weeklyBody}</p>
          </article>
        </section>

        <section
          className="rounded-2xl border border-sky-500/20 bg-slate-900/40 p-5 shadow-inner"
          aria-label="המלצת רמה לשבוע לפי עולם"
        >
          <h2 className="text-base font-bold text-sky-100">{weeklyLevels.title}</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-100/90">
            {weeklyLevels.lines.map((row) => (
              <li key={row.worldId} className="rounded-lg bg-slate-800/50 px-3 py-2">
                {row.lineHe}
              </li>
            ))}
          </ul>
          {weeklyLevels.footnote ? (
            <p className="mt-3 text-xs text-slate-500">{weeklyLevels.footnote}</p>
          ) : null}
        </section>

        <section className="grid gap-4 md:grid-cols-2" aria-label="חזרות לפי התקדמות">
          <article className="rounded-2xl border border-violet-500/20 bg-violet-950/15 p-5 shadow-inner">
            <h2 className="text-base font-bold text-violet-100">{srs.waitingWeekTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-100/90">{srs.waitingWeekBody}</p>
          </article>
          <article className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-5 shadow-inner">
            <h2 className="text-base font-bold text-rose-100">{srs.strengthenFocusTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-100/90">{srs.strengthenFocusBody}</p>
          </article>
          <article className="rounded-2xl border border-teal-500/20 bg-teal-950/15 p-5 shadow-inner">
            <h2 className="text-base font-bold text-teal-100">{srs.stabilizingTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-100/90">{srs.stabilizingBody}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-slate-900/45 p-5 shadow-inner">
            <h2 className="text-base font-bold text-slate-200">לפי עולמות</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-100/85">
              {srs.worldsSummaryLine ?? "כשיתעדן התזמון — יופיע כאן ריכוז קצר של איפה נפתחות החזרות."}
            </p>
            {srs.confidence === "sparse" ? (
              <p className="mt-2 text-xs text-slate-500">כשייצברו עוד נתונים ממשחקים — התמונה כאן תתחדד.</p>
            ) : null}
          </article>
        </section>

        {srs.detailBullets.length > 0 ? (
          <section
            className="rounded-2xl border border-white/10 bg-slate-900/25 px-5 py-4"
            aria-label="דוגמאות קצרות"
          >
            <h2 className="text-sm font-semibold text-slate-300">בקצרה על הפריטים</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-200/90 marker:text-slate-500">
              {srs.detailBullets.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section
          className="rounded-2xl border border-white/10 bg-slate-900/35 p-5"
          aria-label="מעורבות בקצרה"
        >
          <h2 className="text-sm font-semibold text-slate-300">{insights.engagementTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-200/95">{insights.engagementBody}</p>
          {insights.confidence === "sparse" ? (
            <p className="mt-3 text-xs text-slate-500">כשייצברו עוד ניסיונות — התמונה כאן תתעדכן כמעט מיד.</p>
          ) : null}
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-xs font-medium text-slate-400">זמן משוער באפליקציה</p>
            <p className="mt-2 text-3xl font-bold tabular-nums">
              {progress.playMinutesApprox} דק׳
            </p>
            <p className="mt-1 text-xs text-slate-500">נספר בקירוב כשהכרטיסייה פעילה.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-xs font-medium text-slate-400">כוכבים שנצברו</p>
            <p className="mt-2 text-3xl font-bold tabular-nums">⭐️ {progress.stars}</p>
            <p className="mt-1 text-xs text-slate-500">חיזוק חיובי על ניסיונות טובים.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-xs font-medium text-slate-400">משחקים מהמסלול</p>
            <p className="mt-2 text-3xl font-bold tabular-nums">
              {completedInApp} / {insightCatalog.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">הושלמו לפחות פעם אחת (לפי המכשיר הזה).</p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
          <h2 className="text-lg font-bold">רמת קושי נוכחית לפי עולם</h2>
          <ul className="mt-4 space-y-3">
            {WORLDS.map((w) => (
              <li
                key={w.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-800/60 px-4 py-3"
              >
                <span className="font-medium">{worldLabel[w.id]}</span>
                <span className="text-sm text-amber-200">
                  {difficultyHe(progress.worlds[w.id].difficulty)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-white/10 pt-4 text-xs text-slate-500">
            עדכון אחרון בתיעוד:{" "}
            {progress.updatedAt ? new Date(progress.updatedAt).toLocaleString("he-IL") : "—"} · נשמר מקומית
            בדפדפן (MVP).
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/30 p-5">
          <h2 className="text-base font-bold text-slate-200">עוד בקצרה (לגישה מהירה)</h2>
          <p className="mt-1 text-xs text-slate-500">
            הרשימה משלימה את התמונה — מבוססת על שלושת משחקי הלגאסי; המספרים למעלה כוללים את כל המשחקים
            במסלול.
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-emerald-200/90">סיומים בלגאסי</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
                {highlights.length === 0 ? (
                  <li className="text-slate-500">עדיין אין — זה בסדר גמור.</li>
                ) : (
                  highlights.slice(0, 5).map((g) => (
                    <li key={g.id} className="rounded-lg bg-slate-900/40 px-2 py-1.5">
                      {g.title}
                      <span className="text-slate-500"> · {worldLabel[g.worldId]}</span>
                    </li>
                  ))
                )}
                {highlights.length > 5 ? (
                  <li className="text-xs text-slate-500">ועוד {highlights.length - 5}…</li>
                ) : null}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-200/90">טרם סומן בלגאסי</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
                {notTried.length === 0 ? (
                  <li className="text-slate-500">
                    לפי המאגר הקלאסי — הכול נוסה. אפשר לחקור משחקים נוספים ממסך העולם.
                  </li>
                ) : (
                  notTried.slice(0, 5).map((g) => (
                    <li key={g.id} className="rounded-lg bg-slate-900/40 px-2 py-1.5">
                      {g.title}
                      <span className="text-slate-500"> · {g.learningGoal}</span>
                    </li>
                  ))
                )}
                {notTried.length > 5 ? (
                  <li className="text-xs text-slate-500">ועוד {notTried.length - 5}…</li>
                ) : null}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
