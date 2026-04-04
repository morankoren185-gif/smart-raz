import type { EnglishWordMission } from "@/content/english-words/english-word-missions";

export type EnglishWordMissionStampStyle = Readonly<{
  stampId: string;
  emoji: string;
  labelHe: string;
  ringClass: string;
}>;

type OmitStamp = Omit<EnglishWordMissionStampStyle, "stampId">;

const STYLES: Readonly<Record<string, OmitStamp>> = {
  "📗": {
    emoji: "📗",
    labelHe: "חותמת התחלה מילולית",
    ringClass: "border-emerald-400/70 bg-emerald-600/20",
  },
  "🧩": {
    emoji: "🧩",
    labelHe: "חותמת הזוגות",
    ringClass: "border-cyan-400/70 bg-cyan-900/25",
  },
  "🔤": {
    emoji: "🔤",
    labelHe: "חותמת האותיות",
    ringClass: "border-indigo-400/70 bg-indigo-950/30",
  },
  "👂": {
    emoji: "👂",
    labelHe: "חותמת ההקשבה",
    ringClass: "border-violet-400/70 bg-violet-950/25",
  },
  "🚀": {
    emoji: "🚀",
    labelHe: "חותמת המסע המשולב",
    ringClass: "border-amber-400/70 bg-amber-950/25",
  },
};

export function getStampDisplayForEnglishWordMission(
  mission: EnglishWordMission,
): EnglishWordMissionStampStyle {
  const stampId = mission.stampId.trim();
  const hit = STYLES[stampId];
  if (hit) return { stampId, ...hit };
  return {
    stampId,
    emoji: stampId,
    labelHe: "חותמת משימה",
    ringClass: "border-white/40 bg-white/10",
  };
}
