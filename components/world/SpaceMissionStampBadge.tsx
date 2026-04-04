"use client";

import type { SpaceMission } from "@/content/space/space-missions";
import { getStampDisplayForSpaceMission } from "@/lib/space/space-mission-stamp-display";

type SpaceMissionStampBadgeProps = Readonly<{
  mission: SpaceMission;
  size?: "sm" | "lg";
}>;

export function SpaceMissionStampBadge({ mission, size = "sm" }: SpaceMissionStampBadgeProps) {
  const d = getStampDisplayForSpaceMission(mission);
  const box =
    size === "lg"
      ? "h-16 w-16 min-h-16 min-w-16 text-3xl shadow-md"
      : "h-10 w-10 min-h-10 min-w-10 text-xl shadow-sm";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl border-2 ${box} ${d.ringClass}`}
      title={d.labelHe}
      aria-label={d.labelHe}
      role="img"
    >
      <span aria-hidden>{d.emoji}</span>
    </span>
  );
}
