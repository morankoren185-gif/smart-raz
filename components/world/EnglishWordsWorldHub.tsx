"use client";

import { ENGLISH_WORD_MISSIONS } from "@/content/english-words/english-word-missions";
import { getGameDefinitionsForWorld } from "@/content/game-definitions";
import {
  getSuggestedNextEnglishWordMission,
  isEnglishWordMissionComplete,
  isEnglishWordMissionUnlocked,
} from "@/lib/progress/english-words-missions-sync";
import { useProgressContext } from "@/components/providers/ProgressAndTimeProvider";
import { EnglishWordMissionStampBadge } from "@/components/world/EnglishWordMissionStampBadge";
import Link from "next/link";

export function EnglishWordsWorldHub() {
  const { progress } = useProgressContext();
  const games = getGameDefinitionsForWorld("englishWords");
  const nextMission = getSuggestedNextEnglishWordMission({
    worlds: { englishWords: progress.worlds.englishWords },
    englishWordsMissionProgress: progress.englishWordsMissionProgress,
  });
  const sorted = [...ENGLISH_WORD_MISSIONS].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-8">
      <section aria-label="מסע מילים באנגלית">
        <h2 className="text-xl font-bold text-sky-100">מסע קטן — מילה אחרי מילה</h2>
        <p className="mt-1 text-sm text-white/75">
          כל שלב הוא משחק קצר; אפשר ליהנות מהצלחות קטנות בלי לחץ.
        </p>
        <ul className="mt-4 flex flex-col gap-4">
          {sorted.map((m) => {
            const ewCtx = {
              worlds: { englishWords: progress.worlds.englishWords },
              englishWordsMissionProgress: progress.englishWordsMissionProgress,
            };
            const unlocked = isEnglishWordMissionUnlocked(m, ewCtx);
            const done = isEnglishWordMissionComplete(m, ewCtx);
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
              statusClass = "bg-indigo-600/40 text-indigo-50";
            }

            return (
              <li key={m.id}>
                {unlocked ? (
                  <Link
                    href={`/world/englishWords/mission/${m.id}`}
                    className="flex min-h-[5.5rem] flex-col gap-2 rounded-3xl border border-white/15 bg-white/10 p-5 text-right shadow-lg backdrop-blur transition hover:border-amber-300/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {done ? <EnglishWordMissionStampBadge mission={m} /> : null}
                        <span className="text-lg font-bold text-white">{m.title}</span>
                      </div>
                      <p className="mt-1 text-sm text-white/75">{m.description}</p>
                      {m.focusWords.length > 0 ? (
                        <p className="mt-1 text-xs text-sky-200/80">
                          {m.focusWords.join(" · ")}
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
                    <span
                      className={`mt-2 inline-flex rounded-full px-4 py-2 text-sm font-semibold sm:mt-0 ${statusClass}`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-label="כל משחקי המילים">
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
