"use client";

import { useProgressContext } from "@/components/providers/ProgressAndTimeProvider";
import {
  getLevelForStars,
  getLevelProgress,
  LAST_SEEN_LEVEL_ID_KEY,
  STAR_LEVEL_IDS_IN_ORDER,
} from "@/lib/progress/levels";
import { useEffect, useMemo, useState } from "react";

export function HomeLevelProgress() {
  const { progress } = useProgressContext();
  const stars = progress.stars;
  const snap = useMemo(() => getLevelProgress(stars), [stars]);
  const [celebrate, setCelebrate] = useState<string | null>(null);

  const levelOrder = STAR_LEVEL_IDS_IN_ORDER;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const currentId = getLevelForStars(stars).id;
    const prev = window.localStorage.getItem(LAST_SEEN_LEVEL_ID_KEY);
    let celebrateLabel: string | null = null;
    if (prev !== null && prev !== currentId) {
      const idxPrev = levelOrder.indexOf(prev);
      const idxNow = levelOrder.indexOf(currentId);
      if (idxPrev >= 0 && idxNow > idxPrev) {
        celebrateLabel = getLevelForStars(stars).label;
      }
    }
    window.localStorage.setItem(LAST_SEEN_LEVEL_ID_KEY, currentId);
    if (celebrateLabel) {
      queueMicrotask(() => setCelebrate(celebrateLabel));
    }
  }, [stars, levelOrder]);

  useEffect(() => {
    if (!celebrate) return;
    const t = window.setTimeout(() => setCelebrate(null), 4500);
    return () => window.clearTimeout(t);
  }, [celebrate]);

  return (
    <div
      className="w-full max-w-[16rem] rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-right shadow-lg backdrop-blur sm:max-w-xs"
      aria-live="polite"
    >
      <p className="text-xs font-medium text-white/75">הדרגה שלך</p>
      <p className="mt-0.5 text-lg font-bold text-amber-100">{snap.current.label}</p>

      <div className="mt-2">
        <div
          className="h-1.5 overflow-hidden rounded-full bg-black/35"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(snap.barFraction * 100)}
          aria-label={snap.isMaxLevel ? "הגעת לדרגה הגבוהה ביותר" : "התקדמות לדרגה הבאה"}
        >
          <div
            className="h-full rounded-full bg-gradient-to-l from-amber-400 to-teal-400 transition-[width] duration-500 ease-out"
            style={{ width: `${snap.barFraction * 100}%` }}
          />
        </div>
      </div>

      {snap.isMaxLevel ? (
        <p className="mt-2 text-xs leading-relaxed text-teal-100/90">
          כל הכבוד — אתה אלוף הידע ברמה המלאה. כל כוכב נוסף הוא תוספת כיף במסע.
        </p>
      ) : (
        <p className="mt-2 text-xs text-white/80">
          עוד <span className="font-semibold tabular-nums">{snap.starsToNext}</span>{" "}
          {snap.starsToNext === 1 ? "כוכב" : "כוכבים"} לדרגה ״{snap.next?.label}״
        </p>
      )}

      {celebrate ? (
        <p className="mt-3 rounded-xl border border-amber-300/50 bg-amber-400/15 px-3 py-2 text-xs font-medium text-amber-50">
          יופי! עלית דרגה — עכשיו אתה ״{celebrate}״
        </p>
      ) : null}
    </div>
  );
}

