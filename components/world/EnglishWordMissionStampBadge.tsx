"use client";

import type { EnglishWordMission } from "@/content/english-words/english-word-missions";
import { getStampDisplayForEnglishWordMission } from "@/lib/english-words/english-word-mission-stamp-display";

type EnglishWordMissionStampBadgeProps = Readonly<{
  mission: EnglishWordMission;
  size?: "sm" | "lg";
}>;

export function EnglishWordMissionStampBadge({
  mission,
  size = "sm",
}: EnglishWordMissionStampBadgeProps) {
  const d = getStampDisplayForEnglishWordMission(mission);
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
