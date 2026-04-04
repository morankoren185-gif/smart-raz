"use client";

import type { FlagMission } from "@/content/flags/flag-missions";
import { getStampDisplayForMission } from "@/lib/flags/flag-mission-stamp-display";

type FlagMissionStampBadgeProps = Readonly<{
  mission: FlagMission;
  size?: "sm" | "lg";
}>;

/** חותמת משימה — רגועה וקטנה, לשימוש כשהמשימה הושלמה */
export function FlagMissionStampBadge({ mission, size = "sm" }: FlagMissionStampBadgeProps) {
  const d = getStampDisplayForMission(mission);
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
