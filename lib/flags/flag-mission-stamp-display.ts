/**
 * תצוגת חותמת משימה (flags) — מיפוי מ־stampId מקובץ התוכן לטקסט וסגנון עדין.
 */

import type { FlagMission } from "@/content/flags/flag-missions";

export type FlagMissionStampStyle = Readonly<{
  /** מזהה מהתוכן (לרוב אימוג׳י) */
  stampId: string;
  emoji: string;
  labelHe: string;
  ringClass: string;
}>;

const KNOWN: Readonly<Record<string, Omit<FlagMissionStampStyle, "stampId">>> = {
  "⭐️": {
    emoji: "⭐️",
    labelHe: "חותמת ההתחלה",
    ringClass: "border-amber-400/70 bg-amber-500/20",
  },
  "🧩": {
    emoji: "🧩",
    labelHe: "חותמת הזוגות",
    ringClass: "border-teal-400/70 bg-teal-600/25",
  },
  "🗺️": {
    emoji: "🗺️",
    labelHe: "חותמת המפה",
    ringClass: "border-sky-400/70 bg-sky-700/25",
  },
  "🚀": {
    emoji: "🚀",
    labelHe: "חותמת המסע המשולב",
    ringClass: "border-fuchsia-400/70 bg-fuchsia-950/30",
  },
};

export function getStampDisplayForMission(mission: FlagMission): FlagMissionStampStyle {
  const stampId = mission.stampId.trim();
  const hit = KNOWN[stampId];
  if (hit) return { stampId, ...hit };
  return {
    stampId,
    emoji: stampId,
    labelHe: "חותמת משימה",
    ringClass: "border-white/40 bg-white/10",
  };
}

/** האם להדגיש חותמת משימה (משימה הושלמה) — לוגיקת תצוגה בלבד */
export function shouldShowMissionStamp(_mission: FlagMission, missionComplete: boolean): boolean {
  return missionComplete;
}
