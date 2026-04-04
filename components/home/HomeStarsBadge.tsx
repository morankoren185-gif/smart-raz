"use client";

import { useProgressContext } from "@/components/providers/ProgressAndTimeProvider";

export function HomeStarsBadge() {
  const { progress } = useProgressContext();
  return (
    <div
      className="rounded-2xl border border-amber-400/40 bg-amber-500/15 px-4 py-3 text-right shadow-lg backdrop-blur"
      aria-live="polite"
    >
      <p className="text-xs font-medium text-amber-100/90">כוכבים שנאספו</p>
      <p className="text-2xl font-bold tabular-nums" suppressHydrationWarning>
        ⭐️ {progress.stars}
      </p>
    </div>
  );
}
