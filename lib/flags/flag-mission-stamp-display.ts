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
  /** חותמות מסעות לפי יבשת — טון עדין ומובחן */
  "🏰": {
    emoji: "🏰",
    labelHe: "חותמת אירופה",
    ringClass: "border-indigo-400/75 bg-indigo-950/40",
  },
  "🐉": {
    emoji: "🐉",
    labelHe: "חותמת אסיה",
    ringClass: "border-rose-400/72 bg-rose-950/32",
  },
  "🦜": {
    emoji: "🦜",
    labelHe: "חותמת דרום אמריקה",
    ringClass: "border-lime-400/70 bg-emerald-950/30",
  },
  "🦁": {
    emoji: "🦁",
    labelHe: "חותמת אפריקה",
    ringClass: "border-amber-400/75 bg-amber-950/35",
  },
  "🍁": {
    emoji: "🍁",
    labelHe: "חותמת צפון אמריקה",
    ringClass: "border-orange-400/72 bg-orange-950/32",
  },
  "🕌": {
    emoji: "🕌",
    labelHe: "חותמת מסע דגלים במזרח התיכון",
    ringClass: "border-cyan-400/70 bg-cyan-950/32",
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

/** מסע עם פילטר יבשת — מטא־דאטה מהקטלוג */
export function isFlagRegionMission(mission: FlagMission): boolean {
  return mission.regionId != null;
}

/** שורת חיזוק קצרה כשסיימו מסע אזורי */
export function getRegionMissionCelebrationSubtitle(mission: FlagMission): string | null {
  if (!isFlagRegionMission(mission)) return null;
  const d = getStampDisplayForMission(mission);
  return `סיימת את המסע ב${mission.region} — ${d.labelHe} נוספה לאוסף שלך.`;
}

/** האם להדגיש חותמת משימה (משימה הושלמה) — לוגיקת תצוגה בלבד */
export function shouldShowMissionStamp(_mission: FlagMission, missionComplete: boolean): boolean {
  return missionComplete;
}
