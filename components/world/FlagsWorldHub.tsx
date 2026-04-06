"use client";

import { FLAG_MISSIONS } from "@/content/flags/flag-missions";
import { FLAG_REGION_MISSIONS_LIST } from "@/content/flags/flag-region-missions";
import { getGameDefinitionsForWorld } from "@/content/game-definitions";
import {
  getCompletedFlagRegionMissions,
  getSuggestedNextFlagMission,
  isFlagMissionComplete,
  isFlagMissionUnlocked,
} from "@/lib/progress/flags-missions-sync";
import { useProgressContext } from "@/components/providers/ProgressAndTimeProvider";
import { FlagMissionStampBadge } from "@/components/world/FlagMissionStampBadge";
import Link from "next/link";

export function FlagsWorldHub() {
  const { progress } = useProgressContext();
  const games = getGameDefinitionsForWorld("flags");
  const nextMission = getSuggestedNextFlagMission(progress);
  const sorted = [...FLAG_MISSIONS].sort((a, b) => a.sortOrder - b.sortOrder);
  const completedRegionMissions = getCompletedFlagRegionMissions(progress);

  return (
    <div className="space-y-8">
      <section aria-label="מסע קטן בדגלים">
        <h2 className="text-xl font-bold text-teal-100">מסע קטן — שלב אחרי שלב</h2>
        <p className="mt-1 text-sm text-white/75">בוחרים משימה ופותחים את השלבים הרגועים בפנים.</p>
        <ul className="mt-4 flex flex-col gap-4">
          {sorted.map((m) => {
            const unlocked = isFlagMissionUnlocked(m, progress);
            const done = isFlagMissionComplete(m, progress);
            const suggested = nextMission?.id === m.id;

            let statusLabel = "נעול";
            let statusClass = "bg-slate-700/80 text-slate-200";
            if (!unlocked) {
              statusLabel = "נעול";
              statusClass = "bg-slate-800/90 text-slate-400";
            } else if (done) {
              statusLabel = "הושלם";
              statusClass = "bg-emerald-600/50 text-emerald-50";
            } else if (suggested) {
              statusLabel = "הבא בתור";
              statusClass = "bg-amber-500/35 text-amber-50";
            } else {
              statusLabel = "פתוח";
              statusClass = "bg-teal-600/40 text-teal-50";
            }

            return (
              <li key={m.id}>
                {unlocked ? (
                  <Link
                    href={`/world/flags/mission/${m.id}`}
                    className="flex min-h-[5.5rem] flex-col gap-2 rounded-3xl border border-white/15 bg-white/10 p-5 text-right shadow-lg backdrop-blur transition hover:border-amber-300/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {done ? <FlagMissionStampBadge mission={m} /> : null}
                        <span className="text-lg font-bold text-white">{m.title}</span>
                      </div>
                      <p className="mt-1 text-sm text-white/75">{m.description}</p>
                      {m.focusCountries.length > 0 ? (
                        <p className="mt-1 text-xs text-teal-200/80">
                          פוקוס: {m.focusCountries.join(", ")}
                        </p>
                      ) : null}
                    </div>
                    <span
                      className={`inline-flex shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${statusClass}`}
                    >
                      {statusLabel}
                    </span>
                  </Link>
                ) : (
                  <div className="flex min-h-[5.5rem] flex-col justify-center rounded-3xl border border-white/10 bg-black/25 p-5 opacity-70 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-bold text-white/80">{m.title}</p>
                      <p className="mt-1 text-sm text-white/55">יפתח אחרי שמסיימים את המשימה הקודמת.</p>
                    </div>
                    <span className={`mt-2 inline-flex rounded-full px-4 py-2 text-sm font-semibold sm:mt-0 ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-label="מסעות לפי יבשת">
        <h2 className="text-xl font-bold text-teal-100">מסעות לפי יבשת</h2>
        <p className="mt-1 text-sm text-white/75">
          אחרי שמסיימים את המסע המשולב — אפשר לתרגל אזור אחד בכל פעם, בלי מבחן.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-teal-200/88">
          {completedRegionMissions.length > 0 ? (
            <>
              <span className="font-medium text-teal-100/95">יבשות באוסף: </span>
              {completedRegionMissions.map((m) => m.region).join(" · ")} (
              {completedRegionMissions.length}/{FLAG_REGION_MISSIONS_LIST.length})
            </>
          ) : (
            <>עדיין אין חותמות יבשת באוסף — אחרי מסע שמסיימים, מופיעה כאן רשימה קטנה.</>
          )}
        </p>
        <ul className="mt-4 flex flex-col gap-3">
          {FLAG_REGION_MISSIONS_LIST.map((m) => {
            const unlocked = isFlagMissionUnlocked(m, progress);
            const done = isFlagMissionComplete(m, progress);
            const suggested = nextMission?.id === m.id;

            let statusLabel = "נעול";
            let statusClass = "bg-slate-700/80 text-slate-200";
            if (!unlocked) {
              statusLabel = "נעול";
              statusClass = "bg-slate-800/90 text-slate-400";
            } else if (done) {
              statusLabel = "הושלם";
              statusClass = "bg-emerald-600/50 text-emerald-50";
            } else if (suggested) {
              statusLabel = "הבא בתור";
              statusClass = "bg-amber-500/35 text-amber-50";
            } else {
              statusLabel = "פתוח";
              statusClass = "bg-sky-600/35 text-sky-50";
            }

            return (
              <li key={m.id}>
                {unlocked ? (
                  <Link
                    href={`/world/flags/mission/${m.id}`}
                    className="flex min-h-[4.75rem] flex-col gap-1 rounded-2xl border border-white/12 bg-gradient-to-l from-white/[0.07] to-transparent p-4 text-right shadow-md backdrop-blur transition hover:border-sky-300/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {done ? <FlagMissionStampBadge mission={m} presentation="hubRegion" /> : null}
                        <span className="text-base font-bold text-white">{m.title}</span>
                        <span className="text-xs font-medium text-sky-200/90">{m.region}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-white/70">{m.description}</p>
                      {m.focusCountries.length > 0 ? (
                        <p className="mt-1 line-clamp-2 text-xs text-teal-200/75">
                          דגלים: {m.focusCountries.join(" · ")}
                        </p>
                      ) : null}
                    </div>
                    <span
                      className={`mt-2 inline-flex shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold sm:mt-0 ${statusClass}`}
                    >
                      {statusLabel}
                    </span>
                  </Link>
                ) : (
                  <div className="flex min-h-[4.75rem] flex-col justify-center rounded-2xl border border-white/10 bg-black/20 p-4 opacity-70 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-base font-bold text-white/85">{m.title}</p>
                      <p className="mt-0.5 text-sm text-white/55">
                        יפתח אחרי המסע המשולב (&quot;מסע קטן בין יבשות&quot;).
                      </p>
                    </div>
                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold sm:mt-0 ${statusClass}`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        {completedRegionMissions.length > 0 ? (
          <div
            className="mt-6 rounded-3xl border border-amber-400/20 bg-gradient-to-l from-amber-950/20 to-teal-950/15 px-4 py-5"
            aria-label="האוסף שלי"
          >
            <h3 className="text-base font-bold text-amber-100/95">האוסף שלי</h3>
            <p className="mt-0.5 text-xs text-white/65">חותמות יבשות שכבר אספת — כל אחת מספרת סיפור קטן.</p>
            <ul className="mt-4 flex flex-wrap justify-end gap-5">
              {completedRegionMissions.map((m) => (
                <li key={m.id} className="flex flex-col items-center gap-1.5">
                  <FlagMissionStampBadge mission={m} presentation="hubRegion" />
                  <span className="max-w-[6rem] text-center text-xs font-medium text-white/90">{m.region}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section aria-label="כל המשחקים בעולם">
        <h2 className="text-lg font-bold text-white/90">כל המשחקים כאן לידכם</h2>
        <p className="mt-1 text-sm text-white/60">רוצים לדלג ישר? אפשר גם ככה.</p>
        <ul className="mt-3 space-y-3">
          {games.map((g) => (
            <li key={g.id}>
              <Link
                href={`/play/${g.slug}`}
                className="block rounded-2xl border border-white/12 bg-white/5 px-4 py-4 transition hover:border-amber-300/40"
              >
                <span className="font-semibold text-white">{g.title}</span>
                <span className="mt-1 block text-sm text-white/65">{g.tagline}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
