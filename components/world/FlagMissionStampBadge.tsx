"use client";

import type { FlagMission } from "@/content/flags/flag-missions";
import { getStampDisplayForMission } from "@/lib/flags/flag-mission-stamp-display";

type FlagMissionStampBadgeProps = Readonly<{
  mission: FlagMission;
  size?: "sm" | "lg";
  /** ברירת מחדל: מסע רגיל; hubRegion — בולט מעט ברשימת יבשות; celebration — דף משימה אזורית אחרי סיום */
  presentation?: "default" | "hubRegion" | "celebration";
}>;

/** חותמת משימה — רגועה וקטנה, לשימוש כשהמשימה הושלמה */
export function FlagMissionStampBadge({
  mission,
  size = "sm",
  presentation = "default",
}: FlagMissionStampBadgeProps) {
  const d = getStampDisplayForMission(mission);
  let box: string;
  let ring = "border-2";
  if (presentation === "celebration") {
    box = "h-20 w-20 min-h-20 min-w-20 text-4xl shadow-lg";
    ring = "border-[3px]";
  } else if (presentation === "hubRegion") {
    box = "h-12 w-12 min-h-12 min-w-12 text-2xl shadow-md";
  } else if (size === "lg") {
    box = "h-16 w-16 min-h-16 min-w-16 text-3xl shadow-md";
  } else {
    box = "h-10 w-10 min-h-10 min-w-10 text-xl shadow-sm";
  }
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl ${ring} ${box} ${d.ringClass}`}
      title={d.labelHe}
      aria-label={d.labelHe}
      role="img"
    >
      <span aria-hidden>{d.emoji}</span>
    </span>
  );
}
